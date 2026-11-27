const TEMPLATE_LABELS = {
  quiz: "آزمون",
  gameshow_quiz: "مسابقه تلویزیونی",
  flashcard: "فلش‌کارت",
  matching: "جورکردنی",
  type: "پاسخ‌گزین",
};

const clean = (value) => String(value ?? "").trim();

function getPairs(activity) {
  const content = activity?.content || {};
  if (activity.type === "matching") {
    return (content.pairs || []).map((pair) => ({
      left: clean(pair.left),
      right: clean(pair.right),
      icon: pair.icon || "🔗",
      image: pair.image || "",
    })).filter((pair) => pair.left && pair.right);
  }
  if (activity.type === "flashcard") {
    return (content.cards || []).map((card) => ({
      left: clean(card.front),
      right: clean(card.back),
      icon: card.icon || "🎴",
      image: card.image || "",
    })).filter((pair) => pair.left && pair.right);
  }
  if (activity.type === "type") {
    return (content.questions || []).map((question) => ({
      left: clean(question.hint),
      right: clean(question.answer),
      icon: "💡",
      image: "",
    })).filter((pair) => pair.left && pair.right);
  }
  if (activity.type === "quiz" || activity.type === "gameshow_quiz") {
    return (content.questions || []).map((question) => ({
      left: clean(question.question),
      right: clean(question.options?.[question.correct_answer ?? question.correctIndex]),
      icon: "📝",
      image: question.image || "",
    })).filter((pair) => pair.left && pair.right);
  }
  if (activity.type === "group_sort") {
    return (content.groups || []).flatMap((group) =>
      (group.items || []).map((item) => ({
        left: clean(item),
        right: clean(group.name),
        icon: group.icon || "📁",
        image: "",
      })),
    ).filter((pair) => pair.left && pair.right);
  }
  if (activity.type === "missing_word") {
    return (content.sentences || []).map((item) => ({
      left: clean(item.sentence),
      right: clean(item.missingWord),
      icon: "✏️",
      image: "",
    })).filter((pair) => pair.left && pair.right);
  }
  return [];
}

function toFlashcards(activity) {
  const pairs = getPairs(activity);
  if (pairs.length < 2) throw new Error("برای تبدیل به فلش‌کارت حداقل دو جفت معتبر لازم است");
  return {
    cards: pairs.map((pair) => ({
      front: pair.left,
      back: pair.right,
      image: pair.image || "",
      icon: pair.icon || "🎴",
    })),
  };
}

function toMatching(activity) {
  const pairs = getPairs(activity);
  if (pairs.length < 2) throw new Error("برای تبدیل به جورکردنی حداقل دو جفت معتبر لازم است");
  return { pairs };
}

function toQuiz(activity) {
  const pairs = getPairs(activity);
  if (pairs.length < 4) throw new Error("برای ساخت آزمون چهارگزینه‌ای حداقل چهار جفت معتبر لازم است");
  const answers = [...new Set(pairs.map((pair) => pair.right))];
  if (answers.length < 4) throw new Error("برای ساخت چهار گزینهٔ متفاوت حداقل چهار پاسخ یکتا لازم است");
  return {
    questions: pairs.map((pair) => {
      const distractors = answers.filter((answer) => answer !== pair.right).slice(0, 3);
      if (distractors.length !== 3) throw new Error("برای هر سؤال سه گزینهٔ انحرافی یکتا لازم است");
      return {
        question: pair.left,
        image: pair.image || "",
        options: [pair.right, ...distractors],
        correct_answer: 0,
      };
    }),
  };
}

function toType(activity) {
  const pairs = getPairs(activity);
  if (!pairs.length) throw new Error("محتوای فعالیت برای تبدیل به پاسخ‌گزین کافی نیست");
  return {
    questions: pairs.map((pair) => ({
      hint: pair.left,
      answer: pair.right,
      distractors: [],
    })),
  };
}

export function getCompatibleTemplates(activity) {
  if (!activity?.content || typeof activity.content !== "object") return [];
  const supportedSources = ["quiz", "gameshow_quiz", "flashcard", "matching", "type", "group_sort", "missing_word"];
  if (!supportedSources.includes(activity.type)) return [];
  const pairs = getPairs(activity);
  if (pairs.length < 2) return [];
  const options = [];
  const uniqueAnswers = new Set(pairs.map((pair) => pair.right)).size;
  if (activity.type !== "flashcard") options.push({ type: "flashcard", label: TEMPLATE_LABELS.flashcard });
  if (activity.type !== "matching") options.push({ type: "matching", label: TEMPLATE_LABELS.matching });
  if (pairs.length >= 4 && uniqueAnswers >= 4 && activity.type !== "quiz") options.push({ type: "quiz", label: TEMPLATE_LABELS.quiz });
  if (pairs.length >= 4 && uniqueAnswers >= 4 && activity.type !== "gameshow_quiz") options.push({ type: "gameshow_quiz", label: TEMPLATE_LABELS.gameshow_quiz });
  if (activity.type !== "type") options.push({ type: "type", label: TEMPLATE_LABELS.type });
  return options;
}

/**
 * Converts only when the source has the required semantic data.
 * It creates a new activity and never mutates the source.
 */
export function convertActivityData(activity, targetType) {
  let content;
  switch (targetType) {
    case "flashcard": content = toFlashcards(activity); break;
    case "matching": content = toMatching(activity); break;
    case "quiz":
    case "gameshow_quiz":
      content = ["quiz", "gameshow_quiz"].includes(activity.type)
        ? { questions: (activity.content.questions || []).map((question) => ({
            ...question,
            options: Array.isArray(question.options) ? [...question.options] : [],
          })) }
        : toQuiz(activity);
      break;
    case "type": content = toType(activity); break;
    default: throw new Error("تبدیل به این قالب هنوز پشتیبانی نمی‌شود");
  }
  return {
    title: `${activity.title || "فعالیت"} — ${TEMPLATE_LABELS[targetType] || targetType}`,
    description: `نسخهٔ تبدیل‌شده از فعالیت «${activity.title || "بدون عنوان"}»؛ محتوای اصلی حفظ شده و قالب اجرا تغییر کرده است.`,
    type: targetType,
    theme: activity.theme || "lavender",
    content,
    sourceActivityId: activity.id,
    sourceActivityType: activity.type,
    conversionVersion: 1,
  };
}

export { TEMPLATE_LABELS };

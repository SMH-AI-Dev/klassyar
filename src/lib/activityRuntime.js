export function normalizeActivityForPlay(activity) {
  if (!activity?.content || typeof activity.content !== "object") return activity;
  const content = { ...activity.content };

  if (["group_sort", "speed_sorting"].includes(activity.type)) {
    const groups = content.groups || [];
    if (!Array.isArray(content.items) || !content.items.length) {
      const allItems = content.all_items?.length
        ? content.all_items
        : groups.flatMap((group) => group.items || []);
      content.items = allItems.map((item) => {
        const owner = groups.find((group) => (group.items || []).some((groupItem) =>
          (typeof groupItem === "string" ? groupItem : groupItem.text || groupItem.label) ===
          (typeof item === "string" ? item : item.text || item.label)
        ));
        return typeof item === "string"
          ? { text: item, group: owner?.name || "", icon: owner?.icon || "📁" }
          : { ...item, text: item.text || item.label || item.item || "", group: item.group || owner?.name || "", icon: item.icon || owner?.icon || "📁" };
      }).filter((item) => item.text && item.group);
    } else {
      content.items = content.items.map((item) => typeof item === "string"
        ? { text: item, group: groups.find((group) => (group.items || []).includes(item))?.name || "" }
        : item);
    }
  }

  if (["gameshow_quiz", "win_or_lose_quiz"].includes(activity.type) && !Array.isArray(content.items)) {
    content.items = (content.questions || []).map((question) => {
      const correctIndex = Number.isInteger(question.correctAnswer)
        ? question.correctAnswer
        : Number.isInteger(question.correct_answer)
          ? question.correct_answer
          : 0;
      return {
        question: question.question || question.prompt || "",
        options: Array.isArray(question.options) ? question.options : [],
        correctAnswer: question.options?.[correctIndex] ?? question.correctAnswer ?? question.correct_answer ?? "",
        image: question.image || "",
      };
    });
  }

  if (["balloon_pop", "flying_fruit"].includes(activity.type) && !Array.isArray(content.items)) {
    content.items = (content.questions || []).map((question) => ({
      question: question.question || "",
      answer: question.answer || "",
      options: [question.answer, ...(question.wrongAnswers || [])].filter(Boolean),
    }));
  }

  if (activity.type === "true_false" && !Array.isArray(content.questions)) {
    content.questions = (content.statements || content.items || []).map((statement) => {
      const value = statement.is_true ?? statement.isTrue ?? statement.correct;
      return {
        question: statement.text || statement.question || "",
        correctAnswer: value === true || value === "true" ? "true" : "false",
        explanation: statement.explanation || "",
      };
    });
  }

  if (activity.type === "fill_blank" && !Array.isArray(content.questions)) {
    content.questions = (content.sentences || []).map((sentence) => ({
      question: sentence.text || sentence.sentence || "",
      answer: sentence.correctAnswers?.[0] || sentence.blanks?.[0]?.answer || sentence.answer || "",
      hint: sentence.hint || "",
    }));
  }

  if (activity.type === "anagram" && !Array.isArray(content.items)) {
    content.items = (content.words || []).map((item) => ({
      word: item.word || item.answer || "",
      hint: item.hint || item.clue || "",
    }));
  }

  if (activity.type === "hangman" && !Array.isArray(content.items)) {
    content.items = (content.words || []).map((item) => ({
      word: item.word || item.answer || "",
      hint: item.hint || item.clue || "",
    }));
  }

  return { ...activity, content };
}

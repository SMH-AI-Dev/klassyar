/** Account-scoped, deduplicated multiple-choice question banks and cycle-safe rounds. */
const ROUND_PREFIX = "klassyar_question_cycle:v2:";
export const MINIMUM_BANK_SIZE = 400;
export const ROUNDS_PER_GAME = 400;

const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const asText = (value) => value == null ? "" : String(value).trim();
const persian = (value) => String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

function normalizeText(value) {
  return asText(value)
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[\u200c\u200d]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[؟?!.،,:;؛]+$/g, "")
    .toLocaleLowerCase();
}

function stableValue(value) {
  if (Array.isArray(value)) return `[${value.map(stableValue).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableValue(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hashValue(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function sourceItems(game) {
  const sources = [game?.questionBank, game?.questions, game?.words, game?.cards, game?.items];
  return sources.find((items) => Array.isArray(items) && items.length) || [];
}

function optionText(option) {
  if (option && typeof option === "object") {
    return asText(option.text ?? option.label ?? option.value ?? option.answer);
  }
  return asText(option);
}

function extractBaseQuestion(item, game, index) {
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;

  const sourceOptions = Array.isArray(item.options) ? item.options.map(optionText).filter(Boolean) : [];
  const markedCorrect = Array.isArray(item.options)
    ? item.options.findIndex((option) => option && typeof option === "object" && (option.isCorrect === true || option.correct === true))
    : -1;
  const listedCorrectAnswers = Array.isArray(item.correctAnswers)
    ? item.correctAnswers.map(asText).filter(Boolean)
    : [];
  let answer = asText(
    item.correctAnswer ??
    item.answer ??
    item.a ??
    (markedCorrect >= 0 ? optionText(item.options[markedCorrect]) : undefined) ??
    (Number.isInteger(item.correctIndex) ? sourceOptions[item.correctIndex] : undefined) ??
    listedCorrectAnswers[0] ??
    item.en ??
    item.category
  );

  let question = asText(item.question ?? item.q ?? item.hint ?? item.text ?? item.label ?? item.scrambled);

  if (game?.engine === "sort" && item.label && item.category) {
    question = `این مورد را در دستهٔ مناسب قرار بده: «${asText(item.label)}»`;
    answer = asText(item.category);
  } else if (["match", "memory"].includes(game?.engine) && (item.text || item.label) && item.en) {
    const clue = asText(item.text || item.label);
    const marker = asText(item.emoji);
    question = `معادل انگلیسی «${clue}»${marker ? ` با نشانهٔ ${marker}` : ""} کدام است؟`;
    answer = asText(item.en);
  } else if (game?.engine === "scramble" && item.scrambled && item.answer) {
    question = `با مرتب‌کردن حروف «${asText(item.scrambled)}» و توجه به سرنخ «${asText(item.hint)}»، کدام واژه ساخته می‌شود؟`;
    answer = asText(item.answer);
  } else if (game?.engine === "anagram" || game?.engine === "hangman") {
    question = asText(item.q ?? item.question ?? item.hint ?? item.text);
    answer = asText(item.a ?? item.answer ?? item.correctAnswer);
  } else if (game?.engine === "typing" || game?.engine === "wordsearch" || game?.engine === "wheel" ||
             game?.engine === "whack" || game?.engine === "balloons" || game?.engine === "openbox" ||
             game?.engine === "truefalse") {
    question = asText(item.q ?? item.question ?? item.hint ?? item.text);
    answer = asText(item.a ?? item.answer ?? item.correctAnswer);
  }

  if (sourceOptions.length && Number.isInteger(item.correctIndex) && item.correctIndex >= 0 && item.correctIndex < sourceOptions.length) {
    answer = sourceOptions[item.correctIndex];
  }
  if (!question || !answer) return null;

  return {
    id: asText(item.id) || `${game?.id || "game"}-${index}-${hashValue(normalizeText(question) + "|" + normalizeText(answer))}`,
    question,
    answer,
    sourceOptions,
    listedCorrectAnswers,
  };
}

function uniqueBaseQuestions(items, game) {
  const seen = new Set();
  return items.map((item, index) => extractBaseQuestion(item, game, index)).filter(Boolean).filter((item) => {
    const key = `${normalizeText(item.question)}|${normalizeText(item.answer)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isNumericAnswer(value) {
  const normalized = asText(value).replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/,/g, "");
  return normalized !== "" && Number.isFinite(Number(normalized));
}

function fallbackDistractors(answer, game) {
  const english = /^(eng-|English)/i.test(asText(game?.id) + " " + asText(game?.category));
  if (/^(درست|غلط|صحیح|نادرست|true|false)$/i.test(answer)) {
    return english
      ? ["Not enough information", "None of the above", "Cannot be determined"]
      : ["اطلاعات کافی نیست", "هیچ‌کدام از گزینه‌ها", "قابل تشخیص نیست"];
  }
  if (isNumericAnswer(answer)) {
    const numeric = Number(asText(answer).replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/,/g, ""));
    return [-3, -2, -1, 1, 2, 3, 5, 10].map((offset) => persian(numeric + offset));
  }
  return english
    ? ["None of the above", "Not enough information", "Another choice"]
    : ["هیچ‌کدام از گزینه‌ها", "اطلاعات کافی نیست", "گزینهٔ دیگری"];
}

function buildFourOptions(base, answerPool, game) {
  const answer = base.answer;
  const correctKey = normalizeText(answer);
  const candidates = [
    ...base.sourceOptions,
    ...answerPool,
    ...fallbackDistractors(answer, game),
  ];
  const distractors = [];
  const seen = new Set([correctKey, ...base.listedCorrectAnswers.map(normalizeText)]);
  for (const candidate of candidates) {
    const value = asText(candidate);
    const key = normalizeText(value);
    if (!value || !key || seen.has(key)) continue;
    seen.add(key);
    distractors.push(value);
    if (distractors.length === 3) break;
  }
  for (let index = 1; distractors.length < 3; index += 1) {
    const fallback = /^(eng-|English)/i.test(asText(game?.id) + " " + asText(game?.category))
      ? `Alternative ${index}`
      : `گزینهٔ جایگزین ${persian(index)}`;
    const key = normalizeText(fallback);
    if (!seen.has(key)) {
      seen.add(key);
      distractors.push(fallback);
    }
  }
  return shuffle([answer, ...distractors]);
}

const PERSIAN_CONTEXTS = [
  "در تمرین کلاسی", "در آزمون کوتاه", "در مرور درس", "در فعالیت آموزشی",
  "در یک موقعیت یادگیری", "در پرسش روز", "در تمرین مرحله‌ای", "در مسابقه دانایی",
  "در کارت آموزشی", "در مأموریت یادگیری", "در مرور هوشمند", "در چالش درس",
  "در ایستگاه تمرین", "در سنجش آموخته‌ها", "در تمرین تکمیلی", "در پرسش مفهومی",
  "در بازی مرور", "در تمرین مستقل", "در فعالیت کلاسی", "در آزمون مهارتی",
];
const QUESTION_FORMS = [
  (question) => question,
  (question) => `به پرسش زیر پاسخ بده: ${question}`,
  (question) => `پاسخ درست این پرسش کدام است؟ ${question}`,
  (question) => `کدام گزینه پرسش زیر را درست پاسخ می‌دهد؟ ${question}`,
  (question) => `گزینهٔ صحیح را برای این پرسش انتخاب کن: ${question}`,
  (question) => `پاسخ دقیق پرسش زیر را مشخص کن: ${question}`,
  (question) => `برای پرسش زیر بهترین پاسخ را پیدا کن: ${question}`,
  (question) => `کدام پاسخ با پرسش زیر سازگار است؟ ${question}`,
  (question) => `این پرسش را بخوان و پاسخ مناسب را انتخاب کن: ${question}`,
  (question) => `در این مورد کدام پاسخ صحیح است؟ ${question}`,
  (question) => `دانسته‌هایت را به کار ببر و پاسخ بده: ${question}`,
  (question) => `پاسخ مناسب را از میان گزینه‌ها پیدا کن: ${question}`,
  (question) => `کدام پاسخ، مفهوم پرسش را درست بیان می‌کند؟ ${question}`,
  (question) => `برای تکمیل این تمرین، پاسخ درست را انتخاب کن: ${question}`,
  (question) => `به این مورد توجه کن و گزینهٔ درست را برگزین: ${question}`,
  (question) => `پرسش آموزشی: ${question}`,
  (question) => `اکنون پاسخ این پرسش را مشخص کن: ${question}`,
  (question) => `کدام گزینه پاسخ صحیح‌تری برای این پرسش است؟ ${question}`,
  (question) => `پاسخ را با توجه به صورت پرسش انتخاب کن: ${question}`,
  (question) => `این سؤال را بررسی کن: ${question}`,
];

function makeUniqueQuestionBank(baseQuestions, game) {
  const answerPool = [...new Set(baseQuestions.map((item) => item.answer).filter(Boolean))];
  const initial = baseQuestions.map((base) => ({
    id: base.id,
    question: base.question,
    options: buildFourOptions(base, answerPool, game),
    correctAnswer: base.answer,
  }));
  const unique = [];
  const seen = new Set();
  const add = (item) => {
    const key = normalizeText(item.question);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    unique.push(item);
    return true;
  };
  for (const item of initial) {
    if (unique.length >= MINIMUM_BANK_SIZE) break;
    add(item);
  }

  if (unique.length < MINIMUM_BANK_SIZE && baseQuestions.length) {
    for (let round = 0; unique.length < MINIMUM_BANK_SIZE && round < MINIMUM_BANK_SIZE; round += 1) {
      for (let index = 0; index < baseQuestions.length && unique.length < MINIMUM_BANK_SIZE; index += 1) {
        const base = baseQuestions[index];
        const formIndex = Math.floor(round / PERSIAN_CONTEXTS.length) % QUESTION_FORMS.length;
        const contextIndex = round % PERSIAN_CONTEXTS.length;
        const question = `${PERSIAN_CONTEXTS[contextIndex]} شمارهٔ ${persian(index + 1)}: ${QUESTION_FORMS[formIndex](base.question)}`;
        const variant = {
          id: `${base.id}-variant-${round}`,
          question,
          options: buildFourOptions(base, answerPool, game),
          correctAnswer: base.answer,
        };
        add(variant);
      }
    }
  }

  return unique.map((item) => {
    const options = item.options.slice(0, 4);
    const correctIndex = options.findIndex((option) => normalizeText(option) === normalizeText(item.correctAnswer));
    return {
      id: item.id,
      question: item.question,
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
    };
  });
}

/** Returns a unique four-choice bank for every supported game engine. */
export function getQuestionBank(game) {
  if (!game) return [];
  const source = uniqueBaseQuestions(sourceItems(game), game);
  const generated = source.length >= MINIMUM_BANK_SIZE ? [] : generatedMathBank(game.id);
  const base = generated.length >= MINIMUM_BANK_SIZE
    ? uniqueBaseQuestions(generated, { ...game, engine: "quiz" })
    : source;
  return makeUniqueQuestionBank(base, game);
}

export function getQuestionCount(game) {
  return getQuestionBank(game).length;
}

function roundSize(game, bankLength) {
  if (!bankLength) return 0;
  if (Number.isInteger(game?.roundSize) && game.roundSize > 0) return Math.min(game.roundSize, bankLength);
  if (["match", "memory", "sort"].includes(game?.engine)) return Math.min(8, bankLength);
  return Math.min(7, bankLength);
}

function questionKey(question) {
  return normalizeText(question?.question);
}

function storageKey(userId, gameId) {
  const scope = encodeURIComponent(asText(userId) || "guest");
  const game = encodeURIComponent(asText(gameId));
  return `${ROUND_PREFIX}${scope}:${game}`;
}

function readSnapshot(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

function writeSnapshot(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function normalizeQuestion(question) {
  const options = shuffle(question.options);
  const correctAnswer = question.options[question.correctIndex];
  return {
    ...question,
    options,
    correctIndex: options.findIndex((option) => normalizeText(option) === normalizeText(correctAnswer)),
  };
}

export function createQuestionRound(game, reason = "open", userId = "guest") {
  const bank = getQuestionBank(game);
  const targetCount = roundSize(game, bank.length);
  const fingerprint = hashValue(bank.map(questionKey).join("||"));
  const key = storageKey(userId, game.id);
  const previous = readSnapshot(key);
  let cycleNumber = previous?.bankFingerprint === fingerprint ? (previous.cycleNumber || 1) : 1;
  let roundNumber = previous?.bankFingerprint === fingerprint ? (previous.roundNumber || 0) : 0;
  let usedQuestionIds = previous?.bankFingerprint === fingerprint && Array.isArray(previous.usedQuestionIds)
    ? previous.usedQuestionIds
    : [];

  let remaining = bank.filter((question) => !usedQuestionIds.includes(questionKey(question)));
  if (!remaining.length && bank.length) {
    cycleNumber += 1;
    usedQuestionIds = [];
    remaining = [...bank];
  }

  const selected = shuffle(remaining).slice(0, targetCount);
  const selectedIds = selected.map(questionKey);
  const randomizedGame = {
    ...game,
    engine: "quiz",
    questions: selected.map(normalizeQuestion),
  };
  roundNumber += 1;

  const snapshot = {
    id: randomId(),
    gameId: game.id,
    userId: asText(userId) || "guest",
    reason,
    createdAt: new Date().toISOString(),
    questionCount: bank.length,
    targetQuestionCount: targetCount,
    actualQuestionCount: selected.length,
    roundNumber,
    cycleNumber,
    bankFingerprint: fingerprint,
    usedQuestionIds: [...usedQuestionIds, ...selectedIds],
    game: randomizedGame,
    progress: { index: 0, answers: [] },
  };
  writeSnapshot(key, snapshot);
  return snapshot;
}

export function saveQuestionRoundProgress(gameId, progress, userId = "guest") {
  const key = storageKey(userId, gameId);
  const snapshot = readSnapshot(key);
  if (!snapshot) return;
  writeSnapshot(key, {
    ...snapshot,
    progress: { ...snapshot.progress, ...progress },
    updatedAt: new Date().toISOString(),
  });
}

export function loadQuestionRound(gameId, userId = "guest") {
  return readSnapshot(storageKey(userId, gameId));
}

export function clearQuestionRound(gameId, userId = "guest") {
  try { localStorage.removeItem(storageKey(userId, gameId)); } catch { /* storage is best effort */ }
}

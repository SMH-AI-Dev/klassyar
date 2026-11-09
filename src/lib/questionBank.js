/** Local round builder for the built-in game catalogue. */
const ROUND_PREFIX = "klassyar_question_round:";
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
const persian = (value) => String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

function numericQuestion(operator, left, right, answer) {
  const options = shuffle([...new Set([answer, ...[-2, -1, 1, 2, 3, -3].map((offset) => Math.max(0, answer + offset))])].slice(0, 4));
  return {
    question: `${persian(left)} ${operator} ${persian(right)} = ؟`,
    options: options.map(persian),
    correctIndex: options.indexOf(answer),
  };
}

function generatedMathBank(id) {
  const bank = [];
  if (id === "math-add-basic") for (let a = 1; a <= 20; a += 1) for (let b = 1; b <= 20; b += 1) bank.push(numericQuestion("+", a, b, a + b));
  if (id === "math-sub-basic") for (let a = 11; a <= 30; a += 1) for (let b = 1; b <= 20; b += 1) bank.push(numericQuestion("−", a, b, a - b));
  if (id === "math-mult-easy") for (let a = 1; a <= 20; a += 1) for (let b = 1; b <= 20; b += 1) bank.push(numericQuestion("×", a, b, a * b));
  if (id === "math-division") for (let divisor = 1; divisor <= 20; divisor += 1) for (let quotient = 1; quotient <= 20; quotient += 1) bank.push(numericQuestion("÷", divisor * quotient, divisor, quotient));
  return bank;
}

function sourceItems(game) {
  return game?.questionBank || game?.questions || game?.words || game?.cards || game?.items || [];
}

function stableValue(value) {
  if (Array.isArray(value)) return `[${value.map(stableValue).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableValue(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function isValidBankItem(item, game) {
  if (!item || typeof item !== "object" || Array.isArray(item)) return false;
  if (game?.engine === "quiz") {
    return typeof item.question === "string"
      && item.question.trim().length > 0
      && Array.isArray(item.options)
      && item.options.length >= 2
      && Number.isInteger(item.correctIndex)
      && item.correctIndex >= 0
      && item.correctIndex < item.options.length;
  }
  if (game?.engine === "match" || game?.engine === "memory") {
    return Boolean(item.id && (item.text || item.en || item.emoji));
  }
  if (game?.engine === "sort") return Boolean(item.id && item.label && item.category);
  if (["type", "fillblank", "scramble"].includes(game?.engine)) {
    return Boolean(item.answer && (item.hint || item.text || item.question || item.scrambled));
  }
  return Object.values(item).some((value) => typeof value === "string" ? value.trim().length > 0 : value != null);
}

function uniqueValidItems(items, game) {
  const seen = new Set();
  return items.filter((item) => {
    if (!isValidBankItem(item, game)) return false;
    const key = stableValue(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeQuestion(question) {
  if (!Array.isArray(question?.options) || question.options.length < 2) return { ...question };
  const correct = question.options[question.correctIndex];
  if (correct === undefined) return { ...question };
  const options = shuffle(question.options);
  return { ...question, options, correctIndex: options.indexOf(correct) };
}

/** Returns unique authored entries, or generated arithmetic questions where available. */
export function getQuestionBank(game) {
  const source = uniqueValidItems(sourceItems(game), game);
  if (source.length >= MINIMUM_BANK_SIZE) return source;
  const generated = generatedMathBank(game?.id);
  if (generated.length >= MINIMUM_BANK_SIZE) return generated;
  return source;
}

export function getQuestionCount(game) {
  return getQuestionBank(game).length;
}

function roundSize(game, bankLength) {
  if (!bankLength) return 0;
  if (game?.roundSize) return Math.min(game.roundSize, bankLength);
  if (["match", "memory", "sort"].includes(game?.engine)) return Math.min(8, bankLength);
  return Math.min(7, bankLength);
}

function roundGame(game) {
  const bank = shuffle(getQuestionBank(game));
  const selected = bank.slice(0, roundSize(game, bank.length));
  const cloned = { ...game };
  if (Array.isArray(game.questions) || game.engine === "quiz") cloned.questions = selected.map(normalizeQuestion);
  else if (Array.isArray(game.words)) cloned.words = selected;
  else if (Array.isArray(game.cards)) cloned.cards = selected;
  else if (Array.isArray(game.items)) cloned.items = selected;
  return cloned;
}

function signature(game) {
  return stableValue(game.questions || game.words || game.cards || game.items || []);
}

function diversifyRound(game, usedSignatures) {
  let randomized = roundGame(game);
  for (let attempt = 0; attempt < 40 && usedSignatures.includes(signature(randomized)); attempt += 1) {
    randomized = roundGame(game);
  }

  if (usedSignatures.includes(signature(randomized))) {
    const items = randomized.questions || randomized.words || randomized.cards || randomized.items;
    if (items?.length > 1) {
      const diversified = [...items.slice(1), items[0]];
      if (randomized.questions) randomized.questions = diversified;
      else if (randomized.words) randomized.words = diversified;
      else if (randomized.cards) randomized.cards = diversified;
      else randomized.items = diversified;
    } else if (randomized.questions?.[0]?.options?.length > 1) {
      randomized.questions[0] = normalizeQuestion(randomized.questions[0]);
    }
  }
  return randomized;
}

export function createQuestionRound(game, reason = "open") {
  let previous;
  try { previous = JSON.parse(localStorage.getItem(`${ROUND_PREFIX}${game.id}`) || "null"); } catch { previous = null; }
  const usedSignatures = previous?.usedSignatures || [];
  const randomized = diversifyRound(game, usedSignatures);
  const round = {
    id: randomId(),
    gameId: game.id,
    reason,
    createdAt: new Date().toISOString(),
    questionCount: getQuestionCount(game),
    targetQuestionCount: roundSize(game, getQuestionCount(game)),
    roundNumber: (previous?.roundNumber || 0) + 1,
    game: randomized,
  };
  const snapshot = {
    ...round,
    usedSignatures: [...usedSignatures, signature(randomized)].slice(-ROUNDS_PER_GAME),
    progress: { index: 0, answers: [] },
  };
  try { localStorage.setItem(`${ROUND_PREFIX}${game.id}`, JSON.stringify(snapshot)); } catch { /* storage is best effort */ }
  return snapshot;
}

export function saveQuestionRoundProgress(gameId, progress) {
  try {
    const key = `${ROUND_PREFIX}${gameId}`;
    const snapshot = JSON.parse(localStorage.getItem(key) || "null");
    if (snapshot) localStorage.setItem(key, JSON.stringify({
      ...snapshot,
      progress: { ...snapshot.progress, ...progress },
      updatedAt: new Date().toISOString(),
    }));
  } catch { /* storage is best effort */ }
}

export function loadQuestionRound(gameId) {
  try { return JSON.parse(localStorage.getItem(`${ROUND_PREFIX}${gameId}`) || "null"); } catch { return null; }
}

export function clearQuestionRound(gameId) {
  try { localStorage.removeItem(`${ROUND_PREFIX}${gameId}`); } catch { /* storage is best effort */ }
}

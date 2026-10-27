/**
 * Central question-bank and round manager.
 *
 * A game keeps its authored content in `questionBank` (or the legacy
 * `questions`/`words` fields). This module creates a fresh, shuffled round
 * without mutating the source data. The last round is persisted locally so a
 * future progress-sync layer can resume it safely.
 */

const ROUND_PREFIX = "klassyar_question_round:";
export const QUESTIONS_PER_GAME = 400;
export const ROUNDS_PER_GAME = 400;

function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function randomizeQuestion(question) {
  if (!Array.isArray(question?.options)) return { ...question };
  const options = shuffle(question.options);
  const correct = question.options[question.correctIndex];
  return { ...question, options, correctIndex: options.indexOf(correct) };
}

function randomizeGameContent(game) {
  const randomized = { ...game };
  if (Array.isArray(game.questions)) {
    randomized.questions = shuffle(game.questions).map(randomizeQuestion);
  }
  if (Array.isArray(game.words)) randomized.words = shuffle(game.words);
  if (Array.isArray(game.cards)) randomized.cards = shuffle(game.cards);
  if (Array.isArray(game.items)) randomized.items = shuffle(game.items);
  if (Array.isArray(game.categories)) randomized.categories = shuffle(game.categories);
  return randomized;
}

function contentSignature(game) {
  if (Array.isArray(game.questions)) {
    return game.questions.map((q) => `${q.question}|${q.options?.join(',') || ''}`).join('||');
  }
  if (Array.isArray(game.cards)) return game.cards.map((card) => card.id).join('|');
  if (Array.isArray(game.words)) return game.words.map((word) => word.answer || word.scrambled).join('|');
  if (Array.isArray(game.items)) return game.items.map((item) => item.id).join('|');
  return JSON.stringify(game);
}

function storageKey(gameId) {
  return `${ROUND_PREFIX}${gameId}`;
}

export function getQuestionBank(game) {
  return game?.questionBank || game?.questions || game?.words || [];
}

export function getQuestionCount(game) {
  return getQuestionBank(game).length;
}

export function createQuestionRound(game, reason = "open") {
  let previous = null;
  try {
    previous = JSON.parse(localStorage.getItem(storageKey(game.id)) || "null");
  } catch {
    previous = null;
  }

  const round = {
    id: randomId(),
    gameId: game.id,
    reason,
    createdAt: new Date().toISOString(),
    questionCount: getQuestionCount(game),
    roundNumber: (previous?.roundNumber || 0) + 1,
    targetQuestionCount: QUESTIONS_PER_GAME,
    targetRoundCount: ROUNDS_PER_GAME,
  };
  const usedSignatures = Array.isArray(previous?.usedSignatures) ? previous.usedSignatures : [];
  let randomizedGame = randomizeGameContent(game);
  // Keep generating until this arrangement has not been used in the current
  // 400-round cycle. This is especially useful for card and memory games.
  for (let attempt = 0; attempt < 80 && usedSignatures.includes(contentSignature(randomizedGame)); attempt += 1) {
    randomizedGame = randomizeGameContent(game);
  }
  round.signature = contentSignature(randomizedGame);
  const nextUsedSignatures = [...usedSignatures, round.signature].slice(-ROUNDS_PER_GAME);
  const snapshot = {
    ...round,
    cycle: Math.floor((round.roundNumber - 1) / ROUNDS_PER_GAME) + 1,
    game: randomizedGame,
    usedSignatures: nextUsedSignatures,
    progress: { index: 0, answers: [] },
  };

  try {
    localStorage.setItem(storageKey(game.id), JSON.stringify(snapshot));
  } catch {
    // The game remains playable when storage is unavailable or full.
  }
  return snapshot;
}

export function saveQuestionRoundProgress(gameId, progress) {
  try {
    const raw = localStorage.getItem(storageKey(gameId));
    if (!raw) return;
    const snapshot = JSON.parse(raw);
    localStorage.setItem(storageKey(gameId), JSON.stringify({
      ...snapshot,
      progress: { ...snapshot.progress, ...progress },
      updatedAt: new Date().toISOString(),
    }));
  } catch {
    // Progress persistence is best-effort in local-first mode.
  }
}

export function loadQuestionRound(gameId) {
  try {
    const raw = localStorage.getItem(storageKey(gameId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearQuestionRound(gameId) {
  try {
    localStorage.removeItem(storageKey(gameId));
  } catch {
    // Ignore unavailable storage.
  }
}

export function formatHistoricalAnswer(label, equivalents = {}) {
  const values = [label, equivalents.hijri, equivalents.shamsi, equivalents.gregorian]
    .filter(Boolean);
  return [...new Set(values)].join(" / ");
}


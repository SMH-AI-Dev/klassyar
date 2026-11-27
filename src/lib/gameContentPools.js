import gameLibrary from "./gameLibrary.js";
import englishGames from "./englishGames.js";

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200d]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase();
}

function uniqueBy(items, keyOf) {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalize(keyOf(item));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function collectQuestionRecords(games) {
  const records = [];
  for (const game of games) {
    for (const item of game.questions || []) {
      const answer = item.options?.[item.correctIndex] ?? item.answer ?? item.a;
      const question = item.question ?? item.hint ?? item.text ?? item.q;
      if (question && answer) {
        records.push({
          id: `pool-${game.id}-${records.length}`,
          q: String(question),
          a: String(answer),
          wrong: Array.isArray(item.options)
            ? item.options.filter((option, index) => index !== item.correctIndex).map(String)
            : Array.isArray(item.wrong) ? item.wrong.map(String) : [],
          sourceGameId: game.id,
        });
      }
    }
    for (const item of game.items || []) {
      const q = item.q ?? item.question ?? item.text ?? item.label;
      const a = item.a ?? item.answer ?? item.correctAnswer ?? item.category;
      if (q && a) records.push({
        id: `pool-${game.id}-${records.length}`,
        q: String(q),
        a: String(a),
        wrong: Array.isArray(item.wrong) ? item.wrong.map(String) : [],
        sourceGameId: game.id,
      });
    }
    for (const item of game.cards || []) {
      if (item.text && item.en) records.push({
        id: `pool-${game.id}-${records.length}`,
        q: String(item.text),
        a: String(item.en),
        wrong: [],
        sourceGameId: game.id,
      });
    }
    for (const item of game.words || []) {
      if (item.hint && item.answer) records.push({
        id: `pool-${game.id}-${records.length}`,
        q: String(item.hint),
        a: String(item.answer),
        wrong: [],
        sourceGameId: game.id,
      });
    }
  }
  return uniqueBy(records, (item) => `${item.q}|${item.a}`);
}

function collectWordRecords(games) {
  const records = [];
  const add = (word, clue, sourceGameId) => {
    const answer = String(word ?? "").trim();
    if (!answer || /\s/.test(answer) || !/^[\p{L}\p{N}-]+$/u.test(answer)) return;
    if (Array.from(answer).length < 2 || Array.from(answer).length > 10) return;
    records.push({
      id: `word-pool-${sourceGameId}-${records.length}`,
      q: String(clue || answer),
      a: answer,
      hint: String(clue || answer),
      sourceGameId,
    });
  };
  for (const game of games) {
    for (const item of game.words || []) add(item.answer, item.hint, game.id);
    for (const item of game.cards || []) add(item.en, item.text, game.id);
  }
  return uniqueBy(records, (item) => item.a);
}

const persianGames = gameLibrary.filter((game) => !/^eng-/i.test(game.id));
const englishOnlyGames = [...englishGames, ...gameLibrary.filter((game) => /^eng-/i.test(game.id))];

const PERSIAN_QUESTION_POOL = collectQuestionRecords(persianGames);
const ENGLISH_QUESTION_POOL = collectQuestionRecords(englishOnlyGames);
const PERSIAN_WORD_POOL = collectWordRecords(persianGames);
const ENGLISH_WORD_POOL = collectWordRecords(englishOnlyGames);

/**
 * Generic legacy mini-games have small starter sets. This supplies them with
 * original, deduplicated content records from the matching language catalogue.
 * It does not change their engine or convert their interaction into a quiz.
 */
export function getFallbackContentPool(game) {
  const isEnglish = /^eng-/i.test(String(game?.id || ""));
  const questionPool = isEnglish ? ENGLISH_QUESTION_POOL : PERSIAN_QUESTION_POOL;
  const wordPool = isEnglish ? ENGLISH_WORD_POOL : PERSIAN_WORD_POOL;
  if (["scramble", "anagram", "hangman", "wordsearch"].includes(game?.engine)) return wordPool;
  return questionPool;
}

export function getFallbackContentPoolStats() {
  return {
    faQuestions: PERSIAN_QUESTION_POOL.length,
    enQuestions: ENGLISH_QUESTION_POOL.length,
    faWords: PERSIAN_WORD_POOL.length,
    enWords: ENGLISH_WORD_POOL.length,
  };
}

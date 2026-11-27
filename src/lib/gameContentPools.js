import gameLibrary from "./gameLibrary.js";

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

function collectWordRecords(games, language) {
  const records = [];
  const hasLanguageScript = (value) => language === "fa"
    ? /[\u0600-\u06FF]/.test(String(value ?? ""))
    : /[A-Za-z]/.test(String(value ?? ""));
  const add = (word, clue, sourceGameId) => {
    const answer = String(word ?? "").trim();
    if (!answer || /\s/.test(answer) || !/^[\p{L}\p{N}-]+$/u.test(answer)) return;
    if (!hasLanguageScript(answer)) return;
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
    for (const item of game.cards || []) {
      add(language === "fa" ? item.text : item.en, item.text, game.id);
    }
  }
  return uniqueBy(records, (item) => item.a);
}

const persianGames = gameLibrary.filter((game) => !/^eng-/i.test(game.id));

const PERSIAN_QUESTION_POOL = collectQuestionRecords(persianGames)
  .filter((item) => /[\u0600-\u06FF]/.test(item.q + item.a));
const PERSIAN_WORD_POOL = collectWordRecords(persianGames, "fa");

/**
 * Supplies legacy school mini-games with original Persian records.
 * Each game keeps its own engine and interaction model.
 */
export function getFallbackContentPool(game) {
  if (["scramble", "anagram", "hangman", "wordsearch"].includes(game?.engine)) return PERSIAN_WORD_POOL;
  return PERSIAN_QUESTION_POOL;
}

export function getFallbackContentPoolStats() {
  return {
    faQuestions: PERSIAN_QUESTION_POOL.length,
    faWords: PERSIAN_WORD_POOL.length,
  };
}

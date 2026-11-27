import gameLibrary from "./gameLibrary.js";
import englishGames from "./englishGames.js";
import { getGameContentBank, MINIMUM_BANK_SIZE } from "./questionBank.js";

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[\u200c\u200d]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[؟?!.،,:;؛]+$/g, "")
    .toLocaleLowerCase();
}

function identity(game, item) {
  switch (game.engine) {
    case "quiz": return normalize(item.question);
    case "match":
    case "memory": return `${normalize(item.text || item.label)}|${normalize(item.en || item.answer)}`;
    case "sort": return `${normalize(item.label)}|${normalize(item.category)}`;
    case "scramble":
    case "anagram":
    case "hangman":
    case "wordsearch": return normalize(item.answer || item.a);
    case "type": return `${normalize(item.hint || item.question)}|${normalize(item.answer || item.a)}`;
    case "fillblank": return `${normalize(item.text || item.question)}|${normalize(item.answer || item.a)}`;
    default: return `${normalize(item.q || item.question || item.hint || item.text)}|${normalize(item.a || item.answer || item.correctAnswer)}`;
  }
}

function validateRecord(game, item) {
  switch (game.engine) {
    case "quiz":
      return Boolean(
        item.question &&
        Array.isArray(item.options) &&
        item.options.length === 4 &&
        new Set(item.options.map(normalize)).size === 4 &&
        Number.isInteger(item.correctIndex) &&
        item.correctIndex >= 0 &&
        item.correctIndex < 4
      );
    case "match":
    case "memory":
      return Boolean(item.id && (item.text || item.label) && (item.en || item.answer));
    case "sort":
      return Boolean(item.id && item.label && item.category);
    case "scramble":
      return Boolean(item.scrambled && item.answer && item.hint);
    case "type":
      return Boolean(item.hint && item.answer);
    case "fillblank":
      return Boolean((item.text || item.question) && (item.answer || item.a));
    case "typing":
      return Boolean((item.q || item.hint || item.question) && (item.a || item.answer));
    case "anagram":
    case "hangman":
    case "wheel":
    case "whack":
    case "balloons":
    case "truefalse":
    case "wordsearch":
    case "openbox":
      return Boolean((item.q || item.hint || item.question) && (item.a || item.answer));
    default:
      return Boolean(item && typeof item === "object");
  }
}

const catalogues = [
  ["fa", gameLibrary],
  ["en", englishGames],
];
let failures = 0;
const report = catalogues.flatMap(([language, games]) => games.map((game) => {
  const bank = getGameContentBank(game);
  const seen = new Set();
  const issues = [];
  if (bank.length !== MINIMUM_BANK_SIZE) issues.push(`bank-size:${bank.length}`);
  bank.forEach((item, index) => {
    const key = identity(game, item);
    if (!key || key === "|") issues.push(`empty-content:${index}`);
    else if (seen.has(key)) issues.push(`duplicate-content:${index}`);
    seen.add(key);
    if (!validateRecord(game, item)) issues.push(`invalid-record:${index}`);
  });
  if (game.engine === "sort") {
    const categoryNames = new Set((game.categories || []).map((category) => normalize(category.name)));
    bank.forEach((item, index) => {
      if (!categoryNames.has(normalize(item.category))) issues.push(`unknown-category:${index}`);
    });
  }
  const passed = issues.length === 0;
  if (!passed) failures += 1;
  return { language, id: game.id, engine: game.engine, count: bank.length, passed, issues: issues.slice(0, 8) };
}));
for (const item of report) {
  console.log(`${item.language.toUpperCase()}\t${item.id}\t${item.engine}\t${item.count}\t${item.passed ? "PASS" : "FAIL"}${item.issues.length ? `\t${item.issues.join(",")}` : ""}`);
}
console.log(`SUMMARY\t${report.length} games\t${report.length - failures} pass\t${failures} fail`);
if (failures) process.exitCode = 1;

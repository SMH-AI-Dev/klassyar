import gameLibrary from "./gameLibrary.js";
import englishGames from "./englishGames.js";
import { getQuestionBank, MINIMUM_BANK_SIZE } from "./questionBank.js";

function stableValue(value) {
  if (Array.isArray(value)) return `[${value.map(stableValue).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableValue(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function validItem(game, item) {
  if (!item || typeof item !== "object" || Array.isArray(item)) return false;
  if (game.engine === "quiz") {
    return typeof item.question === "string"
      && item.question.trim().length > 0
      && Array.isArray(item.options)
      && item.options.length >= 2
      && new Set(item.options).size === item.options.length
      && Number.isInteger(item.correctIndex)
      && item.correctIndex >= 0
      && item.correctIndex < item.options.length
      && item.options.every((option) => typeof option === "string" && option.trim());
  }
  if (["match", "memory"].includes(game.engine)) return Boolean(item.id && (item.text || item.en || item.emoji));
  if (game.engine === "sort") return Boolean(item.id && item.label && item.category);
  if (game.engine === "scramble") return Boolean(item.scrambled && item.answer && item.hint);
  if (game.engine === "fillblank") return Boolean(item.text?.includes("___") && item.answer);
  if (game.engine === "type") return Boolean(item.hint && item.answer);
  return false;
}

const catalogues = [
  ["fa", gameLibrary],
  ["en", englishGames],
];
let failures = 0;
const report = catalogues.flatMap(([language, games]) => games.map((game) => {
  const seen = new Set();
  const bank = getQuestionBank(game).filter((item) => {
    if (!validItem(game, item)) return false;
    const key = stableValue(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const passed = bank.length >= MINIMUM_BANK_SIZE;
  if (!passed) failures += 1;
  return {
    language,
    id: game.id,
    engine: game.engine,
    distinctValidItems: bank.length,
    required: MINIMUM_BANK_SIZE,
    passed,
  };
}));

for (const item of report) {
  console.log(`${item.language.toUpperCase()}\t${item.id}\t${item.engine}\t${item.distinctValidItems}\t${item.passed ? "PASS" : "FAIL"}`);
}
console.log(`SUMMARY\t${report.length} games\t${report.length - failures} pass\t${failures} below ${MINIMUM_BANK_SIZE}`);
if (failures) process.exitCode = 1;

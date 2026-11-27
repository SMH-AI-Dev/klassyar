import gameLibrary from "./gameLibrary.js";
import englishGames from "./englishGames.js";
import { getQuestionBank, MINIMUM_BANK_SIZE } from "./questionBank.js";

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

const catalogues = [
  ["fa", gameLibrary],
  ["en", englishGames],
];
let failures = 0;
const report = catalogues.flatMap(([language, games]) => games.map((game) => {
  const bank = getQuestionBank(game);
  const seen = new Set();
  const issues = [];
  if (bank.length !== MINIMUM_BANK_SIZE) issues.push(`bank-size:${bank.length}`);
  bank.forEach((question, index) => {
    const key = normalize(question?.question);
    if (!key) issues.push(`empty-question:${index}`);
    else if (seen.has(key)) issues.push(`duplicate-question:${index}`);
    seen.add(key);
    if (!Array.isArray(question?.options) || question.options.length !== 4) {
      issues.push(`option-count:${index}`);
      return;
    }
    const optionKeys = question.options.map(normalize);
    if (optionKeys.some((option) => !option) || new Set(optionKeys).size !== 4) {
      issues.push(`duplicate-or-empty-options:${index}`);
    }
    if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex >= 4) {
      issues.push(`invalid-correct-index:${index}`);
    }
  });
  const passed = issues.length === 0;
  if (!passed) failures += 1;
  return { language, id: game.id, sourceEngine: game.engine, count: bank.length, passed, issues: issues.slice(0, 8) };
}));
for (const item of report) {
  console.log(`${item.language.toUpperCase()}\t${item.id}\t${item.sourceEngine}\t${item.count}\t${item.passed ? "PASS" : "FAIL"}${item.issues.length ? `\t${item.issues.join(",")}` : ""}`);
}
console.log(`SUMMARY\t${report.length} games\t${report.length - failures} pass\t${failures} fail`);
if (failures) process.exitCode = 1;

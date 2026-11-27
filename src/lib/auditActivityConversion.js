import { convertActivityData, getCompatibleTemplates } from "./activityConversion.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const flashcards = {
  id: "flashcards-source",
  title: "واژگان",
  type: "flashcard",
  theme: "lavender",
  content: {
    cards: [
      { front: "Apple", back: "سیب" },
      { front: "Book", back: "کتاب" },
      { front: "Water", back: "آب" },
      { front: "Sun", back: "خورشید" },
    ],
  },
};
const quiz = convertActivityData(flashcards, "quiz");
assert(quiz.type === "quiz" && quiz.content.questions.length === 4, "Flashcard to quiz conversion failed");
assert(quiz.content.questions.every((item) => item.options.length === 4 && item.correct_answer === 0), "Converted quiz options are invalid");

const matching = convertActivityData(flashcards, "matching");
assert(matching.content.pairs.length === 4, "Flashcard to matching conversion failed");

const flashcardsAgain = convertActivityData(matching, "flashcard");
assert(flashcardsAgain.content.cards.length === 4, "Matching to flashcard conversion failed");

const groupSort = {
  id: "sort-source",
  title: "دسته‌بندی",
  type: "group_sort",
  content: {
    groups: [
      { name: "میوه", items: ["سیب", "موز"] },
      { name: "وسیله", items: ["کتاب", "مداد"] },
    ],
  },
};
const sortedPairs = convertActivityData(groupSort, "matching");
assert(sortedPairs.content.pairs.length === 4, "Group sort to matching conversion failed");

const gameshow = convertActivityData(quiz, "gameshow_quiz");
assert(gameshow.type === "gameshow_quiz" && gameshow.content.questions.length === 4, "Quiz to gameshow conversion failed");

const incompatible = getCompatibleTemplates({
  id: "weak-source",
  title: "منبع ناکافی",
  type: "flashcard",
  content: { cards: [{ front: "A", back: "X" }, { front: "B", back: "X" }] },
});
assert(!incompatible.some((item) => item.type === "quiz" || item.type === "gameshow_quiz"), "Invalid quiz conversion was offered");

assert(flashcards.type === "flashcard" && flashcards.content.cards.length === 4, "Source activity was mutated");
console.log("PASS flashcard ↔ matching conversion");
console.log("PASS flashcard → four-choice quiz conversion");
console.log("PASS group sort → matching conversion");
console.log("PASS quiz → gameshow quiz conversion");
console.log("PASS incompatible conversions are not offered");
console.log("PASS source activities remain unchanged");

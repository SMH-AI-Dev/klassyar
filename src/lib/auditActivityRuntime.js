import { normalizeActivityForPlay } from "./activityRuntime.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const groupSort = normalizeActivityForPlay({
  type: "group_sort",
  content: {
    groups: [
      { name: "میوه", items: ["سیب", "موز"] },
      { name: "ابزار", items: ["چکش", "پیچ‌گوشتی"] },
    ],
    all_items: ["سیب", "موز", "چکش", "پیچ‌گوشتی"],
  },
});
assert(groupSort.content.items.length === 4, "Group Sort did not produce runtime items");
assert(groupSort.content.items.every((item) => item.text && item.group), "Group Sort item is missing text or group");

const gameshow = normalizeActivityForPlay({
  type: "gameshow_quiz",
  content: {
    questions: [{ question: "پایتخت ایران؟", options: ["تهران", "شیراز", "تبریز", "یزد"], correctAnswer: 0 }],
  },
});
assert(gameshow.content.items[0].correctAnswer === "تهران", "Gameshow correct answer index was not converted to its answer text");

const trueFalse = normalizeActivityForPlay({
  type: "true_false",
  content: { statements: [{ text: "زمین گرد است", is_true: true }, { text: "خورشید سیاره است", is_true: false }] },
});
assert(trueFalse.content.questions.length === 2, "True/False statements were not normalized");
assert(trueFalse.content.questions[0].correctAnswer === "true" && trueFalse.content.questions[1].correctAnswer === "false", "True/False values were mapped incorrectly");

const fillBlank = normalizeActivityForPlay({
  type: "fill_blank",
  content: { sentences: [{ text: "آب در دمای صفر درجه یخ می‌زند", correctAnswers: ["یخ"] }] },
});
assert(fillBlank.content.questions[0].question && fillBlank.content.questions[0].answer === "یخ", "Fill Blank sentence was not normalized");

const anagram = normalizeActivityForPlay({
  type: "anagram",
  content: { words: [{ word: "کتاب", hint: "چیزی برای خواندن" }] },
});
assert(anagram.content.items[0].word === "کتاب", "Anagram words were not normalized");

const hangman = normalizeActivityForPlay({
  type: "hangman",
  content: { words: [{ word: "مدرسه", hint: "محل آموزش" }] },
});
assert(hangman.content.items[0].word === "مدرسه", "Hangman words were not normalized");

console.log("PASS Group Sort creator-to-player schema");
console.log("PASS Gameshow Quiz answer-index normalization");
console.log("PASS True/False creator-to-player schema");
console.log("PASS Fill Blank creator-to-player schema");
console.log("PASS Anagram and Hangman word schemas");

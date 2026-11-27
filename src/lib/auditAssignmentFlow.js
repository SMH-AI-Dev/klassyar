const storage = new Map();
globalThis.localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); },
  clear() { storage.clear(); },
};

const { classroom } = await import("./classroom.js");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const teacher = {
  id: "audit-teacher",
  role: "teacher",
  firstName: "معلم",
  lastName: "آزمایشی",
};
classroom.setTeacherProfile(teacher, {
  firstName: teacher.firstName,
  lastName: teacher.lastName,
});
const createdClass = classroom.createClass("کلاس آزمون", teacher.id);
const { student } = classroom.addStudent(createdClass.id, {
  firstName: "دانش‌آموز",
  lastName: "آزمایشی",
}, teacher.id);

const activitySnapshot = {
  id: "audit-activity-1",
  title: "کارت‌های واژگان",
  type: "flashcard",
  description: "فعالیت آزمایشی",
  content: { cards: [{ front: "Apple", back: "سیب" }, { front: "Book", back: "کتاب" }] },
  theme: "lavender",
  options: {},
};
const activityAssignment = classroom.addAssignment(createdClass.id, {
  title: "تکلیف کارت‌ها",
  studentIds: [student.id],
  activitySnapshot,
  questions: [],
  maxAttempts: 2,
  shuffleItems: true,
  deadline: null,
}, teacher.id);

let currentClass = classroom.state(teacher.id).classes.find((item) => item.id === createdClass.id);
let invitation = classroom.invitation(currentClass, student, classroom.state(teacher.id).teacher);
const studentUser = {
  id: "audit-student-account",
  role: "student",
  firstName: student.firstName,
  lastName: student.lastName,
};
classroom.activate(invitation, studentUser);
let profile = classroom.student();
const importedActivityAssignment = profile.assignments.find((item) => item.id === activityAssignment.id);
assert(importedActivityAssignment?.activitySnapshot?.content?.cards?.length === 2, "Activity snapshot did not survive invitation export/import");
assert(importedActivityAssignment.maxAttempts === 2, "Attempt limit was not preserved");

assert(classroom.recordResult({
  assignmentId: activityAssignment.id,
  gameId: activitySnapshot.id,
  gameTitle: activitySnapshot.title,
  roundId: "audit-round-1",
  score: 2,
  total: 2,
  percent: 100,
}), "Student result was not recorded");
assert(classroom.results().some((item) => item.assignmentId === activityAssignment.id), "Assignment result is missing");

const quizAssignment = classroom.addAssignment(createdClass.id, {
  title: "تکلیف چهارگزینه‌ای",
  studentIds: [student.id],
  questions: [{
    prompt: "۲ + ۲ چند می‌شود؟",
    options: ["۳", "۴", "۵", "۶"],
    correctIndex: 1,
    feedback: "جمع دو عدد",
  }],
  maxAttempts: 1,
}, teacher.id);
currentClass = classroom.state(teacher.id).classes.find((item) => item.id === createdClass.id);
invitation = classroom.invitation(currentClass, student, classroom.state(teacher.id).teacher);
classroom.activate(invitation, studentUser);
profile = classroom.student();
assert(profile.assignments.some((item) => item.id === quizAssignment.id), "Legacy quiz assignment did not survive invitation import");
classroom.submitAssignment(quizAssignment.id, [{
  choiceIndex: 1,
  selectedOption: "۴",
  correct: true,
}]);
let blockedSecondAttempt = false;
try {
  classroom.submitAssignment(quizAssignment.id, [{
    choiceIndex: 1,
    selectedOption: "۴",
    correct: true,
  }]);
} catch {
  blockedSecondAttempt = true;
}
assert(blockedSecondAttempt, "Multiple-choice assignment exceeded its one-attempt limit");

console.log("PASS assignment snapshot invitation round-trip");
console.log("PASS assignment results retain assignmentId");
console.log("PASS legacy multiple-choice assignments remain compatible");
console.log("PASS multiple-choice assignment attempt limits are enforced");

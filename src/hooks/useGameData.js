import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { localData } from "@/api/localDataClient";
import { toast } from "@/lib/sonner";
import { useState } from "react";
import { demoSamples } from "@/lib/demoData";
import { classroom } from "@/lib/classroom";

const SHUFFLE_FIELDS_BY_TYPE = {
  quiz: ["questions"],
  flashcard: ["cards"],
  matching: ["pairs"],
  memory_game: ["pairs"],
  group_sort: ["items"],
  wordsearch: ["items"],
  random_wheel: ["items"],
  true_false: ["items"],
  unjumble: ["items", "sentences"],
  whack_a_mole: ["items"],
  fill_blank: ["questions"],
  ranking: ["items"],
  spinner: ["items"],
  card_flip: ["cards", "items"],
  drag_text: ["items"],
  balloon_pop: ["items"],
  missing_word: ["questions"],
  anagram: ["items", "words"],
  random_cards: ["items"],
  airplane: ["questions"],
  gameshow_quiz: ["items", "questions"],
  hangman: ["items", "words"],
  image_quiz: ["questions"],
  labelled_diagram: ["labels"],
  maze_chase: ["questions"],
  open_the_box: ["items"],
  flip_tiles: ["tiles"],
  match: ["pairs"],
  type: ["questions"],
  scramble: ["words"],
};

function seededShuffle(items, seedText) {
  const result = [...items];
  let seed = Array.from(String(seedText)).reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 2166136261);
  for (let index = result.length - 1; index > 0; index -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const target = seed % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function normalizeActivityForPlay(activity) {
  if (!activity?.content || typeof activity.content !== "object") return activity;
  const content = { ...activity.content };

  if (activity.type === "group_sort") {
    const groups = content.groups || [];
    if (!Array.isArray(content.items) || !content.items.length) {
      const allItems = content.all_items?.length
        ? content.all_items
        : groups.flatMap((group) => group.items || []);
      content.items = allItems.map((item) => {
        const owner = groups.find((group) => (group.items || []).some((groupItem) =>
          (typeof groupItem === "string" ? groupItem : groupItem.text || groupItem.label) ===
          (typeof item === "string" ? item : item.text || item.label)
        ));
        return typeof item === "string"
          ? { text: item, group: owner?.name || "", icon: owner?.icon || "📁" }
          : { ...item, text: item.text || item.label || item.item || "", group: item.group || owner?.name || "", icon: item.icon || owner?.icon || "📁" };
      }).filter((item) => item.text && item.group);
    } else {
      content.items = content.items.map((item) => typeof item === "string"
        ? { text: item, group: groups.find((group) => (group.items || []).includes(item))?.name || "" }
        : item);
    }
  }

  if (activity.type === "gameshow_quiz" && !Array.isArray(content.items)) {
    content.items = (content.questions || []).map((question) => {
      const correctIndex = Number.isInteger(question.correctAnswer)
        ? question.correctAnswer
        : Number.isInteger(question.correct_answer)
          ? question.correct_answer
          : 0;
      return {
        question: question.question || question.prompt || "",
        options: Array.isArray(question.options) ? question.options : [],
        correctAnswer: question.options?.[correctIndex] ?? question.correctAnswer ?? question.correct_answer ?? "",
        image: question.image || "",
      };
    });
  }

  if (activity.type === "true_false" && !Array.isArray(content.questions)) {
    content.questions = (content.statements || content.items || []).map((statement) => {
      const value = statement.is_true ?? statement.isTrue ?? statement.correct;
      return {
        question: statement.text || statement.question || "",
        correctAnswer: value === true || value === "true" ? "true" : "false",
        explanation: statement.explanation || "",
      };
    });
  }

  if (activity.type === "fill_blank" && !Array.isArray(content.questions)) {
    content.questions = (content.sentences || []).map((sentence) => ({
      question: sentence.text || sentence.sentence || "",
      answer: sentence.correctAnswers?.[0] || sentence.blanks?.[0]?.answer || sentence.answer || "",
      hint: sentence.hint || "",
    }));
  }

  if (activity.type === "anagram" && !Array.isArray(content.items)) {
    content.items = (content.words || []).map((item) => ({
      word: item.word || item.answer || "",
      hint: item.hint || item.clue || "",
    }));
  }

  if (activity.type === "hangman" && !Array.isArray(content.items)) {
    content.items = (content.words || []).map((item) => ({
      word: item.word || item.answer || "",
      hint: item.hint || item.clue || "",
    }));
  }

  return { ...activity, content };
}

function prepareAssignedActivity(snapshot, assignment, studentId, attemptNumber) {
  if (!snapshot) return null;
  const normalized = normalizeActivityForPlay(snapshot);
  const prepared = { ...normalized, content: { ...(normalized.content || {}) } };
  if (assignment?.shuffleItems === false) return prepared;
  const fields = SHUFFLE_FIELDS_BY_TYPE[prepared.type] || [];
  const field = fields.find((name) => Array.isArray(prepared.content[name]) && prepared.content[name].length > 1);
  if (!field) return prepared;
  const seed = `${assignment.id}:${studentId || "student"}:${attemptNumber}`;
  prepared.content[field] = seededShuffle(prepared.content[field], seed);
  return prepared;
}

export function useGameData() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activityId = searchParams.get("id");
  const assignmentId = searchParams.get("assignmentId");
  const isDemo = searchParams.get("demo") === "true";
  const type = searchParams.get("type") || "quiz";

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: async () => {
      const acts = await localData.entities.Activity.list();
      return acts.find((item) => item.id === activityId);
    },
    enabled: !isDemo && !assignmentId && !!activityId,
  });

  const studentProfile = assignmentId ? classroom.student() : null;
  const assignment = assignmentId
    ? (studentProfile?.assignments || []).find((item) => item.id === assignmentId) || null
    : null;
  const assignmentAttempts = assignmentId
    ? classroom.results().filter((item) =>
        item.assignmentId === assignmentId && item.studentId === studentProfile?.student?.id)
    : [];
  const assignmentExpired = Boolean(assignment?.deadline && Date.now() > Date.parse(assignment.deadline));
  const attemptsExhausted = Boolean(assignment?.maxAttempts && assignmentAttempts.length >= assignment.maxAttempts);
  const assignedActivity = assignment?.activitySnapshot && !assignmentExpired && !attemptsExhausted
    ? {
        ...prepareAssignedActivity(
          assignment.activitySnapshot,
          assignment,
          studentProfile?.student?.id,
          assignmentAttempts.length + 1,
        ),
        assignmentId,
      }
    : null;

  const demoActivity = isDemo ? demoSamples[type] || demoSamples.quiz : null;
  const [saving, setSaving] = useState(false);

  const saveActivity = async (title, content) => {
    if (saving) return;
    setSaving(true);
    try {
      const overrides = localStorage.getItem("customTitle");
      await localData.entities.Activity.create({
        title: overrides || title || demoActivity?.title || "فعالیت جدید",
        type,
        description: "",
        content: content || demoActivity?.content,
        theme: "lavender",
      });
      localStorage.removeItem("customTitle");
      toast.success("فعالیت با موفقیت ذخیره شد! 🎉");
      navigate("/");
    } catch {
      toast.error("خطا در ذخیره فعالیت");
    } finally {
      setSaving(false);
    }
  };

  return {
    activity: normalizeActivityForPlay(isDemo ? demoActivity : assignmentId ? assignedActivity : activity),
    isLoading: isDemo || assignmentId ? false : isLoading,
    isDemo,
    type,
    activityId,
    assignmentId,
    assignment,
    saveActivity,
    saving,
  };
}

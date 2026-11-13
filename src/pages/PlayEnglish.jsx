import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GamePlayer from "@/engine/GamePlayer";
import { useAuth } from "@/context/AuthContext";
import { classroom } from "@/lib/classroom";
import englishGames from "@/lib/englishGames";
import { getQuestionBank } from "@/lib/questionBank";

function shuffleLetters(value) {
  const letters = [...value];
  let shuffled = [...letters];
  let attempts = 0;
  while (attempts < 20 && shuffled.join("") === value) {
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts += 1;
  }
  return shuffled.join("");
}

function mergeTeacherQuestions(game, teacherQuestions) {
  if (!game || !Array.isArray(teacherQuestions) || !teacherQuestions.length) return game;
  const prepared = teacherQuestions
    .map((entry) => {
      const source = entry?.question ?? entry;
      if (!source || typeof source !== "object") return null;
      if (game.engine === "scramble") {
        const answer = String(source.answer || "").trim();
        if (!answer) return null;
        return {
          ...source,
          answer,
          hint: String(source.hint || "").trim(),
          scrambled: String(source.scrambled || "").trim() || shuffleLetters(answer),
        };
      }
      if (game.engine === "match" || game.engine === "memory") {
        return {
          ...source,
          id: source.id || `${game.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
          text: String(source.text || source.label || "").trim(),
          emoji: String(source.emoji || "").trim(),
        };
      }
      if (game.engine === "sort") {
        return {
          ...source,
          id: source.id || `${game.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
          label: String(source.label || source.text || "").trim(),
          category: String(source.category || "دستهٔ معلم").trim(),
        };
      }
      return source;
    })
    .filter(Boolean);

  if (!prepared.length) return game;

  if (["math-add-basic", "math-sub-basic", "math-mult-easy", "math-division"].includes(game.id)) {
    return { ...game, questionBank: [...getQuestionBank(game), ...prepared] };
  }

  const merged = { ...game };
  if (game.engine === "quiz") {
    merged.questions = [...(game.questions || []), ...prepared.filter((item) => item?.question && Array.isArray(item.options))];
    return merged;
  }
  if (game.engine === "scramble") {
    merged.words = [...(game.words || []), ...prepared];
    return merged;
  }
  if (game.engine === "match" || game.engine === "memory") {
    merged.cards = [...(game.cards || []), ...prepared];
    return merged;
  }
  if (game.engine === "sort") {
    const categories = [...(game.categories || [])];
    prepared.forEach((item) => {
      if (!categories.some((category) => category.name === item.category)) {
        categories.push({ name: item.category, items: [] });
      }
    });
    merged.categories = categories;
    merged.items = [...(game.items || []), ...prepared];
    return merged;
  }
  if (game.engine === "type" || game.engine === "fillblank") {
    merged.questions = [...(game.questions || []), ...prepared];
    return merged;
  }
  return merged;
}

export default function PlayEnglish() {
  const { user } = useAuth();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = englishGames.find(g => g.id === gameId);
  const mergedGame = useMemo(() => mergeTeacherQuestions(game, classroom.getTeacherQuestionsForGame(gameId, user?.id)), [game, gameId, user?.id]);

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">بازی یافت نشد</h2>
        <p className="text-gray-500 mb-4">بازی مورد نظر در دسترس نیست</p>
        <button
          onClick={() => navigate("/english-hub")}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl clay-element font-medium"
        >
          بازگشت به بازی‌ها
        </button>
      </div>
    );
  }

  return <GamePlayer game={mergedGame} />;
}

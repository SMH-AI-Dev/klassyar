import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import QuizEngine from "./QuizEngine";
import { createQuestionRound, saveQuestionRoundProgress } from "@/lib/questionBank";
import { classroom } from "@/lib/classroom";

export default function GamePlayer({ game, userId = "guest" }) {
  const navigate = useNavigate();
  const [round, setRound] = useState(() => createQuestionRound(game, "open", userId));
  const activeGameId = useRef(`${userId}:${game.id}`);

  useEffect(() => {
    if (activeGameId.current !== game.id) {
      activeGameId.current = game.id;
      setRound(createQuestionRound(game, "open"));
    }
    const handlePageShow = (event) => {
      if (event.persisted) setRound(createQuestionRound(game, "return", userId));
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [game, userId]);

  const Engine = QuizEngine;
  if (!Engine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>موتور بازی یافت نشد</p>
        <Button onClick={() => navigate(-1)} className="mt-4">بازگشت</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-4 right-16 z-50 rounded-full bg-white/80 px-3 py-2 text-xs font-medium text-gray-600 shadow-md" aria-live="polite">
        بانک محتوایی: {round.questionCount} مورد
      </div>
      <button onClick={() => navigate(-1)} className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center clay-element shadow-lg">
        <ArrowRight className="w-5 h-5" />
      </button>
      <Engine
        key={round.id}
        game={round.game}
        roundId={round.id}
        onProgress={(progress) => saveQuestionRoundProgress(game.id, progress, userId)}
        onComplete={({ score, total }) => classroom.recordResult({
          gameId: game.id,
          gameTitle: game.title,
          roundId: round.id,
          score,
          total,
          percent: total ? Math.round((score / total) * 100) : 0,
        })}
        onRestart={() => setRound(createQuestionRound(game, "restart", userId))}
      />
    </div>
  );
}

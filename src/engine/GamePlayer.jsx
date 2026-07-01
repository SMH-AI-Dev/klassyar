import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import QuizEngine from "./QuizEngine";
import MatchEngine from "./MatchEngine";
import TypeEngine from "./TypeEngine";
import SortEngine from "./SortEngine";
import ScrambleEngine from "./ScrambleEngine";
import FillBlankEngine from "./FillBlankEngine";

export default function GamePlayer({ game }) {
  const navigate = useNavigate();

  const engines = {
    quiz: QuizEngine,
    match: MatchEngine,
    type: TypeEngine,
    sort: SortEngine,
    scramble: ScrambleEngine,
    fillblank: FillBlankEngine,
  };

  const Engine = engines[game.engine];
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
      <button onClick={() => navigate(-1)} className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center clay-element shadow-lg">
        <ArrowRight className="w-5 h-5" />
      </button>
      <Engine game={game} />
    </div>
  );
}

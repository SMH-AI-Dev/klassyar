import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import QuizEngine from "./QuizEngine";
import MatchEngine from "./MatchEngine";
import TypeEngine from "./TypeEngine";
import SortEngine from "./SortEngine";
import ScrambleEngine from "./ScrambleEngine";
import FillBlankEngine from "./FillBlankEngine";
import AnagramEngine from "./AnagramEngine";
import HangmanEngine from "./HangmanEngine";
import WheelEngine from "./WheelEngine";
import WhackEngine from "./WhackEngine";
import BalloonsEngine from "./BalloonsEngine";
import TrueFalseEngine from "./TrueFalseEngine";
import WordSearchEngine from "./WordSearchEngine";
import OpenBoxEngine from "./OpenBoxEngine";
import TypingEngine from "./TypingEngine";
import { createQuestionRound, saveQuestionRoundProgress } from "@/lib/questionBank";
import { classroom } from "@/lib/classroom";

export default function GamePlayer({ game }) {
  const navigate = useNavigate();
  const [round, setRound] = useState(() => createQuestionRound(game, "open"));
  const activeGameId = useRef(game.id);

  useEffect(() => {
    if (activeGameId.current !== game.id) {
      activeGameId.current = game.id;
      setRound(createQuestionRound(game, "open"));
    }
    const handlePageShow = (event) => {
      if (event.persisted) setRound(createQuestionRound(game, "return"));
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [game]);

  const engines = {
    quiz: QuizEngine,
    match: MatchEngine,
    type: TypeEngine,
    sort: SortEngine,
    scramble: ScrambleEngine,
    fillblank: FillBlankEngine,
    anagram: AnagramEngine,
    hangman: HangmanEngine,
    wheel: WheelEngine,
    whack: WhackEngine,
    balloons: BalloonsEngine,
    truefalse: TrueFalseEngine,
    wordsearch: WordSearchEngine,
    openbox: OpenBoxEngine,
    typing: TypingEngine,
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
        onProgress={(progress) => saveQuestionRoundProgress(game.id, progress)}
        onComplete={({ score, total }) => classroom.recordResult({
          gameId: game.id,
          gameTitle: game.title,
          roundId: round.id,
          score,
          total,
          percent: total ? Math.round((score / total) * 100) : 0,
        })}
        onRestart={() => setRound(createQuestionRound(game, "restart"))}
      />
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import QuizEngine from "./QuizEngine";
import MatchEngine from "./MatchEngine";
import SortEngine from "./SortEngine";
import ScrambleEngine from "./ScrambleEngine";
import FillBlankEngine from "./FillBlankEngine";
import TypeEngine from "./TypeEngine";
import AnagramEngine from "./AnagramEngine";
import HangmanEngine from "./HangmanEngine";
import WheelEngine from "./WheelEngine";
import WhackEngine from "./WhackEngine";
import BalloonsEngine from "./BalloonsEngine";
import TrueFalseEngine from "./TrueFalseEngine";
import WordSearchEngine from "./WordSearchEngine";
import OpenBoxEngine from "./OpenBoxEngine";
import TypingEngine from "./TypingEngine";
import { createGameRound, saveQuestionRoundProgress } from "@/lib/questionBank";
import { classroom } from "@/lib/classroom";

const ENGINE_BY_TYPE = {
  quiz: QuizEngine,
  match: MatchEngine,
  memory: MatchEngine,
  sort: SortEngine,
  scramble: ScrambleEngine,
  fillblank: FillBlankEngine,
  type: TypeEngine,
  typing: TypingEngine,
  anagram: AnagramEngine,
  hangman: HangmanEngine,
  wheel: WheelEngine,
  whack: WhackEngine,
  balloons: BalloonsEngine,
  truefalse: TrueFalseEngine,
  wordsearch: WordSearchEngine,
  openbox: OpenBoxEngine,
};

function prepareEngineGame(game) {
  if (game.engine === "typing") {
    const source = game.items || [];
    return {
      ...game,
      items: source.map((item) => ({
        ...item,
        q: item.q || item.hint || item.question || item.text || "",
        a: item.a || item.answer || item.correctAnswer || "",
      })),
    };
  }
  return game;
}

export default function GamePlayer({ game, userId = "guest" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get("assignmentId");
  const studentProfile = assignmentId ? classroom.student() : null;
  const assignment = assignmentId
    ? (studentProfile?.assignments || []).find((item) => item.id === assignmentId) || null
    : null;
  const assignmentAttempts = assignmentId
    ? classroom.results().filter((item) => item.assignmentId === assignmentId && item.studentId === studentProfile?.student?.id)
    : [];
  const assignmentExpired = Boolean(assignment?.deadline && Date.now() > Date.parse(assignment.deadline));
  const attemptsExhausted = Boolean(assignment?.maxAttempts && assignmentAttempts.length >= assignment.maxAttempts);
  const assignmentInvalid = Boolean(assignmentId && (
    !assignment || assignment.gameId !== game.id || assignmentExpired || attemptsExhausted
  ));
  const [round, setRound] = useState(() => createGameRound(game, "open", userId));
  const activeScope = useRef(`${userId}:${game.id}`);

  useEffect(() => {
    const nextScope = `${userId}:${game.id}`;
    if (activeScope.current !== nextScope) {
      activeScope.current = nextScope;
      setRound(createGameRound(game, "open", userId));
    }
    const handlePageShow = (event) => {
      if (event.persisted) setRound(createGameRound(game, "return", userId));
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [game, userId]);

  const Engine = ENGINE_BY_TYPE[round.engine || round.game?.engine || game.engine];
  const engineGame = prepareEngineGame(round.game);

  if (assignmentInvalid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-lg font-bold text-slate-800">
          {!assignment ? "این تکلیف در پروفایل دانش‌آموز پیدا نشد" : assignmentExpired ? "مهلت این تکلیف به پایان رسیده است" : "تعداد دفعات مجاز این تکلیف تمام شده است"}
        </p>
        <Button onClick={() => navigate("/StudentAssignments")} className="mt-4">بازگشت به تکلیف‌ها</Button>
      </div>
    );
  }

  if (!Engine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p>موتور این نوع بازی هنوز ثبت نشده است: {game.engine}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">بازگشت</Button>
      </div>
    );
  }

  const completeRound = ({ score = 0, total = 0 } = {}) => {
    classroom.recordResult({
      gameId: game.id,
      gameTitle: game.title,
      assignmentId: assignmentId || null,
      roundId: round.id,
      score,
      total,
      percent: total ? Math.round((score / total) * 100) : 0,
    });
  };

  return (
    <div>
      <div className="fixed top-4 right-16 z-50 rounded-full bg-white/80 px-3 py-2 text-xs font-medium text-gray-600 shadow-md" aria-live="polite">
        بانک محتوا: {round.questionCount} مورد
        {round.questionCount < 400 && <span className="mr-1 text-amber-700"> (بانک هنوز کامل نیست)</span>}
      </div>
      <button onClick={() => navigate(-1)} className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center clay-element shadow-lg">
        <ArrowRight className="w-5 h-5" />
      </button>
      <Engine
        key={round.id}
        game={engineGame}
        roundId={round.id}
        onProgress={(progress) => saveQuestionRoundProgress(game.id, progress, userId)}
        onComplete={completeRound}
        onFinish={completeRound}
        onRestart={() => setRound(createGameRound(game, "restart", userId))}
      />
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Timer } from "lucide-react";
import bestSelfBadge from "@/assets/pic/best-self-badge.png";

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FillBlankEngine({ game, onProgress, onComplete, onRestart }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(20);
  const [answers, setAnswers] = useState([]);
  const [options, setOptions] = useState([]);
  const reported = useRef(false);

  useEffect(() => {
    onProgress?.({ index: qIdx, answers });
  }, [qIdx, answers, onProgress]);

  useEffect(() => {
    if (finished && !reported.current) {
      reported.current = true;
      onComplete?.({ score, total: game.questions.length });
    }
  }, [finished, score, game.questions.length, onComplete]);

  useEffect(() => {
    const correctAnswer = game.questions[qIdx]?.answer;
    const distractors = [...new Set(game.questions.map((question) => question.answer).filter(Boolean))]
      .filter((answer) => answer !== correctAnswer)
      .slice(0, 3);
    setOptions(shuffle([...distractors, correctAnswer].filter(Boolean)));
  }, [qIdx, game]);

  useEffect(() => {
    if (feedback !== null || finished) return;
    if (timer <= 0) { submitAnswer(""); return; }
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, feedback, finished, qIdx]);

  const submitAnswer = (text) => {
    if (feedback !== null) return;
    const blanks = game.questions[qIdx].answer;
    const isCorrect = text.trim().toLowerCase() === blanks.trim().toLowerCase();
    if (isCorrect) setScore(s => s + 1);
    setSelectedAnswer(text);
    setAnswers((prev) => [...prev, { q: qIdx, selected: text, correct: isCorrect }]);
    setFeedback(isCorrect);
  };

  const renderQuestion = (text) => {
    return text.split("___").map((part, i, arr) => (
      <span key={i}>
        {part}
        {i < arr.length - 1 && (
          <span className="inline-block w-20 sm:w-28 border-b-2 border-purple-400 mx-1" />
        )}
      </span>
    ));
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    setTimer(20);
    if (qIdx + 1 >= game.questions.length) {
      setFinished(true);
    } else {
      setQIdx(i => i + 1);
    }
  };

  const restart = () => {
    if (onRestart) {
      onRestart();
      return;
    }
    setQIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setFinished(false);
    setTimer(20);
    setAnswers([]);
    reported.current = false;
  };

  if (finished) {
    const pct = Math.round((score / game.questions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 to-indigo-900">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/95 rounded-3xl p-8 max-w-md w-full text-center clay-element">
          <img src={bestSelfBadge} alt="بهترین خودت باش!" className="w-24 h-24 mx-auto mb-4 icon-float rounded-2xl" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{game.title}</h2>
          <p className="text-gray-500 mb-6">نتیجه نهایی</p>
          <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{pct}%</div>
          <p className="text-lg mb-6">{score} از {game.questions.length} جای خالی درست</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </div>
          <Button onClick={restart} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl px-8 py-4 h-auto text-lg">
            <RotateCcw className="w-5 h-5 ml-2" /> دوباره
          </Button>
        </motion.div>
      </div>
    );
  }

  const q = game.questions[qIdx];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
      <motion.div key={qIdx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-lg">
        <div className="mb-4 flex items-center gap-3">
          <Timer className="w-5 h-5 text-white/80" />
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <motion.div initial={{ width: "100%" }} animate={{ width: `${(timer / 20) * 100}%` }} className="h-2 bg-white rounded-full" />
          </div>
          <span className="text-white font-bold">{timer}s</span>
        </div>
        <div className="text-white/60 text-sm mb-4">سوال {qIdx + 1} از {game.questions.length}</div>
        <div className="bg-white/95 rounded-3xl p-6 mb-4 clay-element">
          <p dir="auto" className="text-lg font-bold text-gray-800 text-right leading-relaxed">{renderQuestion(q.text)}</p>
          {q.fa && <p dir="rtl" className="text-sm text-gray-500 mt-1 text-right">{q.fa}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((answer) => {
              const isCorrectAnswer = answer === q.answer;
              const isSelected = selectedAnswer === answer;
              let buttonClass = "bg-white/95 text-gray-800 border-transparent hover:border-purple-300";
              if (feedback !== null) {
                if (isCorrectAnswer) buttonClass = "bg-green-100 text-green-800 border-green-500";
                else if (isSelected) buttonClass = "bg-red-100 text-red-800 border-red-500";
              }
              return (
                <button
                  type="button"
                  key={answer}
                  onClick={() => submitAnswer(answer)}
                  disabled={feedback !== null}
                  className={`p-4 rounded-2xl text-lg font-bold border-2 transition-all clay-element ${buttonClass}`}
                >
                  {answer}
                </button>
              );
          })}
        </div>
        {feedback === false && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-white text-sm">
            پاسخ درست: {q.answer}
          </motion.p>
        )}
        <AnimatePresence>
          {feedback !== null && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <Button onClick={nextQuestion} className="w-full h-14 bg-white text-purple-700 rounded-2xl text-lg font-bold clay-element">
                {qIdx + 1 >= game.questions.length ? "مشاهده نتیجه" : "سوال بعدی"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

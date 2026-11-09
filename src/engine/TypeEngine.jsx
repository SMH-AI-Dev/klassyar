import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Timer } from "lucide-react";
import bestSelfBadge from "@/assets/pic/best-self-badge.png";

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function TypeEngine({ game, onProgress, onComplete, onRestart }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(20);
  const [options, setOptions] = useState([]);
  const [answers, setAnswers] = useState([]);
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
    if (feedback !== null || finished) return;
    if (timer <= 0) {
      submitAnswer("");
      return;
    }
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, feedback, finished, qIdx]);

  useEffect(() => {
    const q = game.questions[qIdx];
    if (!q) return;
    const correctAnswer = q.answer;
    const allAnswers = [...new Set(game.questions.map(quest => quest.answer).filter(Boolean))];
    const wrongAnswers = allAnswers.filter(a => a !== correctAnswer);
    const shuffledWrong = shuffleArray(wrongAnswers).slice(0, 3);
    const newOptions = shuffleArray([correctAnswer, ...shuffledWrong]);
    setOptions(newOptions);
    setSelectedAnswer(null);
    setFeedback(null);
    setTimer(20);
  }, [qIdx, game]);

  const submitAnswer = (answer) => {
    const q = game.questions[qIdx];
    if (feedback !== null) return;
    const isCorrect = answer === q.answer;
    if (isCorrect) setScore(s => s + 1);
    setAnswers((prev) => [...prev, { q: qIdx, selected: answer, correct: isCorrect }]);
    setFeedback(isCorrect);
  };

  const nextQuestion = () => {
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-indigo-900">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/95 rounded-3xl p-8 max-w-md w-full text-center clay-element">
          <img src={bestSelfBadge} alt="بهترین خودت باش!" className="w-24 h-24 mx-auto mb-4 icon-float rounded-2xl" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{game.title}</h2>
          <p className="text-gray-500 mb-6">نتیجه نهایی</p>
          <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{pct}%</div>
          <p className="text-lg mb-6">{score} از {game.questions.length} پاسخ درست</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
          </div>
          <Button onClick={restart} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl px-8 py-4 h-auto text-lg">
            <RotateCcw className="w-5 h-5 ml-2" /> دوباره
          </Button>
        </motion.div>
      </div>
    );
  }

  const q = game.questions[qIdx];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
      <motion.div key={qIdx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="mb-4 flex items-center gap-3">
          <Timer className="w-5 h-5 text-white/80" />
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <motion.div initial={{ width: "100%" }} animate={{ width: `${(timer / 20) * 100}%` }} className="h-2 bg-white rounded-full" />
          </div>
          <span className="text-white font-bold">{timer}s</span>
        </div>
        <div className="text-white/60 text-sm mb-4">سوال {qIdx + 1} از {game.questions.length}</div>
        <div className="bg-white/95 rounded-3xl p-6 mb-4 clay-element">
          <p dir="auto" className="text-xl font-bold text-gray-800 text-center">{q.hint}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === q.answer;
            let btnClass = "bg-white text-gray-800 border-2 border-transparent hover:border-blue-300";
            if (feedback !== null) {
              if (isCorrectAnswer) btnClass = "bg-green-100 text-green-800 border-2 border-green-500";
              else if (isSelected && !isCorrectAnswer) btnClass = "bg-red-100 text-red-800 border-2 border-red-500";
              else btnClass = "bg-gray-100 text-gray-400 border-2 border-transparent";
            } else if (isSelected) {
              btnClass = "bg-blue-100 text-blue-800 border-2 border-blue-500";
            }
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (feedback !== null) return;
                  setSelectedAnswer(option);
                  submitAnswer(option);
                }}
                disabled={feedback !== null}
                className={`p-4 rounded-2xl text-lg font-bold transition-all clay-element ${btnClass}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {feedback !== null && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <Button onClick={nextQuestion} className="w-full h-14 bg-white text-blue-700 rounded-2xl text-lg font-bold clay-element">
                {qIdx + 1 >= game.questions.length ? "مشاهده نتیجه" : "سوال بعدی"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

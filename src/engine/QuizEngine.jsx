import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, Star, Timer } from "lucide-react";

export default function QuizEngine({ game }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(15);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  const bgColors = ["from-purple-600 to-indigo-700", "from-pink-500 to-rose-600", "from-blue-600 to-cyan-600", "from-teal-500 to-green-600", "from-orange-500 to-red-600"];
  const bgIdx = qIdx % bgColors.length;

  useEffect(() => {
    if (showResult || finished) return;
    if (timer <= 0) {
      handleAnswer(-1);
      return;
    }
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, showResult, finished, qIdx]);

  const handleAnswer = (idx) => {
    if (showResult) return;
    setSelected(idx);
    const isCorrect = idx === game.questions[qIdx].correctIndex;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(a => [...a, { q: qIdx, selected: idx, correct: isCorrect }]);
    setShowResult(true);
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowResult(false);
    setTimer(15);
    if (qIdx + 1 >= game.questions.length) {
      setFinished(true);
    } else {
      setQIdx(i => i + 1);
    }
  };

  const restart = () => {
    setQIdx(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setTimer(15);
    setFinished(false);
    setAnswers([]);
  };

  if (finished) {
    const pct = Math.round((score / game.questions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 to-indigo-900">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/95 rounded-3xl p-8 max-w-md w-full text-center clay-element">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1 }} className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Star className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{game.title}</h2>
          <p className="text-gray-500 mb-6">نتیجه نهایی</p>
          <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{pct}%</div>
          <p className="text-lg mb-6">{score} از {game.questions.length} سوال درست</p>
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
    <div className={`min-h-screen p-4 bg-gradient-to-br ${bgColors[bgIdx]} flex items-center justify-center`}>
      <motion.div key={qIdx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-lg">
        <div className="mb-4 flex items-center gap-3">
          <Timer className="w-5 h-5 text-white/80" />
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <motion.div initial={{ width: "100%" }} animate={{ width: `${(timer / 15) * 100}%` }} className="h-2 bg-white rounded-full" />
          </div>
          <span className="text-white font-bold">{timer}s</span>
        </div>
        <div className="text-white/60 text-sm mb-4">سوال {qIdx + 1} از {game.questions.length}</div>
        <div className="bg-white/95 rounded-3xl p-6 mb-4 clay-element">
          <p className="text-xl font-bold text-gray-800 text-right">{q.question}</p>
        </div>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let btnClass = "bg-white/90 text-gray-800 border-2 border-transparent";
            if (showResult) {
              if (i === q.correctIndex) btnClass = "bg-green-100 border-green-500 text-green-800";
              else if (i === selected) btnClass = "bg-red-100 border-red-500 text-red-800";
            }
            return (
              <motion.div key={i} whileHover={!showResult ? { scale: 1.02 } : {}} whileTap={!showResult ? { scale: 0.98 } : {}}>
                <button onClick={() => handleAnswer(i)} disabled={showResult} className={`w-full p-4 rounded-2xl text-right font-medium transition-all ${btnClass} clay-element`} dir="rtl">
                  <span className="inline-flex items-center gap-2">
                    {showResult && i === q.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {showResult && i === selected && i !== q.correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
                    {opt}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
        <AnimatePresence>
          {showResult && (
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

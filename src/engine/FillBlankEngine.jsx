import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, Star, Timer } from "lucide-react";

export default function FillBlankEngine({ game }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(20);

  useEffect(() => {
    if (feedback || finished) return;
    if (timer <= 0) { submitAnswer(""); return; }
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, feedback, finished, qIdx]);

  const submitAnswer = (val) => {
    const text = val ?? input;
    const blanks = game.questions[qIdx].answer;
    const isCorrect = text.trim().toLowerCase() === blanks.trim().toLowerCase();
    if (isCorrect) setScore(s => s + 1);
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
    setInput("");
    setFeedback(null);
    setTimer(20);
    if (qIdx + 1 >= game.questions.length) {
      setFinished(true);
    } else {
      setQIdx(i => i + 1);
    }
  };

  const restart = () => {
    setQIdx(0);
    setScore(0);
    setInput("");
    setFeedback(null);
    setFinished(false);
    setTimer(20);
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
          <p className="text-lg font-bold text-gray-800 text-right leading-relaxed">{renderQuestion(q.text)}</p>
        </div>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitAnswer(input); }}
            disabled={feedback !== null}
            placeholder="کلمه مناسب را بنویسید..."
            className={`w-full p-4 rounded-2xl text-right text-lg border-2 transition-all clay-element outline-none ${
              feedback === true ? "border-green-500 bg-green-50" :
              feedback === false ? "border-red-500 bg-red-50" :
              "border-transparent bg-white/95 focus:border-purple-400"
            }`}
            dir="rtl"
          />
          {feedback === true && <div className="absolute left-4 top-1/2 -translate-y-1/2"><CheckCircle2 className="w-6 h-6 text-green-500" /></div>}
          {feedback === false && <div className="absolute left-4 top-1/2 -translate-y-1/2"><XCircle className="w-6 h-6 text-red-500" /></div>}
        </div>
        {feedback === false && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-white text-sm">
            پاسخ درست: {q.answer}
          </motion.p>
        )}
        {feedback === null && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
            <Button onClick={() => submitAnswer(input)} disabled={!input.trim()} className="w-full h-14 bg-white text-purple-700 rounded-2xl text-lg font-bold clay-element">
              بررسی
            </Button>
          </motion.div>
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

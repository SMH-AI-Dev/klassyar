import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, X, Trophy, Lightbulb, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingEmojis from "@/components/shared/FloatingEmojis";
import { useGameData } from "@/hooks/useGameData";

export default function PlayCrossword() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = () => {
    if (!answer.trim()) return;
    const item = activity.content.items[qIdx];
    const correct = answer.trim().toLowerCase() === item.word.toLowerCase();
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    const a = attempts + 1;
    setAttempts(a);
    if (!correct && a >= 2) setShowHint(true);
    setTimeout(() => {
      if (qIdx < activity.content.items.length - 1) {
        setQIdx(qIdx + 1); setAnswer(""); setIsCorrect(null); setAttempts(0); setShowHint(false);
      } else setIsComplete(true);
    }, 1500);
  };

  const restart = () => {
    setQIdx(0); setScore(0); setAnswer(""); setIsCorrect(null);
    setIsComplete(false); setAttempts(0); setShowHint(false);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500" />
    </div>
  );

  if (!activity || !activity.content?.items?.length) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="clay-element bg-white/80 border-0 p-8 text-center">
        <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
        <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} className="rounded-xl clay-element">
          <ArrowRight className="w-5 h-5 ml-2" />بازگشت
        </Button>
      </Card>
    </div>
  );

  if (isComplete) {
    const pct = Math.round((score / activity.content.items.length) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-slate-50 to-gray-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-20 h-20 text-slate-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">کلمات پیدا شدند! 🎉</h2>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-5xl font-bold text-slate-600">{score}/{activity.content.items.length}</p>
                <p className="text-2xl font-bold text-slate-500 mt-2">{pct}%</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={restart} className="bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const item = activity.content.items[qIdx];
  const progress = qIdx + (isCorrect !== null ? 1 : 0);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100">
      <FloatingEmojis />
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" size="icon" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5" /></Button>
          {isDemo && (
            <Button onClick={() => saveActivity()} disabled={saving}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-xl clay-element px-4 py-2 font-bold text-sm">
              <Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}
            </Button>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🧩</h1>
            <p className="text-gray-600">کلمه {Math.min(qIdx + 1, activity.content.items.length)} از {activity.content.items.length}</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-xl font-bold text-slate-600">{score}/{progress}</div>
        </motion.div>
        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(progress / activity.content.items.length) * 100}%` }} className="h-full bg-gradient-to-r from-slate-400 to-gray-500" />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <Card className="clay-element bg-gradient-to-br from-slate-50 to-gray-50 border-0">
              <CardContent className="p-8 md:p-12">
                <div className="mb-6 text-center">
                  <span className="text-5xl mb-4 block">🔍</span>
                  <p className="text-xl text-gray-500 mb-2">سرنخ:</p>
                  <p className="text-2xl font-bold text-gray-800 leading-relaxed">{item.clue}</p>
                </div>
                <AnimatePresence>
                  {showHint && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center mb-6">
                      <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-xl clay-element">
                        <Lightbulb className="w-5 h-5" />حرف اول: {item.word[0]}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="max-w-md mx-auto mb-6">
                  <Input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()} disabled={isCorrect !== null}
                    dir="ltr" placeholder="پاسخ..." className="text-center text-2xl p-6 rounded-xl clay-element border-2 border-slate-200 focus:border-slate-400" />
                </div>
                <AnimatePresence>
                  {isCorrect !== null && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 text-center">
                      <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-element ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isCorrect ? <><Check className="w-6 h-6" /><span className="text-lg font-bold">آفرین! 🎉</span></> : <><X className="w-6 h-6" /><span className="text-lg font-bold">پاسخ: {item.word}</span></>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-center">
                  <Button onClick={checkAnswer} disabled={!answer.trim() || isCorrect !== null}
                    className="bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-xl clay-element px-8 py-6 text-lg">
                    <Check className="w-5 h-5 ml-2" />بررسی
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

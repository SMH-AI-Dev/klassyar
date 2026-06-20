import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingEmojis from "@/components/shared/FloatingEmojis";
import { useGameData } from "@/hooks/useGameData";

const COLORS = [
  "from-red-400 to-red-500", "from-blue-400 to-blue-500", "from-green-400 to-green-500",
  "from-purple-400 to-purple-500", "from-yellow-400 to-yellow-500", "from-pink-400 to-pink-500",
  "from-orange-400 to-orange-500", "from-teal-400 to-teal-500", "from-cyan-400 to-cyan-500",
];

export default function PlayBalloon_pop() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const [popped, setPopped] = useState(null);
  const [wrongIdx, setWrongIdx] = useState(null);

  useEffect(() => {
    if (activity?.content?.items)
      setShuffledOpts([...activity.content.items[qIdx].options].sort(() => Math.random() - 0.5));
  }, [activity, qIdx]);

  const handlePop = (opt, idx) => {
    if (popped !== null) return;
    if (opt === activity.content.items[qIdx].answer) {
      setPopped(idx);
      setScore(s => s + 1);
      setTimeout(() => {
        if (qIdx < activity.content.items.length - 1) { setQIdx(qIdx + 1); setPopped(null); setWrongIdx(null); }
        else setIsComplete(true);
      }, 1200);
    } else {
      setWrongIdx(idx);
      setTimeout(() => setWrongIdx(null), 600);
    }
  };

  const restart = () => { setQIdx(0); setScore(0); setIsComplete(false); setPopped(null); setWrongIdx(null); };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
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
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-violet-50 to-purple-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-20 h-20 text-violet-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">همه بادکنک‌ها ترکید! 🎉</h2>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-5xl font-bold text-violet-600">{score}/{activity.content.items.length}</p>
                <p className="text-2xl font-bold text-violet-500 mt-2">{pct}%</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={restart} className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const item = activity.content.items[qIdx];
  const progress = qIdx + (popped !== null ? 1 : 0);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 overflow-hidden">
      <FloatingEmojis />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" size="icon" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5" /></Button>
          {isDemo && (
            <Button onClick={() => saveActivity()} disabled={saving}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-xl clay-element px-4 py-2 font-bold text-sm">
              <Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}
            </Button>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🎈</h1>
            <p className="text-gray-600">سوال {qIdx + 1} از {activity.content.items.length}</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-xl font-bold text-violet-600">{score}/{progress}</div>
        </motion.div>
        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(progress / activity.content.items.length) * 100}%` }} className="h-full bg-gradient-to-r from-violet-400 to-purple-500" />
          </div>
        </div>
        <Card className="clay-element bg-white/90 border-0 mb-8">
          <CardContent className="p-6 md:p-8 text-center">
            <span className="text-4xl mb-4 block">❓</span>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{item.question}</p>
          </CardContent>
        </Card>
        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4 md:gap-6 max-w-xl mx-auto">
            {shuffledOpts.map((opt, idx) => {
              const isPopped = popped === idx;
              const isWrong = wrongIdx === idx;
              return (
                <motion.button key={idx} onClick={() => handlePop(opt, idx)} disabled={popped !== null}
                  initial={{ y: 50, opacity: 0 }} animate={{ y: isPopped ? -200 : 0, opacity: isPopped ? 0 : 1, scale: isWrong ? [1, 1.2, 0.8, 1] : 1 }}
                  transition={{ delay: idx * 0.1, duration: isWrong ? 0.3 : 0.4 }}
                  className={`relative p-6 md:p-8 rounded-full clay-element text-center font-bold text-white text-lg md:text-xl shadow-lg ${
                    isWrong ? 'bg-red-500' : `bg-gradient-to-br ${COLORS[idx % COLORS.length]}`
                  } ${isPopped ? 'pointer-events-none' : 'hover:scale-105'}`}>
                  <span className={`block ${isPopped ? 'opacity-0' : ''}`}>{opt}</span>
                  <motion.span className="absolute inset-0 flex items-center justify-center text-5xl"
                    initial={{ scale: 0 }} animate={{ scale: isPopped ? 1 : 0 }}>💥</motion.span>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

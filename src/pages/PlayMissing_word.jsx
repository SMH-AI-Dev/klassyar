import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, X, Trophy, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingEmojis from "@/components/shared/FloatingEmojis";
import { useGameData } from "@/hooks/useGameData";

export default function PlayMissing_word() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const correct = opt === activity.content.items[qIdx].answer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (qIdx < activity.content.items.length - 1) {
        setQIdx(qIdx + 1); setSelected(null); setIsCorrect(null);
      } else setIsComplete(true);
    }, 1200);
  };

  const restart = () => {
    setQIdx(0); setScore(0); setSelected(null); setIsCorrect(null); setIsComplete(false);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
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
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-pink-50 to-rose-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-20 h-20 text-pink-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">کلمات گمشده پیدا شد! 🎉</h2>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-5xl font-bold text-pink-600">{score}/{activity.content.items.length}</p>
                <p className="text-2xl font-bold text-pink-500 mt-2">{pct}%</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={restart} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const item = activity.content.items[qIdx];
  const parts = item.sentence.split('___');
  const progress = qIdx + (selected !== null ? 1 : 0);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
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
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🔍</h1>
            <p className="text-gray-600">سوال {qIdx + 1} از {activity.content.items.length}</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-xl font-bold text-pink-600">{score}/{progress}</div>
        </motion.div>
        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(progress / activity.content.items.length) * 100}%` }} className="h-full bg-gradient-to-r from-pink-400 to-rose-500" />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <Card className="clay-element bg-gradient-to-br from-pink-50 to-rose-50 border-0">
              <CardContent className="p-8 md:p-12">
                <div className="mb-8 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                    {parts.map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < parts.length - 1 && (
                          <span className="inline-block mx-2 w-24 h-10 border-b-4 border-pink-400 bg-pink-50 rounded-lg clay-element align-middle" />
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                  {item.options.map((opt, i) => (
                    <motion.button key={i} onClick={() => handleSelect(opt)} disabled={selected !== null} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className={`p-4 text-center text-lg font-bold rounded-2xl clay-element transition-all ${
                        selected === null ? 'bg-white hover:bg-pink-50 text-gray-800 border-2 border-pink-200'
                        : opt === item.answer ? 'bg-green-200 text-green-800 ring-2 ring-green-400'
                        : selected === opt ? 'bg-red-200 text-red-800'
                        : 'bg-gray-100 text-gray-400'
                      }`}>
                      {opt}
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {selected !== null && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                      <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-element ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isCorrect ? <><Check className="w-6 h-6" /><span className="text-lg font-bold">آفرین! عالی بود! 🌟</span></> : <><X className="w-6 h-6" /><span className="text-lg font-bold">پاسخ صحیح: {item.answer}</span></>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

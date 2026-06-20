import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, X, Trophy, RotateCw, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayOpen_the_box() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [opened, setOpened] = useState({});
  const [activeBox, setActiveBox] = useState(null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fedBack, setFedBack] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.items?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} className="rounded-xl clay-element">
            <ArrowRight className="w-5 h-5 ml-2" />بازگشت
          </Button>
        </Card>
      </div>
    );
  }

  const items = activity.content.items;
  const closedCount = items.filter((_, i) => !opened[i]).length;

  const openBox = (idx) => {
    if (opened[idx] || activeBox !== null) return;
    setActiveBox(idx);
    setSelected(null);
    setFedBack(false);
  };

  const selectAnswer = (ans) => {
    if (fedBack || !activeBox) return;
    setSelected(ans);
    setFedBack(true);
    const correct = ans === items[activeBox].answer;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setOpened(o => ({ ...o, [activeBox]: correct ? "correct" : "wrong" }));
      setActiveBox(null);
      setSelected(null);
      setFedBack(false);
      if (closedCount <= 1) setIsComplete(true);
    }, 1400);
  };

  const handleRestart = () => {
    setOpened({}); setActiveBox(null); setSelected(null);
    setScore(0); setIsComplete(false); setFedBack(false);
  };

  if (isComplete) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-teal-50 to-green-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-20 h-20 text-teal-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">همه جعبه‌ها باز شد! 🎉</h2>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-5xl font-bold text-teal-600">{score}/{items.length}</p>
                <p className="text-2xl font-bold text-teal-500 mt-2">{pct}%</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRestart} className="bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" size="icon" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5" /></Button>
          {isDemo && (
            <Button onClick={() => saveActivity()} disabled={saving} className="bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-xl px-4 py-2 font-bold text-sm">
              <Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}
            </Button>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🎁</h1>
            <p className="text-gray-600">{items.length - closedCount} از {items.length} باز شده</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-xl font-bold text-teal-600">{score}/{items.length}</div>
        </motion.div>

        <div className="mb-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${((items.length - closedCount) / items.length) * 100}%` }} className="h-full bg-gradient-to-r from-teal-400 to-green-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 max-w-lg mx-auto">
          {items.map((item, i) => (
            <motion.button key={i} onClick={() => openBox(i)} whileHover={!opened[i] && activeBox === null ? { scale: 1.05 } : {}} whileTap={!opened[i] && activeBox === null ? { scale: 0.95 } : {}}
              className={`aspect-square rounded-3xl clay-element flex items-center justify-center text-6xl transition-all ${opened[i] ? (opened[i] === "correct" ? "bg-green-200 ring-4 ring-green-400" : "bg-red-200 ring-4 ring-red-400") : activeBox === i ? "bg-white ring-4 ring-teal-400 scale-105" : "bg-gradient-to-br from-teal-400 to-green-400 hover:from-teal-500 hover:to-green-500 cursor-pointer shadow-lg"}`}>
              {opened[i] ? (opened[i] === "correct" ? "✅" : "❌") : activeBox === i ? "📦" : "🎁"}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeBox !== null && (
            <motion.div key={activeBox} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}>
              <Card className="clay-element bg-white border-0 mb-6">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">{items[activeBox].question}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {items[activeBox].options.map((opt, j) => {
                      const isSelected = selected === opt;
                      const isCorrect = opt === items[activeBox].answer;
                      let bg = "bg-gray-50 hover:bg-teal-50 border-2 border-gray-200";
                      if (fedBack && isSelected) bg = isCorrect ? "bg-green-200 border-2 border-green-400" : "bg-red-200 border-2 border-red-400";
                      else if (fedBack && isCorrect) bg = "bg-green-100 border-2 border-green-300";
                      else if (isSelected) bg = "bg-teal-100 border-2 border-teal-400";
                      return (
                        <button key={j} onClick={() => selectAnswer(opt)} disabled={fedBack}
                          className={`p-4 rounded-2xl clay-element text-lg font-bold transition-all ${bg}`}>
                          <span className="flex items-center justify-center gap-2">
                            {opt}
                            {fedBack && isCorrect && <Check className="w-5 h-5 text-green-600" />}
                            {fedBack && isSelected && !isCorrect && <X className="w-5 h-5 text-red-600" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {fedBack && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-4">
                      <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-element text-lg font-bold ${selected === items[activeBox].answer ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {selected === items[activeBox].answer ? <>🎉 آفرین! جواب درست!</> : <>😢 جواب درست: {items[activeBox].answer}</>}
                      </span>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

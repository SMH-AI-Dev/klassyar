import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Save, RotateCw, Trophy, Check, X } from "lucide-react";

export default function PlayImage_quiz() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const items = activity?.content?.items || [];
  const item = items[currentIndex];

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);
    if (item?.options?.[index] === item?.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
    } else {
      setIsComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setIsComplete(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (!activity || !items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")}>بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">پایان آزمون! 🌟</h2>
            <div className="text-5xl font-bold text-cyan-600 mb-6">{score}/{items.length}</div>
            <p className="text-xl text-gray-600 mb-8">امتیاز شما: {Math.round((score / items.length) * 100)}%</p>
            <div className="flex gap-3">
              <Button onClick={resetGame} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl clay-element"><RotateCw className="w-5 h-5 ml-2" />شروع دوباره</Button>
              <Button onClick={() => navigate(isDemo ? '/' : '/Dashboard')} variant="outline" className="flex-1 rounded-xl clay-element">بازگشت</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate(isDemo ? '/' : '/Dashboard')} variant="outline" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
          {isDemo && <Button onClick={() => saveActivity()} disabled={saving} className="bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-xl px-4 py-2 font-bold text-sm"><Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}</Button>}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title}</h1>
            <p className="text-gray-600">{currentIndex + 1} از {items.length}</p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">{score}</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}>
            <Card className="clay-element bg-white border-0 mb-6">
              <CardContent className="p-8 text-center">
                <div className="text-8xl mb-6">{item?.image}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-8">{item?.question}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {item?.options?.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = opt === item.answer;
                    let bgClass = "bg-white hover:bg-cyan-50";
                    if (selected !== null) {
                      if (isSelected && isCorrect) bgClass = "bg-green-200";
                      else if (isSelected && !isCorrect) bgClass = "bg-red-200";
                      else if (isCorrect) bgClass = "bg-green-100";
                      else bgClass = "opacity-50 bg-white";
                    }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                        className={`w-full p-4 text-center rounded-2xl clay-element transition-all ${bgClass}`}>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg font-medium">{opt}</span>
                          {selected !== null && isCorrect && <Check className="w-5 h-5 text-green-600" />}
                          {isSelected && !isCorrect && <X className="w-5 h-5 text-red-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleNext} disabled={selected === null}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-2xl clay-element py-4 text-lg font-bold">
              {currentIndex < items.length - 1 ? "سوال بعدی" : "اتمام آزمون"}
            </Button>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

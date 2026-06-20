import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw, Check, GripVertical, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingEmojis from "@/components/shared/FloatingEmojis";
import { useGameData } from "@/hooks/useGameData";

export default function PlayTimeline() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [shuffled, setShuffled] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);

  useEffect(() => {
    if (activity?.content?.items)
      setShuffled([...activity.content.items].sort(() => Math.random() - 0.5));
  }, [activity]);

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...shuffled];
    const [item] = next.splice(dragIdx, 1);
    next.splice(idx, 0, item);
    setShuffled(next);
    setDragIdx(null);
  };

  const handleCheck = () => {
    const correct = shuffled.filter((item, idx) => item.order === idx + 1).length;
    setScore(correct);
    setChecked(true);
    setAttempts(attempts + 1);
    if (correct === shuffled.length) {
      setTimeout(() => setIsComplete(true), 1500);
    }
  };

  const restart = () => {
    setShuffled([...activity.content.items].sort(() => Math.random() - 0.5));
    setScore(0); setAttempts(0); setIsComplete(false); setChecked(false);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500" />
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
    const pct = Math.round((score / shuffled.length) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-fuchsia-50 to-pink-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-20 h-20 md:w-24 md:h-24 text-fuchsia-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">آفرین! ترتیب درست! 🎉</h2>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-5xl font-bold text-fuchsia-600">{score}/{shuffled.length}</p>
                <p className="text-2xl font-bold text-fuchsia-500 mt-2">{pct}%</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={restart} className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50">
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
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 📅</h1>
            <p className="text-gray-600">تلاش {attempts + 1}</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-xl font-bold text-fuchsia-600">{score}/{shuffled.length}</div>
        </motion.div>
        <div className="mb-6">
          <p className="text-center text-gray-600 mb-4 text-lg">🖐️ آیتم‌ها را به ترتیب صحیح بکشید و رها کنید</p>
          <div className="space-y-3">
            {shuffled.map((item, idx) => (
              <motion.div key={idx} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                draggable onDragStart={() => handleDragStart(idx)} onDragOver={handleDragOver} onDrop={() => handleDrop(idx)}
                className={`flex items-center gap-4 p-4 rounded-2xl clay-element cursor-grab active:cursor-grabbing transition-all ${
                  checked ? (item.order === idx + 1 ? 'bg-green-100 ring-2 ring-green-400' : 'bg-red-100 ring-2 ring-red-400') : 'bg-white hover:bg-fuchsia-50'
                }`}>
                <GripVertical className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-400 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{idx + 1}</span>
                <span className="text-lg text-gray-800">{item.text}</span>
                {checked && item.order === idx + 1 && <Check className="w-5 h-5 text-green-600 mr-auto" />}
              </motion.div>
            ))}
          </div>
        </div>
        {!checked ? (
          <Button onClick={handleCheck} className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-2xl clay-element py-6 text-xl">
            <Check className="w-6 h-6 ml-2" />بررسی ترتیب
          </Button>
        ) : (
          score === shuffled.length ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
              <p className="text-2xl font-bold text-green-600 mb-4">✅ همه درست هستند! آفرین!</p>
            </motion.div>
          ) : (
            <div className="flex gap-3">
              <Button onClick={restart} className="flex-1 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-2xl clay-element py-6 text-xl">
                <RotateCw className="w-6 h-6 ml-2" />دوباره
              </Button>
              <Button onClick={() => setChecked(false)} variant="outline" className="flex-1 rounded-2xl clay-element py-6 text-xl">
                ویرایش
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

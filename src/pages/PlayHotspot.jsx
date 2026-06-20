import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, X, Trophy, RotateCw, Save, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayHotspot() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.items?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
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
  const current = items[currentIdx];

  const handleClick = (e) => {
    if (feedback) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const dx = Math.abs(x - current.x);
    const dy = Math.abs(y - current.y);
    const correct = dx < 8 && dy < 8;
    if (correct) setScore(s => s + 1);
    setFeedback({ x: current.x, y: current.y, clickX: x, clickY: y });
    setFeedbackType(correct ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      setFeedbackType(null);
      if (currentIdx < items.length - 1) setCurrentIdx(i => i + 1);
      else setIsComplete(true);
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentIdx(0); setScore(0); setIsComplete(false);
    setFeedback(null); setFeedbackType(null);
  };

  if (isComplete) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-yellow-50 to-amber-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">همه نقاط پیدا شد! 🎉</h2>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-5xl font-bold text-amber-600">{score}/{items.length}</p>
                <p className="text-2xl font-bold text-amber-500 mt-2">{pct}%</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRestart} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" size="icon" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5" /></Button>
          {isDemo && (
            <Button onClick={() => saveActivity()} disabled={saving} className="bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-xl px-4 py-2 font-bold text-sm">
              <Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}
            </Button>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🎯</h1>
            <p className="text-gray-600">مورد {currentIdx + 1} از {items.length}</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-xl font-bold text-amber-600">{score}/{currentIdx + 1}</div>
        </motion.div>

        <div className="mb-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${((currentIdx) / items.length) * 100}%` }} className="h-full bg-gradient-to-r from-amber-400 to-yellow-500" />
          </div>
        </div>

        <div className="text-center mb-6">
          <span className="text-2xl font-bold text-gray-700 bg-white clay-element rounded-2xl px-8 py-4 inline-block">
            <MapPin className="w-6 h-6 inline ml-2 text-amber-500" />
            {current.label} کجاست؟
          </span>
        </div>

        <div className="relative w-full aspect-square max-w-lg mx-auto mb-6 cursor-crosshair rounded-3xl overflow-hidden clay-element" onClick={handleClick}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100" />
          <div className="absolute inset-4 rounded-2xl bg-gradient-to-b from-amber-200 to-yellow-200 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-300 to-yellow-300 clay-element" />
            <div className="absolute bottom-12 w-16 h-24 bg-gradient-to-b from-amber-300 to-yellow-300 rounded-b-2xl" />
            <div className="absolute left-8 bottom-32 w-10 h-6 bg-gradient-to-r from-amber-300 to-yellow-300 rounded-full" />
            <div className="absolute right-8 bottom-32 w-10 h-6 bg-gradient-to-l from-amber-300 to-yellow-300 rounded-full" />
          </div>
          <AnimatePresence>
            {feedback && (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" style={{ left: `${feedback.x}%`, top: `${feedback.y}%` }}>
                  <div className="w-8 h-8 rounded-full bg-green-400 ring-4 ring-white clay-element" />
                </motion.div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" style={{ left: `${feedback.clickX}%`, top: `${feedback.clickY}%` }}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center clay-element ${feedbackType === "correct" ? "bg-green-500" : "bg-red-500"}`}>
                    {feedbackType === "correct" ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-white" />}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center mb-4">
              <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-element text-lg font-bold ${feedbackType === "correct" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {feedbackType === "correct" ? <><Check className="w-6 h-6" />آفرین! درست بود 🎯</> : <><X className="w-6 h-6" />اشتباه! موقعیت {current.label}</>}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-2 justify-center">
          {items.map((item, i) => (
            <span key={i} className={`px-4 py-2 rounded-xl clay-element text-sm font-bold transition-all ${i < currentIdx ? "bg-green-200 text-green-800 ring-2 ring-green-400" : i === currentIdx ? "bg-amber-200 text-amber-800 ring-2 ring-amber-400 animate-pulse" : "bg-white text-gray-500"}`}>
              {i < currentIdx && "✅ "}{item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

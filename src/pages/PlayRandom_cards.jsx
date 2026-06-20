import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw, Sparkles, ThumbsUp, BookOpen, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingEmojis from "@/components/shared/FloatingEmojis";
import { useGameData } from "@/hooks/useGameData";

export default function PlayRandom_cards() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [remaining, setRemaining] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [review, setReview] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [drawnCount, setDrawnCount] = useState(0);

  useEffect(() => {
    if (activity?.content?.items) setRemaining([...activity.content.items].sort(() => Math.random() - 0.5));
  }, [activity]);

  const drawCard = () => {
    if (remaining.length === 0) { setIsComplete(true); return; }
    const [card, ...rest] = remaining;
    setCurrentCard(card);
    setRemaining(rest);
    setIsFlipped(false);
    setDrawnCount(d => d + 1);
  };

  const rateCard = (type) => {
    if (type === 'known') setKnown(k => k + 1);
    else setReview(r => r + 1);
    setCurrentCard(null);
    if (remaining.length === 0) setTimeout(() => setIsComplete(true), 300);
  };

  const restart = () => {
    setRemaining([...activity.content.items].sort(() => Math.random() - 0.5));
    setCurrentCard(null); setIsFlipped(false); setKnown(0); setReview(0); setIsComplete(false); setDrawnCount(0);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
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

  if (isComplete) return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
        <Card className="clay-element bg-gradient-to-br from-amber-50 to-yellow-50 border-0">
          <CardContent className="p-8 md:p-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">کارت‌ها تموم شد! 🎉</h2>
            <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element flex gap-6 justify-center">
              <div><p className="text-gray-500">بلدم ✅</p><p className="text-3xl font-bold text-green-600">{known}</p></div>
              <div className="w-px bg-gray-300" />
              <div><p className="text-gray-500">بعداً 📚</p><p className="text-3xl font-bold text-amber-600">{review}</p></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={restart} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
              <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
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
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🎴</h1>
            <p className="text-gray-600">{remaining.length + (currentCard ? 1 : 0)} کارت باقی‌مانده</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-sm"><span className="text-green-600">✅{known}</span> | <span className="text-amber-600">📚{review}</span></div>
        </motion.div>
        <div className="flex justify-center mb-8">
          <AnimatePresence mode="wait">
            {currentCard ? (
              <motion.div key={drawnCount} initial={{ opacity: 0, scale: 0.5, rotateY: 180 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} className="w-full max-w-md">
                <div className="relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                  <AnimatePresence mode="wait">
                    {!isFlipped ? (
                      <motion.div key="front" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }}>
                        <Card className="clay-element bg-white border-0 min-h-[280px]">
                          <CardContent className="flex flex-col items-center justify-center min-h-[280px] p-8 text-center">
                            <Sparkles className="w-12 h-12 text-amber-400 mb-4" />
                            <p className="text-2xl font-bold text-gray-800">{currentCard.front}</p>
                            <p className="text-gray-500 mt-6 text-sm">برای دیدن پاسخ کلیک کنید 👆</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div key="back" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }}>
                        <Card className="clay-element bg-gradient-to-br from-amber-50 to-yellow-50 border-0 min-h-[280px]">
                          <CardContent className="flex flex-col items-center justify-center min-h-[280px] p-8 text-center">
                            <p className="text-2xl font-bold text-gray-800 mb-6">{currentCard.back}</p>
                            <p className="text-gray-500 text-sm">برای برگشت کلیک کنید 👆</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {isFlipped && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mt-6 justify-center">
                    <Button onClick={() => rateCard('known')} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl clay-element py-6 text-lg">
                      <ThumbsUp className="w-5 h-5 ml-2" />بلدم ✅
                    </Button>
                    <Button onClick={() => rateCard('review')} variant="outline" className="flex-1 rounded-xl clay-element py-6 text-lg border-amber-300 text-amber-700">
                      <BookOpen className="w-5 h-5 ml-2" />بعداً 📚
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="draw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <Card className="clay-element bg-white/80 border-0 p-12 cursor-pointer hover:bg-white transition-all" onClick={drawCard}>
                  <CardContent className="text-center">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                      <span className="text-8xl">🎴</span>
                    </motion.div>
                    <p className="text-xl text-gray-600 mt-6">برای کشیدن کارت کلیک کنید</p>
                    <p className="text-gray-400 mt-2">{remaining.length} کارت باقی‌مانده</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

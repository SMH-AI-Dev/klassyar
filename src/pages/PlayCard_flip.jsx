import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingEmojis from "@/components/shared/FloatingEmojis";
import { useGameData } from "@/hooks/useGameData";

export default function PlayCard_flip() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (activity?.content?.items) {
      const deck = activity.content.items.flatMap((item) => [
        { ...item, uid: `${item.pairId}-a`, pairId: item.pairId },
        { ...item, uid: `${item.pairId}-b`, pairId: item.pairId },
      ]).sort(() => Math.random() - 0.5);
      setCards(deck);
    }
  }, [activity]);

  const handleFlip = (uid) => {
    if (isChecking || flipped.includes(uid) || matched.has(uid)) return;
    const newFlipped = [...flipped, uid];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setIsChecking(true);
      setAttempts(a => a + 1);
      const [first, second] = newFlipped;
      const card1 = cards.find(c => c.uid === first);
      const card2 = cards.find(c => c.uid === second);
      if (card1.pairId === card2.pairId) {
        setMatched(new Set([...matched, first, second]));
        setFlipped([]);
        setIsChecking(false);
        if (matched.size + 2 === cards.length) setTimeout(() => setIsComplete(true), 500);
      } else setTimeout(() => { setFlipped([]); setIsChecking(false); }, 1000);
    }
  };

  const restart = () => {
    const deck = [...activity.content.items].flatMap((item) => [
      { ...item, uid: `${item.pairId}-a`, pairId: item.pairId },
      { ...item, uid: `${item.pairId}-b`, pairId: item.pairId },
    ]).sort(() => Math.random() - 0.5);
    setCards(deck); setFlipped([]); setMatched(new Set()); setAttempts(0); setIsComplete(false);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
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
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
        <Card className="clay-element bg-gradient-to-br from-rose-50 to-pink-50 border-0">
          <CardContent className="p-8 md:p-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <Trophy className="w-20 h-20 text-rose-500 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">همه جفت‌ها پیدا شد! 🎉</h2>
            <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
              <p className="text-5xl font-bold text-rose-600">{cards.length / 2} جفت</p>
              <p className="text-2xl text-gray-600 mt-2">تعداد تلاش: {attempts}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={restart} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
              <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
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
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🃏</h1>
            <p className="text-gray-600">{matched.size / 2} از {cards.length / 2} جفت | {attempts} تلاش</p>
          </div>
          <Button onClick={restart} variant="outline" size="icon" className="rounded-xl clay-element"><RotateCw className="w-5 h-5" /></Button>
        </motion.div>
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.uid) || matched.has(card.uid);
            return (
              <motion.button key={card.uid} onClick={() => handleFlip(card.uid)} whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl clay-element text-2xl md:text-3xl font-bold transition-all ${
                  isFlipped ? 'bg-white text-gray-800' : 'bg-gradient-to-br from-rose-400 to-pink-500 text-white'
                } ${matched.has(card.uid) ? 'ring-4 ring-green-400 opacity-80' : ''}`}>
                <AnimatePresence mode="wait">
                  {isFlipped ? (
                    <motion.span key="front" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }} className="block">
                      {card.text || card.front}
                    </motion.span>
                  ) : (
                    <motion.span key="back" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }} className="block">
                      🎴
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

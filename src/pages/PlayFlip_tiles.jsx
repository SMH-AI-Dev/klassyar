import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Save, RotateCw, Trophy } from "lucide-react";

export default function PlayFlip_tiles() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();

  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (activity?.content?.items) {
      const pairs = activity.content.items.flatMap((emoji, i) => [
        { emoji, id: `${i}-a`, pairId: i },
        { emoji, id: `${i}-b`, pairId: i },
      ]);
      setTiles(pairs.sort(() => Math.random() - 0.5));
    }
  }, [activity]);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setAttempts(a => a + 1);
      const [a, b] = newFlipped;
      if (tiles[a].pairId === tiles[b].pairId) {
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === tiles.length) setIsComplete(true);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const resetGame = () => {
    if (activity?.content?.items) {
      const pairs = activity.content.items.flatMap((emoji, i) => [
        { emoji, id: `${i}-a`, pairId: i },
        { emoji, id: `${i}-b`, pairId: i },
      ]);
      setTiles(pairs.sort(() => Math.random() - 0.5));
      setFlipped([]);
      setMatched([]);
      setAttempts(0);
      setIsComplete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.items?.length) {
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
      <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آفرین! 🎉</h2>
            <p className="text-xl text-gray-600 mb-4">همه جفت‌ها را پیدا کردید!</p>
            <div className="text-3xl font-bold text-violet-600 mb-8">{attempts} تلاش</div>
            <div className="flex gap-3">
              <Button onClick={resetGame} className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl clay-element"><RotateCw className="w-5 h-5 ml-2" />شروع دوباره</Button>
              <Button onClick={() => navigate(isDemo ? '/' : '/Dashboard')} variant="outline" className="flex-1 rounded-xl clay-element">بازگشت</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate(isDemo ? '/' : '/Dashboard')} variant="outline" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
          {isDemo && <Button onClick={() => saveActivity()} disabled={saving} className="bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-xl px-4 py-2 font-bold text-sm"><Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}</Button>}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title}</h1>
            <p className="text-gray-600">تلاش‌ها: {attempts}</p>
          </div>
          <Button onClick={resetGame} variant="outline" className="rounded-xl clay-element"><RotateCw className="w-5 h-5 ml-2" />شروع دوباره</Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {tiles.map((tile, index) => {
            const isVisible = flipped.includes(index) || matched.includes(index);
            return (
              <motion.button key={tile.id} onClick={() => handleFlip(index)}
                whileHover={{ scale: isVisible ? 1 : 1.05 }} whileTap={{ scale: 0.95 }} className="aspect-square">
                <Card className={`clay-element border-0 h-full transition-all flex items-center justify-center ${isVisible ? "bg-white" : "bg-gradient-to-br from-violet-400 to-purple-400"}`}>
                  <CardContent className="flex items-center justify-center h-full p-2">
                    <span className="text-5xl">{isVisible ? tile.emoji : "❓"}</span>
                  </CardContent>
                </Card>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-2.5 rounded-full transition-all" style={{ width: `${tiles.length ? (matched.length / tiles.length) * 100 : 0}%` }} />
        </div>
      </div>
    </div>
  );
}

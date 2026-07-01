import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Timer as TimerIcon } from "lucide-react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchEngine({ game }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const pairs = game.cards.flatMap(c => [c, c]);
    setCards(shuffle(pairs));
  }, [game]);

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [finished]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setFinished(true);
    }
  }, [matched, cards]);

  const handleFlip = (idx) => {
    if (locked || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    setMoves(m => m + 1);

    if (newFlipped.length === 2) {
      setLocked(true);
      const [a, b] = newFlipped;
      if (cards[a].id === cards[b].id) {
        setMatched(m => [...m, a, b]);
        setFlipped([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 1000);
      }
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-900 to-teal-900">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/95 rounded-3xl p-8 max-w-md w-full text-center clay-element">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{game.title}</h2>
          <p className="text-gray-500 mb-4">تبریک! همه جفت‌ها رو پیدا کردی</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 rounded-2xl p-4"><p className="text-2xl font-bold text-purple-600">{moves}</p><p className="text-xs text-gray-500">حرکت</p></div>
            <div className="bg-green-50 rounded-2xl p-4"><p className="text-2xl font-bold text-green-600">{formatTime(timer)}</p><p className="text-xs text-gray-500">زمان</p></div>
          </div>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl px-8 py-4 h-auto text-lg">
            <RotateCcw className="w-5 h-5 ml-2" /> دوباره
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-800 to-teal-800">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 text-white">
          <div className="flex items-center gap-2"><TimerIcon className="w-5 h-5" /><span className="text-lg font-bold">{formatTime(timer)}</span></div>
          <div className="text-lg font-bold">حرکات: {moves}</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            return (
              <motion.button key={idx} onClick={() => handleFlip(idx)} whileTap={{ scale: 0.95 }} className="aspect-square">
                <motion.div animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.4 }} className="w-full h-full rounded-2xl clay-element" style={{ transformStyle: "preserve-3d" }}>
                  <div className="w-full h-full flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white" style={{ backfaceVisibility: "hidden" }}>
                    <span className="text-3xl">?</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <span className="text-4xl">{card.emoji}</span>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

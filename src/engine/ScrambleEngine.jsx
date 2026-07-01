import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Star, Timer, Lightbulb, Shuffle } from "lucide-react";

export default function ScrambleEngine({ game }) {
  const [wIdx, setWIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!game.words || !game.words[wIdx]) return;
    setSelected([]);
    setRevealed(false);
    setFeedback(null);
    setShowHint(false);
    setTimer(30);
    const w = game.words[wIdx];
    const letters = w.scrambled.split("").map((ch, i) => ({ id: i, ch }));
    setTiles(letters.sort(() => Math.random() - 0.5));
  }, [wIdx, game]);

  useEffect(() => {
    if (feedback || finished) return;
    if (timer <= 0) {
      setRevealed(true);
      setFeedback(false);
      return;
    }
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, feedback, finished, wIdx]);

  const handleTileClick = (tileId) => {
    if (revealed || feedback !== null) return;
    if (selected.includes(tileId)) {
      setSelected(prev => prev.filter(id => id !== tileId));
    } else {
      const newSelected = [...selected, tileId];
      setSelected(newSelected);
      const word = newSelected.map(id => tiles.find(t => t.id === id).ch).join("");
      if (word.length === game.words[wIdx].answer.length) {
        const isCorrect = word === game.words[wIdx].answer;
        if (isCorrect) setScore(s => s + 1);
        setFeedback(isCorrect);
        setRevealed(true);
      }
    }
  };

  const shuffleTiles = () => {
    setTiles(prev => [...prev.sort(() => Math.random() - 0.5)]);
    setSelected([]);
  };

  const nextWord = () => {
    if (wIdx + 1 >= game.words.length) {
      setFinished(true);
    } else {
      setWIdx(i => i + 1);
    }
  };

  const restart = () => {
    setWIdx(0);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / game.words.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-900 to-rose-900">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/95 rounded-3xl p-8 max-w-md w-full text-center clay-element">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1 }} className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Star className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{game.title}</h2>
          <p className="text-gray-500 mb-6">نتیجه نهایی</p>
          <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">{pct}%</div>
          <p className="text-lg mb-6">{score} از {game.words.length} کلمه درست</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
          </div>
          <Button onClick={restart} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl px-8 py-4 h-auto text-lg">
            <RotateCcw className="w-5 h-5 ml-2" /> دوباره
          </Button>
        </motion.div>
      </div>
    );
  }

  const word = game.words[wIdx];
  const currentWord = selected.map(id => tiles.find(t => t.id === id).ch).join("");

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
      <motion.div key={wIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
        <div className="mb-4 flex items-center gap-3">
          <Timer className="w-5 h-5 text-white/80" />
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <motion.div initial={{ width: "100%" }} animate={{ width: `${(timer / 30) * 100}%` }} className="h-2 bg-white rounded-full" />
          </div>
          <span className="text-white font-bold">{timer}s</span>
        </div>
        <div className="text-white/60 text-sm mb-4">کلمه {wIdx + 1} از {game.words.length}</div>
        <div className="bg-white/95 rounded-3xl p-6 mb-6 clay-element text-center">
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {tiles.map((tile) => {
              const isSelected = selected.includes(tile.id);
              return (
                <motion.button
                  key={tile.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleTileClick(tile.id)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-xl font-bold transition-all clay-element ${
                    isSelected
                      ? "bg-pink-500 text-white"
                      : "bg-white text-gray-800 border-2 border-pink-200 hover:border-pink-400"
                  }`}
                >
                  {tile.ch}
                </motion.button>
              );
            })}
          </div>
          <div className="min-h-[48px] flex items-center justify-center">
            {revealed ? (
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-2xl font-bold ${feedback ? "text-green-600" : "text-red-600"}`}>
                {feedback ? `✓ ${word.answer}` : `✗ ${word.answer}`}
              </motion.p>
            ) : (
              <p className="text-2xl font-bold text-gray-800 tracking-widest">{currentWord || "..."}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mb-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
            <Button onClick={shuffleTiles} disabled={revealed} className="w-full bg-white/20 text-white rounded-2xl h-12 clay-element border border-white/30">
              <Shuffle className="w-5 h-5 ml-2" /> جابجایی
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
            <Button onClick={() => setShowHint(true)} disabled={showHint || revealed} className="w-full bg-white/20 text-white rounded-2xl h-12 clay-element border border-white/30">
              <Lightbulb className="w-5 h-5 ml-2" /> راهنما
            </Button>
          </motion.div>
        </div>
        <AnimatePresence>
          {showHint && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white/90 rounded-2xl p-3 mb-4 clay-element text-center">
              <p className="text-gray-700">{word.hint}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button onClick={nextWord} className="w-full h-14 bg-white text-pink-700 rounded-2xl text-lg font-bold clay-element">
              {wIdx + 1 >= game.words.length ? "مشاهده نتیجه" : "کلمه بعدی"}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

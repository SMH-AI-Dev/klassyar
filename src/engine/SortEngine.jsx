import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Star, CheckCircle2, XCircle } from "lucide-react";

export default function SortEngine({ game }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [placed, setPlaced] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!game.categories || !game.items) return;
    const cats = game.categories.map(c => ({ ...c, droppedItems: [] }));
    setCategories(cats);
    const shuffled = [...game.items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setTotalItems(shuffled.length);
  }, [game]);

  const handleDrop = (itemId, catName) => {
    setPlaced(p => ({ ...p, [itemId]: catName }));
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const removeFromCategory = (itemId) => {
    const item = game.items.find(i => i.id === itemId);
    if (item) {
      setItems(prev => [...prev, item]);
      const newPlaced = { ...placed };
      delete newPlaced[itemId];
      setPlaced(newPlaced);
    }
  };

  const checkAnswers = () => {
    let correct = 0;
    game.items.forEach(item => {
      if (placed[item.id] === item.category) correct++;
    });
    setScore(correct);
    setFeedback(true);
    setFinished(true);
  };

  const restart = () => {
    const shuffled = [...game.items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setPlaced({});
    setFeedback(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / totalItems) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-900 to-green-900">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/95 rounded-3xl p-8 max-w-md w-full text-center clay-element">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1 }} className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Star className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{game.title}</h2>
          <p className="text-gray-500 mb-6">نتیجه دسته‌بندی</p>
          <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">{pct}%</div>
          <p className="text-lg mb-6">{score} از {totalItems} درست</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-3 bg-gradient-to-r from-teal-500 to-green-500 rounded-full" />
          </div>
          <Button onClick={restart} className="bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-2xl px-8 py-4 h-auto text-lg">
            <RotateCcw className="w-5 h-5 ml-2" /> دوباره
          </Button>
        </motion.div>
      </div>
    );
  }

  const placedItems = {};
  Object.entries(placed).forEach(([itemId, catName]) => {
    if (!placedItems[catName]) placedItems[catName] = [];
    const item = game.items.find(i => i.id === itemId);
    if (item) placedItems[catName].push(item);
  });

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-teal-700 to-green-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 text-white">
          <h2 className="text-xl font-bold">{game.title}</h2>
          <div className="text-lg font-bold">{totalItems - items.length} / {totalItems}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {game.categories.map((cat) => {
            const catItems = placedItems[cat.name] || [];
            return (
              <div
                key={cat.name}
                className="bg-white/20 rounded-3xl p-4 min-h-[160px] clay-element border-2 border-dashed border-white/30"
              >
                <h3 className="text-white font-bold text-lg mb-3 text-center">{cat.name}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {catItems.map((item) => (
                    <motion.button
                      key={item.id}
                      layout
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      onClick={() => removeFromCategory(item.id)}
                      className="bg-white/90 text-gray-800 px-3 py-2 rounded-2xl text-sm font-medium clay-element hover:bg-red-50 transition-colors"
                    >
                      {item.label} ✕
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex gap-1"
              >
                {game.categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleDrop(item.id, cat.name)}
                    className="bg-white/90 text-gray-800 px-4 py-3 rounded-2xl text-sm font-medium clay-element hover:bg-purple-50 transition-all whitespace-nowrap"
                  >
                    {item.label} ← {cat.name}
                  </button>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {items.length > 0 && (
          <p className="text-white/60 text-sm text-center mb-4">برای هر مورد، روی دسته مناسب کلیک کنید</p>
        )}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={checkAnswers}
            disabled={items.length > 0}
            className="w-full h-14 bg-white text-teal-700 rounded-2xl text-lg font-bold clay-element"
          >
            {items.length > 0 ? `هنوز ${items.length} مورد باقی مانده` : "بررسی پاسخ‌ها"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

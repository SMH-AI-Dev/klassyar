import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, Save, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MAZE_SIZE = 8;

export default function PlayMaze_chase() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [qIdx, setQIdx] = useState(0);
  const [playerPos, setPlayerPos] = useState(0);
  const [monsterPos, setMonsterPos] = useState(-3);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [lost, setLost] = useState(false);

  const restart = () => { setQIdx(0); setPlayerPos(0); setMonsterPos(-3); setLives(3); setSelected(null); setIsComplete(false); setLost(false); };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
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

  const total = activity.content.items.length;

  if (lost) return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
        <Card className="clay-element bg-gradient-to-br from-red-50 to-pink-50 border-0">
          <CardContent className="p-8 md:p-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <span className="text-8xl">👾</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-4">هیولا تو رو گرفت!</h2>
            <p className="text-gray-600 mb-6">هیولا بهت رسید! دوباره تلاش کن</p>
            <p className="text-xl text-gray-500 mb-6">به {qIdx} سوال جواب دادی</p>
            <Button onClick={restart} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع دوباره 🔄</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  if (isComplete) return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
        <Card className="clay-element bg-gradient-to-br from-indigo-50 to-purple-50 border-0">
          <CardContent className="p-8 md:p-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">از مارپیچ فرار کردی! 🏃</h2>
            <p className="text-gray-500 mb-6">هیولا نرسید بهت!</p>
            <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
              <p className="text-5xl font-bold text-indigo-600">{qIdx}/{total}</p>
              <p className="text-gray-500 mt-1">سوال جواب داده</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={restart} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl clay-element px-8 py-6 text-lg">بازی دوباره 🔄</Button>
              <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />خروج</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const item = activity.content.items[qIdx];
  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === item.options.indexOf(item.answer);
    const moved = correct ? playerPos + 1 : monsterPos + 1;
    if (correct) { setPlayerPos(p => Math.min(p + 1, total)); } 
    else { setMonsterPos(m => m + 1); setLives(l => l - 1); }
    setTimeout(() => {
      if (!correct && (lives - 1 <= 0 || moved >= playerPos)) { setLost(true); return; }
      if (correct && moved >= total) { setIsComplete(true); return; }
      if (qIdx < total - 1) { setQIdx(qIdx + 1); setSelected(null); } 
      else setIsComplete(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4">
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" size="icon" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5" /></Button>
          {isDemo && (
            <Button onClick={() => saveActivity()} disabled={saving}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-xl clay-element px-4 py-2 font-bold text-sm">
              <Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}
            </Button>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🧩</h1>
            <p className="text-gray-600">مرحله {qIdx + 1} از {total}</p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(h => <Heart key={h} className={`w-6 h-6 ${h <= lives ? "text-red-500 fill-red-500" : "text-gray-300"}`} />)}
          </div>
        </motion.div>

        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(playerPos / total) * 100}%` }}
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500" />
          </div>
        </div>

        <Card className="clay-element bg-white/80 border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex justify-center gap-1 md:gap-2 mb-4" dir="ltr">
              {Array.from({ length: MAZE_SIZE }, (_, i) => {
                let content = i === playerPos ? "🧑" : i === monsterPos ? "👾" : i < playerPos ? "✅" : "⬜";
                return (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                    className={`w-9 h-9 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl rounded-lg clay-element
                      ${i === playerPos ? "bg-gradient-to-br from-green-400 to-emerald-500" : ""}
                      ${i === monsterPos ? "bg-gradient-to-br from-red-400 to-pink-500" : ""}
                      ${i < playerPos ? "bg-green-100" : i !== playerPos && i !== monsterPos ? (i > playerPos ? "bg-white/30" : "") : ""}`}>
                    {content}
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 text-sm text-gray-500">
              <span>🧑 شما</span><span>👾 هیولا</span><span>✅ رد شده</span><span>⬜ مسیر</span>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <Card className="clay-element bg-gradient-to-br from-indigo-50 to-purple-50 border-0">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">❓</span>
                  <h2 className="text-xl font-bold text-gray-800">{item.question}</h2>
                </div>
                <div className="space-y-3">
                  {item.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = i === item.options.indexOf(item.answer);
                    let btnClass = "bg-white hover:bg-indigo-50 text-gray-800 border-2 border-indigo-200";
                    if (selected !== null) btnClass = isCorrect ? "bg-green-100 border-green-400 text-green-800" : isSelected ? "bg-red-100 border-red-400 text-red-800" : "bg-gray-100 border-gray-200 text-gray-400";
                    return (
                      <motion.button key={i} whileHover={selected === null ? { scale: 1.02 } : {}}
                        onClick={() => handleSelect(i)} disabled={selected !== null}
                        className={`w-full p-4 rounded-2xl clay-element text-right text-lg font-medium transition-all ${btnClass}`}>
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {selected !== null && isCorrect && <span className="text-green-600">✅</span>}
                          {selected !== null && isSelected && !isCorrect && <X className="w-5 h-5 text-red-600" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                {selected !== null && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
                    <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl clay-element font-bold ${selected === item.options.indexOf(item.answer) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selected === item.options.indexOf(item.answer) ? "🎯 آفرین! یک قدم جلو رفتی" : `😵 پاسخ اشتباه! پاسخ صحیح: ${item.answer}`}
                    </span>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

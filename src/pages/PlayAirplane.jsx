import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayAirplane() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const restart = () => { setQIdx(0); setScore(0); setSelected(null); setIsComplete(false); };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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

  if (isComplete) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <span className="text-7xl block mb-4">✈️</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">پرواز موفق! 🌤️</h2>
              <p className="text-gray-500 mb-6">همه سوالات رو جواب دادی</p>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-5xl font-bold text-blue-600">{score}/{total}</p>
                <p className="text-gray-500 mt-1">پاسخ صحیح</p>
                <div className="mt-3 bg-gray-200 rounded-full h-3 overflow-hidden clay-element">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                </div>
                <p className="text-lg text-blue-500 mt-2 font-bold">{pct}%</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={restart} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl clay-element px-8 py-6 text-lg">پرواز دوباره 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />فرود</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const item = activity.content.items[qIdx];
  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === item.options.indexOf(item.answer);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (qIdx < total - 1) { setQIdx(qIdx + 1); setSelected(null); }
      else setIsComplete(true);
    }, 1200);
  };

  const progress = score + (selected !== null && selected === item.options.indexOf(item.answer) ? 1 : 0);

  const clouds = ["☁️", "⛅", "🌤️", "☁️", "☀️"];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 overflow-hidden">
      <div className="max-w-4xl mx-auto relative">
        {clouds.map((c, i) => (
          <motion.span key={i} initial={{ x: -100 }} animate={{ x: [null, 100, -100] }} transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute text-3xl opacity-30 pointer-events-none" style={{ top: `${10 + i * 15}%`, left: `${5 + i * 20}%` }}>{c}</motion.span>
        ))}

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4 relative z-10">
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" size="icon" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5" /></Button>
          {isDemo && (
            <Button onClick={() => saveActivity()} disabled={saving}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-xl clay-element px-4 py-2 font-bold text-sm">
              <Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}
            </Button>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} ✈️</h1>
            <p className="text-gray-600">سوال {qIdx + 1} از {total}</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-center">
            <p className="text-sm text-gray-500">امتیاز</p>
            <p className="text-xl font-bold text-blue-600">{score}</p>
          </div>
        </motion.div>

        <div className="mb-6 relative z-10">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(progress / total) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400" />
          </div>
        </div>

        <div className="mb-6 relative z-10" dir="ltr">
          <div className="relative h-24 bg-blue-100/50 rounded-2xl clay-element overflow-hidden">
            <motion.div animate={{ x: `${(progress / total) * 90}%` }} transition={{ type: "spring" }}
              className="absolute bottom-2 text-4xl" style={{ left: "5%" }}>
              ✈️
            </motion.div>
            {[25, 50, 75].map(p => (
              <div key={p} className="absolute bottom-0 text-2xl opacity-40" style={{ left: `${p}%` }}>⛳</div>
            ))}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <Card className="clay-element bg-gradient-to-br from-blue-50 to-white border-0 mb-6 relative z-10">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🧑‍✈️</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{item.question}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {item.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = i === item.options.indexOf(item.answer);
                    let btnClass = "bg-white hover:bg-sky-50 text-gray-800 border-2 border-sky-200";
                    if (selected !== null) {
                      if (isCorrect) btnClass = "bg-green-100 border-green-400 text-green-800";
                      else if (isSelected) btnClass = "bg-red-100 border-red-400 text-red-800";
                      else btnClass = "bg-gray-100 border-gray-200 text-gray-400";
                    }
                    return (
                      <motion.button key={i} whileHover={selected === null ? { scale: 1.05, y: -3 } : {}}
                        onClick={() => handleSelect(i)} disabled={selected !== null}
                        className={`p-5 rounded-2xl clay-element text-center text-lg font-medium transition-all ${btnClass}`}>
                        <div className="text-2xl mb-2">{["☁️", "☁️", "☁️"][i]}</div>
                        <span>{opt}</span>
                        {selected !== null && isCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600 mt-1">✅</motion.div>}
                        {selected !== null && isSelected && !isCorrect && <X className="w-5 h-5 text-red-600 mx-auto mt-1" />}
                      </motion.button>
                    );
                  })}
                </div>
                {selected !== null && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-center">
                    <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-element font-bold text-lg ${selected === item.options.indexOf(item.answer) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selected === item.options.indexOf(item.answer) ? "✈️ پرواز به جلو! 🎉" : `❌ پاسخ صحیح: ${item.answer}`}
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

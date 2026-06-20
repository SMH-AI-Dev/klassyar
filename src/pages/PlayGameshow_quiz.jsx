import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, Save, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const colors = [
  { bg: "from-orange-400 to-red-500", hover: "hover:from-orange-500 hover:to-red-600", label: "A" },
  { bg: "from-amber-400 to-orange-500", hover: "hover:from-amber-500 hover:to-orange-600", label: "B" },
  { bg: "from-red-400 to-rose-500", hover: "hover:from-red-500 hover:to-rose-600", label: "C" },
  { bg: "from-rose-400 to-pink-500", hover: "hover:from-rose-500 hover:to-pink-600", label: "D" },
];

export default function PlayGameshow_quiz() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [points, setPoints] = useState(0);

  const restart = () => { setQIdx(0); setScore(0); setSelected(null); setIsComplete(false); setPoints(0); };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
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
    const pct = Math.round((score / activity.content.items.length) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-rose-50">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-orange-50 to-red-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">برنده شدی! 🏆</h2>
              <p className="text-gray-500 mb-6">مسابقه تلویزیونی را با موفقیت به پایان رساندی</p>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-6xl font-bold text-orange-600">{points.toLocaleString()}</p>
                <p className="text-lg text-gray-500 mt-1">امتیاز نهایی</p>
                <p className="text-2xl font-bold text-orange-500 mt-2">{score}/{activity.content.items.length} صحیح ({pct}%)</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={restart} className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl clay-element px-8 py-6 text-lg">دور بعد 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />خروج</Button>
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
    const correct = i === item.options.indexOf(item.correct);
    if (correct) { setScore(s => s + 1); setPoints(p => p + (activity.content.items.length - qIdx) * 100); }
    setTimeout(() => {
      if (qIdx < activity.content.items.length - 1) { setQIdx(qIdx + 1); setSelected(null); }
      else setIsComplete(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-orange-50 via-red-50 to-rose-50">
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
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🎤</h1>
            <p className="text-gray-600">سوال {qIdx + 1} از {activity.content.items.length}</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-center">
            <p className="text-sm text-gray-500">امتیاز</p>
            <p className="text-xl font-bold text-orange-600">{points.toLocaleString()}</p>
          </div>
        </motion.div>

        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${((qIdx + (selected !== null ? 1 : 0)) / activity.content.items.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-orange-400 to-red-500" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <Card className="clay-element bg-gradient-to-br from-orange-50 to bg-white border-0 mb-6">
              <CardContent className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🎯</span>
                  <h2 className="text-2xl font-bold text-gray-800">{item.question}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.options.map((opt, i) => {
                    const c = colors[i];
                    const isSelected = selected === i;
                    const isCorrect = i === item.options.indexOf(item.correct);
                    let btnStyle = `${c.bg} ${c.hover} text-white`;
                    if (selected !== null) {
                      if (isCorrect) btnStyle = "bg-green-500 text-white";
                      else if (isSelected) btnStyle = "bg-red-500 text-white";
                      else btnStyle = "bg-gray-300 text-gray-500";
                    }
                    return (
                      <motion.button key={i} whileHover={selected === null ? { scale: 1.05 } : {}} whileTap={selected === null ? { scale: 0.95 } : {}}
                        onClick={() => handleSelect(i)} disabled={selected !== null}
                        className={`relative p-5 rounded-2xl clay-element font-bold text-lg transition-all ${btnStyle}`}>
                        <span className="absolute top-2 left-3 text-xs opacity-60 bg-white/20 px-2 py-1 rounded-lg">{c.label}</span>
                        <span>{opt}</span>
                        {selected !== null && isCorrect && <Check className="absolute top-2 right-3 w-5 h-5" />}
                        {selected !== null && isSelected && !isCorrect && <X className="absolute top-2 right-3 w-5 h-5" />}
                      </motion.button>
                    );
                  })}
                </div>
                {selected !== null && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                    <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-element text-lg font-bold ${selected === item.options.indexOf(item.correct) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selected === item.options.indexOf(item.correct) ? <>✅ آفرین! +{(activity.content.items.length - qIdx) * 100} امتیاز</> : <>❌ پاسخ صحیح: {item.correct}</>}
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

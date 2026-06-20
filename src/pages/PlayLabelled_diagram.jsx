import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, X, Trophy, RotateCw, Save, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayLabelled_diagram() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [placed, setPlaced] = useState({});
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [shaking, setShaking] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.items?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
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
  const remaining = items.filter((_, i) => !placed[i]);
  const allPlaced = Object.keys(placed).length === items.length;

  const handleDiagramClick = (e) => {
    if (!selectedLabel || feedback) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM().inverse();
    const pos = pt.matrixTransform(ctm);
    const target = items[selectedLabel];
    const dx = Math.abs(pos.x - target.x);
    const dy = Math.abs(pos.y - target.y);
    const correct = dx < 6 && dy < 6;
    if (correct) {
      setScore(s => s + 1);
      setPlaced(p => ({ ...p, [selectedLabel]: true }));
      setFeedback({ correct: true, idx: selectedLabel });
    } else {
      setShaking(selectedLabel);
      setFeedback({ correct: false, idx: selectedLabel });
    }
    setTimeout(() => {
      setFeedback(null);
      setSelectedLabel(null);
      setShaking(null);
      if (correct) {
        const allDone = Object.keys(placed).length + 1 >= items.length;
        if (allDone) setIsComplete(true);
      }
    }, 1000);
  };

  const handleRestart = () => { setPlaced({}); setSelectedLabel(null); setScore(0); setIsComplete(false); setFeedback(null); setShaking(null); };

  if (isComplete) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-emerald-50 to-green-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">نمودار کامل شد! 🌸</h2>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-5xl font-bold text-emerald-600">{score}/{items.length}</p>
                <p className="text-2xl font-bold text-emerald-500 mt-2">{pct}%</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRestart} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" size="icon" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5" /></Button>
          {isDemo && (
            <Button onClick={() => saveActivity()} disabled={saving} className="bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-xl px-4 py-2 font-bold text-sm">
              <Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}
            </Button>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} 🌱</h1>
            <p className="text-gray-600">{Object.keys(placed).length} از {items.length} برچسب</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-xl font-bold text-emerald-600">{score}/{Object.keys(placed).length}</div>
        </motion.div>

        <div className="mb-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(Object.keys(placed).length / items.length) * 100}%` }} className="h-full bg-gradient-to-r from-emerald-400 to-green-500" />
          </div>
        </div>

        <div className="text-center mb-4">
          <span className="text-lg font-bold text-gray-700 bg-white clay-element rounded-2xl px-6 py-3 inline-block">
            {selectedLabel !== null ? <><MapPin className="w-5 h-5 inline ml-2 text-emerald-500" />روی محل {items[selectedLabel].label} کلیک کن</> : "برچسب را انتخاب کن"}
          </span>
        </div>

        <svg viewBox="0 0 100 100" className="w-full max-w-md mx-auto mb-6 cursor-cross-pointer bg-white clay-element rounded-3xl p-2" onClick={handleDiagramClick} style={{ touchAction: "none" }}>
          <g id="flower">
            <rect x="30" y="88" width="40" height="10" rx="3" fill="#8B4513" stroke="#6B3410" strokeWidth="1" />
            <rect x="32" y="85" width="36" height="5" rx="2" fill="#A0522D" />
            <line x1="50" y1="85" x2="50" y2="25" stroke="#2D8A4E" strokeWidth="3" strokeLinecap="round" />
            <g id="leaves">
              <ellipse cx="64" cy="55" rx="8" ry="4" fill="#3CB371" transform="rotate(-20,64,55)" stroke="#2D8A4E" strokeWidth="1" />
              <ellipse cx="36" cy="65" rx="7" ry="3.5" fill="#3CB371" transform="rotate(20,36,65)" stroke="#2D8A4E" strokeWidth="1" />
            </g>
            <g id="flower-head">
              <circle cx="50" cy="20" r="8" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="1" />
              <circle cx="42" cy="16" r="5" fill="#FFC0CB" stroke="#FF69B4" strokeWidth="0.8" />
              <circle cx="58" cy="16" r="5" fill="#FFC0CB" stroke="#FF69B4" strokeWidth="0.8" />
              <circle cx="42" cy="24" r="5" fill="#FFC0CB" stroke="#FF69B4" strokeWidth="0.8" />
              <circle cx="58" cy="24" r="5" fill="#FFC0CB" stroke="#FF69B4" strokeWidth="0.8" />
              <circle cx="50" cy="20" r="5" fill="#FFD700" />
            </g>
            <g id="roots">
              <path d="M50,85 Q48,92 45,95" fill="none" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M50,85 Q52,91 55,94" fill="none" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M50,85 Q47,90 42,94" fill="none" stroke="#8B4513" strokeWidth="1" strokeLinecap="round" />
            </g>
          </g>
          {items.map((item, i) => (
            <g key={i}>
              <circle cx={item.x} cy={item.y} r="6" fill={placed[i] ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.2)"} stroke={selectedLabel === i ? "#10B981" : "rgba(16,185,129,0.3)"} strokeWidth={selectedLabel === i ? 2 : 1} strokeDasharray={placed[i] ? "none" : "4,2"} />
              {placed[i] && (
                <g>
                  <rect x={item.x - 12} y={item.y - 14} width="24" height="14" rx="4" fill="#10B981" stroke="#059669" strokeWidth="1" />
                  <text x={item.x} y={item.y - 4} textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="tahoma">{item.label}</text>
                  <line x1={item.x} y1={item.y} x2={item.x} y2={item.y + 4} stroke="#10B981" strokeWidth="1.5" />
                  <circle cx={item.x} cy={item.y + 5} r="1.5" fill="#10B981" />
                </g>
              )}
            </g>
          ))}
          {feedback && feedback.correct && <text x={items[feedback.idx].x} y={items[feedback.idx].y - 20} textAnchor="middle" fill="#10B981" fontSize="6" fontWeight="bold">✅</text>}
        </svg>

        {feedback && !feedback.correct && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-element bg-red-100 text-red-800 text-lg font-bold">
              <X className="w-6 h-6" />اشتباه! دوباره تلاش کن
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {items.map((item, i) => !placed[i] && (
            <motion.button key={i} onClick={() => setSelectedLabel(i)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              animate={shaking === i ? { x: [0, -8, 8, -8, 8, 0] } : selectedLabel === i ? { scale: 1.1 } : {}}
              transition={shaking === i ? { duration: 0.4 } : {}}
              className={`px-5 py-3 rounded-2xl clay-element font-bold text-lg ${selectedLabel === i ? "bg-emerald-500 text-white ring-4 ring-emerald-300" : "bg-white text-gray-800 border-2 border-emerald-200 hover:bg-emerald-50"}`}>
              <MapPin className="w-4 h-4 inline ml-1" />{item.label}
            </motion.button>
          ))}
          {remaining.length === 0 && <p className="text-lg text-emerald-600 font-bold w-full text-center">همه برچسب‌ها قرار گرفت! 🌸</p>}
        </div>
      </div>
    </div>
  );
}

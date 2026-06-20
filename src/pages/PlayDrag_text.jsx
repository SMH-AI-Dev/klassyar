import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, X, Trophy, RotateCw, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingEmojis from "@/components/shared/FloatingEmojis";
import { useGameData } from "@/hooks/useGameData";

export default function PlayDrag_text() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [slots, setSlots] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (activity?.content?.items) initQuestion();
  }, [activity, qIdx]);

  const initQuestion = () => {
    const item = activity.content.items[qIdx];
    const blanks = item.blanks || item.sentence.match(/___/g)?.length || 0;
    setSlots(Array(blanks).fill(null));
    setAvailableWords([...item.words].sort(() => Math.random() - 0.5));
    setSelectedWord(null); setChecked(false); setResults([]);
  };

  const selectWord = (word) => {
    if (checked) return;
    const idx = availableWords.indexOf(word);
    if (idx === -1) return;
    const firstEmpty = slots.indexOf(null);
    if (firstEmpty === -1) return;
    const newSlots = [...slots];
    newSlots[firstEmpty] = word;
    setSlots(newSlots);
    setAvailableWords(prev => prev.filter((_, i) => i !== idx));
  };

  const removeFromSlot = (idx) => {
    if (checked) return;
    if (slots[idx] === null) return;
    setAvailableWords(prev => [...prev, slots[idx]]);
    const newSlots = [...slots];
    newSlots[idx] = null;
    setSlots(newSlots);
  };

  const handleCheck = () => {
    if (slots.some(s => s === null) || availableWords.length > 0) return;
    const item = activity.content.items[qIdx];
    const ans = item.answer || item.blanks;
    const res = slots.map((s, i) => s === ans[i]);
    setResults(res);
    setChecked(true);
    const correct = res.every(Boolean);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (qIdx < activity.content.items.length - 1) { setQIdx(qIdx + 1); }
      else setIsComplete(true);
    }, 1500);
  };

  const restart = () => { setQIdx(0); setScore(0); setIsComplete(false); };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
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
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="clay-element bg-gradient-to-br from-cyan-50 to-blue-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Trophy className="w-20 h-20 text-cyan-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">جملات کامل شد! 🎉</h2>
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-5xl font-bold text-cyan-600">{score}/{activity.content.items.length}</p>
                <p className="text-2xl font-bold text-cyan-500 mt-2">{pct}%</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={restart} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl clay-element px-8 py-6 text-lg">شروع مجدد 🔄</Button>
                <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")} variant="outline" className="rounded-xl clay-element px-8 py-6 text-lg"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const item = activity.content.items[qIdx];
  const parts = item.sentence.split('___');
  const progress = qIdx + (checked ? 1 : 0);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50">
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
            <h1 className="text-2xl font-bold text-gray-800">{activity.title} ✏️</h1>
            <p className="text-gray-600">جمله {qIdx + 1} از {activity.content.items.length}</p>
          </div>
          <div className="bg-white clay-element rounded-xl px-4 py-2 text-xl font-bold text-cyan-600">{score}/{progress}</div>
        </motion.div>
        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(progress / activity.content.items.length) * 100}%` }} className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <Card className="clay-element bg-gradient-to-br from-cyan-50 to-blue-50 border-0 mb-6">
              <CardContent className="p-8 md:p-10">
                <p className="text-2xl md:text-3xl font-bold text-gray-800 text-center leading-relaxed mb-6">
                  {parts.map((part, i) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < parts.length - 1 && (
                        <span onClick={() => removeFromSlot(i)}
                          className={`inline-flex items-center justify-center mx-2 min-w-[90px] h-12 px-3 rounded-xl clay-element cursor-pointer transition-all ${
                            checked
                              ? results[i] ? 'bg-green-200 text-green-800 ring-2 ring-green-400' : 'bg-red-200 text-red-800 ring-2 ring-red-400'
                              : slots[i] ? 'bg-cyan-100 text-cyan-800 ring-2 ring-cyan-400' : 'bg-gray-100 border-2 border-dashed border-cyan-300'
                          }`}>
                          {slots[i] || '___'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </CardContent>
            </Card>
            {availableWords.length > 0 && (
              <motion.div className="flex flex-wrap gap-3 justify-center mb-6">
                {availableWords.map((word, i) => (
                  <motion.button key={i} onClick={() => selectWord(word)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-2xl clay-element font-bold text-lg transition-all ${
                      selectedWord === word ? 'bg-cyan-500 text-white' : 'bg-white text-gray-800 border-2 border-cyan-200 hover:bg-cyan-50'
                    }`}>
                    {word}
                  </motion.button>
                ))}
              </motion.div>
            )}
            <AnimatePresence>
              {checked && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-element ${results.every(Boolean) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {results.every(Boolean) ? <><Check className="w-6 h-6" /><span className="text-lg font-bold">آفرین! جمله درست است! 🌟</span></> : <><X className="w-6 h-6" /><span className="text-lg font-bold">اشتباه!</span></>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!checked && (
              <Button onClick={handleCheck} disabled={slots.some(s => s === null) || availableWords.length > 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl clay-element py-6 text-xl">
                <Check className="w-6 h-6 ml-2" />بررسی
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

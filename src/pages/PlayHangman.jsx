import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Save, RotateCw, Trophy } from "lucide-react";

const PERSIAN_ALPHABET = ["ا","ب","پ","ت","ث","ج","چ","ح","خ","د","ذ","ر","ز","ژ","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ک","گ","ل","م","ن","و","ه","ی"];

const HangmanSVG = ({ wrong }) => (
  <svg viewBox="0 0 100 120" className="w-32 h-40 text-gray-700">
    <line x1="20" y1="115" x2="80" y2="115" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="50" y1="115" x2="50" y2="15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="50" y1="15" x2="75" y2="15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="75" y1="15" x2="75" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    {wrong > 0 && <circle cx="75" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="3" />}
    {wrong > 1 && <line x1="75" y1="50" x2="75" y2="78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
    {wrong > 2 && <line x1="75" y1="58" x2="58" y2="70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
    {wrong > 3 && <line x1="75" y1="58" x2="92" y2="70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
    {wrong > 4 && <line x1="75" y1="78" x2="60" y2="98" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
    {wrong > 5 && <line x1="75" y1="78" x2="90" y2="98" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
  </svg>
);

export default function PlayHangman() {
  const navigate = useNavigate();
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [roundResult, setRoundResult] = useState(null);

  const items = activity?.content?.items || [];
  const currentWord = items[currentIndex]?.word || "";
  const currentHint = items[currentIndex]?.hint || "";
  const cleanWord = currentWord.replace(/\s/g, "");
  const uniqueLetters = [...new Set(cleanWord.split(""))];
  const correctGuesses = uniqueLetters.filter(l => guessed.includes(l)).length;
  const wordFound = uniqueLetters.length > 0 && correctGuesses === uniqueLetters.length;
  const lost = wrong >= 6;

  useEffect(() => {
    if (wordFound || lost) {
      if (wordFound) setScore(s => s + 1);
      setRoundResult(wordFound ? "win" : "lose");
    }
  }, [wordFound, lost]);

  useEffect(() => {
    if (roundResult) {
      const t = setTimeout(() => {
        if (currentIndex < items.length - 1) {
          setCurrentIndex(i => i + 1);
          setGuessed([]);
          setWrong(0);
          setRoundResult(null);
        } else {
          setFinished(true);
        }
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [roundResult, currentIndex, items.length]);

  const handleGuess = (letter) => {
    if (guessed.includes(letter) || roundResult) return;
    setGuessed([...guessed, letter]);
    if (!cleanWord.includes(letter)) setWrong(w => w + 1);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setGuessed([]);
    setWrong(0);
    setScore(0);
    setFinished(false);
    setRoundResult(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
      </div>
    );
  }

  if (!activity || !items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")}>بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">پایان بازی! 🎉</h2>
            <p className="text-xl text-gray-600 mb-4">کلمات حدس زده شده:</p>
            <div className="text-5xl font-bold text-red-600 mb-8">{score}/{items.length}</div>
            <div className="flex gap-3">
              <Button onClick={resetGame} className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl clay-element"><RotateCw className="w-5 h-5 ml-2" />شروع دوباره</Button>
              <Button onClick={() => navigate(isDemo ? '/' : '/Dashboard')} variant="outline" className="flex-1 rounded-xl clay-element">بازگشت</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => navigate(isDemo ? '/' : '/Dashboard')} variant="outline" className="rounded-xl clay-element"><ArrowRight className="w-5 h-5 ml-2" />بازگشت</Button>
          {isDemo && <Button onClick={() => saveActivity()} disabled={saving} className="bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-xl px-4 py-2 font-bold text-sm"><Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}</Button>}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title}</h1>
            <p className="text-gray-600">امتیاز: {score}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <HangmanSVG wrong={wrong} />
          <div className="text-3xl font-bold tracking-[0.3em] text-gray-800 text-center" dir="ltr">{cleanWord.split("").map(l => guessed.includes(l) ? l : "_").join(" ")}</div>
          <p className="text-lg text-orange-600 font-medium">راهنما: {currentHint}</p>
          <p className="text-sm text-red-500">خطاها: {wrong}/6</p>

          <div className="bg-white/60 clay-element rounded-2xl p-4 w-full">
            <div className="flex flex-wrap justify-center gap-1.5">
              {PERSIAN_ALPHABET.map(letter => {
                const used = guessed.includes(letter);
                const isCorrect = used && cleanWord.includes(letter);
                return (
                  <button key={letter} onClick={() => handleGuess(letter)} disabled={used || roundResult}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      used ? (isCorrect ? "bg-green-200 text-green-700" : "bg-red-200 text-red-500") : "bg-white hover:bg-orange-100 text-gray-700 shadow-sm"
                    }`}>
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {roundResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
                <Card className={`clay-element border-0 p-6 text-center ${roundResult === "win" ? "bg-green-100" : "bg-red-100"}`}>
                  <p className="text-2xl font-bold mb-2">{roundResult === "win" ? "🎉 کلمه را پیدا کردی!" : "😞 متاسفانه درست نشد"}</p>
                  {roundResult === "lose" && <p className="text-lg text-gray-700">کلمه: {currentWord}</p>}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

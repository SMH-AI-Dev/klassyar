import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, Trophy, RotateCw, Lightbulb } from "lucide-react";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayUnjumble() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  const shuffleWord = (word) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const currentWord = activity.content.words[currentWordIndex];
    const correct = userAnswer.trim().toLowerCase() === currentWord.word.toLowerCase();
    
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentWordIndex < activity.content.words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setUserAnswer("");
        setIsCorrect(null);
        setShowHint(false);
      } else {
        setIsComplete(true);
      }
    }, 1500);
  };

  const skipWord = () => {
    if (currentWordIndex < activity.content.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserAnswer("");
      setIsCorrect(null);
      setShowHint(false);
    } else {
      setIsComplete(true);
    }
  };

  const restartGame = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setUserAnswer("");
    setIsCorrect(null);
    setIsComplete(false);
    setShowHint(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.words?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد یا کلمه‌ای وجود ندارد</p>
          <Button onClick={() => navigate("/Dashboard")} className="rounded-xl clay-element">
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / activity.content.words.length) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="clay-element bg-gradient-to-br from-teal-50 to-green-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Trophy className="w-20 h-20 md:w-24 md:h-24 text-teal-500 mx-auto mb-6" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                تبریک! تمام شد
              </h2>
              
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-gray-600 mb-2">امتیاز شما:</p>
                <p className="text-5xl font-bold text-teal-600">
                  {score}/{activity.content.words.length}
                </p>
                <p className="text-2xl font-bold text-teal-500 mt-2">{percentage}%</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={restartGame}
                  className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-xl clay-element px-8 py-6 text-lg"
                >
                  شروع مجدد
                </Button>
                <Button
                  onClick={() => navigate("/Dashboard")}
                  variant="outline"
                  className="rounded-xl clay-element px-8 py-6 text-lg"
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                  بازگشت به داشبورد
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentWord = activity.content.words[currentWordIndex];
  const jumbledWord = shuffleWord(currentWord.word);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <RandomAnimations />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/Dashboard")}
              variant="outline"
              size="icon"
              className="rounded-xl clay-element"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{activity.title}</h1>
              {activity.description && (
                <p className="text-gray-600 mt-1">{activity.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white clay-element rounded-xl px-4 py-2">
              <p className="text-sm text-gray-600">امتیاز</p>
              <p className="text-xl font-bold text-teal-600">{score}</p>
            </div>
            <div className="bg-white clay-element rounded-xl px-4 py-2">
              <p className="text-sm text-gray-600">کلمه</p>
              <p className="text-xl font-bold text-gray-800">
                {currentWordIndex + 1}/{activity.content.words.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentWordIndex + 1) / activity.content.words.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-teal-400 to-green-400"
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Word Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWordIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="clay-element bg-gradient-to-br from-teal-50 to-green-50 border-0">
              <CardContent className="p-8 md:p-12">
                {/* Hint */}
                {currentWord.hint && (
                  <div className="mb-6 text-center">
                    <Button
                      onClick={() => setShowHint(!showHint)}
                      variant="outline"
                      className="rounded-xl clay-element"
                    >
                      <Lightbulb className="w-4 h-4 ml-2" />
                      {showHint ? 'پنهان کردن راهنما' : 'نمایش راهنما'}
                    </Button>
                    <AnimatePresence>
                      {showHint && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-gray-600 mt-4"
                        >
                          {currentWord.hint}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Jumbled Word */}
                <div className="mb-8 text-center">
                  <p className="text-gray-600 mb-4 text-lg">حروف را مرتب کنید:</p>
                  <div className="flex justify-center gap-2 mb-8 flex-wrap">
                    {jumbledWord.split('').map((letter, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-teal-400 to-green-400 rounded-xl clay-element flex items-center justify-center text-white text-2xl md:text-3xl font-bold"
                      >
                        {letter}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="max-w-md mx-auto mb-8">
                  <Input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    disabled={isCorrect !== null}
                    placeholder="پاسخ خود را وارد کنید..."
                    className="text-center text-2xl p-6 rounded-xl clay-element border-2 border-teal-200 focus:border-teal-400"
                  />
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {isCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-8 text-center"
                    >
                      <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-element ${
                        isCorrect
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                        <p className="text-lg font-bold">
                          {isCorrect ? '✓ صحیح!' : `✗ اشتباه! پاسخ: ${currentWord.word}`}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim() || isCorrect !== null}
                    className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-xl clay-element px-8 py-6 text-lg"
                  >
                    <Check className="w-5 h-5 ml-2" />
                    بررسی
                  </Button>
                  <Button
                    onClick={skipWord}
                    disabled={isCorrect !== null}
                    variant="outline"
                    className="rounded-xl clay-element px-8 py-6 text-lg"
                  >
                    <RotateCw className="w-5 h-5 ml-2" />
                    رد کردن
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

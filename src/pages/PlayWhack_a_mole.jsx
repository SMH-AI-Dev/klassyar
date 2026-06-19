import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayWhack_a_mole() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id');
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [activeMoles, setActiveMoles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const gameIntervalRef = useRef(null);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setIsComplete(true);
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    }
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setIsComplete(false);
    setActiveMoles([]);

    gameIntervalRef.current = setInterval(() => {
      const numMoles = Math.floor(Math.random() * 3) + 1;
      const newMoles = [];
      for (let i = 0; i < numMoles; i++) {
        const randomIndex = Math.floor(Math.random() * 9);
        if (!newMoles.includes(randomIndex)) {
          newMoles.push(randomIndex);
        }
      }
      setActiveMoles(newMoles);
    }, 1000);
  };

  const whackMole = (index) => {
    if (activeMoles.includes(index)) {
      setScore(score + 1);
      setActiveMoles(activeMoles.filter(m => m !== index));
    }
  };

  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate("/Dashboard")} className="rounded-xl clay-element">
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="clay-element bg-gradient-to-br from-red-50 to-orange-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Trophy className="w-20 h-20 md:w-24 md:h-24 text-red-500 mx-auto mb-6" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                تبریک! بازی تمام شد
              </h2>
              
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-gray-600 mb-2">امتیاز نهایی:</p>
                <p className="text-5xl font-bold text-red-600">{score}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl clay-element px-8 py-6 text-lg"
                >
                  بازی مجدد
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
          
          {isPlaying && (
            <div className="flex items-center gap-4">
              <div className="bg-white clay-element rounded-xl px-4 py-2">
                <p className="text-sm text-gray-600">امتیاز</p>
                <p className="text-xl font-bold text-red-600">{score}</p>
              </div>
              <div className="bg-white clay-element rounded-xl px-4 py-2">
                <p className="text-sm text-gray-600">زمان</p>
                <p className="text-xl font-bold text-gray-800">{timeLeft}s</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Game Area */}
        <Card className="clay-element bg-gradient-to-br from-red-50 to-orange-50 border-0">
          <CardContent className="p-8 md:p-12">
            {!isPlaying ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  آماده برای بازی؟
                </h2>
                <p className="text-gray-600 mb-8">
                  موش‌ها را بزن و امتیاز کسب کن! شما 60 ثانیه وقت دارید.
                </p>
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg px-12 py-6 rounded-2xl clay-element"
                >
                  شروع بازی
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <motion.button
                    key={index}
                    onClick={() => whackMole(index)}
                    className={`aspect-square rounded-2xl clay-element transition-all ${
                      activeMoles.includes(index)
                        ? 'bg-gradient-to-br from-red-400 to-orange-400'
                        : 'bg-gradient-to-br from-gray-200 to-gray-300'
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence>
                      {activeMoles.includes(index) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center justify-center h-full"
                        >
                          <span className="text-4xl">🐹</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

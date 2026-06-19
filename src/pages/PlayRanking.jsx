import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayRanking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');
  
  const [items, setItems] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      const found = activities.find(a => a.id === activityId);
      if (found && found.content?.items) {
        const shuffled = [...found.content.items].sort(() => Math.random() - 0.5);
        setItems(shuffled);
      }
      return found;
    },
  });

  const moveItem = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) {
      return;
    }
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
  };

  const checkAnswer = () => {
    const correct = items.every((item, index) => item === activity.content.items[index]);
    const correctCount = items.filter((item, index) => item === activity.content.items[index]).length;
    setScore(correctCount);
    setIsComplete(true);
  };

  const restartGame = () => {
    const shuffled = [...activity.content.items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setIsComplete(false);
    setScore(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.items?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد یا آیتمی وجود ندارد</p>
          <Button onClick={() => navigate("/Dashboard")} className="rounded-xl clay-element">
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / activity.content.items.length) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="clay-element bg-gradient-to-br from-sky-50 to-blue-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Trophy className="w-20 h-20 md:w-24 md:h-24 text-sky-500 mx-auto mb-6" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {percentage === 100 ? 'عالی! همه درست بود!' : 'تمام شد!'}
              </h2>
              
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-gray-600 mb-2">امتیاز شما:</p>
                <p className="text-5xl font-bold text-sky-600">
                  {score}/{activity.content.items.length}
                </p>
                <p className="text-2xl font-bold text-sky-500 mt-2">{percentage}%</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={restartGame}
                  className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white rounded-xl clay-element px-8 py-6 text-lg"
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <RandomAnimations />
      <div className="max-w-4xl mx-auto">
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
        </motion.div>

        <Card className="clay-element bg-gradient-to-br from-sky-50 to-blue-50 border-0">
          <CardContent className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                آیتم‌ها را به ترتیب صحیح مرتب کنید
              </h2>
              <p className="text-gray-600">
                با کشیدن و رها کردن، ترتیب را تغییر دهید
              </p>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 clay-element"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <Button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === items.length - 1}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1 text-lg font-medium text-gray-800">
                      {item}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={checkAnswer}
                className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white rounded-xl clay-element px-8 py-6 text-lg"
              >
                بررسی جواب
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

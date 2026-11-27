import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/hooks/useGameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw, Save } from "lucide-react";
import { motion } from "framer-motion";
import RandomAnimations from "@/components/shared/RandomAnimations";
import ActivityResultReporter from "@/lib/ActivityResultReporter";

export default function PlayGroup_sort() {
  const navigate = useNavigate();

  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();

  const [items, setItems] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userAssignments, setUserAssignments] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeExpired, setTimeExpired] = useState(false);

  useEffect(() => {
    if (activity?.content?.items) {
      setItems([...activity.content.items].sort(() => Math.random() - 0.5));
    }
  }, [activity]);

  useEffect(() => {
    if (activity?.type !== "speed_sorting" || isComplete) return;
    setTimeLeft(activity.content.timeLimit || 60);
    const timer = setInterval(() => {
      setTimeLeft((remaining) => {
        if (remaining <= 1) {
          clearInterval(timer);
          setTimeExpired(true);
          setIsComplete(true);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activity?.id, activity?.type, activity?.content?.timeLimit, isComplete]);

  const handleItemClick = (itemIndex) => {
    if (selectedGroup !== null && !userAssignments[itemIndex]) {
      const nextAssignments = { ...userAssignments, [itemIndex]: selectedGroup };
      setUserAssignments(nextAssignments);
      const allAssigned = Object.keys(nextAssignments).length === items.length;
      if (allAssigned) setTimeout(() => checkAnswers(nextAssignments), 300);
    }
  };

  const checkAnswers = (assignments = userAssignments) => {
    const correct = items.filter((item, index) => assignments[index] === item.group).length;
    if (correct === items.length || activity?.type === "speed_sorting") setIsComplete(true);
  };

  const correctCount = items.filter((item, index) => userAssignments[index] === item.group).length;

  const resetGame = () => {
    if (activity?.content?.items) {
      setItems([...activity.content.items].sort(() => Math.random() - 0.5));
      setSelectedGroup(null);
      setUserAssignments({});
      setIsComplete(false); setTimeExpired(false); setTimeLeft(activity?.content?.timeLimit || 60);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.groups || !activity.content?.items) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate(isDemo ? "/" : "/Dashboard")}>بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center">
        <ActivityResultReporter activity={activity} score={correctCount} total={items.length} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{correctCount === items.length ? "عالی! 🎉" : timeExpired ? "زمان تمام شد ⏱️" : "پایان بازی"}</h2>
            <p className="text-xl text-gray-600 mb-8">{correctCount} از {items.length} مورد را درست دسته‌بندی کردید.</p>
            <div className="flex gap-3">
              <Button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl clay-element"
              >
                <RotateCw className="w-5 h-5 ml-2" />
                شروع دوباره
              </Button>
              <Button
                onClick={() => navigate(isDemo ? "/" : "/Dashboard")}
                variant="outline"
                className="flex-1 rounded-xl clay-element"
              >
                بازگشت
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <RandomAnimations />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate(isDemo ? "/" : "/Dashboard")}
            variant="outline"
            className="rounded-xl clay-element"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت
          </Button>
          {isDemo && (
            <Button onClick={() => saveActivity()} disabled={saving}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-xl clay-element px-4 py-2 font-bold text-sm">
              <Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}
            </Button>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title}</h1>
            {activity.type === "speed_sorting" && <p className="text-sm font-bold text-rose-600">زمان باقی‌مانده: {timeLeft} ثانیه</p>}
            <p className="text-gray-600">
              {Object.keys(userAssignments).length} از {items.length} دسته‌بندی شده
            </p>
          </div>
          <Button
            onClick={resetGame}
            variant="outline"
            className="rounded-xl clay-element"
          >
            <RotateCw className="w-5 h-5 ml-2" />
            شروع دوباره
          </Button>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">گروه مورد نظر را انتخاب کنید:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {activity.content.groups.map((group, index) => (
              <Button
                key={index}
                onClick={() => setSelectedGroup(group.name)}
                variant={selectedGroup === group.name ? "default" : "outline"}
                className={`h-16 rounded-2xl clay-element ${
                  selectedGroup === group.name
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                    : ''
                }`}
              >
                <span className="text-2xl ml-2">{group.icon || "📊"}</span>
                {group.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => handleItemClick(index)}
              disabled={userAssignments[index] !== undefined}
              whileHover={{ scale: userAssignments[index] ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-2xl clay-element transition-all ${
                userAssignments[index]
                  ? 'bg-green-200 opacity-70'
                  : selectedGroup
                  ? 'bg-white hover:bg-pink-50 cursor-pointer'
                  : 'bg-gray-100 cursor-not-allowed'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{item.icon || "📌"}</div>
                <p className="text-sm font-medium">{item.text}</p>
                {userAssignments[index] && (
                  <p className="text-xs text-green-700 mt-2">{userAssignments[index]}</p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

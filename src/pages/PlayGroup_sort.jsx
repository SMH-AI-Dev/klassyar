import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayGroup_sort() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id');

  const [items, setItems] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userAssignments, setUserAssignments] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  useEffect(() => {
    if (activity?.content?.items) {
      setItems([...activity.content.items].sort(() => Math.random() - 0.5));
    }
  }, [activity]);

  const handleItemClick = (itemIndex) => {
    if (selectedGroup !== null && !userAssignments[itemIndex]) {
      setUserAssignments({...userAssignments, [itemIndex]: selectedGroup});
      
      const allAssigned = Object.keys(userAssignments).length + 1 === items.length;
      if (allAssigned) {
        setTimeout(() => checkAnswers(), 500);
      }
    }
  };

  const checkAnswers = () => {
    let correct = 0;
    items.forEach((item, index) => {
      if (userAssignments[index] === item.group) correct++;
    });
    
    if (correct === items.length) {
      setIsComplete(true);
    }
  };

  const resetGame = () => {
    if (activity?.content?.items) {
      setItems([...activity.content.items].sort(() => Math.random() - 0.5));
      setSelectedGroup(null);
      setUserAssignments({});
      setIsComplete(false);
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
          <Button onClick={() => navigate("/Dashboard")}>بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">عالی! 🎉</h2>
            <p className="text-xl text-gray-600 mb-8">همه موارد را درست دسته‌بندی کردید!</p>
            <div className="flex gap-3">
              <Button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl clay-element"
              >
                <RotateCw className="w-5 h-5 ml-2" />
                شروع دوباره
              </Button>
              <Button
                onClick={() => navigate("/Dashboard")}
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
            onClick={() => navigate("/Dashboard")}
            variant="outline"
            className="rounded-xl clay-element"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title}</h1>
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

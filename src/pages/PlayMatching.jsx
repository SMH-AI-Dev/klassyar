import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayMatching() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id');

  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  useEffect(() => {
    if (activity?.content?.pairs) {
      const left = activity.content.pairs.map((p, i) => ({ ...p.left, index: i }));
      const right = [...activity.content.pairs.map((p, i) => ({ ...p.right, index: i }))].sort(() => Math.random() - 0.5);
      setLeftItems(left);
      setRightItems(right);
    }
  }, [activity]);

  const handleLeftClick = (index) => {
    if (!matched.includes(index)) {
      setSelectedLeft(index);
      checkMatch(index, selectedRight);
    }
  };

  const handleRightClick = (index) => {
    if (!matched.includes(index)) {
      setSelectedRight(index);
      checkMatch(selectedLeft, index);
    }
  };

  const checkMatch = (left, right) => {
    if (left !== null && right !== null) {
      if (left === right) {
        setMatched([...matched, left]);
        setSelectedLeft(null);
        setSelectedRight(null);
        
        if (matched.length + 1 === activity.content.pairs.length) {
          setIsComplete(true);
        }
      } else {
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    if (activity?.content?.pairs) {
      const left = activity.content.pairs.map((p, i) => ({ ...p.left, index: i }));
      const right = [...activity.content.pairs.map((p, i) => ({ ...p.right, index: i }))].sort(() => Math.random() - 0.5);
      setLeftItems(left);
      setRightItems(right);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatched([]);
      setIsComplete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.pairs) {
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
      <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آفرین! 🎉</h2>
            <p className="text-xl text-gray-600 mb-8">همه جفت‌ها را پیدا کردید!</p>
            <div className="flex gap-3">
              <Button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl clay-element"
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
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
              {matched.length} از {activity.content.pairs.length} جفت پیدا شده
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

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            {leftItems.map((item) => (
              <motion.button
                key={item.index}
                onClick={() => handleLeftClick(item.index)}
                disabled={matched.includes(item.index)}
                whileHover={{ scale: matched.includes(item.index) ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-2xl clay-element text-right transition-all ${
                  matched.includes(item.index)
                    ? 'bg-green-200 opacity-50'
                    : selectedLeft === item.index
                    ? 'bg-blue-200 ring-4 ring-blue-400'
                    : 'bg-white hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon || "🧩"}</span>
                  <span className="text-lg font-medium">{item.text}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="space-y-3">
            {rightItems.map((item) => (
              <motion.button
                key={item.index}
                onClick={() => handleRightClick(item.index)}
                disabled={matched.includes(item.index)}
                whileHover={{ scale: matched.includes(item.index) ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-2xl clay-element text-right transition-all ${
                  matched.includes(item.index)
                    ? 'bg-green-200 opacity-50'
                    : selectedRight === item.index
                    ? 'bg-blue-200 ring-4 ring-blue-400'
                    : 'bg-white hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon || "🧩"}</span>
                  <span className="text-lg font-medium">{item.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

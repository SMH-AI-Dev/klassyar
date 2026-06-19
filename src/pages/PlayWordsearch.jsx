import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayWordsearch() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id');

  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  const generateGrid = (words) => {
    const size = 12;
    const grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const letters = 'آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی';
    
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        
        if (canPlace(grid, word, row, col, direction, size)) {
          placeWord(grid, word, row, col, direction);
          placed = true;
        }
        attempts++;
      }
    });

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!grid[i][j]) {
          grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    
    return grid;
  };

  const canPlace = (grid, word, row, col, direction, size) => {
    if (direction === 'horizontal') {
      if (col + word.length > size) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] && grid[row][col + i] !== word[i]) return false;
      }
    } else {
      if (row + word.length > size) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] && grid[row + i][col] !== word[i]) return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    if (direction === 'horizontal') {
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col] = word[i];
      }
    }
  };

  const [grid, setGrid] = useState([]);

  useEffect(() => {
    if (activity?.content?.words) {
      setGrid(generateGrid(activity.content.words));
    }
  }, [activity]);

  const resetGame = () => {
    if (activity?.content?.words) {
      setGrid(generateGrid(activity.content.words));
      setFoundWords([]);
      setSelectedCells([]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.words) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate("/Dashboard")}>بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  const isComplete = foundWords.length === activity.content.words.length;

  if (isComplete) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آفرین! 🎉</h2>
            <p className="text-xl text-gray-600 mb-8">همه کلمات را پیدا کردید!</p>
            <div className="flex gap-3">
              <Button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl clay-element"
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
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
              {foundWords.length} از {activity.content.words.length} کلمه پیدا شده
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="clay-element bg-white border-0 p-4">
              <div className="inline-grid gap-1">
                {grid.map((row, i) => (
                  <div key={i} className="flex gap-1">
                    {row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 clay-element flex items-center justify-center font-bold text-sm md:text-base cursor-pointer hover:bg-indigo-200 transition-colors"
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="clay-element bg-white border-0 p-4">
              <h3 className="font-bold text-lg mb-4">کلمات:</h3>
              <div className="space-y-2">
                {activity.content.words.map((word, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${
                      foundWords.includes(word)
                        ? 'bg-green-200 line-through text-gray-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

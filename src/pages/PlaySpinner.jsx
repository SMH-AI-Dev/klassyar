import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCw } from "lucide-react";

export default function PlaySpinner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');
  
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [themeIndex, setThemeIndex] = useState(0);
  const [spinDuration, setSpinDuration] = useState(3200);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  const spinSpinner = () => {
    if (isSpinning || !activity?.content?.items?.length) return;

    setIsSpinning(true);
    setSelectedItem(null);

    const items = activity.content.items;
    const itemCount = items.length;
    const degreesPerItem = 360 / itemCount;
    const randomIndex = Math.floor(Math.random() * itemCount);
    const extraSpins = 3 + Math.floor(Math.random() * 3);
    const spinOffset = degreesPerItem / 2;

    const newTheme = Math.floor(Math.random() * spinnerThemes.length);
    setThemeIndex(newTheme);
    const newDuration = 2800 + Math.floor(Math.random() * 1000);
    setSpinDuration(newDuration);

    const finalRotation = rotation + (360 * extraSpins) - (randomIndex * degreesPerItem + spinOffset);
    setRotation(finalRotation);
    setSelectedIndex(randomIndex);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedItem(items[randomIndex]);
    }, newDuration);
  };

  const resetSpinner = () => {
    setRotation(0);
    setSelectedItem(null);
    setSelectedIndex(null);
    setIsSpinning(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.items?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد یا گزینه‌ای وجود ندارد</p>
          <Button onClick={() => navigate("/Dashboard")} className="rounded-xl clay-element">
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  const spinnerThemes = [
    {
      colors: [
        'from-emerald-400 to-teal-400',
        'from-cyan-400 to-sky-500',
        'from-slate-400 to-slate-600',
        'from-lime-400 to-emerald-500',
        'from-fuchsia-400 to-pink-500',
        'from-yellow-400 to-orange-400',
      ],
      pointer: '#059669',
      ring: '#134e4a',
      background: 'from-emerald-50 to-teal-50',
    },
    {
      colors: [
        'from-blue-400 to-cyan-400',
        'from-indigo-400 to-purple-500',
        'from-sky-400 to-blue-500',
        'from-fuchsia-400 to-violet-500',
        'from-pink-400 to-rose-500',
        'from-slate-400 to-slate-500',
      ],
      pointer: '#0f172a',
      ring: '#312e81',
      background: 'from-sky-50 to-blue-50',
    },
    {
      colors: [
        'from-orange-400 to-red-400',
        'from-yellow-400 to-amber-400',
        'from-rose-400 to-pink-500',
        'from-red-400 to-rose-500',
        'from-amber-400 to-orange-500',
        'from-slate-400 to-slate-500',
      ],
      pointer: '#b91c1c',
      ring: '#7c2d12',
      background: 'from-amber-50 to-orange-50',
    },
    {
      colors: [
        'from-purple-400 to-pink-400',
        'from-violet-400 to-indigo-500',
        'from-fuchsia-400 to-purple-500',
        'from-slate-400 to-slate-500',
        'from-cyan-400 to-blue-400',
        'from-emerald-400 to-teal-400',
      ],
      pointer: '#8b5cf6',
      ring: '#4c1d95',
      background: 'from-violet-50 to-fuchsia-50',
    },
  ];

  const theme = spinnerThemes[themeIndex] || spinnerThemes[0];
  const items = activity.content.items;
  const itemCount = items.length;
  const degreesPerItem = 360 / itemCount;
  const selectedSegmentCenter = selectedIndex !== null ? {
    x: 50 + 35 * Math.cos(((selectedIndex * degreesPerItem - 90 + degreesPerItem / 2) * Math.PI) / 180),
    y: 50 + 35 * Math.sin(((selectedIndex * degreesPerItem - 90 + degreesPerItem / 2) * Math.PI) / 180),
  } : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen p-4 md:p-8">
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
          <Button
            onClick={resetSpinner}
            variant="outline"
            size="icon"
            className="rounded-xl clay-element"
          >
            <RotateCw className="w-5 h-5" />
          </Button>
        </motion.div>

        <Card className={`clay-element bg-gradient-to-br ${theme.background} border-0`}>
          <CardContent className="p-8">
            <div className="flex flex-col items-center">
              {/* Spinner */}
              <div className="relative w-80 h-80 mb-8">
                <motion.div
                  className="w-full h-full"
                  animate={{ rotate: rotation }}
                  transition={{ duration: spinDuration / 1000, ease: "easeOut" }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {activity.content.items.map((item, index) => {
                      const angle = (360 / activity.content.items.length) * index;
                      const nextAngle = (360 / activity.content.items.length) * (index + 1);
                      const startX = 50 + 50 * Math.cos((angle - 90) * Math.PI / 180);
                      const startY = 50 + 50 * Math.sin((angle - 90) * Math.PI / 180);
                      const endX = 50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180);
                      const endY = 50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180);
                      const isSelected = index === selectedIndex;
                      return (
                        <path
                          key={index}
                          d={`M 50 50 L ${startX} ${startY} A 50 50 0 0 1 ${endX} ${endY} Z`}
                          className={`fill-gradient-to-br ${theme.colors[index % theme.colors.length]}`}
                          style={{
                            fill: `url(#gradient${index})`,
                            stroke: 'white',
                            strokeWidth: isSelected ? 3 : 2,
                            opacity: isSelected ? 1 : 0.92,
                          }}
                        />
                      );
                    })}
                    <defs>
                      {activity.content.items.map((item, index) => (
                        <linearGradient key={index} id={`gradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={`hsl(${(index * 360 / activity.content.items.length)}, 70%, 60%)`} />
                          <stop offset="100%" stopColor={`hsl(${(index * 360 / activity.content.items.length) + 30}, 70%, 50%)`} />
                        </linearGradient>
                      ))}
                    </defs>
                    <circle cx="50" cy="50" r="8" fill="white" stroke="#333" strokeWidth="2" />
                    {selectedSegmentCenter && (
                      <motion.circle
                        cx={selectedSegmentCenter.x}
                        cy={selectedSegmentCenter.y}
                        r="18"
                        fill="none"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth="3"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.9, 0.2, 0.9] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </svg>
                </motion.div>
                
                {/* Arrow pointer */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10"
                  animate={isSpinning ? { y: [0, 6, 0] } : { y: 0 }}
                  transition={{ duration: 0.8, repeat: isSpinning ? Infinity : 0, ease: 'easeInOut' }}
                >
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[35px] drop-shadow-lg"
                    style={{ borderTopColor: theme.pointer }}
                  />
                </motion.div>
              </div>

              {/* Selected Result */}
              <AnimatePresence>
                {selectedItem && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mb-6"
                  >
                    <Card className="clay-element bg-gradient-to-br from-emerald-400 to-teal-400 border-0">
                      <CardContent className="p-6 text-center">
                        <p className="text-white text-lg font-bold mb-2">نتیجه:</p>
                        <p className="text-white text-2xl font-bold">{selectedItem}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spin Button */}
              <Button
                onClick={spinSpinner}
                disabled={isSpinning}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg px-12 py-6 rounded-2xl clay-element"
              >
                {isSpinning ? 'در حال چرخش...' : 'چرخش فلک'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

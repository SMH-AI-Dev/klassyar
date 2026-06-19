import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCw } from "lucide-react";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayRandom_wheel() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [wheelStyle, setWheelStyle] = useState(0);
  const [spinDuration, setSpinDuration] = useState(4200);
  const wheelRef = useRef(null);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  const spinWheel = () => {
    if (isSpinning || !activity?.content?.items?.length) return;
    setIsSpinning(true);
    setSelectedItem(null);

    const items = activity.content.items;
    const itemCount = items.length;
    const degreesPerItem = 360 / itemCount;
    const randomIndex = Math.floor(Math.random() * itemCount);
    const extraSpins = 4 + Math.floor(Math.random() * 3);
    const spinOffset = degreesPerItem / 2;

    // انتخاب تصادفی طرح رنگی و مدت زمان چرخش
    const randomStyle = Math.floor(Math.random() * colorSchemesHex.length);
    setWheelStyle(randomStyle);
    const newDuration = 3600 + Math.floor(Math.random() * 1200);
    setSpinDuration(newDuration);

    const finalRotation = rotation + (360 * extraSpins) - (randomIndex * degreesPerItem + spinOffset);
    setRotation(finalRotation);
    setSelectedIndex(randomIndex);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedItem(items[randomIndex]);
    }, newDuration);
  };

  const resetWheel = () => {
    setRotation(0);
    setSelectedItem(null);
    setSelectedIndex(null);
    setIsSpinning(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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

  // رنگ‌های واقعی برای SVG
  const colorSchemesHex = [
    // طرح 1: بنفش و کرم متناوب (مثل چرخ اول تصویر)
    [
      { from: '#7c3aed', to: '#5b21b6' }, // purple dark
      { from: '#fef3c7', to: '#fde68a' }, // amber light
      { from: '#7c3aed', to: '#5b21b6' }, // purple dark
      { from: '#fef3c7', to: '#fde68a' }, // amber light
      { from: '#7c3aed', to: '#5b21b6' }, // purple dark
      { from: '#fef3c7', to: '#fde68a' }, // amber light
      { from: '#7c3aed', to: '#5b21b6' }, // purple dark
      { from: '#fef3c7', to: '#fde68a' }, // amber light
    ],
    // طرح 2: قرمز با اعداد (مثل چرخ دوم)
    [
      { from: '#dc2626', to: '#991b1b' }, // red dark
      { from: '#f59e0b', to: '#d97706' }, // amber
      { from: '#eab308', to: '#ca8a04' }, // yellow
      { from: '#06b6d4', to: '#0891b2' }, // cyan
      { from: '#3b82f6', to: '#1d4ed8' }, // blue
      { from: '#ec4899', to: '#be185d' }, // pink
      { from: '#10b981', to: '#047857' }, // green
      { from: '#f97316', to: '#c2410c' }, // orange
    ],
    // طرح 3: رنگین‌کمان کلاسیک 8 رنگ
    [
      { from: '#ef4444', to: '#dc2626' }, // red
      { from: '#f97316', to: '#ea580c' }, // orange
      { from: '#eab308', to: '#ca8a04' }, // yellow
      { from: '#22c55e', to: '#16a34a' }, // green
      { from: '#06b6d4', to: '#0891b2' }, // cyan
      { from: '#3b82f6', to: '#2563eb' }, // blue
      { from: '#8b5cf6', to: '#7c3aed' }, // violet
      { from: '#ec4899', to: '#db2777' }, // pink
    ],
    // طرح 4: نارنجی و زرد تناوبی
    [
      { from: '#f97316', to: '#ea580c' }, // orange
      { from: '#fbbf24', to: '#f59e0b' }, // amber
      { from: '#f97316', to: '#ea580c' }, // orange
      { from: '#fbbf24', to: '#f59e0b' }, // amber
      { from: '#f97316', to: '#ea580c' }, // orange
      { from: '#fbbf24', to: '#f59e0b' }, // amber
      { from: '#f97316', to: '#ea580c' }, // orange
      { from: '#fbbf24', to: '#f59e0b' }, // amber
    ],
    // طرح 5: سبز و زرد روشن (مثل چرخ سوم)
    [
      { from: '#fef08a', to: '#fde047' }, // yellow
      { from: '#a3e635', to: '#bef264' }, // lime
      { from: '#fbbf24', to: '#f59e0b' }, // amber
      { from: '#22c55e', to: '#16a34a' }, // green
      { from: '#fef08a', to: '#fde047' }, // yellow
      { from: '#34d399', to: '#10b981' }, // emerald
      { from: '#fbbf24', to: '#f59e0b' }, // amber
      { from: '#14b8a6', to: '#0d9488' }, // teal
    ],
    // طرح 6: آبی و سفید متناوب
    [
      { from: '#3b82f6', to: '#1d4ed8' }, // blue
      { from: '#f1f5f9', to: '#e2e8f0' }, // white/gray
      { from: '#3b82f6', to: '#1d4ed8' }, // blue
      { from: '#f1f5f9', to: '#e2e8f0' }, // white/gray
      { from: '#3b82f6', to: '#1d4ed8' }, // blue
      { from: '#f1f5f9', to: '#e2e8f0' }, // white/gray
      { from: '#3b82f6', to: '#1d4ed8' }, // blue
      { from: '#f1f5f9', to: '#e2e8f0' }, // white/gray
    ],
    // طرح 7: قرمز و زرد (مثل چرخ Wheels of Fortune)
    [
      { from: '#dc2626', to: '#991b1b' }, // red
      { from: '#eab308', to: '#ca8a04' }, // yellow
      { from: '#dc2626', to: '#991b1b' }, // red
      { from: '#eab308', to: '#ca8a04' }, // yellow
      { from: '#dc2626', to: '#991b1b' }, // red
      { from: '#eab308', to: '#ca8a04' }, // yellow
      { from: '#dc2626', to: '#991b1b' }, // red
      { from: '#eab308', to: '#ca8a04' }, // yellow
    ],
    // طرح 8: رنگین‌کمان پاستل 12 رنگ
    [
      { from: '#fecaca', to: '#fca5a5' }, // red pastel
      { from: '#fed7aa', to: '#fdba74' }, // orange pastel
      { from: '#fef08a', to: '#fde047' }, // yellow pastel
      { from: '#d9f99d', to: '#bef264' }, // lime pastel
      { from: '#bbf7d0', to: '#86efac' }, // green pastel
      { from: '#a7f3d0', to: '#6ee7b7' }, // emerald pastel
      { from: '#99f6e4', to: '#5eead4' }, // teal pastel
      { from: '#a5f3fc', to: '#67e8f9' }, // cyan pastel
      { from: '#bfdbfe', to: '#93c5fd' }, // blue pastel
      { from: '#c7d2fe', to: '#a5b4fc' }, // indigo pastel
      { from: '#ddd6fe', to: '#c4b5fd' }, // violet pastel
      { from: '#f5d0fe', to: '#f0abfc' }, // fuchsia pastel
    ],
    // طرح 9: سیاه و قرمز (Roulette style)
    [
      { from: '#1f2937', to: '#111827' }, // black
      { from: '#dc2626', to: '#991b1b' }, // red
      { from: '#1f2937', to: '#111827' }, // black
      { from: '#dc2626', to: '#991b1b' }, // red
      { from: '#1f2937', to: '#111827' }, // black
      { from: '#dc2626', to: '#991b1b' }, // red
      { from: '#1f2937', to: '#111827' }, // black
      { from: '#dc2626', to: '#991b1b' }, // red
    ],
    // طرح 10: طلایی با قهوه‌ای (q.10)
    [
      { from: '#fbbf24', to: '#d97706' }, // gold
      { from: '#92400e', to: '#78350f' }, // brown
      { from: '#fbbf24', to: '#d97706' }, // gold
      { from: '#92400e', to: '#78350f' }, // brown
      { from: '#fbbf24', to: '#d97706' }, // gold
      { from: '#92400e', to: '#78350f' }, // brown
      { from: '#fbbf24', to: '#d97706' }, // gold
      { from: '#92400e', to: '#78350f' }, // brown
    ],
  ];

  // تنظیمات ظاهری فریم، پین‌ها و نشانگر برای 10 طرح (q1 تا q10)
  const themeConfigs = [
    // 1: بنفش/کرم لوکس
    { ringOuter: '#7e22ce', ringInner: '#e9d5ff', pinFill: '#fef08a', pinStroke: '#f59e0b', pointer: '#a855f7' },
    // 2: زرد/طلایی با طیف رنگین (چرخ اعداد)
    { ringOuter: '#eab308', ringInner: '#fde68a', pinFill: '#fef3c7', pinStroke: '#f59e0b', pointer: '#f59e0b' },
    // 3: قاب قرمز کلاسیک بازی
    { ringOuter: '#ef4444', ringInner: '#fecaca', pinFill: '#fde68a', pinStroke: '#f59e0b', pointer: '#ef4444' },
    // 4: سرمه‌ای/زرد ساده
    { ringOuter: '#0f172a', ringInner: '#facc15', pinFill: '#facc15', pinStroke: '#eab308', pointer: '#0ea5e9' },
    // 5: قرمز/زرد کارتونی
    { ringOuter: '#dc2626', ringInner: '#fecaca', pinFill: '#fbbf24', pinStroke: '#f59e0b', pointer: '#f59e0b' },
    // 6: تم سبز/زرد روشن
    { ringOuter: '#16a34a', ringInner: '#bbf7d0', pinFill: '#fde68a', pinStroke: '#f59e0b', pointer: '#22c55e' },
    // 7: قرمز/زرد (WOF)
    { ringOuter: '#b91c1c', ringInner: '#fee2e2', pinFill: '#fde68a', pinStroke: '#eab308', pointer: '#ef4444' },
    // 8: پاستل رنگین
    { ringOuter: '#94a3b8', ringInner: '#e2e8f0', pinFill: '#f1f5f9', pinStroke: '#cbd5e1', pointer: '#a3a3a3' },
    // 9: مشکی/قرمز (Roulette)
    { ringOuter: '#111827', ringInner: '#4b5563', pinFill: '#f59e0b', pinStroke: '#b45309', pointer: '#ef4444' },
    // 10: طلایی/قهوه‌ای
    { ringOuter: '#b45309', ringInner: '#f59e0b', pinFill: '#fcd34d', pinStroke: '#a16207', pointer: '#f59e0b' },
  ];

  // طرح‌های مختلف رنگی برای چرخ (برای سایر بخش‌ها)
  const colorSchemes = [
    // طرح 1: رنگین‌کمان کلاسیک
    [
      'from-red-400 to-red-500',
      'from-orange-400 to-orange-500',
      'from-yellow-400 to-yellow-500',
      'from-lime-400 to-lime-500',
      'from-green-400 to-green-500',
      'from-emerald-400 to-emerald-500',
      'from-cyan-400 to-cyan-500',
      'from-blue-400 to-blue-500',
      'from-indigo-400 to-indigo-500',
      'from-violet-400 to-violet-500',
      'from-purple-400 to-purple-500',
      'from-fuchsia-400 to-fuchsia-500',
    ],
    // طرح 2: رنگین‌کمان پاستل
    [
      'from-red-200 to-red-300',
      'from-orange-200 to-orange-300',
      'from-amber-200 to-amber-300',
      'from-yellow-200 to-yellow-300',
      'from-lime-200 to-lime-300',
      'from-green-200 to-green-300',
      'from-emerald-200 to-emerald-300',
      'from-teal-200 to-teal-300',
      'from-cyan-200 to-cyan-300',
      'from-sky-200 to-sky-300',
      'from-blue-200 to-blue-300',
      'from-indigo-200 to-indigo-300',
    ],
    // طرح 3: رنگین‌کمان تیره
    [
      'from-red-500 to-red-600',
      'from-orange-500 to-orange-600',
      'from-amber-500 to-amber-600',
      'from-yellow-500 to-yellow-600',
      'from-green-500 to-green-600',
      'from-emerald-500 to-emerald-600',
      'from-cyan-500 to-cyan-600',
      'from-blue-500 to-blue-600',
      'from-indigo-500 to-indigo-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-rose-500 to-rose-600',
    ],
    // طرح 4: گرم کلاسیک
    [
      'from-red-400 to-rose-500',
      'from-orange-400 to-red-500',
      'from-amber-400 to-orange-500',
      'from-yellow-400 to-amber-500',
      'from-rose-400 to-pink-500',
      'from-pink-400 to-fuchsia-500',
      'from-orange-300 to-red-400',
      'from-amber-300 to-orange-400',
      'from-yellow-300 to-amber-400',
      'from-red-300 to-rose-400',
    ],
    // طرح 5: گرم پاستل
    [
      'from-red-200 to-rose-300',
      'from-orange-200 to-red-300',
      'from-amber-200 to-orange-300',
      'from-yellow-200 to-amber-300',
      'from-rose-200 to-pink-300',
      'from-pink-200 to-fuchsia-300',
      'from-orange-100 to-red-200',
      'from-amber-100 to-orange-200',
    ],
    // طرح 6: گرم تیره
    [
      'from-red-500 to-rose-600',
      'from-orange-500 to-red-600',
      'from-amber-500 to-orange-600',
      'from-yellow-500 to-amber-600',
      'from-rose-500 to-pink-600',
      'from-pink-500 to-fuchsia-600',
      'from-red-600 to-rose-700',
      'from-orange-600 to-red-700',
    ],
    // طرح 7: سرد کلاسیک
    [
      'from-blue-400 to-cyan-500',
      'from-cyan-400 to-teal-500',
      'from-teal-400 to-emerald-500',
      'from-sky-400 to-blue-500',
      'from-indigo-400 to-blue-500',
      'from-violet-400 to-indigo-500',
      'from-purple-400 to-violet-500',
      'from-emerald-400 to-teal-500',
      'from-cyan-300 to-blue-400',
      'from-blue-300 to-indigo-400',
    ],
    // طرح 8: سرد پاستل
    [
      'from-blue-200 to-cyan-300',
      'from-cyan-200 to-teal-300',
      'from-teal-200 to-emerald-300',
      'from-sky-200 to-blue-300',
      'from-indigo-200 to-blue-300',
      'from-violet-200 to-indigo-300',
      'from-blue-100 to-cyan-200',
      'from-cyan-100 to-teal-200',
    ],
    // طرح 9: سرد تیره
    [
      'from-blue-500 to-cyan-600',
      'from-cyan-500 to-teal-600',
      'from-teal-500 to-emerald-600',
      'from-sky-500 to-blue-600',
      'from-indigo-500 to-blue-600',
      'from-violet-500 to-indigo-600',
      'from-blue-600 to-cyan-700',
      'from-cyan-600 to-teal-700',
    ],
  ];
  
  const colorsHex = colorSchemesHex[wheelStyle];
  const theme = themeConfigs[wheelStyle] || themeConfigs[0];
  const items = activity.content.items;
  const itemCount = items.length;
  const degreesPerItem = 360 / itemCount;
  const selectedSegmentCenter = selectedIndex !== null ? {
    x: 200 + 120 * Math.cos(((selectedIndex * degreesPerItem - 90 + degreesPerItem / 2) * Math.PI) / 180),
    y: 200 + 120 * Math.sin(((selectedIndex * degreesPerItem - 90 + degreesPerItem / 2) * Math.PI) / 180),
  } : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen p-4 md:p-8">
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
              className="rounded-xl clay-element active:scale-95 transition-transform"
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
          
          {/* Color Theme Selector - مخفی شده */}
          {false && (
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setWheelStyle(0)}
              size="sm"
              className={`rounded-xl clay-element transition-all ${
                wheelStyle === 0 
                  ? 'bg-gradient-to-r from-purple-600 to-amber-300 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              بنفش-کرم
            </Button>
            <Button
              onClick={() => setWheelStyle(1)}
              size="sm"
              className={`rounded-xl clay-element transition-all ${
                wheelStyle === 1 
                  ? 'bg-gradient-to-r from-red-600 to-cyan-500 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              قرمز رنگارنگ
            </Button>
            <Button
              onClick={() => setWheelStyle(2)}
              size="sm"
              className={`rounded-xl clay-element transition-all ${
                wheelStyle === 2 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              رنگین‌کمان
            </Button>
            <Button
              onClick={() => setWheelStyle(3)}
              size="sm"
              className={`rounded-xl clay-element transition-all ${
                wheelStyle === 3 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              نارنجی-زرد
            </Button>
            <Button
              onClick={() => setWheelStyle(4)}
              size="sm"
              className={`rounded-xl clay-element transition-all ${
                wheelStyle === 4 
                  ? 'bg-gradient-to-r from-yellow-400 to-green-500 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              سبز-زرد
            </Button>
            <Button
              onClick={() => setWheelStyle(5)}
              size="sm"
              className={`rounded-xl clay-element transition-all ${
                wheelStyle === 5 
                  ? 'bg-gradient-to-r from-blue-500 to-slate-300 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              آبی-سفید
            </Button>
            <Button
              onClick={() => setWheelStyle(6)}
              size="sm"
              className={`rounded-xl clay-element transition-all ${
                wheelStyle === 6 
                  ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              قرمز-زرد
            </Button>
            <Button
              onClick={() => setWheelStyle(7)}
              size="sm"
              className={`rounded-xl clay-element transition-all ${
                wheelStyle === 7 
                  ? 'bg-gradient-to-r from-pink-300 to-blue-300 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              پاستل رنگین
            </Button>
            <Button
              onClick={() => setWheelStyle(8)}
              size="sm"
              className={`rounded-xl clay-element transition-all ${
                wheelStyle === 8 
                  ? 'bg-gradient-to-r from-gray-800 to-red-600 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              سیاه-قرمز
            </Button>
          </div>
          )}
          <Button
            onClick={resetWheel}
            variant="outline"
            size="icon"
            className="rounded-xl clay-element active:scale-95 transition-transform"
          >
            <RotateCw className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Wheel Container */}
        <Card className="clay-element bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
          <CardContent className="p-8">
            <div className="flex flex-col items-center">
              {/* Wheel */}
              <div className="relative w-80 h-80 mb-8">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <motion.div
                  animate={isSpinning ? { y: [0, 6, 0] } : { y: 0 }}
                  transition={{ duration: 0.8, repeat: isSpinning ? Infinity : 0, ease: 'easeInOut' }}
                >
                  <div
                    className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] drop-shadow-lg"
                    style={{ borderTopColor: theme.pointer }}
                  />
                </motion.div>
                </div>

                {/* Stars Animation Container - ستاره‌های درخشان */}
                <div className="absolute inset-0 pointer-events-none">
                  {activity.content.items.map((_, index) => {
                    const itemCount = activity.content.items.length;
                    const anglePerItem = 360 / itemCount;
                    const angle = index * anglePerItem + (anglePerItem / 2) - 90;
                    const starRadius = 145;
                    const x = 200 + starRadius * Math.cos((angle * Math.PI) / 180);
                    const y = 200 + starRadius * Math.sin((angle * Math.PI) / 180);
                    
                    return (
                      <motion.div
                        key={`star-${index}`}
                        className="absolute"
                        style={{
                          left: `${(x / 400) * 100}%`,
                          top: `${(y / 400) * 100}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.15,
                          ease: "easeInOut"
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <defs>
                            <linearGradient id={`starGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ffd700" />
                              <stop offset="50%" stopColor="#fff700" />
                              <stop offset="100%" stopColor="#ffed4e" />
                            </linearGradient>
                            <filter id={`starGlow-${index}`}>
                              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          <path 
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                            fill={`url(#starGrad-${index})`}
                            filter={`url(#starGlow-${index})`}
                          />
                        </svg>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Wheel */}
                <motion.div
                  ref={wheelRef}
                  key={wheelStyle}
                  initial={{ opacity: 0.7 }}
                  animate={{ 
                    opacity: 1,
                    rotate: rotation 
                  }}
                  transition={{ 
                    opacity: { duration: 0.5 },
                    rotate: { 
                      duration: spinDuration / 1000, 
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }
                  }}
                  className="w-full h-full rounded-full shadow-2xl relative overflow-hidden"
                >
                  {/* SVG Wheel */}
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    <defs>
                      {/* Gradients */}
                      {activity.content.items.map((item, index) => {
                        const colorHex = colorsHex[index % colorsHex.length];
                        const gradientId = `gradient-${wheelStyle}-${index}`;
                        return (
                          <linearGradient key={gradientId} id={gradientId} x1="30%" y1="30%" x2="70%" y2="70%">
                            <stop offset="0%" stopColor={colorHex.from} />
                            <stop offset="100%" stopColor={colorHex.to} />
                          </linearGradient>
                        );
                      })}
                      {/* Shadow filter */}
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                        <feOffset dx="0" dy="2" result="offsetblur"/>
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.3"/>
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Outer frame/border */}
                    <circle cx="200" cy="200" r="195" fill="none" stroke={theme.ringOuter} strokeWidth="8" opacity="0.7" />
                    <circle cx="200" cy="200" r="188" fill="none" stroke={theme.ringInner} strokeWidth="3" />
                    
                    {/* Wheel segments */}
                    {activity.content.items.map((item, index) => {
                      const startAngle = index * degreesPerItem - 90;
                      const endAngle = (index + 1) * degreesPerItem - 90;
                      const middleAngle = (startAngle + endAngle) / 2;
                      const isSelected = index === selectedIndex;
                      
                      // حساب نقاط برای path
                      const x1 = 200 + 175 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 = 200 + 175 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 = 200 + 175 * Math.cos((endAngle * Math.PI) / 180);
                      const y2 = 200 + 175 * Math.sin((endAngle * Math.PI) / 180);
                      
                      const largeArcFlag = degreesPerItem > 180 ? 1 : 0;
                      const pathData = `M 200 200 L ${x1} ${y1} A 175 175 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                      
                      // موقعیت متن - در راستای شعاع
                      const textAngle = middleAngle + 90;
                      const textRadius = 110;
                      const textX = 200 + textRadius * Math.cos((middleAngle * Math.PI) / 180);
                      const textY = 200 + textRadius * Math.sin((middleAngle * Math.PI) / 180);
                      
                      const gradientId = `gradient-${wheelStyle}-${index}`;
                      
                      return (
                        <g key={index}>
                          <path
                            d={pathData}
                            fill={`url(#${gradientId})`}
                            stroke="white"
                            strokeWidth={isSelected ? 4 : 2}
                            fillOpacity={isSelected ? 1 : 0.95}
                            filter="url(#shadow)"
                          />
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${textAngle + 45}, ${textX}, ${textY})`}
                            fill="white"
                            fontSize="13"
                            fontWeight="bold"
                            stroke="rgba(0,0,0,0.4)"
                            strokeWidth="0.8"
                            paintOrder="stroke"
                          >
                            {item.length > 10 ? item.substring(0, 10) + '...' : item}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Decorative pins around the edge */}
                    {[...Array(activity.content.items.length)].map((_, index) => {
                      const angle = (index * 360 / activity.content.items.length) - 90;
                      const x = 200 + 182 * Math.cos((angle * Math.PI) / 180);
                      const y = 200 + 182 * Math.sin((angle * Math.PI) / 180);
                      return (
                        <circle key={`pin-${index}`} cx={x} cy={y} r="4" fill={theme.pinFill} stroke={theme.pinStroke} strokeWidth="1.5" />
                      );
                    })}
                    {selectedSegmentCenter && (
                      <motion.circle
                        cx={selectedSegmentCenter.x}
                        cy={selectedSegmentCenter.y}
                        r="26"
                        fill="none"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth="4"
                        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 0.25, 0.8] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    
                    {/* Center circle with depth */}
                    <circle cx="200" cy="200" r="30" fill="url(#centerGradient)" stroke="#94a3b8" strokeWidth="3" />
                    <circle cx="200" cy="200" r="22" fill="#e2e8f0" />
                    <circle cx="200" cy="200" r="18" fill="#f1f5f9" />
                    
                    {/* Center gradient */}
                    <defs>
                      <radialGradient id="centerGradient">
                        <stop offset="0%" stopColor="#f8fafc" />
                        <stop offset="100%" stopColor="#cbd5e1" />
                      </radialGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>

              {/* Selected Item */}
              <AnimatePresence>
                {selectedItem && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mb-6"
                  >
                    <Card className="clay-element bg-gradient-to-br from-green-400 to-emerald-400 border-0">
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
                onClick={spinWheel}
                disabled={isSpinning}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg px-12 py-6 rounded-2xl clay-element"
              >
                {isSpinning ? 'در حال چرخش...' : 'چرخش چرخ'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

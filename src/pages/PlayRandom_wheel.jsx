import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCw, Save } from "lucide-react";
import { useGameData } from "@/hooks/useGameData";

/* ===== 5 تم سه‌بعدی لوکس ===== */
const themes = [
  { // 0: طلایی لوکس (کازینویی)
    name: 'طلایی لوکس',
    segments: [
      { from: '#fbbf24', to: '#b45309' },
      { from: '#fde68a', to: '#d97706' },
      { from: '#fbbf24', to: '#b45309' },
      { from: '#fde68a', to: '#d97706' },
      { from: '#fbbf24', to: '#b45309' },
      { from: '#fde68a', to: '#d97706' },
      { from: '#fbbf24', to: '#b45309' },
      { from: '#fde68a', to: '#d97706' },
    ],
    rimOuter: '#78350f',
    rimInner: '#fbbf24',
    arrowColor: '#ef4444',
    arrowGlow: '#fca5a5',
    pinColor: '#fef3c7',
    pinBorder: '#d97706',
    centerGrad: ['#fef3c7', '#d97706'],
    shadow: '0 20px 60px rgba(180,83,9,0.5)',
    innerShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
    bevel: '#92400e',
    resultBg: 'from-amber-500 to-yellow-500',
  },
  { // 1: نئون سایبرپانک
    name: 'نئون',
    segments: [
      { from: '#ff006e', to: '#8338ec' },
      { from: '#00f5d4', to: '#0077b6' },
      { from: '#ff006e', to: '#8338ec' },
      { from: '#00f5d4', to: '#0077b6' },
      { from: '#ff006e', to: '#8338ec' },
      { from: '#00f5d4', to: '#0077b6' },
      { from: '#ff006e', to: '#8338ec' },
      { from: '#00f5d4', to: '#0077b6' },
    ],
    rimOuter: '#3a0ca3',
    rimInner: '#00f5d4',
    arrowColor: '#f72585',
    arrowGlow: '#ff99c8',
    pinColor: '#00f5d4',
    pinBorder: '#3a0ca3',
    centerGrad: ['#3a0ca3', '#10002b'],
    shadow: '0 20px 60px rgba(58,12,163,0.6), 0 0 40px rgba(0,245,212,0.3)',
    innerShadow: 'inset 0 0 20px rgba(0,245,212,0.2)',
    bevel: '#240046',
    resultBg: 'from-fuchsia-600 to-purple-600',
  },
  { // 2: کریستال بلور
    name: 'کریستال',
    segments: [
      { from: '#93c5fd', to: '#dbeafe' },
      { from: '#c4b5fd', to: '#ede9fe' },
      { from: '#f9a8d4', to: '#fce7f3' },
      { from: '#93c5fd', to: '#dbeafe' },
      { from: '#c4b5fd', to: '#ede9fe' },
      { from: '#f9a8d4', to: '#fce7f3' },
      { from: '#93c5fd', to: '#dbeafe' },
      { from: '#c4b5fd', to: '#ede9fe' },
    ],
    rimOuter: '#94a3b8',
    rimInner: '#e2e8f0',
    arrowColor: '#6366f1',
    arrowGlow: '#a5b4fc',
    pinColor: '#f1f5f9',
    pinBorder: '#94a3b8',
    centerGrad: ['#ffffff', '#cbd5e1'],
    shadow: '0 20px 60px rgba(100,116,139,0.3)',
    innerShadow: 'inset 0 0 20px rgba(255,255,255,0.5)',
    bevel: '#64748b',
    resultBg: 'from-indigo-400 to-blue-400',
  },
  { // 3: کارناوال شاد
    name: 'کارناوال',
    segments: [
      { from: '#ef4444', to: '#dc2626' },
      { from: '#f97316', to: '#ea580c' },
      { from: '#eab308', to: '#ca8a04' },
      { from: '#22c55e', to: '#16a34a' },
      { from: '#3b82f6', to: '#1d4ed8' },
      { from: '#a855f7', to: '#9333ea' },
      { from: '#ec4899', to: '#db2777' },
      { from: '#14b8a6', to: '#0d9488' },
    ],
    rimOuter: '#dc2626',
    rimInner: '#fca5a5',
    arrowColor: '#f59e0b',
    arrowGlow: '#fde68a',
    pinColor: '#fef3c7',
    pinBorder: '#f59e0b',
    centerGrad: ['#fef3c7', '#f59e0b'],
    shadow: '0 20px 60px rgba(220,38,38,0.4)',
    innerShadow: 'inset 0 0 25px rgba(0,0,0,0.15)',
    bevel: '#991b1b',
    resultBg: 'from-green-500 to-teal-500',
  },
  { // 4: سلطنتی تیره
    name: 'سلطنتی',
    segments: [
      { from: '#1e1b4b', to: '#312e81' },
      { from: '#fbbf24', to: '#d97706' },
      { from: '#1e1b4b', to: '#312e81' },
      { from: '#fbbf24', to: '#d97706' },
      { from: '#1e1b4b', to: '#312e81' },
      { from: '#fbbf24', to: '#d97706' },
      { from: '#1e1b4b', to: '#312e81' },
      { from: '#fbbf24', to: '#d97706' },
    ],
    rimOuter: '#fbbf24',
    rimInner: '#1e1b4b',
    arrowColor: '#fbbf24',
    arrowGlow: '#fde68a',
    pinColor: '#fbbf24',
    pinBorder: '#78350f',
    centerGrad: ['#fbbf24', '#78350f'],
    shadow: '0 20px 60px rgba(30,27,75,0.7)',
    innerShadow: 'inset 0 0 30px rgba(251,191,36,0.15)',
    bevel: '#fcd34d',
    resultBg: 'from-yellow-400 to-amber-600',
  },
];

/* ===== فضاساز ===== */
function SparkleField() {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white/40"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ===== کامپوننت اصلی ===== */
export default function PlayRandom_wheel() {
  const { activity, isLoading, isDemo, saveActivity, saving } = useGameData();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [themeIdx, setThemeIdx] = useState(0);
  const [spinDuration, setSpinDuration] = useState(4200);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef(null);

  const spinWheel = () => {
    if (isSpinning || !activity?.content?.items?.length) return;
    setIsSpinning(true);
    setSelectedItem(null);
    setShowResult(false);

    const items = activity.content.items;
    const itemCount = items.length;
    const degreesPerItem = 360 / itemCount;
    const randomIndex = Math.floor(Math.random() * itemCount);
    const extraSpins = 5 + Math.floor(Math.random() * 4);
    const spinOffset = degreesPerItem / 2;
    const newTheme = Math.floor(Math.random() * themes.length);
    setThemeIdx(newTheme);
    const newDuration = 4000 + Math.floor(Math.random() * 1500);
    setSpinDuration(newDuration);
    const finalRotation = rotation + (360 * extraSpins) - (randomIndex * degreesPerItem + spinOffset);
    setRotation(finalRotation);
    setSelectedIndex(randomIndex);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedItem(items[randomIndex]);
      setShowResult(true);
    }, newDuration);
  };

  const resetWheel = () => {
    setRotation(0);
    setSelectedItem(null);
    setSelectedIndex(null);
    setIsSpinning(false);
    setShowResult(false);
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
          <Button onClick={() => navigate('/Dashboard')} className="rounded-xl clay-element">
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  const t = themes[themeIdx];
  const items = activity.content.items;
  const itemCount = items.length;
  const degreesPerItem = 360 / itemCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-4 md:p-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
    >
      <SparkleField />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="icon"
              className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{activity.title}</h1>
              {activity.description && (
                <p className="text-white/70 mt-1">{activity.description}</p>
              )}
            </div>
          </div>
          {isDemo && (
            <Button onClick={() => saveActivity()} disabled={saving}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-xl clay-element px-4 py-2 font-bold">
              <Save className="w-4 h-4 ml-2" />{saving ? "..." : "ذخیره فعالیت"}
            </Button>
          )}
          <Button
            onClick={resetWheel}
            variant="outline"
            size="icon"
            className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <RotateCw className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Wheel Card */}
        <Card className="border-0 backdrop-blur-xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)' }}>
          <CardContent className="p-6 md:p-10">
            <div className="flex flex-col items-center">

              {/* ===== چرخ ===== */}
              <div className="relative" style={{ width: 340, height: 340 }}>

                {/* فلش بالای چرخ */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20" style={{ marginTop: -8 }}>
                  <motion.div
                    animate={isSpinning ? { y: [0, 8, 0] } : { y: 0 }}
                    transition={{ duration: 0.6, repeat: isSpinning ? Infinity : 0, ease: 'easeInOut' }}
                    className="flex flex-col items-center"
                  >
                    <div style={{
                      width: 0, height: 0,
                      borderLeft: '18px solid transparent',
                      borderRight: '18px solid transparent',
                      borderTop: '32px solid',
                      borderTopColor: t.arrowColor,
                      filter: `drop-shadow(0 0 12px ${t.arrowGlow})`,
                    }} />
                    <div style={{
                      width: 6, height: 20,
                      background: `linear-gradient(to bottom, ${t.arrowColor}, ${t.arrowGlow})`,
                      borderRadius: '0 0 4px 4px',
                      boxShadow: `0 0 10px ${t.arrowGlow}`,
                    }} />
                  </motion.div>
                </div>

                {/* Sparkle stars */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  {items.map((_, i) => {
                    const a = i * degreesPerItem + degreesPerItem / 2 - 90;
                    const r = 155;
                    const cx = 170 + r * Math.cos((a * Math.PI) / 180);
                    const cy = 170 + r * Math.sin((a * Math.PI) / 180);
                    return (
                      <motion.div
                        key={`star-${i}`}
                        className="absolute"
                        style={{ left: `${(cx / 340) * 100}%`, top: `${(cy / 340) * 100}%`, transform: 'translate(-50%,-50%)' }}
                        animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.6, 1.3, 0.6] }}
                        transition={{ duration: 1.8 + Math.random(), repeat: Infinity, delay: i * 0.12 }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <defs>
                            <filter id={`sg-${i}`}>
                              <feGaussianBlur stdDeviation="1.5" result="b" />
                              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                          </defs>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            fill="#ffd700" filter={`url(#sg-${i})`} opacity={0.8} />
                        </svg>
                      </motion.div>
                    );
                  })}
                </div>

                {/* SVG چرخ */}
                <motion.div
                  ref={wheelRef}
                  key={themeIdx}
                  initial={{ opacity: 0.6, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1, rotate: rotation }}
                  transition={{
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 },
                    rotate: {
                      duration: spinDuration / 1000,
                      ease: [0.15, 0.7, 0.3, 1.0],
                    },
                  }}
                  className="w-full h-full rounded-full relative"
                  style={{
                    filter: 'drop-shadow(0 0 0px)',
                    boxShadow: t.shadow,
                  }}
                >
                  <svg viewBox="0 0 340 340" className="w-full h-full">
                    <defs>
                      {items.map((_, i) => {
                        const seg = t.segments[i % t.segments.length];
                        const gid = `g-${themeIdx}-${i}`;
                        return (
                          <linearGradient key={gid} id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={seg.from} />
                            <stop offset="100%" stopColor={seg.to} />
                          </linearGradient>
                        );
                      })}
                      <filter id="segShadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                      </filter>
                      <filter id="bevel">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                        <feSpecularLighting in="blur" surfaceScale="4" specularConstant="0.5" specularExponent="15" result="spec">
                          <fePointLight x="170" y="50" z="200" />
                        </feSpecularLighting>
                        <feComposite in="spec" in2="SourceAlpha" operator="in" result="spec2" />
                        <feComposite in="SourceGraphic" in2="spec2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                      </filter>
                      <radialGradient id="cg">
                        <stop offset="0%" stopColor={t.centerGrad[0]} />
                        <stop offset="100%" stopColor={t.centerGrad[1]} />
                      </radialGradient>
                    </defs>

                    {/* سایه داخلی (حلقه تو‌رونده) */}
                    <circle cx="170" cy="170" r="168" fill="none" stroke={t.bevel} strokeWidth="2" opacity="0.4" />

                    {/* بخش‌های چرخ */}
                    {items.map((_, i) => {
                      const sa = i * degreesPerItem - 90;
                      const ea = (i + 1) * degreesPerItem - 90;
                      const r = 155;
                      const x1 = 170 + r * Math.cos((sa * Math.PI) / 180);
                      const y1 = 170 + r * Math.sin((sa * Math.PI) / 180);
                      const x2 = 170 + r * Math.cos((ea * Math.PI) / 180);
                      const y2 = 170 + r * Math.sin((ea * Math.PI) / 180);
                      const large = degreesPerItem > 180 ? 1 : 0;
                      const d = `M 170 170 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
                      const gid = `g-${themeIdx}-${i}`;
                      const isSel = i === selectedIndex;
                      return (
                        <g key={i} filter="url(#segShadow)">
                          <path
                            d={d}
                            fill={`url(#${gid})`}
                            stroke={isSel ? '#ffffff' : 'rgba(255,255,255,0.5)'}
                            strokeWidth={isSel ? 3 : 1}
                            filter="url(#bevel)"
                          />
                        </g>
                      );
                    })}

                    {/* پین‌های تزئینی لبه */}
                    {items.map((_, i) => {
                      const a = i * degreesPerItem - 90;
                      const pr = 160;
                      const px = 170 + pr * Math.cos((a * Math.PI) / 180);
                      const py = 170 + pr * Math.sin((a * Math.PI) / 180);
                      return (
                        <g key={`pin-${i}`}>
                          <circle cx={px} cy={py} r="5" fill={t.pinColor} stroke={t.pinBorder} strokeWidth="2"
                            filter="url(#segShadow)" />
                          <circle cx={px} cy={py} r="2" fill={t.pinBorder} opacity="0.5" />
                        </g>
                      );
                    })}

                    {/* مرکز چرخ سه‌بعدی */}
                    <circle cx="170" cy="170" r="32" fill="url(#cg)" stroke={t.pinBorder} strokeWidth="3"
                      filter="url(#segShadow)" />
                    <circle cx="170" cy="170" r="24" fill={t.centerGrad[0]} opacity="0.6" />
                    <circle cx="170" cy="170" r="14" fill={t.centerGrad[1]} opacity="0.8" />
                    <circle cx="170" cy="170" r="6" fill="#ffffff" opacity="0.5" />

                    {/* متن‌های روی چرخ - از لبه به سمت مرکز */}
                    {items.map((item, i) => {
                      const midAngle = (i * degreesPerItem + degreesPerItem / 2) - 90;
                      const midRad = (midAngle * Math.PI) / 180;
                      const outerR = 140;
                      const innerR = 45;
                      const midR = (outerR + innerR) / 2;
                      const tx = 170 + midR * Math.cos(midRad);
                      const ty = 170 + midR * Math.sin(midRad);
                      const rot = midAngle + 90;
                      const maxChars = Math.max(4, Math.floor(outerR - innerR) / 6);
                      const text = item.length > maxChars ? item.substring(0, maxChars - 1) + '..' : item;
                      const fontSize = Math.min(14, Math.max(10, 160 / itemCount));

                      return (
                        <g key={`txt-${i}`}>
                          <text
                            x={tx} y={ty}
                            textAnchor="middle" dominantBaseline="middle"
                            transform={`rotate(${rot}, ${tx}, ${ty})`}
                            fill="#ffffff"
                            fontSize={fontSize}
                            fontWeight="bold"
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth="0.6"
                            paintOrder="stroke"
                            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                          >
                            {text}
                          </text>
                        </g>
                      );
                    })}

                    {/* هایلایت برنده */}
                    {selectedIndex !== null && (
                      <motion.circle
                        cx={170 + 120 * Math.cos(((selectedIndex * degreesPerItem - 90 + degreesPerItem / 2) * Math.PI) / 180)}
                        cy={170 + 120 * Math.sin(((selectedIndex * degreesPerItem - 90 + degreesPerItem / 2) * Math.PI) / 180)}
                        r="30"
                        fill="none"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="4"
                        animate={{ r: [26, 34, 26], opacity: [0.7, 0.2, 0.7] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}

                  </svg>
                </motion.div>
              </div>

              {/* ===== نتیجه زیر فلش ===== */}
              <AnimatePresence>
                {showResult && selectedItem && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    className="mt-8 mb-4"
                  >
                    <div className={`
                      relative px-10 py-5 rounded-2xl text-center
                      bg-gradient-to-br ${t.resultBg}
                      shadow-2xl border border-white/20
                    `}>
                      <motion.div
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <p className="text-white/80 text-sm mb-1 font-medium tracking-wide">
                          🎯 نتیجه نهایی
                        </p>
                        <p className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                          {selectedItem}
                        </p>
                      </motion.div>
                      {/* گوشه‌های تزئینی */}
                      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white/40 rounded-tr" />
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white/40 rounded-bl" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ===== دکمه چرخش ===== */}
              <Button
                onClick={spinWheel}
                disabled={isSpinning}
                className={`
                  mt-4 text-white text-lg px-14 py-5 rounded-2xl font-bold
                  transition-all duration-300 relative overflow-hidden
                  ${isSpinning
                    ? 'bg-gray-500 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl'
                  }
                `}
                style={{
                  boxShadow: isSpinning ? 'none' : '0 8px 32px rgba(168,85,247,0.4)',
                }}
              >
                {isSpinning ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    در حال چرخش...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RotateCw className="w-5 h-5" />
                    چرخش چرخ
                  </span>
                )}
              </Button>

              {/* ===== برچسب تم ===== */}
              <div className="mt-4 text-white/40 text-xs">
                تم: {t.name}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

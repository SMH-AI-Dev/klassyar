import React, { useMemo } from "react";
import { motion } from "framer-motion";

const emojis = [
  "⭐", "🎮", "🎯", "🎨", "🌈", "🦋", "🌸", "🎈", "🎪", "🎭",
  "🚀", "🌈", "🌟", "💫", "✨", "🎵", "🎶", "🦄", "🐱", "🐶",
  "🦋", "🐝", "🌸", "🌺", "🌻", "🍀", "🎲", "🧩", "🎪", "🎨",
];

const colors = [
  "from-purple-400/30 to-pink-400/30",
  "from-blue-400/30 to-cyan-400/30",
  "from-green-400/30 to-emerald-400/30",
  "from-yellow-400/30 to-orange-400/30",
  "from-red-400/30 to-rose-400/30",
  "from-indigo-400/30 to-violet-400/30",
];

export default function FloatingEmojis({ count = 8, mobileCount }) {
  const effectiveCount = typeof window !== 'undefined' && window.innerWidth < 640
    ? (mobileCount ?? Math.max(3, Math.floor(count / 2.5)))
    : count;
  const items = useMemo(() => {
    const used = new Set();
    const result = [];
    for (let i = 0; i < count; i++) {
      let idx;
      do { idx = Math.floor(Math.random() * emojis.length); } while (used.has(idx));
      used.add(idx);
      result.push({
        id: i,
        emoji: emojis[idx],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 32,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        xMove: (Math.random() - 0.5) * 60,
        yMove: (Math.random() - 0.5) * 60,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return result;
  }, [effectiveCount]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.3, 0.6, 0],
            scale: [0, 1, 1.1, 1, 0],
            x: [0, item.xMove, -item.xMove / 2, item.xMove / 2, 0],
            y: [0, item.yMove, -item.yMove / 2, item.yMove / 2, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-2 clay-element`}>
            {item.emoji}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

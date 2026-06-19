import React from 'react';
import { motion } from 'framer-motion';

// 50 کودکانه انیمیشن‌های متحرک
export const childAnimations = [
  // 1-10: حیوانات
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 10, -10, 0],
          y: [0, -5, 5, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700" />
        </svg>
      </motion.div>
    ),
    name: 'star'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FF6B6B" />
          <circle cx="8" cy="8" r="2" fill="#FFF" />
          <circle cx="16" cy="8" r="2" fill="#FFF" />
          <path d="M8 16c2 2 6 2 8 0" stroke="#FFF" strokeWidth="2" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'smiley'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 15, -15, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4CAF50" />
        </svg>
      </motion.div>
    ),
    name: 'checkmark'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF69B4" />
        </svg>
      </motion.div>
    ),
    name: 'heart'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 8, -8, 0],
          y: [0, -6, 6, 0],
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FF8C00" />
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700" opacity="0.7" />
        </svg>
      </motion.div>
    ),
    name: 'double-star'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#87CEEB" />
          <circle cx="8" cy="8" r="1.5" fill="#FFF" />
          <circle cx="16" cy="8" r="1.5" fill="#FFF" />
          <path d="M8 16c2 1.5 4 1.5 6 0" stroke="#FFF" strokeWidth="1.5" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'happy-face'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 12, -12, 0],
          y: [0, -8, 8, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#32CD32" />
        </svg>
      </motion.div>
    ),
    name: 'green-check'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, -10, 10, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#DC143C" />
        </svg>
      </motion.div>
    ),
    name: 'red-heart'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 6, -6, 0],
          y: [0, -4, 4, 0],
          rotate: [0, 20, -20, 0],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FF1493" />
        </svg>
      </motion.div>
    ),
    name: 'pink-star'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, -360],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#98FB98" />
          <circle cx="8" cy="8" r="1.2" fill="#FFF" />
          <circle cx="16" cy="8" r="1.2" fill="#FFF" />
          <path d="M8 16c2 1.2 4 1.2 6 0" stroke="#FFF" strokeWidth="1.2" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'green-smiley'
  },

  // 11-20: شکل‌های هندسی متحرک
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FF6347" stroke="#FFF" strokeWidth="2" />
        </svg>
      </motion.div>
    ),
    name: 'spinning-circle'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 20, -20, 0],
          rotate: [0, 45, -45, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#4169E1" />
        </svg>
      </motion.div>
    ),
    name: 'bouncing-square'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,12 12,22 2,12" fill="#FFD700" />
        </svg>
      </motion.div>
    ),
    name: 'diamond'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 15, -15, 0],
          y: [0, -12, 12, 0],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 15,9 22,9 16,14 19,21 12,16 5,21 8,14 2,9 9,9" fill="#FF69B4" />
        </svg>
      </motion.div>
    ),
    name: 'star-shape'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, 360],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#32CD32" stroke="#FFF" strokeWidth="2" />
        </svg>
      </motion.div>
    ),
    name: 'green-circle'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 10, -10, 0],
          rotate: [0, 30, -30, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="3" fill="#FF4500" />
        </svg>
      </motion.div>
    ),
    name: 'orange-rectangle'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 120, 240, 360],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 20,8 20,16 12,22 4,16 4,8" fill="#9370DB" />
        </svg>
      </motion.div>
    ),
    name: 'hexagon'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 18, -18, 0],
          y: [0, -9, 9, 0],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 20,8 16,20 8,20 4,8" fill="#FF1493" />
        </svg>
      </motion.div>
    ),
    name: 'pentagon'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, -360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#00CED1" stroke="#FFF" strokeWidth="2" />
        </svg>
      </motion.div>
    ),
    name: 'turquoise-circle'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 12, -12, 0],
          rotate: [0, 25, -25, 0],
        }}
        transition={{
          duration: 4.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#DC143C" />
        </svg>
      </motion.div>
    ),
    name: 'red-square'
  },

  // 21-30: حیوانات کارتونی
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 8, -8, 0],
          y: [0, -6, 6, 0],
          rotate: [0, 8, -8, 0],
        }}
        transition={{
          duration: 4.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFD700" />
          <circle cx="8" cy="8" r="1.5" fill="#000" />
          <circle cx="16" cy="8" r="1.5" fill="#000" />
          <path d="M8 16c2 1 4 1 6 0" stroke="#000" strokeWidth="1.5" fill="none" />
          <path d="M6 6c0-1 1-2 2-2" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M18 6c0-1-1-2-2-2" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-cat'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FF69B4" />
          <circle cx="8" cy="8" r="1.2" fill="#FFF" />
          <circle cx="16" cy="8" r="1.2" fill="#FFF" />
          <path d="M8 16c2 1.5 4 1.5 6 0" stroke="#FFF" strokeWidth="1.5" fill="none" />
          <path d="M6 6c1-1 2-1 3 0" stroke="#FFF" strokeWidth="1" fill="none" />
          <path d="M15 6c1-1 2-1 3 0" stroke="#FFF" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-dog'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 14, -14, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#98FB98" />
          <circle cx="8" cy="8" r="1.5" fill="#000" />
          <circle cx="16" cy="8" r="1.5" fill="#000" />
          <path d="M8 16c2 1 4 1 6 0" stroke="#000" strokeWidth="1.5" fill="none" />
          <path d="M6 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M16 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-rabbit'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, 12, -12, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFA500" />
          <circle cx="8" cy="8" r="1.3" fill="#000" />
          <circle cx="16" cy="8" r="1.3" fill="#000" />
          <path d="M8 16c2 1.2 4 1.2 6 0" stroke="#000" strokeWidth="1.2" fill="none" />
          <path d="M6 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M16 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-monkey'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 10, -10, 0],
          y: [0, -7, 7, 0],
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 5.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#87CEEB" />
          <circle cx="8" cy="8" r="1.4" fill="#000" />
          <circle cx="16" cy="8" r="1.4" fill="#000" />
          <path d="M8 16c2 1.3 4 1.3 6 0" stroke="#000" strokeWidth="1.3" fill="none" />
          <path d="M6 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M16 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-fish'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#DDA0DD" />
          <circle cx="8" cy="8" r="1.5" fill="#000" />
          <circle cx="16" cy="8" r="1.5" fill="#000" />
          <path d="M8 16c2 1 4 1 6 0" stroke="#000" strokeWidth="1.5" fill="none" />
          <path d="M6 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M16 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-bird'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 16, -16, 0],
          y: [0, -11, 11, 0],
        }}
        transition={{
          duration: 5.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#F0E68C" />
          <circle cx="8" cy="8" r="1.4" fill="#000" />
          <circle cx="16" cy="8" r="1.4" fill="#000" />
          <path d="M8 16c2 1.2 4 1.2 6 0" stroke="#000" strokeWidth="1.2" fill="none" />
          <path d="M6 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M16 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-mouse'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, -8, 8, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFB6C1" />
          <circle cx="8" cy="8" r="1.3" fill="#000" />
          <circle cx="16" cy="8" r="1.3" fill="#000" />
          <path d="M8 16c2 1.1 4 1.1 6 0" stroke="#000" strokeWidth="1.1" fill="none" />
          <path d="M6 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M16 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-elephant'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 12, -12, 0],
          y: [0, -8, 8, 0],
          rotate: [0, 18, -18, 0],
        }}
        transition={{
          duration: 5.1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#98FB98" />
          <circle cx="8" cy="8" r="1.5" fill="#000" />
          <circle cx="16" cy="8" r="1.5" fill="#000" />
          <path d="M8 16c2 1 4 1 6 0" stroke="#000" strokeWidth="1.5" fill="none" />
          <path d="M6 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M16 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-turtle'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -360],
        }}
        transition={{
          duration: 6.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFE4B5" />
          <circle cx="8" cy="8" r="1.4" fill="#000" />
          <circle cx="16" cy="8" r="1.4" fill="#000" />
          <path d="M8 16c2 1.3 4 1.3 6 0" stroke="#000" strokeWidth="1.3" fill="none" />
          <path d="M6 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M16 6c1-1 2-1 2 0" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    ),
    name: 'cartoon-panda'
  },

  // 31-40: اشیاء متحرک
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 20, -20, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700" />
        </svg>
      </motion.div>
    ),
    name: 'flying-star'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          y: [0, -15, 15, 0],
          rotate: [0, 45, -45, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#FF6347" />
        </svg>
      </motion.div>
    ),
    name: 'bouncing-cube'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#4169E1" />
        </svg>
      </motion.div>
    ),
    name: 'expanding-ball'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 25, -25, 0],
          y: [0, -12, 12, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,12 12,22 2,12" fill="#32CD32" />
        </svg>
      </motion.div>
    ),
    name: 'floating-diamond'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, 360],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FF69B4" stroke="#FFF" strokeWidth="2" />
        </svg>
      </motion.div>
    ),
    name: 'spinning-heart'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 18, -18, 0],
          rotate: [0, 30, -30, 0],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="3" fill="#FFD700" />
        </svg>
      </motion.div>
    ),
    name: 'sliding-rectangle'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 120, 240, 360],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 20,8 20,16 12,22 4,16 4,8" fill="#9370DB" />
        </svg>
      </motion.div>
    ),
    name: 'pulsing-hexagon'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 22, -22, 0],
          y: [0, -14, 14, 0],
        }}
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 20,8 16,20 8,20 4,8" fill="#FF1493" />
        </svg>
      </motion.div>
    ),
    name: 'zigzag-pentagon'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, -360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#00CED1" stroke="#FFF" strokeWidth="2" />
        </svg>
      </motion.div>
    ),
    name: 'counter-spinning-circle'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 16, -16, 0],
          rotate: [0, 25, -25, 0],
        }}
        transition={{
          duration: 5.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#DC143C" />
        </svg>
      </motion.div>
    ),
    name: 'waving-square'
  },

  // 41-50: عناصر طبیعت و آب و هوا
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 12, -12, 0],
          y: [0, -8, 8, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 5.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700" />
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFA500" opacity="0.6" />
        </svg>
      </motion.div>
    ),
    name: 'sun'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M7 16c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#87CEEB" strokeWidth="2" fill="none" />
          <path d="M12 12c0-1.1.9-2 2-2s2 .9 2 2" stroke="#87CEEB" strokeWidth="2" fill="none" />
          <circle cx="8" cy="8" r="1" fill="#87CEEB" />
          <circle cx="16" cy="8" r="1" fill="#87CEEB" />
        </svg>
      </motion.div>
    ),
    name: 'cloud'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 18, -18, 0],
          y: [0, -12, 12, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FF6347" />
        </svg>
      </motion.div>
    ),
    name: 'flower'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#228B22" />
        </svg>
      </motion.div>
    ),
    name: 'tree'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 14, -14, 0],
          y: [0, -9, 9, 0],
          rotate: [0, 20, -20, 0],
        }}
        transition={{
          duration: 6.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#4169E1" />
        </svg>
      </motion.div>
    ),
    name: 'wave'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 7.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700" />
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFA500" opacity="0.5" />
        </svg>
      </motion.div>
    ),
    name: 'rainbow'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -13, 13, 0],
        }}
        transition={{
          duration: 6.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FF69B4" />
        </svg>
      </motion.div>
    ),
    name: 'butterfly'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          rotate: [0, -12, 12, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#8B4513" />
        </svg>
      </motion.div>
    ),
    name: 'mountain'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          x: [0, 16, -16, 0],
          y: [0, -10, 10, 0],
          rotate: [0, 18, -18, 0],
        }}
        transition={{
          duration: 6.1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00CED1" />
        </svg>
      </motion.div>
    ),
    name: 'fish'
  },
  {
    component: ({ x, y }) => (
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: `${x}%`, top: `${y}%` }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -360],
        }}
        transition={{
          duration: 7.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFE4B5" />
        </svg>
      </motion.div>
    ),
    name: 'moon'
  },
];
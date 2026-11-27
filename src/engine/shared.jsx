import React from "react";
import { fa, shuffle } from "@/lib/text";

/**
 * @typedef {Object} Item
 * @property {string} q - The question text
 * @property {string} a - The answer text
 * @property {string[]} [wrong] - Optional array of wrong answers
 */

/**
 * @typedef {Object} GameResult
 * @property {number} score - The score achieved
 * @property {number} total - The total number of questions
 */

/**
 * @typedef {Object} GameProps
 * @property {Item[]} items - The array of items/questions
 * @property {function(GameResult): void} onFinish - Callback when game finishes
 */

export const OPTION_STYLES = [
  { bg: "linear-gradient(135deg,#ff416c,#ff4b2b)", shape: "▲" },
  { bg: "linear-gradient(135deg,#2563eb,#4facfe)", shape: "◆" },
  { bg: "linear-gradient(135deg,#f59e0b,#fbbf24)", shape: "●" },
  { bg: "linear-gradient(135deg,#059669,#34d399)", shape: "■" },
];

/** Correct answer + distractors (explicit wrong answers first, then answers of other items). */
export function buildOptions(item, all, n = 4) {
  const pool = new Set();
  (item.wrong ?? []).forEach((w) => w && w !== item.a && pool.add(w));
  for (const o of shuffle(all.filter((i) => i.a !== item.a).map((i) => i.a))) {
    if (pool.size >= n - 1) break;
    pool.add(o);
  }
  const wrongs = [...pool].slice(0, n - 1);
  return shuffle([item.a, ...wrongs]);
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Hud({ score, current, total, lives, maxLives = 3, extra }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <div className="rounded-full bg-white/90 px-3 py-1 text-sm font-black text-amber-600 shadow">⭐ {fa(score)}</div>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/70 shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(Math.min(current, total) / Math.max(total, 1)) * 100}%`, background: "linear-gradient(90deg,#ff4fa3,#8b5cf6,#3b82f6)" }}
        />
      </div>
      <div className="text-sm font-black text-violet-900">
        {fa(Math.min(current + 1, total))}/{fa(total)}
      </div>
      {extra}
      {lives !== undefined && (
        <div className="flex text-lg" aria-label={`${lives} جان`}>
          {Array.from({ length: maxLives }).map((_, i) => (
            <span key={i} className={i < lives ? "animate-twinkle" : "opacity-50"} style={{ animationDelay: `${i * 0.2}s` }}>
              {i < lives ? "❤️" : "🖤"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function TimerBar({ seconds, running, onEnd }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-white/70 shadow-inner">
      <div
        className="timer-fill h-full rounded-full"
        style={{ animationDuration: `${seconds}s`, animationPlayState: running ? "running" : "paused" }}
        onAnimationEnd={(e) => e.animationName === "timer" && onEnd()}
      />
    </div>
  );
}

export function QuestionCard({ children, hint }) {
  return (
    <div className="animate-pop mb-4 rounded-3xl bg-white/95 px-5 py-6 text-center shadow-xl">
      {hint && <div className="mb-1 text-xs font-bold text-violet-400">{hint}</div>}
      <div className="text-2xl font-black leading-relaxed text-violet-950 sm:text-3xl">{children}</div>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import { sfx } from "@/lib/fx";
import { shuffle } from "@/lib/text";
import type { Item } from "@/lib/types";
import { Hud, QuestionCard, buildOptions, type GameProps } from "./shared";

const COLORS = ["#ff4fa3", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

type Balloon = { id: number; text: string; correct: boolean; left: number; dur: number; delay: number; color: string };

function makeBalloons(it: Item, all: Item[]): Balloon[] {
  const slots = shuffle([3, 27, 51, 75]);
  return buildOptions(it, all, 4).map((text, i) => ({
    id: i,
    text,
    correct: text === it.a,
    left: slots[i] + Math.random() * 3,
    dur: 10 + Math.random() * 4,
    delay: i * 0.6,
    color: COLORS[(i + Math.floor(Math.random() * 6)) % 6],
  }));
}

export default function BalloonsEngine({ game, roundId, onProgress, onComplete, onRestart }: GameProps) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [popped, setPopped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const it = game.items[idx];
  const balloons = useMemo(() => makeBalloons(it, game.items), [it, game.items]);

  function advance(nextScore: number, nextLives: number) {
    setLocked(true);
    setTimeout(() => {
      if (nextLives <= 0 || idx + 1 >= game.items.length) onFinish({ score: nextScore, total: game.items.length });
      else {
        setIdx(idx + 1);
        setPopped([]);
        setLocked(false);
      }
    }, 700);
  }

  function pop(b: Balloon) {
    if (locked || popped.includes(b.id)) return;
    sfx.pop();
    setPopped((p) => [...p, b.id]);
    if (b.correct) {
      sfx.correct();
      const s = score + 1;
      setScore(s);
      advance(s, lives);
    } else {
      sfx.wrong();
      const l = lives - 1;
      setLives(l);
      if (l <= 0) advance(score, 0);
    }
  }

  function missed() {
    if (locked) return;
    sfx.wrong();
    const l = lives - 1;
    setLives(l);
    advance(score, l);
  }

  return (
    <div>
      <Hud score={score} current={idx} total={game.items.length} lives={lives} maxLives={5} />
      <QuestionCard hint="بادکنکِ پاسخ درست را بترکان 🎈">{it.q}</QuestionCard>
      <div className="scene-sky relative mx-auto h-[440px] max-w-xl overflow-hidden rounded-3xl shadow-xl">
        {[0, 1, 2].map((c) => (
          <span key={c} className="absolute text-6xl opacity-80" style={{ top: `${12 + c * 28}%`, animation: `cloud ${40 + c * 15}s linear infinite`, animationDelay: `-${c * 14}s` }}>☁️</span>
        ))}
        {balloons.map((b) => {
          const isPopped = popped.includes(b.id);
          return (
            <div
              key={`${idx}-${b.id}`}
              className="absolute"
              style={{
                left: `${b.left}%`,
                bottom: -150,
                width: "21%",
                minWidth: 78,
                animation: `rise ${b.dur}s ${b.delay}s linear both`,
                animationPlayState: isPopped || locked ? "paused" : "running",
              }}
              onAnimationEnd={(e) => e.animationName === "rise" && b.correct && !isPopped && missed()}
            >
              <button
                onClick={() => pop(b)}
                className={`block w-full ${isPopped ? "animate-pop-out pointer-events-none" : ""}`}
                style={{ animation: isPopped ? undefined : "sway 3s ease-in-out infinite", transformOrigin: "50% 100%" }}
                aria-label={b.text}
              >
                <span
                  className="flex aspect-[4/5] w-full items-center justify-center rounded-[50%_50%_50%_50%/60%_60%_40%_40%] p-2 text-center text-[13px] font-extrabold leading-tight text-white shadow-lg sm:text-sm"
                  style={{ background: `radial-gradient(circle at 30% 25%, #ffffffaa, ${b.color} 45%)` }}
                >
                  {b.text}
                </span>
                <span className="mx-auto block h-10 w-px bg-white/80" />
              </button>
              {isPopped && <span className="animate-pop-out pointer-events-none absolute inset-0 grid place-items-center text-4xl">{b.correct ? "🎉" : "💥"}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
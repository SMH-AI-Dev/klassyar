import React, { useMemo, useState } from "react";
import { sfx } from "@/lib/fx";
import { shuffle } from "@/lib/text";
import { Hud, QuestionCard, buildOptions, type GameProps } from "./shared";

export default function WhackEngine({ game, roundId, onProgress, onComplete, onRestart }: GameProps) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bad, setBad] = useState<number[]>([]);
  const [hit, setHit] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const it = game.items[idx];

  const placement = useMemo(() => {
    const holes = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    return buildOptions(it, game.items).map((text, i) => ({ hole: holes[i], text, correct: text === it.a }));
  }, [it, game.items]);

  function whack(p: { hole: number; correct: boolean }) {
    if (locked || bad.includes(p.hole)) return;
    if (p.correct) {
      sfx.pop();
      sfx.correct();
      setHit(p.hole);
      setLocked(true);
      const s = score + 1;
      setScore(s);
      setTimeout(() => {
        if (idx + 1 >= game.items.length) onFinish({ score: s, total: game.items.length });
        else {
          setIdx(idx + 1);
          setBad([]);
          setHit(null);
          setLocked(false);
        }
      }, 900);
    } else {
      sfx.wrong();
      setBad((b) => [...b, p.hole]);
      const l = lives - 1;
      setLives(l);
      if (l <= 0) {
        setLocked(true);
        setTimeout(() => onFinish({ score, total: game.items.length }), 900);
      }
    }
  }

  return (
    <div>
      <Hud score={score} current={idx} total={game.items.length} lives={lives} maxLives={3} />
      <QuestionCard hint="به موشِ دارای پاسخ درست ضربه بزن 🔨">{it.q}</QuestionCard>
      <div className="scene-grass mx-auto grid max-w-md grid-cols-3 gap-2 rounded-3xl p-3 shadow-xl sm:gap-4 sm:p-5">
        {Array.from({ length: 9 }).map((_, h) => {
          const p = placement.find((x) => x.hole === h);
          const isBad = bad.includes(h);
          const isHit = hit === h;
          return (
            <div key={h} className="relative aspect-square overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1/4 rounded-[50%] bg-amber-950/80 shadow-inner" />
              {p && (
                <button
                  onClick={() => whack(p)}
                  className="absolute inset-x-1 bottom-[10%] top-[6%] flex flex-col items-center justify-end"
                  style={{ animation: `moleUp 0.55s ${h * 0.07}s both, moleBob 1.8s ${0.6 + h * 0.07}s ease-in-out infinite` }}
                  aria-label={p.text}
                >
                  <span className={`text-4xl sm:text-5xl ${isBad ? "grayscale" : ""} ${isHit ? "animate-bounce-y" : ""}`}>{isBad ? "😵" : isHit ? "🤩" : "🐹"}</span>
                  <span className={`-mt-1 w-full rounded-xl px-1 py-1 text-[12px] font-extrabold leading-tight shadow sm:text-sm ${isHit ? "bg-emerald-400 text-white" : isBad ? "bg-slate-300 text-slate-500" : "bg-white text-violet-900"}`}>
                    {p.text}
                  </span>
                </button>
              )}
              {isHit && <span className="animate-pop-out pointer-events-none absolute inset-0 grid place-items-center text-5xl">💥</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
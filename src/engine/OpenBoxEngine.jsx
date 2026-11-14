import React, { useState } from "react";
import { sfx } from "@/lib/fx";
import { Hud, OPTION_STYLES, QuestionCard, buildOptions, type GameProps } from "./shared";

const PRIZES = ["🌟", "🍭", "🏅", "🎉", "🍕", "🦄", "💎", "🎈", "🍩"];
const COLORS = ["#ff4fa3", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#f97316"];

export default function OpenBoxEngine({ game, roundId, onProgress, onComplete, onRestart }: GameProps) {
  const [opened, setOpened] = useState<Record<number, "ok" | "bad">>({});
  const [active, setActive] = useState<number | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const count = Object.keys(opened).length;

  function open(i: number) {
    if (opened[i] || active !== null) return;
    sfx.flip();
    setOptions(buildOptions(game.items[i], game.items));
    setPicked(null);
    setActive(i);
  }

  function choose(o: number) {
    if (picked !== null || active === null) return;
    const ok = options[o] === game.items[active].a;
    setPicked(o);
    ok ? sfx.correct() : sfx.wrong();
    const s = score + (ok ? 1 : 0);
    setScore(s);
    setTimeout(() => {
      const next = { ...opened, [active]: ok ? ("ok" as const) : ("bad" as const) };
      setOpened(next);
      setActive(null);
      if (Object.keys(next).length >= game.items.length) setTimeout(() => onFinish({ score: s, total: game.items.length }), 1000);
    }, 1200);
  }

  return (
    <div>
      <Hud score={score} current={count} total={game.items.length} />
      {active === null ? (
        <>
          <p className="mb-3 text-center text-sm font-bold text-violet-700">یک جعبه انتخاب کن!</p>
          <div className="mx-auto grid max-w-md grid-cols-3 gap-3 sm:gap-4">
            {game.items.map((_, i) => {
              const st = opened[i];
              return (
                <button
                  key={i}
                  onClick={() => open(i)}
                  disabled={!!st}
                  className="animate-pop relative grid aspect-square place-items-center rounded-3xl text-6xl shadow-xl transition-transform hover:scale-105 disabled:hover:scale-100"
                  style={{ background: st ? (st === "ok" ? "#d1fae5" : "#e2e8f0") : `linear-gradient(135deg,${COLORS[i % 9]},#ffffff55)`, animationDelay: `${i * 70}ms` }}
                >
                  <span style={{ animation: st ? undefined : `boxJump 1.6s ${i * 0.2}s ease-in-out infinite` }}>
                    {st ? (st === "ok" ? PRIZES[i % PRIZES.length] : "💨") : "🎁"}
                  </span>
                  {!st && <span className="absolute top-1 start-2 rounded-full bg-white/90 px-2 text-sm font-black text-violet-800">{(i + 1).toLocaleString("fa-IR")}</span>}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="animate-pop">
          <QuestionCard hint={`جعبه‌ی شماره‌ی ${(active + 1).toLocaleString("fa-IR")}`}>{game.items[active].q}</QuestionCard>
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((o, i) => {
              const right = o === game.items[active].a;
              const state = picked === null ? "idle" : right ? "right" : picked === i ? "wrong" : "dim";
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={picked !== null}
                  className={`flex min-h-16 items-center gap-3 rounded-2xl px-4 py-3 text-lg font-extrabold text-white shadow-lg transition-all hover:scale-[1.03] ${state === "dim" ? "scale-95 opacity-40" : ""} ${state === "right" ? "scale-105 ring-4 ring-white" : ""} ${state === "wrong" ? "animate-shake" : ""}`}
                  style={{ background: OPTION_STYLES[i].bg }}
                >
                  <span className="text-xl opacity-80">{OPTION_STYLES[i].shape}</span>
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
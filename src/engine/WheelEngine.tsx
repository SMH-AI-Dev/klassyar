import React, { useState } from "react";
import { sfx } from "@/lib/fx";
import { Hud, OPTION_STYLES, QuestionCard, buildOptions, type GameProps } from "./shared";

const COLORS = ["#ff4fa3", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7"];

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [r * Math.sin(a), -r * Math.cos(a)];
}

export default function WheelEngine({ game, roundId, onProgress, onComplete, onRestart }: GameProps) {
  const n = game.items.length;
  const seg = 360 / n;
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function spin() {
    if (spinning || current !== null) return;
    const avail = game.items.map((_, i) => i).filter((i) => !done.includes(i));
    const k = avail[Math.floor(Math.random() * avail.length)];
    const mid = k * seg + seg / 2 + (Math.random() - 0.5) * seg * 0.6;
    const cur = ((rot % 360) + 360) % 360;
    const target = (360 - mid + 360) % 360;
    setRot(rot + 360 * 5 + ((target - cur + 360) % 360));
    setSpinning(true);
    sfx.spin();
    setTimeout(() => {
      setSpinning(false);
      setOptions(buildOptions(game.items[k], game.items));
      setPicked(null);
      setCurrent(k);
    }, 4200);
  }

  function choose(i: number) {
    if (picked !== null || current === null) return;
    const correct = options[i] === game.items[current].a;
    setPicked(i);
    correct ? sfx.correct() : sfx.wrong();
    const finalScore = score + (correct ? 1 : 0);
    setScore(finalScore);
    setTimeout(() => {
      const nd = [...done, current];
      setDone(nd);
      setCurrent(null);
      if (nd.length >= n) onComplete({ score: finalScore, total: n });
    }, 1300);
  }

  return (
    <div>
      <Hud score={score} current={done.length} total={n} />
      {current === null ? (
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 text-5xl drop-shadow-lg">🔻</div>
            <div
              className="aspect-square w-full rounded-full shadow-2xl"
              style={{
                transform: `rotate(${rot}deg)`,
                transition: spinning ? "transform 4.1s cubic-bezier(0.12, 0.7, 0.1, 1)" : "none",
                border: "8px solid #fff",
              }}
            >
              <svg viewBox="-102 -102 204 204" className="h-full w-full">
                {game.items.map((it, i) => {
                  const [x1, y1] = polar(100, i * seg);
                  const [x2, y2] = polar(100, (i + 1) * seg);
                  const mid = i * seg + seg / 2;
                  const isDone = done.includes(i);
                  const label = it.q.length > 13 ? `${it.q.slice(0, 12)}…` : it.q;
                  return (
                    <g key={i} opacity={isDone ? 0.35 : 1}>
                      <path d={`M0 0 L${x1} ${y1} A100 100 0 0 1 ${x2} ${y2} Z`} fill={isDone ? "#94a3b8" : COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="1.5" />
                      <text transform={`rotate(${mid - 90}) translate(58,0)`} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={n > 6 ? 8 : 10} fontWeight="800" fontFamily="Vazirmatn, sans-serif">
                        {label}
                      </text>
                    </g>
                  );
                })}
                <circle r="13" fill="#fff" />
                <text textAnchor="middle" dominantBaseline="middle" fontSize="12">⭐</text>
              </svg>
            </div>
          </div>
          <button onClick={spin} disabled={spinning} className="btn btn-primary mt-8 px-10 py-4 text-xl">
            {spinning ? "در حال چرخش…" : "🎡 بچرخان!"}
          </button>
        </div>
      ) : (
        <div className="animate-pop">
          <QuestionCard hint={`سؤال شماره‌ی ${(current + 1).toLocaleString("fa-IR")}`}>{game.items[current].q}</QuestionCard>
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((o, i) => {
              const right = o === game.items[current].a;
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
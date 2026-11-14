import React, { useMemo, useState } from "react";
import { sfx } from "@/lib/fx";
import { shuffle } from "@/lib/text";
import { Hud, TimerBar, type GameProps } from "./shared";

export default function TrueFalseEngine({ game, roundId, onProgress, onComplete, onRestart }: GameProps) {
  const cards = useMemo(
    () =>
      game.items.map((it, i) => {
        const others = shuffle(game.items.filter((_, j) => j !== i && game.items[j].a !== it.a).map((x) => x.a));
        const wrongAnswer = it.wrong?.[0] ?? others[0];
        const truth = !wrongAnswer || Math.random() < 0.5;
        return { it, shown: truth ? it.a : wrongAnswer, truth };
      }),
    [game.items]
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState<null | { ok: boolean; dir: "left" | "right" | "none" }>(null);
  const c = cards[idx];

  function answer(choice: boolean | null) {
    if (result) return;
    const ok = choice !== null && choice === c.truth;
    setResult({ ok, dir: choice === null ? "none" : choice ? "right" : "left" });
    ok ? sfx.correct() : sfx.wrong();
    setStreak((s) => (ok ? s + 1 : 0));
    const s = score + (ok ? 1 : 0);
    setScore(s);
    setTimeout(() => {
      if (idx + 1 >= cards.length) onFinish({ score: s, total: cards.length });
      else {
        setIdx(idx + 1);
        setResult(null);
      }
    }, 1100);
  }

  return (
    <div className="mx-auto max-w-md">
      <Hud score={score} current={idx} total={cards.length} extra={streak >= 2 ? <span className="animate-pop rounded-full bg-orange-100 px-2 py-1 text-xs font-black text-orange-600">🔥 {streak.toLocaleString("fa-IR")}</span> : null} />
      <TimerBar key={idx} seconds={10} running={!result} onEnd={() => answer(null)} />
      <div className="relative mt-6 h-72">
        <div className="absolute inset-x-4 top-3 h-64 rounded-3xl bg-white/50" />
        <div
          key={idx}
          className={`absolute inset-x-0 top-0 flex h-64 flex-col items-center justify-center rounded-3xl bg-white px-6 text-center shadow-2xl ${
            result ? (result.dir === "right" ? "animate-out-right" : result.dir === "left" ? "animate-out-left" : "animate-shake") : "animate-pop"
          }`}
          style={{ border: `6px solid ${result ? (result.ok ? "#34d399" : "#f87171") : "#c4b5fd"}` }}
        >
          <div className="text-xl font-black text-violet-950 sm:text-2xl">{c.it.q}</div>
          <div className="my-2 text-3xl text-violet-400">⇩</div>
          <div className="text-2xl font-black text-fuchsia-600 sm:text-3xl">{c.shown}</div>
          {result && <div className="animate-pop absolute -top-4 text-5xl">{result.ok ? "🎉" : "😅"}</div>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => answer(false)} disabled={!!result} className="btn btn-danger py-5 text-xl">❌ غلط</button>
        <button onClick={() => answer(true)} disabled={!!result} className="btn btn-green py-5 text-xl">✅ درست</button>
      </div>
    </div>
  );
}
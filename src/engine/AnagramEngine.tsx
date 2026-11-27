import React, { useMemo, useState } from "react";
import { sfx } from "@/lib/fx";
import { norm, shuffle } from "@/lib/text";
import { Hud, QuestionCard, type GameProps } from "./shared";

type Tile = { id: number; t: string };

export default function AnagramEngine({ game, roundId, onProgress, onComplete, onRestart }: GameProps) {
  const rounds = useMemo(
    () =>
      game.items.map((it) => {
        const words = it.a.trim().split(/\s+/);
        const multi = words.length > 1;
        const parts = multi ? words : Array.from(it.a.replace(/\u200c/g, ""));
        const tiles: Tile[] = parts.map((t, id) => ({ id, t }));
        let sh = shuffle(tiles);
        for (let k = 0; k < 8 && tiles.length > 1 && sh.every((x, i) => x.id === i); k++) sh = shuffle(tiles);
        return { it, tiles: sh, multi };
      }),
    [game.items]
  );
  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [status, setStatus] = useState<null | "ok" | "bad" | "skip">(null);
  const [tries, setTries] = useState(0);
  const [score, setScore] = useState(0);
  const r = rounds[idx];

  function next(gain: number) {
    const total = score + gain;
    setScore(total);
    setTimeout(() => {
      if (idx + 1 >= rounds.length) onComplete({ score: total, total: rounds.length });
      else {
        setIdx(idx + 1);
        setPlaced([]);
        setStatus(null);
        setTries(0);
      }
    }, 1200);
  }

  function place(id: number) {
    if (status) return;
    sfx.click();
    const np = [...placed, id];
    setPlaced(np);
    if (np.length === r.tiles.length) {
      const text = np.map((i) => r.tiles.find((t) => t.id === i)!.t).join(r.multi ? " " : "");
      if (norm(text) === norm(r.it.a)) {
        sfx.correct();
        setStatus("ok");
        next(tries === 0 ? 1 : 0);
      } else {
        sfx.wrong();
        setStatus("bad");
        setTries((t) => t + 1);
        setTimeout(() => {
          setPlaced([]);
          setStatus(null);
        }, 800);
      }
    }
  }

  function skip() {
    if (status) return;
    setStatus("skip");
    setPlaced(r.tiles.slice().sort((a, b) => a.id - b.id).map((t) => t.id));
    next(0);
  }

  return (
    <div>
      <Hud score={score} current={idx} total={rounds.length} />
      <QuestionCard hint={r.multi ? "کلمه‌ها را به ترتیب درست بچین" : "حروف را مرتب کن"}>{r.it.q}</QuestionCard>

      <div className={`mb-6 flex flex-wrap justify-center gap-2 ${status === "bad" ? "animate-shake" : ""}`}>
        {r.tiles.map((_, i) => {
          const id = placed[i];
          const tile = id === undefined ? null : r.tiles.find((t) => t.id === id)!;
          return (
            <button
              key={i}
              onClick={() => tile && !status && setPlaced(placed.filter((p) => p !== id))}
              className={`grid h-14 place-items-center rounded-2xl border-4 border-dashed text-2xl font-black transition-all ${r.multi ? "min-w-20 px-3" : "w-12"} ${
                tile
                  ? status === "ok"
                    ? "animate-pop border-emerald-400 bg-emerald-100 text-emerald-700"
                    : status === "bad"
                      ? "border-red-400 bg-red-100 text-red-700"
                      : status === "skip"
                        ? "border-amber-400 bg-amber-100 text-amber-700"
                        : "animate-pop border-violet-400 bg-white text-violet-900"
                  : "border-violet-300 bg-white/60"
              }`}
            >
              {tile?.t}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {r.tiles.map((t, i) => {
          const used = placed.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => place(t.id)}
              disabled={used || !!status}
              className={`animate-pop grid h-14 place-items-center rounded-2xl text-2xl font-black text-white shadow-lg transition-all hover:-translate-y-1 ${r.multi ? "min-w-20 px-3" : "w-12"} ${used ? "scale-75 opacity-20" : ""}`}
              style={{ background: ["#ff4fa3", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i % 6], animationDelay: `${i * 50}ms` }}
            >
              {t.t}
            </button>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <button onClick={skip} className="btn btn-soft text-sm">⏭️ نمی‌دانم، بعدی</button>
      </div>
    </div>
  );
}
import React, { useMemo, useRef, useState } from "react";
import { sfx } from "@/lib/fx";
import { fa, norm } from "@/lib/text";
import { Hud, type GameProps } from "./shared";

const SIZE = 10;
const DIRS: [number, number][] = [[0, -1], [0, -1], [1, 0], [1, -1], [1, 1]];
const PERSIAN = "ابپتثجچحخدذرزسشصضطظعغفقکگلمنوهی".split("");
const LATIN = "abcdefghijklmnopqrstuvwxyz".split("");
const COLORS = ["#ff4fa3", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

type Placed = { q: string; a: string; letters: string[] };

function build(items: GameProps["items"]) {
  const prepared: Placed[] = items
    .map((it) => ({ q: it.q, a: it.a, letters: Array.from(it.a.replace(/[\s\u200c]/g, "")).map((c) => norm(c)) }))
    .sort((a, b) => b.letters.length - a.letters.length);
  const latin = prepared.some((p) => p.letters.some((l) => /[a-z]/.test(l)));
  const grid: (string | null)[][] = Array.from({ length: SIZE }, () => Array<string | null>(SIZE).fill(null));
  const placed: Placed[] = [];
  for (const p of prepared) {
    const len = p.letters.length;
    for (let t = 0; t < 300; t++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r0 = Math.floor(Math.random() * SIZE);
      const c0 = Math.floor(Math.random() * SIZE);
      const rEnd = r0 + dr * (len - 1);
      const cEnd = c0 + dc * (len - 1);
      if (rEnd < 0 || rEnd >= SIZE || cEnd < 0 || cEnd >= SIZE) continue;
      let fits = true;
      for (let k = 0; k < len; k++) {
        const cell = grid[r0 + dr * k][c0 + dc * k];
        if (cell !== null && cell !== p.letters[k]) {
          fits = false;
          break;
        }
      }
      if (!fits) continue;
      for (let k = 0; k < len; k++) grid[r0 + dr * k][c0 + dc * k] = p.letters[k];
      placed.push(p);
      break;
    }
  }
  const pool = latin ? LATIN : PERSIAN;
  const filled = grid.map((row) => row.map((c) => c ?? pool[Math.floor(Math.random() * pool.length)]));
  return { grid: filled, placed };
}

const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

export default function WordSearchEngine({ game, roundId, onProgress, onComplete, onRestart }: GameProps) {
  const { grid, placed } = useMemo(() => build(game.items), [game.items]);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [found, setFound] = useState<number[]>([]);
  const [cellColor, setCellColor] = useState<Record<string, number>>({});
  const [flash, setFlash] = useState<string | null>(null);
  const finished = useRef(false);

  function tap(r: number, c: number) {
    if (!start) {
      setStart([r, c]);
      sfx.click();
      return;
    }
    const dr = r - start[0];
    const dc = c - start[1];
    if (dr === 0 && dc === 0) {
      setStart(null);
      return;
    }
    if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) {
      setStart([r, c]);
      return;
    }
    const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    const sr = Math.sign(dr);
    const sc = Math.sign(dc);
    const cells: [number, number][] = Array.from({ length: len }, (_, k) => [start[0] + sr * k, start[1] + sc * k]);
    const str = cells.map(([a, b]) => grid[a][b]);
    const wi = placed.findIndex((p, i) => !found.includes(i) && (same(p.letters, str) || same(p.letters, [...str].reverse())));
    if (wi >= 0) {
      sfx.correct();
      const nf = [...found, wi];
      setFound(nf);
      setCellColor((cc) => {
        const copy = { ...cc };
        cells.forEach(([a, b]) => (copy[`${a}-${b}`] = wi));
        return copy;
      });
      if (nf.length === placed.length && !finished.current) {
        finished.current = true;
        sfx.win();
        setTimeout(() => onFinish({ score: placed.length, total: placed.length }), 1000);
      }
    } else {
      sfx.wrong();
      setFlash(`${start[0]}-${start[1]}`);
      setTimeout(() => setFlash(null), 400);
    }
    setStart(null);
  }

  return (
    <div>
      <Hud score={found.length} current={found.length} total={placed.length} />
      <p className="mb-3 text-center text-sm font-bold text-violet-700">اولین و آخرین حرفِ پاسخ را لمس کن</p>
      <div className="mx-auto max-w-md rounded-3xl bg-white/90 p-2 shadow-xl sm:p-3">
        <div className="dir-ltr grid gap-1" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((ch, c) => {
              const key = `${r}-${c}`;
              const ci = cellColor[key];
              const isStart = start && start[0] === r && start[1] === c;
              return (
                <button
                  key={key}
                  onClick={() => tap(r, c)}
                  className={`aspect-square rounded-lg text-base font-black uppercase transition-all sm:text-xl ${isStart ? "animate-glow scale-110 bg-violet-500 text-white" : ""} ${flash === key ? "animate-shake bg-red-200" : ""}`}
                  style={ci !== undefined ? { background: COLORS[ci % COLORS.length], color: "#fff" } : !isStart && flash !== key ? { background: "#f5f3ff", color: "#3b2a8c" } : undefined}
                >
                  {ch}
                </button>
              );
            }),
          )}
        </div>
      </div>
      <ul className="mx-auto mt-4 grid max-w-md gap-2 sm:grid-cols-2">
        {placed.map((p, i) => {
          const ok = found.includes(i);
          return (
            <li key={i} className={`rounded-xl px-3 py-2 text-sm font-bold shadow ${ok ? "animate-pop text-white" : "bg-white text-violet-900"}`} style={ok ? { background: COLORS[i % COLORS.length] } : undefined}>
              {ok ? `✅ ${p.a}` : `${p.q} (${fa(p.letters.length)} حرف)`}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
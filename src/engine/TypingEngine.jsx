import React, { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/fx";
import { norm } from "@/lib/text";
import { Hud, QuestionCard, type GameProps } from "./shared";

export default function TypingEngine({ game, roundId, onProgress, onComplete, onRestart }: GameProps) {
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "bad" | "reveal">(null);
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const it = game.items[idx];

  useEffect(() => {
    inputRef.current?.focus();
  }, [idx]);

  function advance(gain: number) {
    const s = score + gain;
    setScore(s);
    setTimeout(() => {
      if (idx + 1 >= game.items.length) onFinish({ score: s, total: game.items.length });
      else {
        setIdx(idx + 1);
        setValue("");
        setTries(0);
        setHint(false);
        setStatus(null);
      }
    }, 1300);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "ok" || status === "reveal" || !value.trim()) return;
    if (norm(value) === norm(it.a)) {
      sfx.correct();
      setStatus("ok");
      advance(1);
    } else {
      sfx.wrong();
      const t = tries + 1;
      setTries(t);
      if (t >= 2) {
        setStatus("reveal");
        advance(0);
      } else {
        setStatus("bad");
        setTimeout(() => setStatus(null), 600);
      }
    }
  }

  const pct = (idx / game.items.length) * 100;
  return (
    <div className="mx-auto max-w-lg">
      <Hud score={score} current={idx} total={game.items.length} />
      <div className="scene-night relative mb-5 h-20 overflow-hidden rounded-3xl shadow-xl">
        {["8%", "30%", "55%", "80%"].map((l, i) => (
          <span key={i} className="animate-twinkle absolute text-lg" style={{ left: l, top: `${12 + (i % 2) * 40}%`, animationDelay: `${i * 0.4}s` }}>✨</span>
        ))}
        <span className="absolute bottom-2 top-2 text-3xl transition-all duration-700" style={{ insetInlineStart: `calc(${Math.min(pct, 88)}% + 8px)` }}>
          <span className="inline-block animate-bounce-y" style={{ transform: "scaleX(-1)" }}>🚀</span>
        </span>
        <span className="absolute end-3 top-1/2 -translate-y-1/2 text-4xl">🪐</span>
      </div>

      <QuestionCard hint="پاسخ را بنویس">{it.q}</QuestionCard>
      <form onSubmit={submit} className={status === "bad" ? "animate-shake" : ""}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={status === "ok" || status === "reveal"}
          placeholder={hint ? `${Array.from(it.a)[0]} ${"_ ".repeat(Math.max(0, Array.from(it.a.replace(/\s/g, "")).length - 1))}` : "پاسخ خود را اینجا بنویس…"}
          className={`input text-center text-xl font-extrabold ${status === "ok" ? "!border-emerald-400 !bg-emerald-50" : status === "bad" || status === "reveal" ? "!border-red-400 !bg-red-50" : ""}`}
          autoComplete="off"
        />
        {status === "reveal" && <p className="animate-pop mt-3 text-center text-lg font-black text-emerald-600">پاسخ درست: {it.a}</p>}
        {status === "ok" && <p className="animate-pop mt-3 text-center text-lg font-black text-emerald-600">🎉 آفرین!</p>}
        {status === "bad" && <p className="mt-3 text-center text-sm font-bold text-red-500">اشتباه بود؛ یک فرصت دیگر داری</p>}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setHint(true)} disabled={hint} className="btn btn-soft">💡 راهنمایی</button>
          <button type="submit" className="btn btn-primary">بررسی ✔️</button>
        </div>
      </form>
    </div>
  );
}
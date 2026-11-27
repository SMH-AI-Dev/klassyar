import React, { useMemo, useState } from "react";
import { sfx } from "@/lib/fx";
import { isLetter, norm } from "@/lib/text";
import { Hud, QuestionCard, type GameProps } from "./shared";

const KEYS_FA = "ا ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه ی".split(" ");
const KEYS_EN = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
const FACES = ["😵", "😱", "😰", "😟", "🙂", "😃", "😄"];
const MAX = 6;

export default function HangmanEngine({ game, roundId, onProgress, onComplete, onRestart }: GameProps) {
  const [idx, setIdx] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);
  const [status, setStatus] = useState<null | "won" | "lost">(null);
  const [score, setScore] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const it = game.items[idx];

  const chars = useMemo(() => Array.from(it.a.replace(/\u200c/g, "")), [it]);
  const letters = chars.filter(isLetter);
  const keys = /[a-zA-Z]/.test(it.a) ? KEYS_EN : KEYS_FA;

  function next(gain: number) {
    const total = score + gain;
    setScore(total);
    setTimeout(() => {
      if (idx + 1 >= game.items.length) onComplete({ score: total, total: game.items.length });
      else {
        setIdx(idx + 1);
        setGuessed([]);
        setWrong(0);
        setStatus(null);
      }
    }, 1600);
  }

  function guess(k: string) {
    const key = norm(k);
    if (status || guessed.includes(key)) return;
    const ng = [...guessed, key];
    setGuessed(ng);
    if (!letters.some((c) => norm(c) === key)) {
      sfx.wrong();
      setShakeKey((s) => s + 1);
      const nw = wrong + 1;
      setWrong(nw);
      if (nw >= MAX) {
        setStatus("lost");
        next(0);
      }
    } else {
      sfx.correct();
      if (letters.every((c) => ng.includes(norm(c)))) {
        setStatus("won");
        sfx.win();
        next(1);
      }
    }
  }

  const lives = MAX - wrong;
  return (
    <div>
      <Hud score={score} current={idx} total={game.items.length} lives={lives} maxLives={MAX} />
      <QuestionCard hint="این کلمه چیست؟">{it.q}</QuestionCard>

      <div className="mb-4 flex items-center justify-center gap-4">
        <div key={shakeKey} className={`text-7xl ${status === "won" ? "animate-bounce-y" : shakeKey ? "animate-shake" : "animate-float"}`}>
          {status === "won" ? "🥳" : FACES[lives]}
        </div>
        <div className="flex gap-1 text-3xl">
          {Array.from({ length: MAX }).map((_, i) => (
            <span key={i} className="transition-all duration-500" style={{ opacity: i < lives ? 1 : 0.15, transform: i < lives ? "scale(1)" : "scale(0.5)" }}>🌸</span>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {chars.map((c, i) => {
          if (c === " ") return <span key={i} className="w-4" />;
          const shown = !isLetter(c) || guessed.includes(norm(c)) || status === "lost";
          return (
            <span
              key={i}
              className={`grid h-14 w-11 place-items-center rounded-xl border-b-8 bg-white text-3xl font-black shadow ${
                status === "lost" && isLetter(c) && !guessed.includes(norm(c)) ? "border-red-400 text-red-500" : "border-violet-400 text-violet-900"
              } ${shown ? "animate-pop" : ""}`}
            >
              {shown ? c : ""}
            </span>
          );
        })}
      </div>

      <div dir={keys === KEYS_EN ? "ltr" : "rtl"} className="mx-auto flex max-w-xl flex-wrap justify-center gap-2">
        {keys.map((k) => {
          const used = guessed.includes(norm(k));
          const hit = used && letters.some((c) => norm(c) === norm(k));
          return (
            <button
              key={k}
              onClick={() => guess(k)}
              disabled={used || !!status}
              className={`h-11 w-10 rounded-xl text-lg font-extrabold shadow transition-all hover:-translate-y-1 active:scale-90 ${
                used ? (hit ? "bg-emerald-400 text-white" : "scale-90 bg-slate-300 text-slate-500") : "bg-white text-violet-900"
              }`}
            >
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}
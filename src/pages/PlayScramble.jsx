import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, XCircle, Shuffle } from "lucide-react";
import { motion } from "framer-motion";
import ActivityResultReporter from "@/lib/ActivityResultReporter";

const shuffle = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function readData(searchParams) {
  try {
    const raw = searchParams.get("data");
    return raw ? JSON.parse(decodeURIComponent(raw)) : null;
  } catch {
    return null;
  }
}

export default function PlayScramble() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const data = useMemo(() => readData(searchParams), [searchParams]);
  const [questions, setQuestions] = useState(() => shuffle(data?.questions || []));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setQuestions(shuffle(data?.questions || []));
    setCurrent(0);
    setResult(null);
    setScore({ correct: 0, total: 0 });
  }, [data]);

  const q = questions[current];
  useEffect(() => {
    if (q?.answer) {
      setTiles(shuffle(q.answer.split("").map((character, id) => ({ id, character }))));
      setSelected([]);
    }
  }, [q]);

  if (!data || !Array.isArray(data.questions) || !data.questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 to-green-50">
        <Card className="clay-element p-8 text-center">
          <p className="text-gray-600">داده‌ای برای نمایش وجود ندارد</p>
          <Button onClick={() => navigate(-1)} className="mt-4">بازگشت</Button>
        </Card>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-lime-50 to-green-50 flex items-center justify-center">
        <ActivityResultReporter activity={data} type="scramble" score={score.correct} total={score.total} />
        <Card className="clay-element p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">پایان!</h2>
          <p className="text-lg text-gray-600 mb-4">امتیاز: {score.correct} از {score.total}</p>
          <Button onClick={() => navigate("/Dashboard")} className="rounded-2xl clay-element">بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  const answer = selected.map((id) => tiles.find((tile) => tile.id === id)?.character || "").join("");
  const check = () => {
    if (result !== null || !tiles.length || selected.length !== tiles.length) return;
    const isCorrect = answer.trim().toLowerCase() === q.answer.trim().toLowerCase();
    setResult(isCorrect);
    setScore((previous) => ({ correct: previous.correct + (isCorrect ? 1 : 0), total: previous.total + 1 }));
  };
  const next = () => {
    setSelected([]);
    setResult(null);
    setCurrent((previous) => previous + 1);
  };
  const rescramble = () => {
    setTiles(shuffle(tiles));
    setSelected([]);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-lime-50 to-green-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full clay-element flex items-center justify-center bg-white">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">حروف بهم ریخته 🔀</h1>
        </div>

        <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="clay-element border-0 bg-white/90 mb-4">
            <CardContent className="p-8 text-center">
              <div className="text-sm text-gray-400 mb-2">سوال {current + 1} از {questions.length}</div>
              {q.hint && <p className="text-gray-600 mb-4">{q.hint}</p>}
              <div className="flex flex-wrap gap-2 justify-center mb-5" dir="ltr">
                {tiles.map((tile) => {
                  const chosen = selected.includes(tile.id);
                  return (
                    <button
                      type="button"
                      key={tile.id}
                      disabled={result !== null}
                      onClick={() => setSelected((previous) => chosen ? previous.filter((id) => id !== tile.id) : [...previous, tile.id])}
                      className={`w-12 h-12 rounded-xl text-xl font-bold clay-element ${chosen ? "bg-green-700 text-white/60" : "bg-white text-gray-800 border-2 border-green-300"}`}
                    >
                      {tile.character === " " ? "\u00A0" : tile.character}
                    </button>
                  );
                })}
              </div>
              <div className="min-h-12 flex justify-center gap-2 flex-wrap mb-5" dir="ltr" aria-live="polite">
                {selected.map((id) => <span key={id} className="rounded-lg bg-gray-50 px-3 py-2 text-xl font-bold">{tiles.find((tile) => tile.id === id)?.character}</span>)}
              </div>
              {result === null ? (
                <div className="flex gap-2">
                  <Button onClick={rescramble} variant="outline" className="flex-1 rounded-2xl clay-element">
                    <Shuffle className="w-4 h-4 ml-1" /> بهم ریختن مجدد
                  </Button>
                  <Button onClick={check} disabled={!tiles.length || selected.length !== tiles.length} className="flex-1 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-2xl clay-element">
                    بررسی
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`text-6xl ${result ? "text-green-500" : "text-red-500"}`}>
                    {result ? <CheckCircle className="w-16 h-16 mx-auto" /> : <XCircle className="w-16 h-16 mx-auto" />}
                  </div>
                  <p className="text-lg font-bold">{result ? "✅ درست!" : `❌ نادرست — ${q.answer}`}</p>
                  <Button onClick={next} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl clay-element">
                    {current < questions.length - 1 ? "سوال بعدی" : "مشاهده نتیجه"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

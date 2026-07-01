import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, XCircle, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

export default function PlayScramble() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const data = searchParams.get("data") ? JSON.parse(decodeURIComponent(searchParams.get("data"))) : null;
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  if (!data || !data.questions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 to-green-50">
        <Card className="clay-element p-8 text-center">
          <p className="text-gray-600">داده‌ای برای نمایش وجود ندارد</p>
          <Button onClick={() => navigate(-1)} className="mt-4">بازگشت</Button>
        </Card>
      </div>
    );
  }

  const q = data.questions[current];
  if (!q) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-lime-50 to-green-50 flex items-center justify-center">
        <Card className="clay-element p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">پایان!</h2>
          <p className="text-lg text-gray-600 mb-4">امتیاز: {score.correct} از {score.total}</p>
          <Button onClick={() => navigate("/Dashboard")} className="rounded-2xl clay-element">
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  const scrambled = useMemo(() => {
    const s = q.answer.split("").sort(() => Math.random() - 0.5).join("");
    return s !== q.answer ? s : s.split("").reverse().join("");
  }, [current, q.answer]);

  const check = () => {
    const isCorrect = answer.trim().toLowerCase() === q.answer.trim().toLowerCase();
    setResult(isCorrect);
    setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
  };

  const next = () => {
    setAnswer("");
    setResult(null);
    setCurrent(prev => prev + 1);
  };

  const rescramble = () => setAnswer("");

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
              <div className="text-sm text-gray-400 mb-2">سوال {current + 1} از {data.questions.length}</div>
              {q.hint && <p className="text-gray-600 mb-4">{q.hint}</p>}

              <div className="text-4xl font-bold tracking-[0.5em] text-gray-800 mb-6 bg-gray-50 p-4 rounded-2xl clay-element" dir="ltr">
                {scrambled.split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="inline-block"
                  >{ch}</motion.span>
                ))}
              </div>

              {!result ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="کلمه درست را بنویسید..."
                    className="w-full p-3 rounded-2xl bg-gray-50 border-2 border-gray-200 outline-none focus:border-green-400 transition-all text-right text-lg"
                    dir="rtl"
                    onKeyDown={e => e.key === "Enter" && answer.trim() && check()}
                  />
                  <div className="flex gap-2">
                    <Button onClick={rescramble} variant="outline" className="flex-1 rounded-2xl clay-element">
                      <Shuffle className="w-4 h-4 ml-1" /> بهم ریختن مجدد
                    </Button>
                    <Button onClick={check} disabled={!answer.trim()} className="flex-1 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-2xl clay-element">
                      بررسی
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`text-6xl ${result ? "text-green-500" : "text-red-500"}`}>
                    {result ? <CheckCircle className="w-16 h-16 mx-auto" /> : <XCircle className="w-16 h-16 mx-auto" />}
                  </div>
                  <p className="text-lg font-bold">{result ? "✅ درست!" : "❌ نادرست"}</p>
                  {!result && <p className="text-gray-500">کلمه درست: {q.answer}</p>}
                  <Button onClick={next} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl clay-element">
                    {current < data.questions.length - 1 ? "سوال بعدی" : "مشاهده نتیجه"}
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

import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PlayType() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const data = searchParams.get("data") ? JSON.parse(decodeURIComponent(searchParams.get("data"))) : null;
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  if (!data || !data.questions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
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
      <div className="min-h-screen p-4 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
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

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full clay-element flex items-center justify-center bg-white">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">پاسخ تشریحی ✍️</h1>
        </div>

        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="clay-element border-0 bg-white/90 mb-4">
            <CardContent className="p-8 text-center">
              <div className="text-sm text-gray-400 mb-2">سوال {current + 1} از {data.questions.length}</div>
              <p className="text-xl font-bold text-gray-800 mb-6">{q.hint}</p>
              {!result ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="پاسخ خود را بنویسید..."
                    className="w-full p-3 rounded-2xl bg-gray-50 border-2 border-gray-200 outline-none focus:border-cyan-400 transition-all text-right"
                    dir="rtl"
                    onKeyDown={e => e.key === "Enter" && answer.trim() && check()}
                  />
                  <Button onClick={check} disabled={!answer.trim()} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl clay-element">
                    بررسی پاسخ
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`text-6xl ${result ? "text-green-500" : "text-red-500"}`}>
                    {result ? <CheckCircle className="w-16 h-16 mx-auto" /> : <XCircle className="w-16 h-16 mx-auto" />}
                  </div>
                  <p className="text-lg font-bold">{result ? "✅ پاسخ درست!" : "❌ پاسخ نادرست"}</p>
                  {!result && <p className="text-gray-500">پاسخ درست: {q.answer}</p>}
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

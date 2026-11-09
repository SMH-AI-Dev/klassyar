import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import ActivityResultReporter from "@/lib/ActivityResultReporter";
import selectionPrompt from "@/lib/selectionPrompt";

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

export default function PlayType() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const data = useMemo(() => readData(searchParams), [searchParams]);
  const [questions, setQuestions] = useState(() => shuffle(data?.questions || []));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setQuestions(shuffle(data?.questions || []));
    setCurrent(0);
    setSelected(null);
    setResult(null);
    setScore({ correct: 0, total: 0 });
  }, [data]);

  const q = questions[current];
  useEffect(() => {
    if (!q) return;
    const authoredOptions = Array.isArray(q.options) ? q.options : [];
    const answerPool = authoredOptions.length >= 2
      ? authoredOptions
      : questions.map((question) => question.answer);
    const choices = [...new Set([...answerPool, q.answer].map((answer) => String(answer || "").trim()).filter(Boolean))];
    const distractors = choices.filter((answer) => answer !== q.answer).slice(0, 3);
    if (!distractors.length) distractors.push(q.answer === "گزینهٔ نادرست" ? "پاسخ دیگر" : "گزینهٔ نادرست");
    setOptions(shuffle([...distractors, q.answer]));
    setSelected(null);
  }, [q, questions]);

  if (!data || !Array.isArray(data.questions) || !data.questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
        <Card className="clay-element p-8 text-center">
          <p className="text-gray-600">داده‌ای برای نمایش وجود ندارد</p>
          <Button onClick={() => navigate(-1)} className="mt-4">بازگشت</Button>
        </Card>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <ActivityResultReporter activity={data} type="type" score={score.correct} total={score.total} />
        <Card className="clay-element p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">پایان!</h2>
          <p className="text-lg text-gray-600 mb-4">امتیاز: {score.correct} از {score.total}</p>
          <Button onClick={() => navigate("/Dashboard")} className="rounded-2xl clay-element">بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  const check = () => {
    if (!selected || result !== null) return;
    const isCorrect = selected.trim().toLowerCase() === q.answer.trim().toLowerCase();
    setResult(isCorrect);
    setScore((previous) => ({ correct: previous.correct + (isCorrect ? 1 : 0), total: previous.total + 1 }));
  };
  const next = () => {
    setSelected(null);
    setResult(null);
    setCurrent((previous) => previous + 1);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full clay-element flex items-center justify-center bg-white">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">تمرین انتخاب پاسخ 🗳️</h1>
            <p className="text-sm text-gray-500">پاسخ درست را با کلیک انتخاب کن؛ نیازی به نوشتن نیست.</p>
          </div>
        </div>

        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="clay-element border-0 bg-white/90 mb-4">
            <CardContent className="p-8 text-center">
              <div className="text-sm text-gray-400 mb-2">سوال {current + 1} از {questions.length}</div>
              <p className="text-xl font-bold text-gray-800 mb-6">{selectionPrompt(q)}</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {options.map((option) => (
                  <button
                    type="button"
                    key={option}
                    disabled={result !== null}
                    onClick={() => setSelected(option)}
                    className={`p-4 rounded-xl border-2 text-lg font-bold transition-all clay-element ${
                      selected === option ? "bg-cyan-100 border-cyan-500 text-cyan-900" : "bg-white border-gray-200 text-gray-800 hover:border-cyan-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {result === null ? (
                <Button onClick={check} disabled={!selected} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl clay-element">
                  بررسی پاسخ
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className={`text-6xl ${result ? "text-green-500" : "text-red-500"}`}>
                    {result ? <CheckCircle className="w-16 h-16 mx-auto" /> : <XCircle className="w-16 h-16 mx-auto" />}
                  </div>
                  <p className="text-lg font-bold">{result ? "✅ پاسخ درست!" : `❌ پاسخ درست: ${q.answer}`}</p>
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

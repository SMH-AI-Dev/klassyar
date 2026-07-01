import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AnswerInput from "@/components/shared/AnswerInput";

export default function CreateType() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([{ hint: "", answer: "" }]);

  const addQuestion = () => setQuestions([...questions, { hint: "", answer: "" }]);

  const removeQuestion = (i) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, idx) => idx !== i));
  };

  const update = (i, field, val) => {
    const copy = [...questions];
    copy[i][field] = val;
    setQuestions(copy);
  };

  const save = () => {
    const data = {
      title: "فعالیت تشریحی",
      description: "پاسخ تشریحی توسط دانش‌آموزان",
      type: "type",
      questions: questions.filter(q => q.hint && q.answer),
    };
    localStorage.setItem("pendingActivity", JSON.stringify(data));
    navigate("/Dashboard");
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full clay-element flex items-center justify-center bg-white">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">پرسش تشریحی ✍️</h1>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="clay-element border-0">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">سوال {i + 1}</span>
                    {questions.length > 1 && (
                      <button onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <AnswerInput
                    label="متن سوال / راهنما"
                    value={q.hint}
                    onChange={v => update(i, "hint", v)}
                    placeholder="مثال: پایتخت ایران کجاست؟"
                  />
                  <AnswerInput
                    label="پاسخ درست"
                    value={q.answer}
                    onChange={v => update(i, "answer", v)}
                    placeholder="مثال: تهران"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={addQuestion} variant="outline" className="flex-1 h-12 rounded-2xl clay-element">
            <Plus className="w-5 h-5 ml-2" /> افزودن سوال
          </Button>
          <Button onClick={save} className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl clay-element">
            <Save className="w-5 h-5 ml-2" /> ذخیره فعالیت
          </Button>
        </div>
      </div>
    </div>
  );
}

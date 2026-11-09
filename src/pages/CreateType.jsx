import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AnswerInput from "@/components/shared/AnswerInput";

export default function CreateType() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([{ hint: "", answer: "", distractors: ["", "", ""] }]);

  const addQuestion = () => setQuestions([...questions, { hint: "", answer: "", distractors: ["", "", ""] }]);

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
    const incomplete = questions.some((question) => (
      !question.hint.trim()
      || !question.answer.trim()
      || question.distractors.some((option) => !option.trim())
    ));
    if (incomplete) {
      alert("لطفاً متن هر سوال، پاسخ درست و سه گزینه نادرست را کامل کنید");
      return;
    }

    const hasDuplicateOptions = questions.some((question) => {
      const options = [question.answer, ...question.distractors].map((option) => option.trim().toLocaleLowerCase());
      return new Set(options).size !== options.length;
    });
    if (hasDuplicateOptions) {
      alert("گزینه‌های هر سوال باید با یکدیگر متفاوت باشند");
      return;
    }

    const data = {
      title: "تمرین انتخاب پاسخ",
      description: "دانش‌آموز پاسخ درست را از میان گزینه‌ها انتخاب می‌کند",
      type: "type",
      questions: questions.map((question) => ({
        hint: question.hint.trim(),
        answer: question.answer.trim(),
        options: [question.answer.trim(), ...question.distractors.map((option) => option.trim())],
      })),
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
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ساخت تمرین انتخابی 🗳️</h1>
            <p className="text-sm text-gray-500">دانش‌آموز پاسخ را با کلیک انتخاب می‌کند و نیازی به تایپ ندارد.</p>
          </div>
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
                  {q.distractors.map((option, optionIndex) => (
                    <AnswerInput
                      key={optionIndex}
                      label={`گزینه نادرست ${optionIndex + 1}`}
                      value={option}
                      onChange={value => {
                        const distractors = [...q.distractors];
                        distractors[optionIndex] = value;
                        update(i, "distractors", distractors);
                      }}
                      placeholder={`گزینه ${optionIndex + 1}`}
                    />
                  ))}
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

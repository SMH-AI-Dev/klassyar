import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/lib/sonner";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "quiz",
    theme: "mint",
    content: {
      questions: [{
        question: "",
        image: "",
        options: ["", "", "", ""],
        correct_answer: 0
      }]
    }
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const me = await base44.auth.me();
      return base44.entities.Activity.create({
        ...data,
        created_by: me.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate("/Dashboard");
    },
    onError: (error) => {
      console.error("Error creating activity:", error);
      toast.error("خطا در ایجاد فعالیت");
    },
  });

  const addQuestion = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: [...prev.content.questions, {
          question: "",
          image: "",
          options: ["", "", "", ""],
          correct_answer: 0
        }]
      }
    }));
  };

  const removeQuestion = (index) => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: prev.content.questions.filter((_, i) => i !== index)
      }
    }));
  };

  const updateQuestion = (qIndex, field, value) => {
    setActivity(prev => {
      const newQuestions = [...prev.content.questions];
      newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, questions: newQuestions }
      };
    });
  };

  const updateOption = (qIndex, optIndex, value) => {
    setActivity(prev => {
      const newQuestions = [...prev.content.questions];
      newQuestions[qIndex].options[optIndex] = value;
      return {
        ...prev,
        content: { ...prev.content, questions: newQuestions }
      };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.questions.length === 0) {
      toast.error("لطفاً عنوان و حداقل یک سوال اضافه کنید");
      return;
    }
    createMutation.mutate(activity);
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/Dashboard")}
              variant="outline"
              size="icon"
              className="rounded-xl clay-element"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">آزمون چندگزینه‌ای</h1>
              <p className="text-gray-600">ساخت آزمون تستی</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            ذخیره آزمون
          </Button>
        </motion.div>

        <Card className="clay-element bg-white/80 border-0 mb-6">
          <CardHeader>
            <CardTitle>اطلاعات آزمون</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عنوان</Label>
              <Input
                value={activity.title}
                onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                placeholder="مثال: آزمون ریاضی فصل 2"
                className="rounded-xl clay-element"
              />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea
                value={activity.description}
                onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                placeholder="توضیحات آزمون..."
                className="rounded-xl clay-element"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {activity.content.questions.map((question, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
            >
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">سوال {qIndex + 1}</CardTitle>
                  <Button
                    onClick={() => removeQuestion(qIndex)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>متن سوال</Label>
                    <Textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="سوال خود را بنویسید..."
                      className="rounded-xl clay-element"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>گزینه‌ها</Label>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                          placeholder={`گزینه ${optIndex + 1}`}
                          className="rounded-xl clay-element"
                        />
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correct_answer === optIndex}
                          onChange={() => updateQuestion(qIndex, 'correct_answer', optIndex)}
                          className="w-5 h-5"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={addQuestion}
          variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-green-300 hover:bg-green-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن سوال جدید
        </Button>
      </div>
    </div>
  );
}

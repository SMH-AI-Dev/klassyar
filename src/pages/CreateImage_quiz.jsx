import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, ArrowRight, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

import ImagePicker from "../components/shared/ImagePicker";

export default function CreateImage_quiz() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "image_quiz",
    theme: "cyan",
    content: {
      questions: [{ image: "", question: "", options: ["", "", "", ""], correctAnswer: 0 }]
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const addQuestion = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: [...prev.content.questions, { image: "", question: "", options: ["", "", "", ""], correctAnswer: 0 }]
      }
    }));
  };

  const removeQuestion = (index) => {
    if (activity.content.questions.length <= 1) {
      alert("باید حداقل 1 سوال وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: prev.content.questions.filter((_, i) => i !== index)
      }
    }));
  };

  const updateQuestion = (index, field, value) => {
    setActivity(prev => {
      const newQuestions = [...prev.content.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, content: { ...prev.content, questions: newQuestions } };
    });
  };

  const updateOption = (qIndex, oIndex, value) => {
    setActivity(prev => {
      const newQuestions = [...prev.content.questions];
      newQuestions[qIndex].options[oIndex] = value;
      return { ...prev, content: { ...prev.content, questions: newQuestions } };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.questions.length === 0) {
      alert("لطفاً عنوان و حداقل یک سوال اضافه کنید");
      return;
    }
    createMutation.mutate(activity);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <Button onClick={() => navigate(createPageUrl("Dashboard"))} variant="outline" size="icon" className="rounded-xl clay-element">
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <ImageIcon className="w-8 h-8" />
                آزمون تصویری
              </h1>
              <p className="text-sm md:text-base text-gray-600">سوالات با تصویر</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl clay-element">
            <Save className="w-5 h-5 ml-2" />
            ذخیره فعالیت
          </Button>
        </motion.div>

        <Card className="clay-element bg-white/80 border-0 mb-6">
          <CardHeader><CardTitle className="text-lg md:text-xl">اطلاعات فعالیت</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عنوان</Label>
              <Input value={activity.title} onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                placeholder="مثال: شناسایی حیوانات" className="rounded-xl clay-element" />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea value={activity.description} onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                placeholder="توضیحات کوتاه..." className="rounded-xl clay-element" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-6">
          {activity.content.questions.map((q, qIndex) => (
            <motion.div key={qIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qIndex * 0.1 }}>
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg">سوال {qIndex + 1}</CardTitle>
                  <Button onClick={() => removeQuestion(qIndex)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>تصویر سوال</Label>
                    <ImagePicker currentImage={q.image} onSelect={(url) => updateQuestion(qIndex, 'image', url)} />
                  </div>
                  <div>
                    <Label>سوال</Label>
                    <Input value={q.question} onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="این چیست؟" className="rounded-xl clay-element" />
                  </div>
                  <div className="space-y-3">
                    <Label>گزینه‌ها</Label>
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex gap-3">
                        <div className="flex items-center">
                          <input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswer === oIndex}
                            onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)} className="w-5 h-5" />
                        </div>
                        <Input value={option} onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`گزینه ${oIndex + 1}`} className={`rounded-xl clay-element ${q.correctAnswer === oIndex ? 'bg-green-100' : ''}`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button onClick={addQuestion} variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-cyan-300 hover:bg-cyan-50">
          <Plus className="w-5 h-5 ml-2" />
          افزودن سوال جدید
        </Button>
      </div>
    </div>
  );
}

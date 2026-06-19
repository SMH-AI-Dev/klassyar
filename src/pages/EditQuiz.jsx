import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function EditQuiz() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "quiz",
    theme: "orange",
    content: {
      questions: [{
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
        image: ""
      }]
    }
  });

  const { data: existingActivity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
    enabled: !!activityId,
  });

  useEffect(() => {
    if (existingActivity) {
      setActivity(existingActivity);
    }
  }, [existingActivity]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.update(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      navigate("/Dashboard");
    },
  });

  const addQuestion = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: [...prev.content.questions, {
          question: "",
          options: ["", "", "", ""],
          correct_answer: 0,
          image: ""
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
      const newOptions = [...newQuestions[qIndex].options];
      newOptions[optIndex] = value;
      newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
      return {
        ...prev,
        content: { ...prev.content, questions: newQuestions }
      };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.questions.length === 0) {
      alert("لطفاً عنوان و حداقل یک سوال اضافه کنید");
      return;
    }
    updateMutation.mutate(activity);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!existingActivity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate("/Dashboard")}>بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-800">ویرایش آزمون</h1>
              <p className="text-gray-600">ویرایش سوالات چندگزینه‌ای</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
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
                placeholder="مثال: آزمون ریاضی فصل 3"
                className="rounded-xl clay-element"
              />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea
                value={activity.description}
                onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                placeholder="توضیحات کوتاه..."
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

                  <div className="space-y-3">
                    <Label>گزینه‌ها:</Label>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                          placeholder={`گزینه ${optIndex + 1}`}
                          className="rounded-xl clay-element"
                        />
                        <Button
                          onClick={() => updateQuestion(qIndex, 'correct_answer', optIndex)}
                          variant={question.correct_answer === optIndex ? "default" : "outline"}
                          className={`rounded-xl clay-element ${
                            question.correct_answer === optIndex
                              ? 'bg-green-500 hover:bg-green-600'
                              : ''
                          }`}
                        >
                          {question.correct_answer === optIndex ? '✓ صحیح' : 'انتخاب'}
                        </Button>
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
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-orange-300 hover:bg-orange-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن سوال جدید
        </Button>
      </div>
    </div>
  );
}

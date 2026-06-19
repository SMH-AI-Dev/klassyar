import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Save, Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "@/lib/sonner";

export default function EditTrue_false() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "true_false",
    content: {
      questions: [
        { question: "", correctAnswer: true },
        { question: "", correctAnswer: false }
      ]
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
      toast.success("فعالیت با موفقیت ذخیره شد");
      navigate("/Dashboard");
    },
    onError: () => {
      toast.error("خطا در ذخیره فعالیت");
    },
  });

  const handleSave = () => {
    if (!activity.title.trim()) {
      toast.error("لطفاً عنوان را وارد کنید");
      return;
    }

    const validQuestions = activity.content.questions.filter(q => q.question.trim());

    if (validQuestions.length < 2) {
      toast.error("حداقل 2 سوال معتبر وارد کنید");
      return;
    }

    const activityData = {
      ...activity,
      content: {
        questions: validQuestions
      }
    };

    updateMutation.mutate(activityData);
  };

  const addQuestion = () => {
    setActivity({
      ...activity,
      content: {
        questions: [...activity.content.questions, { question: "", correctAnswer: true }]
      }
    });
  };

  const removeQuestion = (index) => {
    if (activity.content.questions.length <= 2) {
      toast.error("حداقل 2 سوال باید وجود داشته باشد");
      return;
    }
    const newQuestions = activity.content.questions.filter((_, i) => i !== index);
    setActivity({
      ...activity,
      content: { questions: newQuestions }
    });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...activity.content.questions];
    newQuestions[index][field] = value;
    setActivity({
      ...activity,
      content: { questions: newQuestions }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              ویرایش بازی درست/غلط
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </motion.div>

        {/* Main Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="clay-element bg-gradient-to-br from-lime-50 to-green-50 border-0">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان فعالیت</Label>
                  <Input
                    id="title"
                    value={activity.title}
                    onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                    placeholder="عنوان را وارد کنید..."
                    className="mt-2 rounded-xl clay-element"
                  />
                </div>
                <div>
                  <Label htmlFor="description">توضیحات (اختیاری)</Label>
                  <Textarea
                    id="description"
                    value={activity.description}
                    onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                    placeholder="توضیحات را وارد کنید..."
                    className="mt-2 rounded-xl clay-element"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <Card className="clay-element bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">سوالات</h3>
                <Button
                  onClick={addQuestion}
                  variant="outline"
                  size="sm"
                  className="rounded-xl clay-element"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن سوال
                </Button>
              </div>

              <div className="space-y-4">
                {activity.content.questions.map((q, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl p-4 clay-element"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="flex-1 space-y-4">
                        <div>
                          <Label className="text-sm text-gray-600">سوال {index + 1}</Label>
                          <Input
                            value={q.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            placeholder="سوال را وارد کنید..."
                            className="mt-2 rounded-xl clay-element"
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Label className="text-sm text-gray-600 w-24">پاسخ صحیح:</Label>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => updateQuestion(index, 'correctAnswer', true)}
                              variant={q.correctAnswer === true ? "default" : "outline"}
                              className={`rounded-xl clay-element ${
                                q.correctAnswer === true 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                                  : ''
                              }`}
                            >
                              <Check className="w-4 h-4 ml-2" />
                              درست
                            </Button>
                            <Button
                              onClick={() => updateQuestion(index, 'correctAnswer', false)}
                              variant={q.correctAnswer === false ? "default" : "outline"}
                              className={`rounded-xl clay-element ${
                                q.correctAnswer === false 
                                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' 
                                  : ''
                              }`}
                            >
                              <X className="w-4 h-4 ml-2" />
                              غلط
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => removeQuestion(index)}
                        variant="outline"
                        size="icon"
                        className="rounded-xl clay-element text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

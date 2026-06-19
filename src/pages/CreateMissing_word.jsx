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
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateMissing_word() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "missing_word",
    theme: "pink",
    content: {
      sentences: [{ sentence: "", missingWord: "", options: ["", "", ""] }]
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const addSentence = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sentences: [...prev.content.sentences, { sentence: "", missingWord: "", options: ["", "", ""] }]
      }
    }));
  };

  const removeSentence = (index) => {
    if (activity.content.sentences.length <= 1) {
      alert("باید حداقل 1 جمله وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sentences: prev.content.sentences.filter((_, i) => i !== index)
      }
    }));
  };

  const updateSentence = (index, field, value) => {
    setActivity(prev => {
      const newSentences = [...prev.content.sentences];
      newSentences[index] = { ...newSentences[index], [field]: value };
      return { ...prev, content: { ...prev.content, sentences: newSentences } };
    });
  };

  const updateOption = (sIndex, oIndex, value) => {
    setActivity(prev => {
      const newSentences = [...prev.content.sentences];
      newSentences[sIndex].options[oIndex] = value;
      return { ...prev, content: { ...prev.content, sentences: newSentences } };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.sentences.length === 0) {
      alert("لطفاً عنوان و حداقل یک جمله اضافه کنید");
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">کلمه گمشده 🔍</h1>
              <p className="text-sm md:text-base text-gray-600">کلمه مناسب را انتخاب کنید</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl clay-element">
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
                placeholder="مثال: کلمات گمشده" className="rounded-xl clay-element" />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea value={activity.description} onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                placeholder="توضیحات کوتاه..." className="rounded-xl clay-element" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-6">
          {activity.content.sentences.map((s, sIndex) => (
            <motion.div key={sIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sIndex * 0.1 }}>
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg">جمله {sIndex + 1}</CardTitle>
                  <Button onClick={() => removeSentence(sIndex)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>جمله (از ___ برای جای خالی استفاده کنید)</Label>
                    <Textarea value={s.sentence} onChange={(e) => updateSentence(sIndex, 'sentence', e.target.value)}
                      placeholder="مثال: من دیروز به ___ رفتم." className="rounded-xl clay-element" rows={2} />
                  </div>
                  <div>
                    <Label>کلمه صحیح (پاسخ)</Label>
                    <Input value={s.missingWord} onChange={(e) => updateSentence(sIndex, 'missingWord', e.target.value)}
                      placeholder="مثال: مدرسه" className="rounded-xl clay-element bg-green-50" />
                  </div>
                  <div>
                    <Label>گزینه‌های اشتباه</Label>
                    <div className="space-y-2">
                      {s.options.map((opt, oIndex) => (
                        <Input key={oIndex} value={opt} onChange={(e) => updateOption(sIndex, oIndex, e.target.value)}
                          placeholder={`گزینه اشتباه ${oIndex + 1}`} className="rounded-xl clay-element bg-red-50" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button onClick={addSentence} variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-pink-300 hover:bg-pink-50">
          <Plus className="w-5 h-5 ml-2" />
          افزودن جمله جدید
        </Button>
      </div>
    </div>
  );
}

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

export default function CreateHangman() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "hangman",
    theme: "red",
    content: {
      words: [{ word: "", hint: "" }]
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const addWord = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        words: [...prev.content.words, { word: "", hint: "" }]
      }
    }));
  };

  const removeWord = (index) => {
    if (activity.content.words.length <= 1) {
      alert("باید حداقل 1 کلمه وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        words: prev.content.words.filter((_, i) => i !== index)
      }
    }));
  };

  const updateWord = (index, field, value) => {
    setActivity(prev => {
      const newWords = [...prev.content.words];
      newWords[index] = { ...newWords[index], [field]: value };
      return { ...prev, content: { ...prev.content, words: newWords } };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.words.length === 0) {
      alert("لطفاً عنوان و حداقل یک کلمه اضافه کنید");
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">چوبه دار 🎯</h1>
              <p className="text-sm md:text-base text-gray-600">حدس بزن و کلمه را پیدا کن</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl clay-element">
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
                placeholder="مثال: حدس کلمات" className="rounded-xl clay-element" />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea value={activity.description} onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                placeholder="توضیحات کوتاه..." className="rounded-xl clay-element" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-6">
          {activity.content.words.map((w, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg">کلمه {index + 1}</CardTitle>
                  <Button onClick={() => removeWord(index)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>کلمه</Label>
                    <Input value={w.word} onChange={(e) => updateWord(index, 'word', e.target.value)}
                      placeholder="مثال: فیل" className="rounded-xl clay-element" />
                  </div>
                  <div>
                    <Label>راهنما</Label>
                    <Textarea value={w.hint} onChange={(e) => updateWord(index, 'hint', e.target.value)}
                      placeholder="مثال: حیوان بزرگ با خرطوم" className="rounded-xl clay-element" rows={2} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button onClick={addWord} variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-red-300 hover:bg-red-50">
          <Plus className="w-5 h-5 ml-2" />
          افزودن کلمه جدید
        </Button>
      </div>
    </div>
  );
}

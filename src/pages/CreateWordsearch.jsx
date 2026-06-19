import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateWordsearch() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "wordsearch",
    theme: "sky",
    content: {
      words: ["", "", "", ""],
      grid_size: 10
    }
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
  });

  const addWord = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        words: [...prev.content.words, ""]
      }
    }));
  };

  const removeWord = (index) => {
    if (activity.content.words.length <= 3) {
      alert("باید حداقل 3 کلمه وجود داشته باشد");
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

  const updateWord = (index, value) => {
    setActivity(prev => {
      const newWords = [...prev.content.words];
      newWords[index] = value;
      return {
        ...prev,
        content: { ...prev.content, words: newWords }
      };
    });
  };

  const handleSave = () => {
    const validWords = activity.content.words.filter(w => w.trim().length >= 3);
    
    if (!activity.title || validWords.length < 3) {
      alert("لطفاً عنوان و حداقل 3 کلمه (هر کلمه حداقل 3 حرف) اضافه کنید");
      return;
    }
    
    createMutation.mutate({
      ...activity,
      content: {
        ...activity.content,
        words: validWords
      }
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <Button
              onClick={() => navigate("/Dashboard")}
              variant="outline"
              size="icon"
              className="rounded-xl clay-element"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">پیدا کردن کلمه</h1>
              <p className="text-sm md:text-base text-gray-600">جدول کلمات متقاطع</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            ذخیره فعالیت
          </Button>
        </motion.div>

        <Card className="clay-element bg-white/80 border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">اطلاعات فعالیت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عنوان</Label>
              <Input
                value={activity.title}
                onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                placeholder="مثال: پیدا کردن اسم حیوانات"
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
            <div>
              <Label>اندازه جدول: {activity.content.grid_size}×{activity.content.grid_size}</Label>
              <input
                type="range"
                min="8"
                max="15"
                value={activity.content.grid_size}
                onChange={(e) => setActivity({
                  ...activity,
                  content: { ...activity.content, grid_size: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="clay-element bg-white border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">کلمات مخفی شده</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.content.words.map((word, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3"
              >
                <Input
                  value={word}
                  onChange={(e) => updateWord(index, e.target.value)}
                  placeholder={`کلمه ${index + 1} (حداقل 3 حرف)`}
                  className="rounded-xl clay-element"
                />
                <Button
                  onClick={() => removeWord(index)}
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  disabled={activity.content.words.length <= 3}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Button
          onClick={addWord}
          variant="outline"
          className="w-full h-14 rounded-2xl clay-element border-2 border-dashed border-blue-300 hover:bg-blue-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن کلمه جدید
        </Button>

        <div className="mt-6 p-4 bg-blue-50 rounded-2xl clay-element">
          <p className="text-sm text-blue-700">
            💡 <strong>نکته:</strong> کلمات به صورت خودکار در جدول قرار می‌گیرند (افقی، عمودی یا مورب).
            هر کلمه باید حداقل 3 حرف داشته باشد.
          </p>
        </div>
      </div>
    </div>
  );
}

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

export default function CreateUnjumble() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "unjumble",
    theme: "rose",
    content: {
      sentences: [
        { text: "", words: [] },
        { text: "", words: [] }
      ]
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

  const addSentence = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sentences: [...prev.content.sentences, { text: "", words: [] }]
      }
    }));
  };

  const removeSentence = (index) => {
    if (activity.content.sentences.length <= 2) {
      alert("باید حداقل 2 جمله وجود داشته باشد");
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

  const updateSentence = (index, value) => {
    setActivity(prev => {
      const newSentences = [...prev.content.sentences];
      newSentences[index] = {
        text: value,
        words: value.split(' ').filter(w => w.trim())
      };
      return {
        ...prev,
        content: { ...prev.content, sentences: newSentences }
      };
    });
  };

  const handleSave = () => {
    const validSentences = activity.content.sentences.filter(s => s.text.trim() && s.words.length >= 2);
    
    if (!activity.title || validSentences.length < 2) {
      alert("لطفاً عنوان و حداقل 2 جمله (هر جمله حداقل 2 کلمه) اضافه کنید");
      return;
    }
    
    createMutation.mutate({
      ...activity,
      content: { sentences: validSentences }
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">ترتیب کلمات</h1>
              <p className="text-sm md:text-base text-gray-600">مرتب کردن کلمات برای ساخت جمله</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl clay-element"
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
                placeholder="مثال: ساخت جملات صحیح"
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

        <Card className="clay-element bg-white border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">جملات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.content.sentences.map((sentence, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl clay-element"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <Label className="mb-2 block">جمله {index + 1}</Label>
                    <Input
                      value={sentence.text}
                      onChange={(e) => updateSentence(index, e.target.value)}
                      placeholder="مثال: من به مدرسه می‌روم"
                      className="rounded-xl clay-element"
                    />
                  </div>
                  <Button
                    onClick={() => removeSentence(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 mt-7"
                    disabled={activity.content.sentences.length <= 2}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                {sentence.words.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 mt-1">کلمات:</span>
                    {sentence.words.map((word, i) => (
                      <div key={i} className="px-3 py-1 bg-white rounded-lg text-sm font-medium clay-element">
                        {word}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Button
          onClick={addSentence}
          variant="outline"
          className="w-full h-14 rounded-2xl clay-element border-2 border-dashed border-rose-300 hover:bg-rose-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن جمله جدید
        </Button>

        <div className="mt-6 p-4 bg-rose-50 rounded-2xl clay-element">
          <p className="text-sm text-rose-700">
            💡 <strong>نکته:</strong> هر جمله به کلمات جداگانه تقسیم می‌شود و بازیکن باید آن‌ها را به ترتیب صحیح بچیند.
          </p>
        </div>
      </div>
    </div>
  );
}

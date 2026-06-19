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
import { Plus, Trash2, Save, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import IconPicker from "../components/shared/IconPicker";
import ImagePicker from "../components/shared/ImagePicker";

export default function CreateRandom_cards() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "random_cards",
    theme: "amber",
    content: {
      cards: [{ text: "", icon: "🎴", image: "" }]
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const addCard = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        cards: [...prev.content.cards, { text: "", icon: "🎴", image: "" }]
      }
    }));
  };

  const removeCard = (index) => {
    if (activity.content.cards.length <= 1) {
      alert("باید حداقل 1 کارت وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        cards: prev.content.cards.filter((_, i) => i !== index)
      }
    }));
  };

  const updateCard = (index, field, value) => {
    setActivity(prev => {
      const newCards = [...prev.content.cards];
      newCards[index] = { ...newCards[index], [field]: value };
      return { ...prev, content: { ...prev.content, cards: newCards } };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.cards.length === 0) {
      alert("لطفاً عنوان و حداقل یک کارت اضافه کنید");
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
                <Sparkles className="w-8 h-8" />
                کارت‌های تصادفی
              </h1>
              <p className="text-sm md:text-base text-gray-600">انتخاب تصادفی کارت</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl clay-element">
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
                placeholder="مثال: انتخاب تصادفی" className="rounded-xl clay-element" />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea value={activity.description} onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                placeholder="توضیحات کوتاه..." className="rounded-xl clay-element" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-6">
          {activity.content.cards.map((card, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg">کارت {index + 1}</CardTitle>
                  <Button onClick={() => removeCard(index)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>آیکون</Label>
                      <IconPicker currentIcon={card.icon} onSelect={(icon) => updateCard(index, 'icon', icon)} />
                    </div>
                    <div>
                      <Label>تصویر (اختیاری)</Label>
                      <ImagePicker currentImage={card.image} onSelect={(url) => updateCard(index, 'image', url)} />
                    </div>
                  </div>
                  <div>
                    <Label>متن کارت</Label>
                    <Textarea value={card.text} onChange={(e) => updateCard(index, 'text', e.target.value)}
                      placeholder="متن کارت..." className="rounded-xl clay-element" rows={3} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button onClick={addCard} variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-amber-300 hover:bg-amber-50">
          <Plus className="w-5 h-5 ml-2" />
          افزودن کارت جدید
        </Button>
      </div>
    </div>
  );
}

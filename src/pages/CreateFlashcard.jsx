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
import IconPicker from "@/components/shared/IconPicker";

export default function CreateFlashcard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "flashcard",
    theme: "lavender",
    content: {
      cards: [{ front: "", back: "", image: "", icon: "🎴" }]
    }
  });
  const [iconPicker, setIconPicker] = useState({ open: false, cardIndex: 0, field: "front" });

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

  const addCard = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        cards: [...prev.content.cards, { front: "", back: "", image: "", icon: "🎴" }]
      }
    }));
  };

  const removeCard = (index) => {
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
      return {
        ...prev,
        content: { ...prev.content, cards: newCards }
      };
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
              <h1 className="text-3xl font-bold text-gray-800">کارت‌های آموزشی</h1>
              <p className="text-gray-600">ساخت کارت‌های سوال و جواب</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            ذخیره فعالیت
          </Button>
        </motion.div>

        <Card className="clay-element bg-white/80 border-0 mb-6">
          <CardHeader>
            <CardTitle>اطلاعات فعالیت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عنوان</Label>
              <Input
                value={activity.title}
                onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                placeholder="مثال: لغات انگلیسی درس 3"
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
          {activity.content.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">کارت {index + 1}</CardTitle>
                  <Button
                    onClick={() => removeCard(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>جلوی کارت (سوال)</Label>
                    <div className="relative">
                      <Textarea
                        value={card.front}
                        onChange={(e) => updateCard(index, 'front', e.target.value)}
                        placeholder="سوال یا موضوع..."
                        className="rounded-xl clay-element"
                      />
                      <button
                        type="button"
                        onClick={() => setIconPicker({ open: true, cardIndex: index, field: "front" })}
                        className="absolute left-2 top-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-purple-100 transition-all"
                        title="افزودن آیکون"
                      >😊</button>
                    </div>
                    {iconPicker.open && iconPicker.cardIndex === index && iconPicker.field === "front" && (
                      <IconPicker
                        onSelect={(icon) => { updateCard(index, 'front', card.front + icon); setIconPicker({ open: false, cardIndex: 0, field: "front" }); }}
                        onClose={() => setIconPicker({ open: false, cardIndex: 0, field: "front" })}
                      />
                    )}
                  </div>
                  <div>
                    <Label>پشت کارت (جواب)</Label>
                    <div className="relative">
                      <Textarea
                        value={card.back}
                        onChange={(e) => updateCard(index, 'back', e.target.value)}
                        placeholder="پاسخ یا توضیحات..."
                        className="rounded-xl clay-element"
                      />
                      <button
                        type="button"
                        onClick={() => setIconPicker({ open: true, cardIndex: index, field: "back" })}
                        className="absolute left-2 top-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-purple-100 transition-all"
                        title="افزودن آیکون"
                      >😊</button>
                    </div>
                    {iconPicker.open && iconPicker.cardIndex === index && iconPicker.field === "back" && (
                      <IconPicker
                        onSelect={(icon) => { updateCard(index, 'back', card.back + icon); setIconPicker({ open: false, cardIndex: 0, field: "front" }); }}
                        onClose={() => setIconPicker({ open: false, cardIndex: 0, field: "front" })}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={addCard}
          variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-purple-300 hover:bg-purple-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن کارت جدید
        </Button>
      </div>
    </div>
  );
}

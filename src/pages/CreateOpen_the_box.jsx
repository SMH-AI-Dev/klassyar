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
import { Plus, Trash2, Save, ArrowRight, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateOpen_the_box() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "open_the_box",
    theme: "teal",
    content: {
      boxes: [{ number: 1, question: "", answer: "" }]
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const addBox = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        boxes: [...prev.content.boxes, { number: prev.content.boxes.length + 1, question: "", answer: "" }]
      }
    }));
  };

  const removeBox = (index) => {
    if (activity.content.boxes.length <= 1) {
      alert("باید حداقل 1 جعبه وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        boxes: prev.content.boxes.filter((_, i) => i !== index).map((box, idx) => ({ ...box, number: idx + 1 }))
      }
    }));
  };

  const updateBox = (index, field, value) => {
    setActivity(prev => {
      const newBoxes = [...prev.content.boxes];
      newBoxes[index] = { ...newBoxes[index], [field]: value };
      return { ...prev, content: { ...prev.content, boxes: newBoxes } };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.boxes.length === 0) {
      alert("لطفاً عنوان و حداقل یک جعبه اضافه کنید");
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
                <Package className="w-8 h-8" />
                باز کردن جعبه
              </h1>
              <p className="text-sm md:text-base text-gray-600">جعبه‌ها را باز کن و سوال را پاسخ بده</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-xl clay-element">
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
                placeholder="مثال: جعبه‌های شگفت‌انگیز" className="rounded-xl clay-element" />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea value={activity.description} onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                placeholder="توضیحات کوتاه..." className="rounded-xl clay-element" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-6">
          {activity.content.boxes.map((box, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-400 rounded-xl flex items-center justify-center clay-element">
                      <span className="text-white font-bold">{box.number}</span>
                    </div>
                    جعبه {box.number}
                  </CardTitle>
                  <Button onClick={() => removeBox(index)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>سوال</Label>
                    <Textarea value={box.question} onChange={(e) => updateBox(index, 'question', e.target.value)}
                      placeholder="سوال خود را بنویسید..." className="rounded-xl clay-element" rows={2} />
                  </div>
                  <div>
                    <Label>پاسخ</Label>
                    <Input value={box.answer} onChange={(e) => updateBox(index, 'answer', e.target.value)}
                      placeholder="پاسخ صحیح..." className="rounded-xl clay-element" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button onClick={addBox} variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-teal-300 hover:bg-teal-50">
          <Plus className="w-5 h-5 ml-2" />
          افزودن جعبه جدید
        </Button>
      </div>
    </div>
  );
}

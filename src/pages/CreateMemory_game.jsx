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

export default function CreateMemory_game() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "memory_game",
    theme: "violet",
    content: {
      pairs: [
        { text: "", icon: "🎴" },
        { text: "", icon: "🎯" }
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

  const addPair = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        pairs: [...prev.content.pairs, { text: "", icon: "🎴" }]
      }
    }));
  };

  const removePair = (index) => {
    if (activity.content.pairs.length <= 2) {
      alert("باید حداقل 2 جفت وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        pairs: prev.content.pairs.filter((_, i) => i !== index)
      }
    }));
  };

  const updatePair = (index, field, value) => {
    setActivity(prev => {
      const newPairs = [...prev.content.pairs];
      newPairs[index] = { ...newPairs[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, pairs: newPairs }
      };
    });
  };

  const handleSave = () => {
    const validPairs = activity.content.pairs.filter(p => p.text.trim());
    
    if (!activity.title || validPairs.length < 2) {
      alert("لطفاً عنوان و حداقل 2 جفت اضافه کنید");
      return;
    }
    
    createMutation.mutate({
      ...activity,
      content: { pairs: validPairs }
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">بازی حافظه</h1>
              <p className="text-sm md:text-base text-gray-600">پیدا کردن جفت‌های یکسان</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl clay-element"
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
                placeholder="مثال: حیوانات و صداهایشان"
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
            <CardTitle className="text-lg md:text-xl">جفت‌ها (هر کارت 2 بار ظاهر می‌شود)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.content.pairs.map((pair, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl clay-element"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Label className="mb-2 block">متن کارت {index + 1}</Label>
                    <Input
                      value={pair.text}
                      onChange={(e) => updatePair(index, 'text', e.target.value)}
                      placeholder="مثال: گربه"
                      className="rounded-xl clay-element"
                    />
                  </div>
                  <Button
                    onClick={() => removePair(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 mt-6"
                    disabled={activity.content.pairs.length <= 2}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Button
          onClick={addPair}
          variant="outline"
          className="w-full h-14 rounded-2xl clay-element border-2 border-dashed border-violet-300 hover:bg-violet-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن جفت جدید
        </Button>

        <div className="mt-6 p-4 bg-violet-50 rounded-2xl clay-element">
          <p className="text-sm text-violet-700">
            💡 <strong>نکته:</strong> هر کارت 2 بار در بازی ظاهر می‌شود. بازیکن باید جفت‌های یکسان را پیدا کند.
          </p>
        </div>
      </div>
    </div>
  );
}

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

export default function CreateSpinner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "spinner",
    theme: "emerald",
    content: {
      items: ["", ""]
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const addItem = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        items: [...prev.content.items, ""]
      }
    }));
  };

  const removeItem = (index) => {
    if (activity.content.items.length <= 2) {
      alert("حداقل 2 گزینه باید وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        items: prev.content.items.filter((_, i) => i !== index)
      }
    }));
  };

  const updateItem = (index, value) => {
    setActivity(prev => {
      const newItems = [...prev.content.items];
      newItems[index] = value;
      return {
        ...prev,
        content: { ...prev.content, items: newItems }
      };
    });
  };

  const handleSave = () => {
    const validItems = activity.content.items.filter(item => item.trim());
    if (!activity.title || validItems.length < 2) {
      alert("لطفاً عنوان و حداقل 2 گزینه وارد کنید");
      return;
    }
    createMutation.mutate({
      ...activity,
      content: { items: validItems }
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
              onClick={() => navigate(createPageUrl("Dashboard"))}
              variant="outline"
              size="icon"
              className="rounded-xl clay-element"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">اسپینر سوال</h1>
              <p className="text-sm md:text-base text-gray-600">چرخاندن و پاسخ دادن</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl clay-element"
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
                placeholder="مثال: سوالات علوم"
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

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">گزینه‌های اسپینر</h3>
          <Button onClick={addItem} variant="outline" size="sm" className="rounded-xl clay-element">
            <Plus className="w-4 h-4 ml-2" />
            افزودن گزینه
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activity.content.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-2"
            >
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`گزینه ${index + 1}...`}
                className="rounded-xl clay-element"
              />
              <Button
                onClick={() => removeItem(index)}
                variant="outline"
                size="icon"
                className="rounded-xl clay-element text-red-500 hover:text-red-700 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

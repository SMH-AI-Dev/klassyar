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

export default function CreateRandom_wheel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "random_wheel",
    theme: "sky",
    content: {
      items: ["", "", "", ""]
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
    onError: (error) => {
      console.error("خطا در ذخیره‌سازی:", error);
      alert("خطا در ذخیره‌سازی فعالیت. لطفاً دوباره تلاش کنید");
    }
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
      alert("باید حداقل 2 گزینه وجود داشته باشد");
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
    console.log('🟢 handleSave called');
    console.log('🟢 Current activity:', activity);
    
    if (!activity.title || activity.content.items.filter(i => i.trim()).length < 2) {
      alert("لطفاً عنوان و حداقل 2 گزینه اضافه کنید");
      return;
    }
    
    const dataToSave = {
      ...activity,
      content: {
        ...activity.content,
        items: activity.content.items.filter(i => i.trim())
      }
    };
    
    console.log('🟢 Data to save:', dataToSave);
    createMutation.mutate(dataToSave);
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
              <h1 className="text-3xl font-bold text-gray-800">چرخ گردان</h1>
              <p className="text-gray-600">انتخاب تصادفی از میان گزینه‌ها</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl clay-element"
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
                placeholder="مثال: انتخاب دانش‌آموز"
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
            <CardTitle>گزینه‌های چرخ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.content.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3"
              >
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={`گزینه ${index + 1}`}
                  className="rounded-xl clay-element"
                />
                <Button
                  onClick={() => removeItem(index)}
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  disabled={activity.content.items.length <= 2}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Button
          onClick={addItem}
          variant="outline"
          className="w-full h-14 rounded-2xl clay-element border-2 border-dashed border-blue-300 hover:bg-blue-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن گزینه جدید
        </Button>
      </div>
    </div>
  );
}

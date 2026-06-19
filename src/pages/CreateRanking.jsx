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
import { Plus, Trash2, Save, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

import IconPicker from "../components/shared/IconPicker";

export default function CreateRanking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "ranking",
    theme: "sky",
    content: {
      items: [
        { text: "", correctOrder: 1, icon: "1️⃣" },
        { text: "", correctOrder: 2, icon: "2️⃣" },
        { text: "", correctOrder: 3, icon: "3️⃣" }
      ],
      instruction: "موارد را به ترتیب صحیح مرتب کنید"
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
        items: [...prev.content.items, { 
          text: "", 
          correctOrder: prev.content.items.length + 1, 
          icon: `${prev.content.items.length + 1}️⃣` 
        }]
      }
    }));
  };

  const removeItem = (index) => {
    if (activity.content.items.length <= 2) {
      alert("باید حداقل 2 مورد وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        items: prev.content.items.filter((_, i) => i !== index).map((item, idx) => ({
          ...item,
          correctOrder: idx + 1
        }))
      }
    }));
  };

  const updateItem = (index, field, value) => {
    setActivity(prev => {
      const newItems = [...prev.content.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, items: newItems }
      };
    });
  };

  const moveItem = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === activity.content.items.length - 1)
    ) {
      return;
    }

    setActivity(prev => {
      const newItems = [...prev.content.items];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      
      return {
        ...prev,
        content: { 
          ...prev.content, 
          items: newItems.map((item, idx) => ({
            ...item,
            correctOrder: idx + 1
          }))
        }
      };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.items.length < 2) {
      alert("لطفاً عنوان و حداقل 2 مورد اضافه کنید");
      return;
    }
    createMutation.mutate(activity);
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">رتبه‌بندی</h1>
              <p className="text-sm md:text-base text-gray-600">مرتب کردن موارد به ترتیب</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white rounded-xl clay-element"
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
                placeholder="مثال: ترتیب اعداد از کوچک به بزرگ"
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
              <Label>دستورالعمل</Label>
              <Input
                value={activity.content.instruction}
                onChange={(e) => setActivity({
                  ...activity,
                  content: { ...activity.content, instruction: e.target.value }
                })}
                placeholder="موارد را به ترتیب صحیح مرتب کنید"
                className="rounded-xl clay-element"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {activity.content.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="clay-element bg-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <Button
                        onClick={() => moveItem(index, 'up')}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg clay-element"
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => moveItem(index, 'down')}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg clay-element"
                        disabled={index === activity.content.items.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl clay-element">
                      <span className="text-2xl font-bold text-sky-700">{index + 1}</span>
                    </div>

                    <div className="w-24">
                      <IconPicker
                        currentIcon={item.icon}
                        onSelect={(icon) => updateItem(index, 'icon', icon)}
                      />
                    </div>

                    <Input
                      value={item.text}
                      onChange={(e) => updateItem(index, 'text', e.target.value)}
                      placeholder={`مورد ${index + 1}`}
                      className="flex-1 rounded-xl clay-element"
                    />

                    <Button
                      onClick={() => removeItem(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={addItem}
          variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-sky-300 hover:bg-sky-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن مورد جدید
        </Button>
      </div>
    </div>
  );
}

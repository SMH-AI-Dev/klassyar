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
import { Plus, Trash2, Save, ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

import IconPicker from "@/components/shared/IconPicker";
import ImagePicker from "@/components/shared/ImagePicker";

export default function CreateTimeline() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "timeline",
    theme: "fuchsia",
    content: {
      events: [
        { title: "", date: "", description: "", icon: "⏰", image: "" },
        { title: "", date: "", description: "", icon: "📅", image: "" }
      ]
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const addEvent = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        events: [...prev.content.events, { title: "", date: "", description: "", icon: "⏰", image: "" }]
      }
    }));
  };

  const removeEvent = (index) => {
    if (activity.content.events.length <= 2) {
      alert("باید حداقل 2 رویداد وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        events: prev.content.events.filter((_, i) => i !== index)
      }
    }));
  };

  const updateEvent = (index, field, value) => {
    setActivity(prev => {
      const newEvents = [...prev.content.events];
      newEvents[index] = { ...newEvents[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, events: newEvents }
      };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.events.length < 2) {
      alert("لطفاً عنوان و حداقل 2 رویداد اضافه کنید");
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">خط زمانی</h1>
              <p className="text-sm md:text-base text-gray-600">مرتب کردن رویدادها بر اساس زمان</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-xl clay-element"
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
                placeholder="مثال: تاریخ ایران باستان"
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

        <div className="space-y-4 md:space-y-6">
          {activity.content.events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    رویداد {index + 1}
                  </CardTitle>
                  <Button
                    onClick={() => removeEvent(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>آیکون</Label>
                      <IconPicker
                        currentIcon={event.icon}
                        onSelect={(icon) => updateEvent(index, 'icon', icon)}
                      />
                    </div>
                    <div>
                      <Label>تصویر (اختیاری)</Label>
                      <ImagePicker
                        currentImage={event.image}
                        onSelect={(url) => updateEvent(index, 'image', url)}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>عنوان رویداد</Label>
                      <Input
                        value={event.title}
                        onChange={(e) => updateEvent(index, 'title', e.target.value)}
                        placeholder="مثال: تاسیس هخامنشیان"
                        className="rounded-xl clay-element"
                      />
                    </div>
                    <div>
                      <Label>تاریخ/زمان</Label>
                      <Input
                        value={event.date}
                        onChange={(e) => updateEvent(index, 'date', e.target.value)}
                        placeholder="مثال: 550 قبل از میلاد"
                        className="rounded-xl clay-element"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>توضیحات رویداد</Label>
                    <Textarea
                      value={event.description}
                      onChange={(e) => updateEvent(index, 'description', e.target.value)}
                      placeholder="توضیحات کامل رویداد..."
                      className="rounded-xl clay-element"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={addEvent}
          variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-fuchsia-300 hover:bg-fuchsia-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن رویداد جدید
        </Button>
      </div>
    </div>
  );
}

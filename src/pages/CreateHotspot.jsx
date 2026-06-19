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

import ImagePicker from "../components/shared/ImagePicker";

export default function CreateHotspot() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "hotspot",
    theme: "yellow",
    content: {
      mainImage: "",
      hotspots: [
        { label: "", x: 50, y: 50, description: "" }
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

  const addHotspot = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        hotspots: [...prev.content.hotspots, { label: "", x: 50, y: 50, description: "" }]
      }
    }));
  };

  const removeHotspot = (index) => {
    if (activity.content.hotspots.length <= 1) {
      alert("باید حداقل 1 نقطه فعال وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        hotspots: prev.content.hotspots.filter((_, i) => i !== index)
      }
    }));
  };

  const updateHotspot = (index, field, value) => {
    setActivity(prev => {
      const newHotspots = [...prev.content.hotspots];
      newHotspots[index] = { ...newHotspots[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, hotspots: newHotspots }
      };
    });
  };

  const handleSave = () => {
    if (!activity.title || !activity.content.mainImage) {
      alert("لطفاً عنوان و تصویر اصلی را انتخاب کنید");
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">نقطه فعال</h1>
              <p className="text-sm md:text-base text-gray-600">کلیک روی نقاط صحیح تصویر</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-xl clay-element"
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
                placeholder="مثال: اعضای بدن"
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
              <Label>تصویر اصلی (الزامی)</Label>
              <ImagePicker
                currentImage={activity.content.mainImage}
                onSelect={(url) => setActivity({
                  ...activity,
                  content: { ...activity.content, mainImage: url }
                })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-6">
          {activity.content.hotspots.map((hotspot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg">نقطه فعال {index + 1}</CardTitle>
                  <Button
                    onClick={() => removeHotspot(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>برچسب نقطه</Label>
                    <Input
                      value={hotspot.label}
                      onChange={(e) => updateHotspot(index, 'label', e.target.value)}
                      placeholder="مثال: چشم"
                      className="rounded-xl clay-element"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>موقعیت X (درصد)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={hotspot.x}
                        onChange={(e) => updateHotspot(index, 'x', parseFloat(e.target.value))}
                        className="rounded-xl clay-element"
                      />
                    </div>
                    <div>
                      <Label>موقعیت Y (درصد)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={hotspot.y}
                        onChange={(e) => updateHotspot(index, 'y', parseFloat(e.target.value))}
                        className="rounded-xl clay-element"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>توضیحات</Label>
                    <Textarea
                      value={hotspot.description}
                      onChange={(e) => updateHotspot(index, 'description', e.target.value)}
                      placeholder="توضیحات این نقطه..."
                      className="rounded-xl clay-element"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={addHotspot}
          variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-yellow-300 hover:bg-yellow-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن نقطه فعال جدید
        </Button>
      </div>
    </div>
  );
}

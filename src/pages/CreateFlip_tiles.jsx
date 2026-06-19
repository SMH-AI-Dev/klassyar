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

import IconPicker from "@/components/shared/IconPicker";

export default function CreateFlip_tiles() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "flip_tiles",
    theme: "purple",
    content: {
      tiles: [{ front: "", back: "", icon: "🎴" }]
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const addTile = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        tiles: [...prev.content.tiles, { front: "", back: "", icon: "🎴" }]
      }
    }));
  };

  const removeTile = (index) => {
    if (activity.content.tiles.length <= 1) {
      alert("باید حداقل 1 کاشی وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        tiles: prev.content.tiles.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTile = (index, field, value) => {
    setActivity(prev => {
      const newTiles = [...prev.content.tiles];
      newTiles[index] = { ...newTiles[index], [field]: value };
      return { ...prev, content: { ...prev.content, tiles: newTiles } };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.tiles.length === 0) {
      alert("لطفاً عنوان و حداقل یک کاشی اضافه کنید");
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">کاشی‌های چرخان 🔄</h1>
              <p className="text-sm md:text-base text-gray-600">کاشی‌ها را برگردان</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-xl clay-element">
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
                placeholder="مثال: کاشی‌های یادگیری" className="rounded-xl clay-element" />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea value={activity.description} onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                placeholder="توضیحات کوتاه..." className="rounded-xl clay-element" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-6">
          {activity.content.tiles.map((tile, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg">کاشی {index + 1}</CardTitle>
                  <Button onClick={() => removeTile(index)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>آیکون</Label>
                    <IconPicker currentIcon={tile.icon} onSelect={(icon) => updateTile(index, 'icon', icon)} />
                  </div>
                  <div>
                    <Label>جلوی کاشی</Label>
                    <Input value={tile.front} onChange={(e) => updateTile(index, 'front', e.target.value)}
                      placeholder="متن جلو..." className="rounded-xl clay-element" />
                  </div>
                  <div>
                    <Label>پشت کاشی</Label>
                    <Input value={tile.back} onChange={(e) => updateTile(index, 'back', e.target.value)}
                      placeholder="متن پشت..." className="rounded-xl clay-element" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button onClick={addTile} variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed border-purple-300 hover:bg-purple-50">
          <Plus className="w-5 h-5 ml-2" />
          افزودن کاشی جدید
        </Button>
      </div>
    </div>
  );
}

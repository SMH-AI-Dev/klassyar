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

export default function CreateWhack_a_mole() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "whack_a_mole",
    theme: "peach",
    content: {
      correct_items: ["", ""],
      wrong_items: ["", ""],
      game_duration: 60
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

  const addItem = (type) => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [type]: [...prev.content[type], ""]
      }
    }));
  };

  const removeItem = (type, index) => {
    if (activity.content[type].length <= 2) {
      alert("باید حداقل 2 مورد وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [type]: prev.content[type].filter((_, i) => i !== index)
      }
    }));
  };

  const updateItem = (type, index, value) => {
    setActivity(prev => {
      const newItems = [...prev.content[type]];
      newItems[index] = value;
      return {
        ...prev,
        content: { ...prev.content, [type]: newItems }
      };
    });
  };

  const handleSave = () => {
    const validCorrect = activity.content.correct_items.filter(i => i.trim());
    const validWrong = activity.content.wrong_items.filter(i => i.trim());
    
    if (!activity.title || validCorrect.length < 2 || validWrong.length < 2) {
      alert("لطفاً عنوان، حداقل 2 مورد صحیح و 2 مورد نادرست اضافه کنید");
      return;
    }
    
    createMutation.mutate({
      ...activity,
      content: {
        ...activity.content,
        correct_items: validCorrect,
        wrong_items: validWrong
      }
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">بزن بزن</h1>
              <p className="text-sm md:text-base text-gray-600">ضربه زدن به پاسخ‌های صحیح</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl clay-element"
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
                placeholder="مثال: حیوانات خانگی"
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
              <Label>مدت زمان بازی (ثانیه): {activity.content.game_duration}</Label>
              <input
                type="range"
                min="30"
                max="120"
                step="10"
                value={activity.content.game_duration}
                onChange={(e) => setActivity({
                  ...activity,
                  content: { ...activity.content, game_duration: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="clay-element bg-white border-0">
            <CardHeader className="bg-green-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg md:text-xl text-green-700">موارد صحیح ✅</CardTitle>
                <Button
                  onClick={() => addItem('correct_items')}
                  size="sm"
                  variant="outline"
                  className="rounded-xl clay-element border-green-300"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  افزودن
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {activity.content.correct_items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3"
                >
                  <Input
                    value={item}
                    onChange={(e) => updateItem('correct_items', index, e.target.value)}
                    placeholder={`مورد صحیح ${index + 1}`}
                    className="rounded-xl clay-element"
                  />
                  <Button
                    onClick={() => removeItem('correct_items', index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    disabled={activity.content.correct_items.length <= 2}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="clay-element bg-white border-0">
            <CardHeader className="bg-red-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg md:text-xl text-red-700">موارد نادرست ❌</CardTitle>
                <Button
                  onClick={() => addItem('wrong_items')}
                  size="sm"
                  variant="outline"
                  className="rounded-xl clay-element border-red-300"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  افزودن
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {activity.content.wrong_items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3"
                >
                  <Input
                    value={item}
                    onChange={(e) => updateItem('wrong_items', index, e.target.value)}
                    placeholder={`مورد نادرست ${index + 1}`}
                    className="rounded-xl clay-element"
                  />
                  <Button
                    onClick={() => removeItem('wrong_items', index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    disabled={activity.content.wrong_items.length <= 2}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-orange-50 rounded-2xl clay-element">
          <p className="text-sm text-orange-700">
            💡 <strong>نکته:</strong> بازیکن باید فقط روی موارد صحیح کلیک کند و از موارد نادرست دوری کند.
            هر کلیک صحیح امتیاز می‌دهد و هر کلیک نادرست از امتیاز کم می‌کند.
          </p>
        </div>
      </div>
    </div>
  );
}

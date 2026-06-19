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

export default function CreateMatching() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "matching",
    theme: "orange",
    content: {
      pairs: [
        { left: "", right: "", icon: "🔗", image: "" },
        { left: "", right: "", icon: "🔗", image: "" }
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
        pairs: [...prev.content.pairs, { left: "", right: "", icon: "🔗", image: "" }]
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
    if (!activity.title || activity.content.pairs.length < 2) {
      alert("لطفاً عنوان و حداقل 2 جفت اضافه کنید");
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
              onClick={() => navigate("/Dashboard")}
              variant="outline"
              size="icon"
              className="rounded-xl clay-element"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">جورکردنی</h1>
              <p className="text-sm md:text-base text-gray-600">اتصال موارد مرتبط به هم</p>
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
                placeholder="مثال: اتصال حیوانات به صداها"
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
          {activity.content.pairs.map((pair, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="clay-element bg-white border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base md:text-lg">جفت {index + 1}</CardTitle>
                  <Button
                    onClick={() => removePair(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>مورد سمت راست</Label>
                      <Input
                        value={pair.left}
                        onChange={(e) => updatePair(index, 'left', e.target.value)}
                        placeholder="مثال: گربه"
                        className="rounded-xl clay-element"
                      />
                    </div>
                    <div>
                      <Label>مورد سمت چپ (متناظر)</Label>
                      <Input
                        value={pair.right}
                        onChange={(e) => updatePair(index, 'right', e.target.value)}
                        placeholder="مثال: میو میو"
                        className="rounded-xl clay-element"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={addPair}
          variant="outline"
          className="w-full mt-6 h-14 rounded-2xl clay-element border-2 border-dashed border-orange-300 hover:bg-orange-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن جفت جدید
        </Button>
      </div>
    </div>
  );
}

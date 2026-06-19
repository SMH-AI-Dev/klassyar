import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "@/lib/sonner";

export default function EditSpinner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "spinner",
    content: {
      items: ["", ""]
    }
  });

  const { data: existingActivity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
    enabled: !!activityId,
  });

  useEffect(() => {
    if (existingActivity) {
      setActivity(existingActivity);
    }
  }, [existingActivity]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.update(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      toast.success("فعالیت با موفقیت ذخیره شد");
      navigate("/Dashboard");
    },
    onError: () => {
      toast.error("خطا در ذخیره فعالیت");
    },
  });

  const handleSave = () => {
    if (!activity.title.trim()) {
      toast.error("لطفاً عنوان را وارد کنید");
      return;
    }

    const validItems = activity.content.items.filter(item => item.trim());

    if (validItems.length < 2) {
      toast.error("حداقل 2 گزینه معتبر وارد کنید");
      return;
    }

    const activityData = {
      ...activity,
      content: {
        items: validItems
      }
    };

    updateMutation.mutate(activityData);
  };

  const addItem = () => {
    setActivity({
      ...activity,
      content: {
        items: [...activity.content.items, ""]
      }
    });
  };

  const removeItem = (index) => {
    if (activity.content.items.length <= 2) {
      toast.error("حداقل 2 گزینه باید وجود داشته باشد");
      return;
    }
    const newItems = activity.content.items.filter((_, i) => i !== index);
    setActivity({
      ...activity,
      content: { items: newItems }
    });
  };

  const updateItem = (index, value) => {
    const newItems = [...activity.content.items];
    newItems[index] = value;
    setActivity({
      ...activity,
      content: { items: newItems }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              ویرایش فلک شانس
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </motion.div>

        <div className="space-y-6">
          <Card className="clay-element bg-gradient-to-br from-emerald-50 to-teal-50 border-0">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان فعالیت</Label>
                  <Input
                    id="title"
                    value={activity.title}
                    onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                    placeholder="عنوان را وارد کنید..."
                    className="mt-2 rounded-xl clay-element"
                  />
                </div>
                <div>
                  <Label htmlFor="description">توضیحات (اختیاری)</Label>
                  <Textarea
                    id="description"
                    value={activity.description}
                    onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                    placeholder="توضیحات را وارد کنید..."
                    className="mt-2 rounded-xl clay-element"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="clay-element bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">گزینه‌های فلک</h3>
                <Button
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                  className="rounded-xl clay-element"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن گزینه
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activity.content.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
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
                      className="rounded-xl clay-element text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

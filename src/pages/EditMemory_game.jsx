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

export default function EditMemory_game() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "memory_game",
    content: {
      pairs: [
        { card1: "", card2: "" },
        { card1: "", card2: "" }
      ]
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

    const validPairs = activity.content.pairs.filter(
      pair => pair.card1.trim() && pair.card2.trim()
    );

    if (validPairs.length < 2) {
      toast.error("حداقل 2 جفت معتبر وارد کنید");
      return;
    }

    const activityData = {
      ...activity,
      content: {
        pairs: validPairs
      }
    };

    updateMutation.mutate(activityData);
  };

  const addPair = () => {
    setActivity({
      ...activity,
      content: {
        pairs: [...activity.content.pairs, { card1: "", card2: "" }]
      }
    });
  };

  const removePair = (index) => {
    if (activity.content.pairs.length <= 2) {
      toast.error("حداقل 2 جفت باید وجود داشته باشد");
      return;
    }
    const newPairs = activity.content.pairs.filter((_, i) => i !== index);
    setActivity({
      ...activity,
      content: { pairs: newPairs }
    });
  };

  const updatePair = (index, field, value) => {
    const newPairs = [...activity.content.pairs];
    newPairs[index][field] = value;
    setActivity({
      ...activity,
      content: { pairs: newPairs }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
              ویرایش بازی حافظه
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </motion.div>

        {/* Main Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="clay-element bg-gradient-to-br from-violet-50 to-purple-50 border-0">
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

          {/* Card Pairs */}
          <Card className="clay-element bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">جفت کارت‌ها</h3>
                <Button
                  onClick={addPair}
                  variant="outline"
                  size="sm"
                  className="rounded-xl clay-element"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن جفت
                </Button>
              </div>

              <div className="space-y-4">
                {activity.content.pairs.map((pair, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">کارت اول {index + 1}</Label>
                        <Input
                          value={pair.card1}
                          onChange={(e) => updatePair(index, 'card1', e.target.value)}
                          placeholder="متن کارت اول..."
                          className="mt-2 rounded-xl clay-element"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">کارت دوم {index + 1}</Label>
                        <Input
                          value={pair.card2}
                          onChange={(e) => updatePair(index, 'card2', e.target.value)}
                          placeholder="متن کارت دوم..."
                          className="mt-2 rounded-xl clay-element"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => removePair(index)}
                      variant="outline"
                      size="icon"
                      className="mt-7 rounded-xl clay-element text-red-500 hover:text-red-700"
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

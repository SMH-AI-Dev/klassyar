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
import { ArrowRight, Save, Plus, Trash2, FolderPlus } from "lucide-react";
import { toast } from "@/lib/sonner";

export default function EditGroup_sort() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "group_sort",
    content: {
      groups: [
        { name: "گروه 1", items: [""] },
        { name: "گروه 2", items: [""] }
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

    const validGroups = activity.content.groups
      .filter(group => group.name.trim())
      .map(group => ({
        name: group.name,
        items: group.items.filter(item => item.trim())
      }))
      .filter(group => group.items.length > 0);

    if (validGroups.length < 2) {
      toast.error("حداقل 2 گروه معتبر با آیتم وارد کنید");
      return;
    }

    const activityData = {
      ...activity,
      content: {
        groups: validGroups
      }
    };

    updateMutation.mutate(activityData);
  };

  const addGroup = () => {
    setActivity({
      ...activity,
      content: {
        groups: [...activity.content.groups, { name: `گروه ${activity.content.groups.length + 1}`, items: [""] }]
      }
    });
  };

  const removeGroup = (groupIndex) => {
    if (activity.content.groups.length <= 2) {
      toast.error("حداقل 2 گروه باید وجود داشته باشد");
      return;
    }
    const newGroups = activity.content.groups.filter((_, i) => i !== groupIndex);
    setActivity({
      ...activity,
      content: { groups: newGroups }
    });
  };

  const updateGroupName = (groupIndex, name) => {
    const newGroups = [...activity.content.groups];
    newGroups[groupIndex].name = name;
    setActivity({
      ...activity,
      content: { groups: newGroups }
    });
  };

  const addItem = (groupIndex) => {
    const newGroups = [...activity.content.groups];
    newGroups[groupIndex].items.push("");
    setActivity({
      ...activity,
      content: { groups: newGroups }
    });
  };

  const removeItem = (groupIndex, itemIndex) => {
    const newGroups = [...activity.content.groups];
    if (newGroups[groupIndex].items.length <= 1) {
      toast.error("حداقل 1 آیتم باید در هر گروه باشد");
      return;
    }
    newGroups[groupIndex].items = newGroups[groupIndex].items.filter((_, i) => i !== itemIndex);
    setActivity({
      ...activity,
      content: { groups: newGroups }
    });
  };

  const updateItem = (groupIndex, itemIndex, value) => {
    const newGroups = [...activity.content.groups];
    newGroups[groupIndex].items[itemIndex] = value;
    setActivity({
      ...activity,
      content: { groups: newGroups }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
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
              ویرایش بازی دسته‌بندی گروهی
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </motion.div>

        {/* Main Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="clay-element bg-gradient-to-br from-pink-50 to-rose-50 border-0">
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

          {/* Groups */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">گروه‌ها</h3>
            <Button
              onClick={addGroup}
              variant="outline"
              size="sm"
              className="rounded-xl clay-element"
            >
              <FolderPlus className="w-4 h-4 ml-2" />
              افزودن گروه
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activity.content.groups.map((group, groupIndex) => (
              <motion.div
                key={groupIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <Card className="clay-element bg-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Input
                        value={group.name}
                        onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                        placeholder="نام گروه..."
                        className="rounded-xl clay-element font-bold"
                      />
                      <Button
                        onClick={() => removeGroup(groupIndex)}
                        variant="outline"
                        size="icon"
                        className="mr-2 rounded-xl clay-element text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {group.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateItem(groupIndex, itemIndex, e.target.value)}
                            placeholder={`آیتم ${itemIndex + 1}...`}
                            className="rounded-xl clay-element"
                          />
                          <Button
                            onClick={() => removeItem(groupIndex, itemIndex)}
                            variant="outline"
                            size="icon"
                            className="rounded-xl clay-element text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() => addItem(groupIndex)}
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl clay-element"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن آیتم
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

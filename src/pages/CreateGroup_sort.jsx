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

export default function CreateGroup_sort() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "group_sort",
    theme: "mint",
    content: {
      groups: [
        { name: "گروه ۱", icon: "📁", items: [] },
        { name: "گروه ۲", icon: "📂", items: [] }
      ],
      all_items: ["", "", "", ""]
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

  const addGroup = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        groups: [...prev.content.groups, { name: `گروه ${prev.content.groups.length + 1}`, icon: "📁", items: [] }]
      }
    }));
  };

  const removeGroup = (index) => {
    if (activity.content.groups.length <= 2) {
      alert("باید حداقل 2 گروه وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        groups: prev.content.groups.filter((_, i) => i !== index)
      }
    }));
  };

  const updateGroup = (index, field, value) => {
    setActivity(prev => {
      const newGroups = [...prev.content.groups];
      newGroups[index] = { ...newGroups[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, groups: newGroups }
      };
    });
  };

  const addItem = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        all_items: [...prev.content.all_items, ""]
      }
    }));
  };

  const removeItem = (index) => {
    if (activity.content.all_items.length <= 2) {
      alert("باید حداقل 2 مورد وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        all_items: prev.content.all_items.filter((_, i) => i !== index)
      }
    }));
  };

  const updateItem = (index, value) => {
    setActivity(prev => {
      const newItems = [...prev.content.all_items];
      newItems[index] = value;
      return {
        ...prev,
        content: { ...prev.content, all_items: newItems }
      };
    });
  };

  const assignItemToGroup = (itemIndex, groupIndex) => {
    setActivity(prev => {
      const newGroups = [...prev.content.groups];
      const item = prev.content.all_items[itemIndex];
      
      newGroups.forEach(group => {
        group.items = group.items.filter(i => i !== item);
      });
      
      if (!newGroups[groupIndex].items.includes(item)) {
        newGroups[groupIndex].items.push(item);
      }
      
      return {
        ...prev,
        content: { ...prev.content, groups: newGroups }
      };
    });
  };

  const handleSave = () => {
    if (!activity.title || activity.content.groups.length < 2 || activity.content.all_items.filter(i => i.trim()).length < 2) {
      alert("لطفاً عنوان، حداقل 2 گروه و 2 مورد اضافه کنید");
      return;
    }
    
    const filteredContent = {
      ...activity.content,
      all_items: activity.content.all_items.filter(i => i.trim())
    };
    
    createMutation.mutate({ ...activity, content: filteredContent });
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">مرتب‌سازی گروهی</h1>
              <p className="text-sm md:text-base text-gray-600">دسته‌بندی موارد در گروه‌ها</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            ذخیره فعالیت
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="clay-element bg-white/80 border-0">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">اطلاعات فعالیت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>عنوان</Label>
                  <Input
                    value={activity.title}
                    onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                    placeholder="مثال: دسته‌بندی حیوانات"
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

            <Card className="clay-element bg-white border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl">گروه‌ها</CardTitle>
                  <Button
                    onClick={addGroup}
                    size="sm"
                    variant="outline"
                    className="rounded-xl clay-element"
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    گروه جدید
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity.content.groups.map((group, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl clay-element"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <Input
                          value={group.name}
                          onChange={(e) => updateGroup(index, 'name', e.target.value)}
                          placeholder={`نام گروه ${index + 1}`}
                          className="rounded-xl clay-element mb-2"
                        />
                        <div className="text-xs text-gray-500">
                          {group.items.length} مورد تخصیص داده شده
                        </div>
                      </div>
                      <Button
                        onClick={() => removeGroup(index)}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        disabled={activity.content.groups.length <= 2}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="clay-element bg-white border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl">موارد برای دسته‌بندی</CardTitle>
                  <Button
                    onClick={addItem}
                    size="sm"
                    variant="outline"
                    className="rounded-xl clay-element"
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    مورد جدید
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {activity.content.all_items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: itemIndex * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex gap-3">
                      <Input
                        value={item}
                        onChange={(e) => updateItem(itemIndex, e.target.value)}
                        placeholder={`مورد ${itemIndex + 1}`}
                        className="rounded-xl clay-element"
                      />
                      <Button
                        onClick={() => removeItem(itemIndex)}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        disabled={activity.content.all_items.length <= 2}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    {item.trim() && (
                      <div className="flex gap-2 pr-2">
                        <span className="text-xs text-gray-500 flex items-center">تخصیص به:</span>
                        {activity.content.groups.map((group, groupIndex) => (
                          <Button
                            key={groupIndex}
                            onClick={() => assignItemToGroup(itemIndex, groupIndex)}
                            size="sm"
                            variant={group.items.includes(item) ? "default" : "outline"}
                            className="h-7 text-xs rounded-lg"
                          >
                            {group.icon} {group.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

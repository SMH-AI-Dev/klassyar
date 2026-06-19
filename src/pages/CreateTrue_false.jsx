import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, ArrowRight, Check, X } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateTrue_false() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "true_false",
    theme: "lime",
    content: {
      statements: [
        { text: "", is_true: true },
        { text: "", is_true: false }
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

  const addStatement = () => {
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        statements: [...prev.content.statements, { text: "", is_true: true }]
      }
    }));
  };

  const removeStatement = (index) => {
    if (activity.content.statements.length <= 2) {
      alert("باید حداقل 2 عبارت وجود داشته باشد");
      return;
    }
    setActivity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        statements: prev.content.statements.filter((_, i) => i !== index)
      }
    }));
  };

  const updateStatement = (index, field, value) => {
    setActivity(prev => {
      const newStatements = [...prev.content.statements];
      newStatements[index] = { ...newStatements[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, statements: newStatements }
      };
    });
  };

  const handleSave = () => {
    const validStatements = activity.content.statements.filter(s => s.text.trim());
    
    if (!activity.title || validStatements.length < 2) {
      alert("لطفاً عنوان و حداقل 2 عبارت اضافه کنید");
      return;
    }
    
    createMutation.mutate({
      ...activity,
      content: { statements: validStatements }
    });
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">درست یا غلط</h1>
              <p className="text-sm md:text-base text-gray-600">تشخیص صحت عبارات</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white rounded-xl clay-element"
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
                placeholder="مثال: تشخیص عبارات علمی"
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

        <Card className="clay-element bg-white border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">عبارات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.content.statements.map((statement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-lime-50 to-green-50 rounded-xl clay-element"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <Label className="mb-2 block">عبارت {index + 1}</Label>
                    <Textarea
                      value={statement.text}
                      onChange={(e) => updateStatement(index, 'text', e.target.value)}
                      placeholder="مثال: خورشید یک ستاره است"
                      className="rounded-xl clay-element"
                    />
                  </div>
                  <Button
                    onClick={() => removeStatement(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 mt-7"
                    disabled={activity.content.statements.length <= 2}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatement(index, 'is_true', true)}
                    className={`flex-1 p-3 rounded-xl clay-element flex items-center justify-center gap-2 transition-all ${
                      statement.is_true 
                        ? 'bg-green-500 text-white ring-4 ring-green-300' 
                        : 'bg-white hover:bg-green-50'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    <span className="font-medium">درست</span>
                  </button>
                  <button
                    onClick={() => updateStatement(index, 'is_true', false)}
                    className={`flex-1 p-3 rounded-xl clay-element flex items-center justify-center gap-2 transition-all ${
                      !statement.is_true 
                        ? 'bg-red-500 text-white ring-4 ring-red-300' 
                        : 'bg-white hover:bg-red-50'
                    }`}
                  >
                    <X className="w-5 h-5" />
                    <span className="font-medium">غلط</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Button
          onClick={addStatement}
          variant="outline"
          className="w-full h-14 rounded-2xl clay-element border-2 border-dashed border-lime-300 hover:bg-lime-50"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن عبارت جدید
        </Button>

        <div className="mt-6 p-4 bg-lime-50 rounded-2xl clay-element">
          <p className="text-sm text-lime-700">
            💡 <strong>نکته:</strong> بازیکن باید تشخیص دهد هر عبارت درست است یا غلط.
          </p>
        </div>
      </div>
    </div>
  );
}

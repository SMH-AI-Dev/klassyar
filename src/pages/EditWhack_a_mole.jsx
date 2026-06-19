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
import { ArrowRight, Save } from "lucide-react";
import { toast } from "@/lib/sonner";

export default function EditWhack_a_mole() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "whack_a_mole",
    content: {}
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

    updateMutation.mutate(activity);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
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
              ویرایش بازی موش‌کوب
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </motion.div>

        <Card className="clay-element bg-gradient-to-br from-red-50 to-orange-50 border-0">
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
              <div className="bg-white/50 rounded-xl p-4 mt-4">
                <p className="text-sm text-gray-600">
                  این بازی به صورت خودکار اجرا می‌شود و نیازی به تنظیمات اضافی ندارد.
                  بازیکنان باید در 60 ثانیه موش‌ها را بزنند و امتیاز کسب کنند.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

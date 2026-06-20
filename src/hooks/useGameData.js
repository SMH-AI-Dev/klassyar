import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "@/lib/sonner";
import { useState } from "react";
import { demoSamples } from "@/lib/demoData";

export function useGameData() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activityId = searchParams.get("id");
  const isDemo = searchParams.get("demo") === "true";
  const type = searchParams.get("type") || "quiz";

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: async () => {
      const acts = await base44.entities.Activity.list();
      return acts.find((a) => a.id === activityId);
    },
    enabled: !isDemo && !!activityId,
  });

  const demoActivity = isDemo ? demoSamples[type] || demoSamples.quiz : null;

  const [saving, setSaving] = useState(false);

  const saveActivity = async (title, content) => {
    if (saving) return;
    setSaving(true);
    try {
      const overrides = localStorage.getItem("customTitle");
      await base44.entities.Activity.create({
        title: overrides || title || demoActivity?.title || "فعالیت جدید",
        type: type,
        description: "",
        content: content || demoActivity?.content,
        theme: "lavender",
      });
      localStorage.removeItem("customTitle");
      toast.success("فعالیت با موفقیت ذخیره شد! 🎉");
      navigate("/");
    } catch {
      toast.error("خطا در ذخیره فعالیت");
    } finally {
      setSaving(false);
    }
  };

  return {
    activity: isDemo ? demoActivity : activity,
    isLoading: isDemo ? false : isLoading,
    isDemo,
    type,
    activityId,
    saveActivity,
    saving,
  };
}

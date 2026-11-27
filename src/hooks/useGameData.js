import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { localData } from "@/api/localDataClient";
import { toast } from "@/lib/sonner";
import { useState } from "react";
import { demoSamples } from "@/lib/demoData";
import { classroom } from "@/lib/classroom";

export function useGameData() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activityId = searchParams.get("id");
  const assignmentId = searchParams.get("assignmentId");
  const isDemo = searchParams.get("demo") === "true";
  const type = searchParams.get("type") || "quiz";

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: async () => {
      const acts = await localData.entities.Activity.list();
      return acts.find((item) => item.id === activityId);
    },
    enabled: !isDemo && !assignmentId && !!activityId,
  });

  const studentProfile = assignmentId ? classroom.student() : null;
  const assignment = assignmentId
    ? (studentProfile?.assignments || []).find((item) => item.id === assignmentId) || null
    : null;
  const assignmentAttempts = assignmentId
    ? classroom.results().filter((item) =>
        item.assignmentId === assignmentId && item.studentId === studentProfile?.student?.id)
    : [];
  const assignmentExpired = Boolean(assignment?.deadline && Date.now() > Date.parse(assignment.deadline));
  const attemptsExhausted = Boolean(assignment?.maxAttempts && assignmentAttempts.length >= assignment.maxAttempts);
  const assignedActivity = assignment?.activitySnapshot && !assignmentExpired && !attemptsExhausted
    ? { ...assignment.activitySnapshot, assignmentId }
    : null;

  const demoActivity = isDemo ? demoSamples[type] || demoSamples.quiz : null;
  const [saving, setSaving] = useState(false);

  const saveActivity = async (title, content) => {
    if (saving) return;
    setSaving(true);
    try {
      const overrides = localStorage.getItem("customTitle");
      await localData.entities.Activity.create({
        title: overrides || title || demoActivity?.title || "فعالیت جدید",
        type,
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
    activity: isDemo ? demoActivity : assignmentId ? assignedActivity : activity,
    isLoading: isDemo || assignmentId ? false : isLoading,
    isDemo,
    type,
    activityId,
    assignmentId,
    assignment,
    saveActivity,
    saving,
  };
}

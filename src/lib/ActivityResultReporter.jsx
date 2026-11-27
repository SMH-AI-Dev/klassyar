import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { classroom } from "@/lib/classroom";

export default function ActivityResultReporter({ activity, type, score, total }) {
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get("assignmentId");
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current || !activity || !Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return;
    reported.current = true;
    const normalizedTotal = Math.round(total);
    const normalizedScore = Math.max(0, Math.min(normalizedTotal, Math.round(score)));
    try {
      classroom.recordResult({
        gameId: activity.id || `activity-${type || activity.type || "custom"}`,
        gameTitle: activity.title || "فعالیت آموزشی",
        assignmentId: assignmentId || null,
        roundId: `activity-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
        score: normalizedScore,
        total: normalizedTotal,
        percent: Math.round((normalizedScore / normalizedTotal) * 100),
      });
    } catch {
      reported.current = false;
    }
  }, [activity, score, total, type, assignmentId]);

  return null;
}

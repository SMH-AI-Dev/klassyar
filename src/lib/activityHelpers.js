import { base44 } from "@/api/base44Client";

/**
 * ساخت فعالیت جدید با اضافه کردن created_by
 */
export const createActivity = async (activityData) => {
  const me = await base44.auth.me();
  return base44.entities.Activity.create({
    ...activityData,
    created_by: me.email,
    created_date: new Date().toISOString(),
    plays_count: 0
  });
};

/**
 * بروزرسانی فعالیت
 */
export const updateActivity = async (activityId, activityData) => {
  return base44.entities.Activity.update(activityId, {
    ...activityData,
    updated_date: new Date().toISOString()
  });
};

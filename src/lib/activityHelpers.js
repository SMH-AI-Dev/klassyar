import { localData } from "@/api/localDataClient";

/**
 * ساخت فعالیت جدید با اضافه کردن created_by
 */
export const createActivity = async (activityData) => {
  const me = await localData.auth.me();
  return localData.entities.Activity.create({
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
  return localData.entities.Activity.update(activityId, {
    ...activityData,
    updated_date: new Date().toISOString()
  });
};

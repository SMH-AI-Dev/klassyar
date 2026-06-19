import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import ActivityGrid from "@/components/dashboard/ActivityGrid";

export default function SavedActivities() {
  const navigate = useNavigate();

  // دریافت فعالیت‌های کاربر
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      try {
        const result = await base44.entities.Activity.list();
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    },
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              فعالیت‌های شما
            </h1>
            <p className="text-gray-600 text-lg">
              {activities.length} فعالیت ذخیره شده
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/Dashboard')}
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg rounded-2xl clay-element"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              بازگشت به داشبورد
            </Button>
            <Button
              onClick={() => navigate('/Dashboard')}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-2xl clay-element"
            >
              <Plus className="w-5 h-5 ml-2" />
              فعالیت جدید
            </Button>
          </div>
        </motion.div>

        {/* Activities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
            </div>
          ) : activities.length === 0 ? (
            <Card className="clay-element bg-white/60 border-0">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-6">🎮</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  هنوز فعالیتی ساخته نشده
                </h3>
                <p className="text-gray-600 mb-6">
                  با ساخت اولین فعالیت خود شروع کنید!
                </p>
                <Button
                  onClick={() => navigate('/Dashboard')}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 rounded-2xl clay-element"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  ساخت فعالیت جدید
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ActivityGrid activities={activities} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

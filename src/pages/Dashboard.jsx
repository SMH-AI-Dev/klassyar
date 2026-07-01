import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Gamepad2, Trophy, Users, TrendingUp, BookOpen, Globe } from "lucide-react";
import { motion } from "framer-motion";
import StatsCards from "@/components/dashboard/StatsCards";
import ActivityGrid from "@/components/dashboard/ActivityGrid";
import TemplateSelector from "@/components/dashboard/TemplateSelector";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', user?.email],
    queryFn: async () => {
      try {
        const data = await base44.entities.Activity.list();
        const filtered = user?.email
          ? data.filter(a => a.created_by === user.email)
          : data;
        return filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      } catch (error) {
        console.error('Error loading activities:', error);
        return [];
      }
    },
    enabled: !!user,
    initialData: [],
  });

  const { data: results } = useQuery({
    queryKey: ['results', user?.email],
    queryFn: async () => {
      const all = await base44.entities.GameResult.list('-created_date', 100);
      return user?.email ? all.filter(r => r.created_by === user.email) : all;
    },
    enabled: !!user,
    initialData: [],
  });

  const stats = [
    {
      title: "فعالیت‌های شما",
      value: activities.length,
      icon: Gamepad2,
      color: "from-purple-400 to-pink-400"
    },
    {
      title: "کل بازی‌ها",
      value: activities.reduce((sum, a) => sum + (a.plays_count || 0), 0),
      icon: Trophy,
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "امتیاز میانگین",
      value: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) + '%' : '0%',
      icon: TrendingUp,
      color: "from-green-400 to-emerald-400"
    },
    {
      title: "دانش‌آموزان",
      value: new Set(results.map(r => r.created_by)).size,
      icon: Users,
      color: "from-orange-400 to-red-400"
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              سلام، {user?.name || 'کاربر'} 👋
            </h1>
            <p className="text-gray-600 text-lg">آماده‌اید برای ساخت یک فعالیت جدید؟</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowTemplates(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-2xl clay-element"
            >
              <Plus className="w-5 h-5 ml-2" />
              فعالیت جدید
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCards {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Game Hubs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              className="clay-element bg-gradient-to-br from-green-50 to-emerald-50 border-0 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate('/game-hub')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-lg">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-lg font-bold text-gray-800">بازی‌های آموزشی</h3>
                  <p className="text-sm text-gray-500">۵۰ بازی آموزشی تعاملی</p>
                </div>
                <span className="text-2xl">🎮</span>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              className="clay-element bg-gradient-to-br from-blue-50 to-indigo-50 border-0 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate('/english-hub')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-lg">
                  <Globe className="w-7 h-7" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-lg font-bold text-gray-800">باشگاه چالش انگلیسی</h3>
                  <p className="text-sm text-gray-500">۵۰ بازی آموزش زبان انگلیسی</p>
                </div>
                <span className="text-2xl">🏴</span>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Activities Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              فعالیت‌های شما
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
            </div>
          ) : activities.length === 0 ? (
            <Card className="clay-element bg-white/60 border-0">
              <CardContent className="p-12 text-center">
                <Gamepad2 className="w-20 h-20 text-blue-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  فعالیت دلخواه خود را ایجاد کنید
                </h3>
                <p 
                  className="text-gray-600 mb-6 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigate('/SavedActivities')}
                >
                  در اینجا می‌توانید فعالیت‌های خود را مشاهده کنید
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setShowTemplates(true)}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 rounded-2xl clay-element"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    ساخت فعالیت جدید
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ActivityGrid activities={activities} />
          )}
        </motion.div>
      </div>

      {/* Template Selector Modal */}
      {showTemplates && (
        <TemplateSelector onClose={() => setShowTemplates(false)} />
      )}
    </div>
  );
}

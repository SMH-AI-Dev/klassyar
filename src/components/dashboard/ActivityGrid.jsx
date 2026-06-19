import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Share2, Edit, Eye, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/sonner";

const activityIcons = {
  flashcard: "🎴",
  random_wheel: "🎡",
  matching: "🧩",
  group_sort: "📊",
  quiz: "📝",
  wordsearch: "🔍",
  unjumble: "✏️",
  whack_a_mole: "🎯",
  labeled_diagram: "🏷️",
  memory_game: "🃏",
  true_false: "✔️",
  fill_blank: "📄",
  ranking: "🏆",
  spinner: "🎰"
};

const activityNames = {
  flashcard: "کارت‌های آموزشی",
  random_wheel: "چرخ گردان",
  matching: "جورکردنی",
  group_sort: "مرتب‌سازی گروهی",
  quiz: "آزمون",
  wordsearch: "پیدا کردن کلمه",
  unjumble: "ترتیب کلمات",
  whack_a_mole: "بزن بزن",
  labeled_diagram: "برچسب‌زنی",
  memory_game: "بازی حافظه",
  true_false: "درست یا غلط",
  fill_blank: "جای خالی",
  ranking: "رتبه‌بندی",
  spinner: "فلک شانس"
};

const themeColors = {
  lavender: "from-purple-300 to-pink-300",
  mint: "from-green-300 to-emerald-300",
  sky: "from-blue-300 to-cyan-300",
  peach: "from-orange-300 to-red-300",
  rose: "from-rose-300 to-pink-300"
};

export default function ActivityGrid({ activities }) {
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Activity.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success("فعالیت با موفقیت حذف شد");
    },
    onError: () => {
      toast.error("خطا در حذف فعالیت");
    },
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`آیا از حذف "${title}" اطمینان دارید؟`)) {
      deleteMutation.mutate(id);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="clay-element bg-white border-0 overflow-hidden hover:shadow-xl transition-all">
            {/* عنوان فعالیت بالای کارت */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
              <h3 className="font-bold text-lg text-white line-clamp-1 text-center">
                {activity.title}
              </h3>
            </div>

            {/* Card Header with Gradient */}
            <div className={`h-32 bg-gradient-to-br ${themeColors[activity.theme || 'lavender']} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/10" />
              <div className="absolute top-4 right-4 text-6xl">
                {activityIcons[activity.type]}
              </div>
              <div className="absolute bottom-4 right-4">
                <Badge className="bg-white/90 text-gray-800 clay-element border-0">
                  {activityNames[activity.type]}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              {activity.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  <span>{activity.plays_count || 0} بازی</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>
                    {new Date(activity.created_date).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link 
                  to={`/Play?type=${activity.type}&id=${activity.id}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl clay-element">
                    <Play className="w-4 h-4 ml-2" />
                    بازی
                  </Button>
                </Link>
                <Link to={`/Edit?type=${activity.type}&id=${activity.id}`}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl clay-element border-2 border-blue-200"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  onClick={() => handleDelete(activity.id, activity.title)}
                  variant="outline"
                  size="icon"
                  className="rounded-xl clay-element border-2 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Share2, Edit, Eye, Trash2, Copy, Shuffle } from "lucide-react";
import { motion } from "framer-motion";
import { localData } from "@/api/localDataClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/sonner";
import { convertActivityData, getCompatibleTemplates } from "@/lib/activityConversion";

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
  spinner: "🎰",
  crossword: "🔠",
  timeline: "📅",
  card_flip: "🃏",
  hotspot: "📍",
  drag_text: "🧲",
  balloon_pop: "🎈",
  gameshow_quiz: "🏆",
  maze_chase: "🧭",
  airplane: "✈️",
  open_the_box: "🎁",
  missing_word: "✏️",
  anagram: "🔤",
  hangman: "🎯",
  flip_tiles: "🟦",
  image_quiz: "🖼️",
  labelled_diagram: "🏷️",
  labeled_diagram: "🏷️",
  random_cards: "🎴",
  match: "🧩",
  type: "💡",
  scramble: "🔀"
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
  spinner: "فلک شانس",
  crossword: "جدول کلمات",
  timeline: "خط زمانی",
  card_flip: "کارت برگردان",
  hotspot: "نقاط تعاملی",
  drag_text: "واژه‌های جابه‌جایی",
  balloon_pop: "ترکاندن بادکنک",
  gameshow_quiz: "مسابقه تلویزیونی",
  maze_chase: "هزارتو",
  airplane: "هواپیما",
  open_the_box: "جعبه شگفتی",
  missing_word: "کلمه گمشده",
  anagram: "حروف درهم",
  hangman: "حدس واژه",
  flip_tiles: "کاشی برگردان",
  image_quiz: "آزمون تصویری",
  labelled_diagram: "برچسب‌گذاری تصویر",
  labeled_diagram: "برچسب‌گذاری تصویر",
  random_cards: "کارت تصادفی",
  match: "جفت‌یابی",
  type: "پاسخ‌گزین",
  scramble: "واژه درهم"
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
    mutationFn: (id) => localData.entities.Activity.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success("فعالیت با موفقیت حذف شد");
    },
    onError: () => {
      toast.error("خطا در حذف فعالیت");
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (activity) => {
      const { id, created_date, plays_count, created_by, ...copy } = activity;
      return localData.entities.Activity.create({
        ...copy,
        title: `${activity.title} - نسخه کپی`,
        sourceActivityId: activity.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("نسخهٔ مستقل فعالیت ساخته شد");
    },
    onError: () => toast.error("کپی فعالیت انجام نشد"),
  });

  const convertMutation = useMutation({
    mutationFn: async ({ activity, targetType }) => {
      const converted = convertActivityData(activity, targetType);
      return localData.entities.Activity.create(converted);
    },
    onSuccess: (activity) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success(`فعالیت به قالب «${activity.type}» تبدیل شد؛ نسخهٔ اصلی حفظ شده است.`);
    },
    onError: (error) => toast.error(error.message || "تبدیل قالب انجام نشد"),
  });

  const handleExport = (activity) => {
    try {
      const bundle = {
        format: "klassyar-activity",
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        license: activity.license || "teacher-owned-or-authorized",
        attribution: activity.attribution || null,
        activity,
      };
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const safeName = String(activity.title || "activity").replace(/[\\/:*?"<>|]/g, "_");
      anchor.href = url;
      anchor.download = `${safeName}.klassyar.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      toast.success("بستهٔ فعالیت دانلود شد");
    } catch {
      toast.error("ساخت فایل فعالیت ناموفق بود");
    }
  };

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

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/Play?type=${activity.type}&id=${activity.id}`}
                  className="flex-1 min-w-[92px]"
                >
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl clay-element">
                    <Play className="w-4 h-4 ml-2" />
                    بازی
                  </Button>
                </Link>
                <Link to={`/Edit?type=${activity.type}&id=${activity.id}`}>
                  <Button variant="outline" size="icon" title="ویرایش" className="rounded-xl clay-element border-2 border-blue-200">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button onClick={() => duplicateMutation.mutate(activity)} variant="outline" size="icon" title="ساخت نسخه کپی" className="rounded-xl clay-element">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleExport(activity)} variant="outline" size="icon" title="دانلود بسته فعالیت" className="rounded-xl clay-element">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleDelete(activity.id, activity.title)} variant="outline" size="icon" title="حذف" className="rounded-xl clay-element border-2 border-red-200 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs"
                  value=""
                  onChange={(event) => {
                    const targetType = event.target.value;
                    if (targetType) convertMutation.mutate({ activity, targetType });
                  }}
                  disabled={convertMutation.isPending || getCompatibleTemplates(activity).length === 0}
                  aria-label="تبدیل قالب فعالیت"
                >
                  <option value="">{getCompatibleTemplates(activity).length ? "تبدیل به قالب دیگر…" : "تبدیل مستقیم برای این محتوا موجود نیست"}</option>
                  {getCompatibleTemplates(activity).map((template) => (
                    <option key={template.type} value={template.type}>{template.label}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

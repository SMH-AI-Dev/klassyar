import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { localData } from "@/api/localDataClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus, Upload } from "lucide-react";
import { toast } from "@/lib/sonner";
import { motion } from "framer-motion";
import ActivityGrid from "@/components/dashboard/ActivityGrid";

export default function SavedActivities() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const importInput = useRef(null);

  // دریافت فعالیت‌های کاربر
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      try {
        const result = await localData.entities.Activity.list();
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    },
  });

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2_000_000) throw new Error("حجم بستهٔ فعالیت نباید بیشتر از ۲ مگابایت باشد");
      const bundle = JSON.parse(await file.text());
      if (bundle.format !== "klassyar-activity" || bundle.schemaVersion !== 1 || !bundle.activity) {
        throw new Error("فرمت فایل، بستهٔ معتبر کلاس‌یار نیست");
      }
      const activity = bundle.activity;
      const supportedTypes = new Set([
        "quiz", "gameshow_quiz", "flashcard", "matching", "group_sort", "memory_game",
        "random_wheel", "true_false", "unjumble", "whack_a_mole", "wordsearch", "fill_blank",
        "ranking", "crossword", "timeline", "spinner", "card_flip", "hotspot", "drag_text",
        "balloon_pop", "maze_chase", "airplane", "open_the_box", "missing_word", "anagram",
        "hangman", "flip_tiles", "image_quiz", "labelled_diagram", "random_cards", "match",
        "type", "scramble",
      ]);
      if (!activity.title || !supportedTypes.has(activity.type) ||
          !activity.content || typeof activity.content !== "object" || Array.isArray(activity.content)) {
        throw new Error("ساختار فعالیت یا قالب آن در این نسخه پشتیبانی نمی‌شود");
      }
      await localData.entities.Activity.create({
        title: `${activity.title} - واردشده`,
        description: activity.description || "",
        type: activity.type,
        theme: activity.theme || "lavender",
        content: activity.content,
        sourceActivityId: activity.id || null,
        sourceBundleVersion: bundle.schemaVersion,
        sourceAttribution: bundle.attribution || null,
        sourceLicense: bundle.license || "unspecified",
        importedAt: new Date().toISOString(),
      });
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("فعالیت با موفقیت وارد کتابخانه شد");
    } catch (error) {
      toast.error(error.message || "واردکردن بستهٔ فعالیت ناموفق بود");
    } finally {
      event.target.value = "";
    }
  };

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
          <div className="flex flex-wrap gap-3">
            <input ref={importInput} type="file" accept=".json,.klassyar.json,application/json" className="hidden" onChange={handleImport} />
            <Button
              onClick={() => importInput.current?.click()}
              variant="outline"
              size="lg"
              className="border-2 border-violet-200 text-violet-700 px-5 py-6 text-lg rounded-2xl clay-element"
            >
              <Upload className="w-5 h-5 ml-2" />
              واردکردن فعالیت
            </Button>
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

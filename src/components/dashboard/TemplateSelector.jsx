import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const templates = [
  { type: "flashcard", name: "کارت‌های آموزشی", emoji: "🎴", description: "نمایش سوال و پاسخ با کلیک", color: "from-purple-400 to-pink-400" },
  { type: "random_wheel", name: "چرخ گردان", emoji: "🎡", description: "انتخاب تصادفی از میان گزینه‌ها", color: "from-blue-400 to-cyan-400" },
  { type: "matching", name: "جورکردنی", emoji: "🧩", description: "اتصال موارد مرتبط به هم", color: "from-green-400 to-emerald-400" },
  { type: "quiz", name: "آزمون چندگزینه‌ای", emoji: "📝", description: "سوالات تستی با نمره‌دهی", color: "from-orange-400 to-red-400" },
  { type: "group_sort", name: "مرتب‌سازی گروهی", emoji: "📊", description: "دسته‌بندی موارد در گروه‌ها", color: "from-pink-400 to-rose-400" },
  { type: "wordsearch", name: "پیدا کردن کلمه", emoji: "🔍", description: "جدول کلمات متقاطع", color: "from-indigo-400 to-purple-400" },
  { type: "unjumble", name: "ترتیب کلمات", emoji: "✏️", description: "مرتب کردن کلمات برای ساخت جمله", color: "from-teal-400 to-green-400" },
  { type: "whack_a_mole", name: "بزن بزن", emoji: "🎯", description: "ضربه زدن به پاسخ‌های صحیح", color: "from-red-400 to-orange-400" },
  { type: "true_false", name: "درست یا غلط", emoji: "✔️", description: "تشخیص جملات درست از غلط", color: "from-lime-400 to-green-400" },
  { type: "memory_game", name: "بازی حافظه", emoji: "🃏", description: "پیدا کردن جفت‌های یکسان", color: "from-violet-400 to-purple-400" },
  { type: "fill_blank", name: "جای خالی", emoji: "📄", description: "پر کردن جاهای خالی در جمله", color: "from-amber-400 to-orange-400" },
  { type: "ranking", name: "رتبه‌بندی", emoji: "🔢", description: "مرتب کردن موارد به ترتیب", color: "from-sky-400 to-blue-400" },
  { type: "crossword", name: "جدول کلمات متقاطع", emoji: "⬛", description: "حل جدول کلمات متقاطع", color: "from-slate-400 to-gray-400" },
  { type: "timeline", name: "خط زمانی", emoji: "⏰", description: "مرتب کردن رویدادها بر اساس زمان", color: "from-fuchsia-400 to-pink-400" },
  { type: "spinner", name: "اسپینر سوال", emoji: "🎰", description: "چرخاندن و پاسخ دادن", color: "from-emerald-400 to-teal-400" },
  { type: "card_flip", name: "کارت چرخان", emoji: "🔄", description: "چرخش کارت برای نمایش پاسخ", color: "from-rose-400 to-red-400" },
  { type: "hotspot", name: "نقطه فعال", emoji: "📍", description: "کلیک روی نقاط صحیح تصویر", color: "from-yellow-400 to-amber-400" },
  { type: "drag_text", name: "کشیدن متن", emoji: "📝", description: "کشیدن کلمات به جای مناسب", color: "from-cyan-400 to-blue-400" },
  { type: "balloon_pop", name: "ترکاندن بادکنک", emoji: "🎈", description: "بادکنک‌های صحیح را بترکان", color: "from-violet-400 to-purple-400" },
  { type: "gameshow_quiz", name: "مسابقه تلویزیونی", emoji: "🎬", description: "آزمون به سبک برنامه‌های مسابقه", color: "from-orange-400 to-red-400" },
  { type: "maze_chase", name: "تعقیب در مارپیچ", emoji: "🏃", description: "فرار از هیولا با پاسخ صحیح", color: "from-indigo-400 to-purple-400" },
  { type: "airplane", name: "هواپیما", emoji: "✈️", description: "به سمت هدف پرواز کن", color: "from-blue-400 to-cyan-400" },
  { type: "open_the_box", name: "باز کردن جعبه", emoji: "📦", description: "جعبه‌ها را باز کن و سوال را پاسخ بده", color: "from-teal-400 to-green-400" },
  { type: "missing_word", name: "کلمه گمشده", emoji: "🔍", description: "کلمه مناسب را انتخاب کنید", color: "from-pink-400 to-rose-400" },
  { type: "anagram", name: "جایگشت حروف", emoji: "🔀", description: "حروف را مرتب کن و کلمه را پیدا کن", color: "from-lime-400 to-green-400" },
  { type: "hangman", name: "چوبه دار", emoji: "🎯", description: "حدس بزن و کلمه را پیدا کن", color: "from-red-400 to-orange-400" },
  { type: "flip_tiles", name: "کاشی‌های چرخان", emoji: "🔄", description: "کاشی‌ها را برگردان", color: "from-purple-400 to-violet-400" },
  { type: "image_quiz", name: "آزمون تصویری", emoji: "🖼️", description: "سوالات با تصویر", color: "from-cyan-400 to-blue-400" },
  { type: "labelled_diagram", name: "نمودار برچسب‌دار", emoji: "🏷️", description: "برچسب‌گذاری تصویر", color: "from-emerald-400 to-green-400" },
  { type: "random_cards", name: "کارت‌های تصادفی", emoji: "🎴", description: "انتخاب تصادفی کارت", color: "from-amber-400 to-yellow-400" }
];

const templateSamples = {
  flashcard: "نمونه: تمرین کلمات جدید با کارت‌های چندگزینه‌ای",
  random_wheel: "نمونه: پاسخ تصادفی به سوالات زبان",
  matching: "نمونه: جفت‌سازی واژه‌ها و معنی‌ها",
  quiz: "نمونه: آزمون چهارگزینه‌ای درس زبان",
  group_sort: "نمونه: دسته‌بندی کلمات بر اساس معنی",
  wordsearch: "نمونه: پیدا کردن واژه‌های درس انگلیسی",
  unjumble: "نمونه: مرتب‌سازی حروف برای ساخت جمله",
  whack_a_mole: "نمونه: انتخاب سریع پاسخ صحیح",
  true_false: "نمونه: تشخیص جمله درست یا غلط",
  memory_game: "نمونه: پیدا کردن جفت‌های واژه‌ای",
  fill_blank: "نمونه: پر کردن جای خالی در جمله",
  ranking: "نمونه: مرتب‌سازی کلمات بر اساس اهمیت",
  crossword: "نمونه: حل جدول کلمات متقاطع ساده",
  timeline: "نمونه: مرتب‌سازی رویدادهای داستانی",
  spinner: "نمونه: چرخش برای انتخاب سوال بعدی",
  card_flip: "نمونه: کشف پاسخ با چرخاندن کارت",
  hotspot: "نمونه: انتخاب نقطه صحیح روی تصویر",
  drag_text: "نمونه: کشیدن کلمات در جای مناسب",
  balloon_pop: "نمونه: ترکاندن بادکنک پاسخ درست",
  gameshow_quiz: "نمونه: مسابقه تلویزیونی سوال و جواب",
  maze_chase: "نمونه: فرار با جواب‌های صحیح",
  airplane: "نمونه: پرواز تا رسیدن به پاسخ درست",
  open_the_box: "نمونه: باز کردن جعبه برای دیدن سوال",
  missing_word: "نمونه: پیدا کردن کلمه گمشده",
  anagram: "نمونه: تشکیل کلمه با جابجایی حروف",
  hangman: "نمونه: حدس کلمه با کمک حروف",
  flip_tiles: "نمونه: چرخاندن کاشی برای نمایش پاسخ",
  image_quiz: "نمونه: پرسش تصویری همراه با توضیح",
  labelled_diagram: "نمونه: برچسب‌گذاری بخش‌های تصویر",
  random_cards: "نمونه: انتخاب کارت تصادفی برای تمرین"
};

export default function TemplateSelector({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white/95 rounded-3xl clay-element max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-purple-200/50 flex items-center justify-between sticky top-0 bg-white/95 z-10">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-800">انتخاب نوع فعالیت 🎮</h2>
              <p className="text-xs md:text-base text-gray-600 mt-1">{templates.length} بازی آموزشی برای شما!</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="rounded-full clay-element flex-shrink-0"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {templates.map((template, index) => (
                <motion.div
                  key={template.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to={`/Create?type=${template.type}`}>
                    <Card className="clay-element bg-white border-0 cursor-pointer h-full hover:shadow-xl transition-all">
                      <CardContent className="p-3 md:p-4">
                        <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${template.color} rounded-2xl clay-element flex items-center justify-center text-2xl md:text-3xl mb-2 md:mb-3 mx-auto`}>
                          {template.emoji}
                        </div>
                        <h3 className="font-bold text-xs md:text-sm text-gray-800 text-center mb-1 md:mb-2 leading-tight">
                          {template.name}
                        </h3>
                        <p className="text-gray-600 text-[10px] md:text-xs text-center leading-tight">
                          {template.description}
                        </p>
                        <p className="text-gray-500 text-[9px] md:text-[10px] text-center mt-2">
                          {templateSamples[template.type]}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles, Gamepad2, Users, Trophy,
  BookOpen, Zap, Heart, Star, ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import FloatingEmojis from "@/components/shared/FloatingEmojis";

const gameTypes = [
  { name: "کارت‌های آموزشی", emoji: "🎴", type: "flashcard", color: "from-purple-400 to-pink-400" },
  { name: "چرخ شانس", emoji: "🎡", type: "random_wheel", color: "from-blue-400 to-cyan-400" },
  { name: "جورکردن", emoji: "🧩", type: "matching", color: "from-green-400 to-emerald-400" },
  { name: "آزمون", emoji: "📝", type: "quiz", color: "from-orange-400 to-red-400" },
  { name: "مرتب‌سازی گروهی", emoji: "📊", type: "group_sort", color: "from-pink-400 to-rose-400" },
  { name: "جدول کلمات", emoji: "🔍", type: "wordsearch", color: "from-indigo-400 to-purple-400" },
  { name: "ترتیب کلمات", emoji: "✏️", type: "unjumble", color: "from-teal-400 to-green-400" },
  { name: "موش‌کوب", emoji: "🎯", type: "whack_a_mole", color: "from-red-400 to-orange-400" },
  { name: "درست/غلط", emoji: "✔️", type: "true_false", color: "from-lime-400 to-green-400" },
  { name: "بازی حافظه", emoji: "🃏", type: "memory_game", color: "from-violet-400 to-purple-400" },
  { name: "جای خالی", emoji: "📄", type: "fill_blank", color: "from-amber-400 to-orange-400" },
  { name: "رتبه‌بندی", emoji: "🏆", type: "ranking", color: "from-sky-400 to-blue-400" },
  { name: "جدول متقاطع", emoji: "🔤", type: "crossword", color: "from-slate-400 to-gray-400" },
  { name: "خط زمان", emoji: "⏰", type: "timeline", color: "from-fuchsia-400 to-pink-400" },
  { name: "اسپینر سوال", emoji: "🎰", type: "spinner", color: "from-emerald-400 to-teal-400" },
  { name: "چرخش کارت", emoji: "🔄", type: "card_flip", color: "from-rose-400 to-red-400" },
  { name: "نقطه داغ", emoji: "📍", type: "hotspot", color: "from-yellow-400 to-amber-400" },
  { name: "کشیدن متن", emoji: "📝", type: "drag_text", color: "from-cyan-400 to-blue-400" },
  { name: "ترکیدن بادکنک", emoji: "🎈", type: "balloon_pop", color: "from-violet-400 to-purple-400" },
  { name: "مسابقه تلویزیونی", emoji: "📺", type: "gameshow_quiz", color: "from-orange-400 to-red-400" },
  { name: "مارپیچ", emoji: "🏃", type: "maze_chase", color: "from-indigo-400 to-purple-400" },
  { name: "هواپیما", emoji: "✈️", type: "airplane", color: "from-blue-400 to-cyan-400" },
  { name: "باز کردن جعبه", emoji: "📦", type: "open_the_box", color: "from-teal-400 to-green-400" },
  { name: "کلمه گمشده", emoji: "🔎", type: "missing_word", color: "from-pink-400 to-rose-400" },
  { name: "آناگرام", emoji: "🔠", type: "anagram", color: "from-lime-400 to-green-400" },
  { name: "چوبه دار", emoji: "🎭", type: "hangman", color: "from-red-400 to-orange-400" },
  { name: "کاشی‌های چرخان", emoji: "🔲", type: "flip_tiles", color: "from-purple-400 to-violet-400" },
  { name: "آزمون تصویری", emoji: "🖼️", type: "image_quiz", color: "from-cyan-400 to-blue-400" },
  { name: "نمودار برچسب‌دار", emoji: "🏷️", type: "labelled_diagram", color: "from-emerald-400 to-green-400" },
  { name: "کارت‌های تصادفی", emoji: "🎲", type: "random_cards", color: "from-amber-400 to-yellow-400" },
  { name: "🎮 ۵۰ بازی آموزشی", emoji: "🎮", type: "game-hub", color: "from-emerald-400 to-teal-400", isHub: true },
  { name: "🏴 ۵۰ بازی انگلیسی", emoji: "🏴", type: "english-hub", color: "from-blue-400 to-indigo-400", isHub: true },
];

const features = [
  {
    icon: Gamepad2, title: "بازی‌های متنوع",
    description: "۱۳۰ بازی مختلف برای یادگیری جذاب",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: Users, title: "مدیریت کلاس",
    description: "دعوت و پیگیری پیشرفت دانش‌آموزان",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: Trophy, title: "سیستم امتیازدهی",
    description: "رقابت سالم و انگیزه‌بخشی",
    color: "from-orange-400 to-red-400"
  },
  {
    icon: Zap, title: "ساخت آسان",
    description: "ایجاد فعالیت در چند کلیک",
    color: "from-green-400 to-emerald-400"
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingEmojis count={12} />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-pink-200/30 to-blue-200/30" />

          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/60 px-6 py-3 rounded-full mb-6 clay-element">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-purple-700 font-medium">پلتفرم گیمیفیکیشن آموزشی</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
                کلاس یار
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                یادگیری را با ۱۳۰ بازی تعاملی و جذاب به یک تجربه شگفت‌انگیز تبدیل کنید
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/Dashboard">
                  <Button size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-2xl clay-element">
                    شروع کنید
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link to="/Features">
                  <Button size="lg" variant="outline"
                    className="px-8 py-6 text-lg rounded-2xl border-2 border-purple-300 clay-element hover:bg-purple-50">
                    <BookOpen className="w-5 h-5 ml-2" />
                    آشنایی با امکانات
                  </Button>
                </Link>
                <Link to="/LanguageLearning">
                  <Button size="lg" variant="outline"
                    className="px-8 py-6 text-lg rounded-2xl border-2 border-green-300 clay-element hover:bg-green-50">
                    <BookOpen className="w-5 h-5 ml-2" />
                    آموزش زبان
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Free Forever Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <motion.div
                animate={{ boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.7)", "0 0 0 15px rgba(34, 197, 94, 0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block w-full"
              >
                <Card className="clay-element bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="flex justify-center gap-6 flex-wrap">
                      {[
                        { icon: Heart, text: "کاملاً رایگان" },
                        { icon: Zap, text: "بدون تبلیغات" },
                        { icon: Star, text: "بدون محدودیت" },
                      ].map((item, i) => (
                        <motion.div key={i} className="flex flex-col items-center gap-2" whileHover={{ scale: 1.1 }}>
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="font-bold text-green-700">{item.text}</p>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-green-700 text-lg font-semibold mt-4">
                      برای همیشه در اختیار شماست
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Game Types Showcase */}
        <section className="py-16 px-6 bg-white/40">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ۱۳۰ بازی متنوع
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                برای هر سبک یادگیری، یک بازی مناسب
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {gameTypes.map((game, index) => (
                <motion.div
                  key={game.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.06, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => game.isHub ? navigate(`/${game.type}`) : navigate(`/Play?type=${game.type}&demo=true`)}
                  className="cursor-pointer"
                >
                  <Card className={`
                    border-0 h-full transition-all duration-300
                    bg-gradient-to-br ${game.color} bg-opacity-10
                    hover:shadow-xl
                  `}
                    style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))` }}>
                    <CardContent className="p-4 md:p-5 text-center flex flex-col items-center gap-2">
                      <motion.div
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${game.color} clay-element flex items-center justify-center text-2xl md:text-3xl shadow-lg`}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
                      >
                        {game.emoji}
                      </motion.div>
                      <p className="font-bold text-gray-700 text-xs md:text-sm leading-tight mt-1">
                        {game.name}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                چرا کلاس یار؟
              </h2>
              <p className="text-xl text-gray-600">
                ابزارهای قدرتمند برای معلمان، تجربه‌ای جذاب برای دانش‌آموزان
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="clay-element bg-white/60 border-0 h-full">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl clay-element flex items-center justify-center mb-4`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-lg">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <Heart className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                آماده‌اید یادگیری را متحول کنید؟
              </h2>
              <p className="text-xl text-white/90 mb-8">
                همین الان شروع کنید و اولین فعالیت خود را بسازید
              </p>
              <Link to="/Dashboard">
                <Button size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-6 text-xl rounded-2xl clay-element font-bold">
                  <Star className="w-6 h-6 ml-2" />
                  شروع رایگان
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

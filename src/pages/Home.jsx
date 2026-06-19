import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Gamepad2, 
  Users, 
  Trophy,
  BookOpen,
  Zap,
  Heart,
  Star,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Gamepad2,
    title: "بازی‌های متنوع",
    description: "30 نوع بازی مختلف برای یادگیری جذاب",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: Users,
    title: "مدیریت کلاس",
    description: "دعوت و پیگیری پیشرفت دانش‌آموزان",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: Trophy,
    title: "سیستم امتیازدهی",
    description: "رقابت سالم و انگیزه‌بخشی",
    color: "from-orange-400 to-red-400"
  },
  {
    icon: Zap,
    title: "ساخت آسان",
    description: "ایجاد فعالیت در چند کلیک",
    color: "from-green-400 to-emerald-400"
  }
];

const gameTypes = [
  { name: "کارت‌های آموزشی", emoji: "🎴" },
  { name: "چرخ شانس", emoji: "🎡" },
  { name: "جورکردن", emoji: "🧩" },
  { name: "آزمون", emoji: "📝" },
  { name: "دسته‌بندی", emoji: "📊" },
  { name: "بازی حافظه", emoji: "🃏" },
  { name: "جدول کلمات", emoji: "🔍" },
  { name: "درست/غلط", emoji: "✔️" },
  { name: "مرتب‌سازی حروف", emoji: "✏️" },
  { name: "موش‌کوب", emoji: "🎯" },
  { name: "جای خالی", emoji: "📄" },
  { name: "رتبه‌بندی", emoji: "🏆" },
  { name: "جدول متقاطع", emoji: "🔤" },
  { name: "خط زمان", emoji: "⏰" },
  { name: "فلک شانس", emoji: "🎰" },
  { name: "چرخش کارت", emoji: "🎴" },
  { name: "نقطه داغ", emoji: "🎯" },
  { name: "کشیدن متن", emoji: "📝" },
  { name: "ترکیدن بادکنک", emoji: "🎈" },
  { name: "مسابقه تلویزیونی", emoji: "📺" },
  { name: "دونده مارپیچ", emoji: "🏃" },
  { name: "هواپیما", emoji: "✈️" },
  { name: "باز کردن جعبه", emoji: "📦" },
  { name: "کلمه گمشده", emoji: "🔎" },
  { name: "آناگرام", emoji: "🔠" },
  { name: "چوبه دار", emoji: "🎭" },
  { name: "چرخش کاشی", emoji: "🔲" },
  { name: "آزمون تصویری", emoji: "🖼️" },
  { name: "نمودار برچسب‌دار", emoji: "🏷️" },
  { name: "کارت‌های تصادفی", emoji: "🎲" }
];

export default function Home() {
  return (
    <div className="min-h-screen">
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
              یادگیری را با بازی‌های تعاملی و جذاب به یک تجربه شگفت‌انگیز تبدیل کنید
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/Dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-2xl clay-element"
                >
                  شروع کنید
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              
              <Link to="/Features">
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-2xl border-2 border-purple-300 clay-element hover:bg-purple-50"
                >
                  <BookOpen className="w-5 h-5 ml-2" />
                  آشنایی با امکانات
                </Button>
              </Link>
              
              <Link to="/LanguageLearning">
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-2xl border-2 border-green-300 clay-element hover:bg-green-50"
                >
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
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.7)",
                  "0 0 0 15px rgba(34, 197, 94, 0)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block w-full"
            >
              <Card className="clay-element bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="flex justify-center gap-6 flex-wrap">
                    <motion.div 
                      className="flex flex-col items-center gap-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-green-700">کاملاً رایگان</p>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center gap-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-green-700">بدون تبلیغات</p>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col items-center gap-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-green-700">بدون محدودیت</p>
                    </motion.div>
                  </div>
                  <p className="text-green-700 text-lg font-semibold mt-4">
                    برای همیشه در اختیار شماست
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-10 animate-bounce">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-2xl clay-element flex items-center justify-center text-3xl">
              ⭐
            </div>
          </div>
          <div className="absolute bottom-20 left-10 animate-bounce delay-100">
            <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-emerald-300 rounded-2xl clay-element flex items-center justify-center text-4xl">
              🎯
            </div>
          </div>
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
              30 نوع بازی مختلف
            </h2>
            <p className="text-xl text-gray-600">
              برای هر سبک یادگیری، یک بازی مناسب
            </p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {gameTypes.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="clay-element bg-gradient-to-br from-white to-purple-50 border-0 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-3">{game.emoji}</div>
                    <p className="font-medium text-gray-700 text-sm">{game.name}</p>
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
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
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
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {feature.description}
                    </p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Heart className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              آماده‌اید یادگیری را متحول کنید؟
            </h2>
            <p className="text-xl text-white/90 mb-8">
              همین الان شروع کنید و اولین فعالیت خود را بسازید
            </p>
            <Link to="/Dashboard">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-6 text-xl rounded-2xl clay-element font-bold"
              >
                <Star className="w-6 h-6 ml-2" />
                شروع رایگان
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

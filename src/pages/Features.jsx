import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Users, 
  Trophy, 
  Zap, 
  BookOpen, 
  Heart,
  CheckCircle,
  BarChart3,
  Share2,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "گیمیفیکیشن آموزشی",
    description: "تبدیل یادگیری به یک تجربه جذاب و سرگرم‌کننده با 9 نوع بازی مختلف",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: Users,
    title: "مدیریت کلاس",
    description: "ایجاد کلاس، دعوت دانش‌آموزان و پیگیری پیشرفت آن‌ها",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: Trophy,
    title: "سیستم امتیازدهی",
    description: "رقابت سالم و انگیزه‌بخش با امتیازات و رتبه‌بندی",
    color: "from-orange-400 to-red-400"
  },
  {
    icon: Zap,
    title: "ساخت آسان و سریع",
    description: "ایجاد فعالیت‌های تعاملی در عرض چند دقیقه",
    color: "from-green-400 to-emerald-400"
  },
  {
    icon: BarChart3,
    title: "گزارشات پیشرفت",
    description: "مشاهده آمار دقیق عملکرد دانش‌آموزان",
    color: "from-yellow-400 to-orange-400"
  },
  {
    icon: Share2,
    title: "اشتراک‌گذاری آسان",
    description: "به اشتراک‌گذاری فعالیت‌ها با کد یا لینک",
    color: "from-pink-400 to-rose-400"
  }
];

const gameTypes = [
  { name: "کارت‌های آموزشی", emoji: "🎴", description: "سوال و جواب تعاملی" },
  { name: "چرخ گردان", emoji: "🎡", description: "انتخاب تصادفی" },
  { name: "جورکردنی", emoji: "🧩", description: "اتصال موارد" },
  { name: "آزمون چندگزینه‌ای", emoji: "📝", description: "تست و ارزیابی" },
  { name: "مرتب‌سازی گروهی", emoji: "📊", description: "دسته‌بندی" },
  { name: "بازی حافظه", emoji: "🃏", description: "پیدا کردن جفت‌ها" },
  { name: "درست یا غلط", emoji: "✔️", description: "تشخیص صحت" },
  { name: "ترتیب کلمات", emoji: "✏️", description: "مرتب‌سازی کلمات" },
  { name: "بزن بزن", emoji: "🎯", description: "سرعت عمل" }
];

const teacherFeatures = [
  {
    icon: BookOpen,
    title: "ساخت محتوای متنوع",
    description: "ایجاد بازی‌های آموزشی برای هر موضوعی"
  },
  {
    icon: Clock,
    title: "صرفه‌جویی در وقت",
    description: "آماده‌سازی سریع فعالیت‌ها"
  },
  {
    icon: Users,
    title: "کلاس‌های نامحدود",
    description: "مدیریت چندین کلاس به صورت همزمان"
  },
  {
    icon: BarChart3,
    title: "تحلیل و گزارش",
    description: "دیدگاه کامل از عملکرد کلاس"
  }
];

const studentFeatures = [
  {
    icon: Sparkles,
    title: "یادگیری جذاب",
    description: "تجربه تعاملی و سرگرم‌کننده"
  },
  {
    icon: Trophy,
    title: "رقابت دوستانه",
    description: "امتیاز و رتبه‌بندی"
  },
  {
    icon: Zap,
    title: "پاسخ فوری",
    description: "دریافت بازخورد لحظه‌ای"
  },
  {
    icon: Heart,
    title: "انگیزه بیشتر",
    description: "علاقه‌مند شدن به یادگیری"
  }
];

export default function Features() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl mx-auto mb-4 md:mb-6 flex items-center justify-center clay-element">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">امکانات کلاس یار</h1>
          <p className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto">
            همه چیز که برای یک تجربه آموزشی عالی نیاز دارید
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            امکانات اصلی
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="clay-element bg-white border-0 h-full">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-4 flex items-center justify-center clay-element`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl clay-element p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            9 نوع بازی آموزشی
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {gameTypes.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="clay-element bg-white border-0 h-full">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="text-5xl md:text-6xl mb-3">{game.emoji}</div>
                    <h4 className="font-bold text-gray-800 mb-2 text-sm md:text-base">
                      {game.name}
                    </h4>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {game.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">برای معلمان</h2>
            <div className="space-y-4">
              {teacherFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="clay-element bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center clay-element flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">برای دانش‌آموزان</h2>
            <div className="space-y-4">
              {studentFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="clay-element bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center clay-element flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(168, 85, 247, 0.7)",
                "0 0 0 10px rgba(168, 85, 247, 0)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <Card className="clay-element bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-8 md:p-12">
              <CardContent>
                <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-6 animate-bounce" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  کاملاً رایگان، برای همیشه
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  تمام امکانات بدون هیچ محدودیتی در اختیار شماست
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <motion.div 
                    className="flex items-center gap-2 text-green-600 text-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">بدون تبلیغات</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 text-green-600 text-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">بدون محدودیت</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 text-green-600 text-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">بدون نیاز به پرداخت</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

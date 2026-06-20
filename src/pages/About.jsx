import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, Users, Trophy, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "مهندس سید مهدی حسینی",
    role: "معمار و طراح سیستم",
    emoji: "👨‍💻",
    email: "smh.4tecksoftware@gmail.com",
    tel : "+989024912785",
    description: "با تخصص و تجربه گسترده در طراحی و توسعه سیستم‌های آموزشی",
    color: "from-purple-400 to-pink-400"
  },
  {
    name: "GitHub Copilot",
    role: "هوش مصنوعی یار و همراه",
    emoji: "🤖",
    description: "کمک به پیاده‌سازی، بهینه‌سازی و خلق ایده‌های نوآورانه",
    color: "from-green-400 to-emerald-400"
  }
];

const features = [
  {
    icon: Sparkles,
    title: "گیمیفیکیشن آموزشی",
    description: "تبدیل یادگیری به یک تجربه جذاب و سرگرم‌کننده",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: Users,
    title: "برای همه",
    description: "معلمان، دانش‌آموزان و والدین - همه با هم",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: Zap,
    title: "نوآوری مداوم",
    description: "به‌روزرسانی‌ها و قابلیت‌های جدید به طور مرتب",
    color: "from-orange-400 to-red-400"
  },
  {
    icon: Heart,
    title: "ساخته با عشق",
    description: "هر خط کد با دقت و علاقه نوشته شده است",
    color: "from-rose-400 to-pink-400"
  },
  {
    icon: Heart,
    title: "پیشنهادات و انتقادات",
    description: "هرگونه پیشنهاد و انتقاد سازنده‌ای که کمک به پیشرفت این اپلیکیشن باشد را با جان و دل می‌پذیریم",
    email: "klasyar.smh@gmail.com",
    color: "from-rose-400 to-pink-400"
  }
];

export default function About() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl mx-auto mb-4 md:mb-6 flex items-center justify-center clay-element">
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">🎮 کلاس یار</h1>
          <h2 className="text-3xl md:text-5xl font-bold text-purple-600 mb-4">🏫 کلاس، یار بود 📚</h2>
          <div className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 space-y-3">
            <p>
              🌟 <strong>پلتفرم گیمیفیکیشن آموزشی</strong> با <strong>۳۰ نوع بازی تعاملی</strong> 🎯
            </p>
            <p>
              👩‍🏫 ساخته شده برای <strong>معلمان</strong> ، <strong>دانش‌آموزان</strong> و <strong>والدین</strong> 🤝
            </p>
            <p className="text-base md:text-lg text-purple-500">
              ✨ هر درس ، یک ماجراجویی جدید &nbsp; | &nbsp; هر بازی ، یک قدم به سوی یادگیری 🚀
            </p>
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="clay-element bg-gradient-to-br from-purple-50 to-pink-50 border-0">
            <CardContent className="p-6 md:p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">داستان ما</h2>
              </div>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-700 leading-relaxed">
                <p>
                  کلاس یار از یک رویا آغاز شد: رویای ساختن پلتفرمی که یادگیری را برای دانش‌آموزان 
                  ایرانی جذاب‌تر، تعاملی‌تر و لذت‌بخش‌تر کند. این پروژه با سعی و تلاش بی‌وقفه، 
                  کوشش شبانه‌روزی و اشتیاق فراوان به دنیای آموزش، شکل گرفت.
                </p>
                <p>
                  ما باور داریم که آموزش باید همچون یک بازی جذاب باشد - جایی که هر دانش‌آموز با 
                  اشتیاق منتظر درس بعدی باشد و هر معلم بتواند با ابزارهای ساده اما قدرتمند، 
                  تجربه‌های یادگیری بی‌نظیری خلق کند.
                </p>
                <div className="bg-white/60 p-4 md:p-6 rounded-2xl clay-element">
                  <p className="text-purple-700 font-medium text-sm md:text-base">
                    💡 این پلتفرم نتیجه همکاری انسان و هوش مصنوعی است - ترکیبی از خلاقیت انسانی، 
                    تجربه عملی و قدرت محاسباتی هوش مصنوعی که با هم، چیزی فراتر از تصور ساخته‌اند.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">تیم سازنده</h2>
            <p className="text-gray-600 text-base md:text-lg px-4">افرادی که کلاس یار را به واقعیت تبدیل کردند</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="clay-element bg-white border-0 h-full">
                  <CardContent className="p-8 md:p-10 text-center">
                    <div className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${member.color} rounded-3xl mx-auto mb-4 flex items-center justify-center clay-element text-4xl md:text-5xl`}>
                      {member.emoji}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-purple-600 font-medium mb-3 text-sm md:text-base">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {member.description}
                    </p>
                    {member.email && (
                      <div className="space-y-2">
                        <p className="text-purple-600 text-sm">
                          📧 {member.email}
                        </p>
                        {member.tel && (
                          <p className="text-green-600 text-sm">
                            📱 {member.tel}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">ویژگی‌های کلیدی</h2>
            <p className="text-gray-600 text-base md:text-lg px-4">چرا کلاس یار متفاوت است؟</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="clay-element bg-white border-0">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-4 flex items-center justify-center clay-element`}>
                      <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {feature.description}
                    </p>
                    {feature.email && (
                      <p className="text-purple-600 text-sm mt-2">
                        📧 {feature.email}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="clay-element bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 border-0">
            <CardContent className="p-6 md:p-8 lg:p-12 text-center text-white">
              <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">ماموریت ما</h2>
              <p className="text-base md:text-xl leading-relaxed max-w-3xl mx-auto mb-4 md:mb-6">
                ما متعهدیم که با ارائه ابزارهای نوآورانه و کاربرپسند، آموزش را برای نسل آینده ایران 
                متحول کنیم. هر روز تلاش می‌کنیم تا کلاس یار را بهتر، سریع‌تر و جذاب‌تر کنیم.
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
                <span className="text-2xl">⭐</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-6 md:py-8 border-t border-purple-200"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-red-500 animate-pulse" />
            <p className="text-base md:text-lg font-medium text-gray-700">
              ساخته شده با عشق برای آموزش ایران
            </p>
          </div>
          <p className="text-sm md:text-base text-gray-500">
            نسخه 1.3.0 | © 2026 کلاس یار | تمامی حقوق محفوظ است
          </p>
        </motion.div>
      </div>
    </div>
  );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Mic, PenTool, MessageSquare, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const languageFeatures = [
  {
    icon: BookOpen,
    title: "یادگیری واژگان",
    description: "آموزش کلمات و عبارات انگلیسی با بازی‌های تعاملی",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: Mic,
    title: "تمرین تلفظ",
    description: "بهبود مهارت گفتاری با بازخورد فوری",
    color: "from-green-400 to-emerald-400"
  },
  {
    icon: PenTool,
    title: "نوشتن و گرامر",
    description: "تمرین نوشتن جملات و یادگیری گرامر",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: MessageSquare,
    title: "مکالمه",
    description: "تمرین مکالمه با سناریوهای واقعی",
    color: "from-orange-400 to-red-400"
  },
  {
    icon: Headphones,
    title: "شنیداری",
    description: "بهبود مهارت شنیداری با داستان‌ها و گفتگوها",
    color: "from-indigo-400 to-purple-400"
  }
];

export default function LanguageLearning() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  بازگشت به خانه
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">آموزش زبان انگلیسی</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 px-6 py-3 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">آموزش زبان تعاملی</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              یادگیری زبان انگلیسی با بازی
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              با استفاده از بازی‌های تعاملی و جذاب، مهارت‌های زبان انگلیسی خود را بهبود بخشید
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-2xl"
                onClick={() => navigate('/LanguageLearning/grades')}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/LanguageLearning/grades')}
              >
                شروع یادگیری
                <BookOpen className="w-5 h-5 mr-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg rounded-2xl border-2 border-blue-300 hover:bg-blue-50"
                onClick={() => window.toastAdd?.({ message: "آزمون سطح به زودی اضافه خواهد شد!", type: "info" })}
                onKeyDown={(e) => e.key === 'Enter' && window.toastAdd?.({ message: "آزمون سطح به زودی اضافه خواهد شد!", type: "info" })}
              >
                آزمون سطح
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              مهارت‌های کلیدی زبان انگلیسی
            </h2>
            <p className="text-lg text-gray-600">
              هر مهارت با روش‌های تعاملی آموزش داده می‌شود
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languageFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="clay-element bg-white border-0 h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                    <Button 
                      className="mt-4 w-full"
                      variant="outline"
                      onClick={() => window.toastAdd?.({ message: `یادگیری ${feature.title} به زودی اضافه خواهد شد!`, type: "info" })}
                      onKeyDown={(e) => e.key === 'Enter' && window.toastAdd?.({ message: `یادگیری ${feature.title} به زودی اضافه خواهد شد!`, type: "info" })}
                    >
                      شروع کنید
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              به زودی...
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              ما در حال توسعه ویژگی‌های پیشرفته‌تری برای آموزش زبان هستیم
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="clay-element bg-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="font-semibold mb-2">چت‌بات هوشمند</h3>
                  <p className="text-sm text-gray-600">تمرین مکالمه با هوش مصنوعی</p>
                </CardContent>
              </Card>
              
              <Card className="clay-element bg-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="font-semibold mb-2">کتاب‌های تعاملی</h3>
                  <p className="text-sm text-gray-600">خواندن با واژگان و تمرین</p>
                </CardContent>
              </Card>
              
              <Card className="clay-element bg-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🎮</div>
                  <h3 className="font-semibold mb-2">بازی‌های پیشرفته</h3>
                  <p className="text-sm text-gray-600">سطوح مختلف دشواری</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
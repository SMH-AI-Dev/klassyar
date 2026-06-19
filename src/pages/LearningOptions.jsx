import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Mic, PenTool, MessageSquare, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const learningOptions = [
  {
    id: "vocabulary",
    title: "یادگیری واژگان",
    description: "آموزش کلمات و عبارات کلیدی",
    icon: BookOpen,
    color: "from-blue-400 to-cyan-400",
    items: [
      "واژگان پایه و ضروری",
      "عبارات روزمره",
      "واژگان تخصصی",
      "هم‌خانواده‌های کلمات",
      "کلمات مترادف و متضاد"
    ]
  },
  {
    id: "pronunciation",
    title: "تمرین تلفظ",
    description: "بهبود مهارت گفتاری",
    icon: Mic,
    color: "from-green-400 to-emerald-400",
    items: [
      "صداهای پایه انگلیسی",
      "تلفظ کلمات دشوار",
      "تمرین جملات",
      "گفتار روان",
      "تلفظ لهجه آمریکایی"
    ]
  },
  {
    id: "grammar",
    title: "نوشتن و گرامر",
    description: "یادگیری قواعد گرامری",
    icon: PenTool,
    color: "from-purple-400 to-pink-400",
    items: [
      "زمان‌های گذشته",
      "زمان‌های آینده",
      "جمله‌های شرطی",
      "فعل‌های کمکی",
      "ساختار جملات پیچیده"
    ]
  },
  {
    id: "conversation",
    title: "مکالمه",
    description: "تمرین مکالمه عملی",
    icon: MessageSquare,
    color: "from-orange-400 to-red-400",
    items: [
      "مکالمه روزمره",
      "گفتگوهای تجاری",
      "مکالمه تلفنی",
      "نقش‌آفرینی",
      "گفتگوهای اجتماعی"
    ]
  },
  {
    id: "listening",
    title: "شنیداری",
    description: "بهبود مهارت شنیداری",
    icon: Headphones,
    color: "from-indigo-400 to-purple-400",
    items: [
      "داستان‌های کوتاه",
      "خبرهای انگلیسی",
      "گفتگوهای روزمره",
      "فیلم‌های آموزشی",
      "مصاحبه‌ها و گزارش‌ها"
    ]
  }
];

const gradeNames = {
  "7": "هفتم",
  "8": "هشتم",
  "9": "نهم",
  "10": "دهم",
  "11": "یازدهم",
  "12": "دوازدهم",
  "all": "همه کلاس‌ها"
};

export default function LearningOptions() {
  const { gradeId } = useParams();
  const navigate = useNavigate();

  const handleOptionSelect = (optionId) => {
    navigate(`/LanguageLearning/${gradeId}/${optionId}`);
  };

  const getGradeSpecificItems = (optionId) => {
    // For "all" grade, combine items from all grades
    if (gradeId === 'all') {
      return learningOptions.find(opt => opt.id === optionId)?.items || [];
    }
    // For specific grades, return the items (could be customized per grade in future)
    return learningOptions.find(opt => opt.id === optionId)?.items || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/LanguageLearning/grades">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  بازگشت
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                آموزش زبان - پایه {gradeNames[gradeId] || gradeId}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              مهارت مورد نظر خود را انتخاب کنید
            </h2>
            <p className="text-lg text-gray-600">
              هر مهارت شامل 5 بخش آموزشی متناسب با پایه {gradeNames[gradeId] || gradeId} است
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="clay-element bg-white border-0 h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center mb-4`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{option.description}</p>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">موارد آموزشی:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {getGradeSpecificItems(option.id).slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                        {getGradeSpecificItems(option.id).length > 3 && (
                          <li className="text-gray-500">و {getGradeSpecificItems(option.id).length - 3} مورد دیگر...</li>
                        )}
                      </ul>
                    </div>

                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => handleOptionSelect(option.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleOptionSelect(option.id)}
                    >
                      شروع کنید
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-white/90 border border-dashed border-blue-200 rounded-3xl p-6 clay-element">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">محتوای سفارشی اضافه کنید</h3>
                <p className="text-gray-600">برای پایه {gradeNames[gradeId] || gradeId} می‌توانید موارد جدید بسازید یا فایل‌های صدا، تصویر، PDF و متن ارسال کنید.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.toastAdd?.({ message: 'برای ساخت مورد جدید از صفحه گزینه مورد استفاده کنید.', type: 'info' })}
                >
                  ایجاد مورد جدید
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.toastAdd?.({ message: 'فایل صوتی خود را برای معلم ارسال کنید.', type: 'info' })}
                >
                  بارگذاری صدا
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.toastAdd?.({ message: 'تصویر جدید برای تمرین بارگذاری شود.', type: 'info' })}
                >
                  بارگذاری تصویر
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.toastAdd?.({ message: 'فایل PDF درس را ارسال کنید.', type: 'info' })}
                >
                  بارگذاری PDF
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.toastAdd?.({ message: 'متن توضیحات یا تمرین را وارد کنید.', type: 'info' })}
                >
                  بارگذاری متن
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
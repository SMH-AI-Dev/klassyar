import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const grades = [
  { id: "7", name: "هفتم", color: "from-blue-400 to-cyan-400" },
  { id: "8", name: "هشتم", color: "from-green-400 to-emerald-400" },
  { id: "9", name: "نهم", color: "from-purple-400 to-pink-400" },
  { id: "10", name: "دهم", color: "from-orange-400 to-red-400" },
  { id: "11", name: "یازدهم", color: "from-indigo-400 to-purple-400" },
  { id: "12", name: "دوازدهم", color: "from-teal-400 to-blue-400" },
  { id: "all", name: "همه کلاس‌ها", color: "from-gray-400 to-gray-600" }
];

export default function GradeSelection() {
  const navigate = useNavigate();

  const handleGradeSelect = (gradeId) => {
    navigate(`/LanguageLearning/${gradeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/LanguageLearning">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  بازگشت
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">انتخاب پایه تحصیلی</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Grades Grid */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              پایه تحصیلی خود را انتخاب کنید
            </h2>
            <p className="text-lg text-gray-600">
              محتوای آموزشی بر اساس کتاب درسی پایه شما تنظیم می‌شود
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grades.map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="clay-element bg-white border-0 h-full hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleGradeSelect(grade.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGradeSelect(grade.id)}
                  tabIndex={0}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${grade.color} flex items-center justify-center mb-4 mx-auto`}>
                      <span className="text-2xl font-bold text-white">{grade.id === 'all' ? '∞' : grade.id}</span>
                    </div>
                    <CardTitle className="text-xl text-center">{grade.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      {grade.id === 'all'
                        ? 'تمرین ترکیبی از همه پایه‌ها'
                        : `آموزش زبان انگلیسی پایه ${grade.name}`
                      }
                    </p>
                    <Button
                      className="mt-4 w-full"
                      variant="outline"
                      onClick={() => handleGradeSelect(grade.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGradeSelect(grade.id)}
                    >
                      انتخاب کنید
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
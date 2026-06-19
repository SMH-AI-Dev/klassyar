import React, { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Mic, PenTool, MessageSquare, Headphones, Play, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const learningData = {
  vocabulary: {
    title: "یادگیری واژگان",
    icon: BookOpen,
    color: "from-blue-400 to-cyan-400",
    items: [
      {
        title: "واژگان پایه و ضروری",
        description: "یادگیری کلمات پایه انگلیسی مورد نیاز روزانه",
        content: "این بخش شامل کلمات ضروری مانند سلام، تشکر، اعداد، رنگ‌ها و غیره است.",
        duration: "15 دقیقه"
      },
      {
        title: "عبارات روزمره",
        description: "جمله‌های کاربردی برای موقعیت‌های مختلف",
        content: "یادگیری عباراتی مانند 'How are you?'، 'What's your name?' و جملات روزمره.",
        duration: "20 دقیقه"
      },
      {
        title: "واژگان تخصصی",
        description: "کلمات مربوط به موضوعات خاص تحصیلی",
        content: "واژگان مربوط به ریاضیات، علوم، تاریخ و سایر دروس.",
        duration: "25 دقیقه"
      },
      {
        title: "هم‌خانواده‌های کلمات",
        description: "یادگیری خانواده کلمات و مشتقات",
        content: "کلماتی مانند happy, happiness, unhappy و خانواده‌های مشابه.",
        duration: "18 دقیقه"
      },
      {
        title: "کلمات مترادف و متضاد",
        description: "گسترش دایره واژگان با مترادف‌ها و متضادها",
        content: "یادگیری کلماتی مانند big/large، hot/cold و غیره.",
        duration: "22 دقیقه"
      }
    ]
  },
  pronunciation: {
    title: "تمرین تلفظ",
    icon: Mic,
    color: "from-green-400 to-emerald-400",
    items: [
      {
        title: "صداهای پایه انگلیسی",
        description: "یادگیری تلفظ صحیح صداهای اصلی",
        content: "تمرین صداهای مانند /θ/, /ð/, /ʃ/, /ʒ/ و سایر صداهای دشوار.",
        duration: "20 دقیقه"
      },
      {
        title: "تلفظ کلمات دشوار",
        description: "تمرین کلمات با تلفظ خاص",
        content: "کلماتی مانند 'thorough'، 'rhythm'، 'colonel' و غیره.",
        duration: "25 دقیقه"
      },
      {
        title: "تمرین جملات",
        description: "تلفظ جملات کامل با ریتم صحیح",
        content: "تمرین تلفظ جملات روزمره با تأکید و ریتم مناسب.",
        duration: "18 دقیقه"
      },
      {
        title: "گفتار روان",
        description: "بهبود جریان گفتار و کاهش مکث‌ها",
        content: "تمرین برای گفتار پیوسته و طبیعی.",
        duration: "22 دقیقه"
      },
      {
        title: "تلفظ لهجه آمریکایی",
        description: "یادگیری تلفظ استاندارد آمریکایی",
        content: "تمرین تلفظ کلمات با لهجه آمریکایی استاندارد.",
        duration: "20 دقیقه"
      }
    ]
  },
  grammar: {
    title: "نوشتن و گرامر",
    icon: PenTool,
    color: "from-purple-400 to-pink-400",
    items: [
      {
        title: "زمان‌های گذشته",
        description: "Simple Past و Past Continuous",
        content: "یادگیری کاربرد و ساختار زمان‌های گذشته.",
        duration: "30 دقیقه"
      },
      {
        title: "زمان‌های آینده",
        description: "Future Simple و Future Continuous",
        content: "تشخیص و استفاده از زمان‌های آینده در جملات.",
        duration: "28 دقیقه"
      },
      {
        title: "جمله‌های شرطی",
        description: "Conditional Sentences",
        content: "یادگیری انواع جمله‌های شرطی (Type 1, 2, 3).",
        duration: "35 دقیقه"
      },
      {
        title: "فعل‌های کمکی",
        description: "Auxiliary Verbs",
        content: "استفاده صحیح از do, does, did, have, has, had.",
        duration: "25 دقیقه"
      },
      {
        title: "ساختار جملات پیچیده",
        description: "Complex Sentences",
        content: "ساخت جملات مرکب با استفاده از conjunctions.",
        duration: "32 دقیقه"
      }
    ]
  },
  conversation: {
    title: "مکالمه",
    icon: MessageSquare,
    color: "from-orange-400 to-red-400",
    items: [
      {
        title: "مکالمه روزمره",
        description: "گفتگوهای日常生活",
        content: "تمرین مکالمه درباره موضوعات روزمره مانند غذا، خانواده، مدرسه.",
        duration: "25 دقیقه"
      },
      {
        title: "گفتگوهای تجاری",
        description: "Business English Conversations",
        content: "مکالمه در محیط کاری و تجاری.",
        duration: "30 دقیقه"
      },
      {
        title: "مکالمه تلفنی",
        description: "Telephone Conversations",
        content: "تمرین مکالمه تلفنی و استفاده از عبارات مناسب.",
        duration: "20 دقیقه"
      },
      {
        title: "نقش‌آفرینی",
        description: "Role-playing Scenarios",
        content: "بازی نقش در موقعیت‌های مختلف اجتماعی.",
        duration: "35 دقیقه"
      },
      {
        title: "گفتگوهای اجتماعی",
        description: "Social Conversations",
        content: "مکالمه در مهمانی‌ها، ملاقات‌ها و رویدادهای اجتماعی.",
        duration: "28 دقیقه"
      }
    ]
  },
  listening: {
    title: "شنیداری",
    icon: Headphones,
    color: "from-indigo-400 to-purple-400",
    items: [
      {
        title: "داستان‌های کوتاه",
        description: "Short Stories Listening",
        content: "شنیدن و درک داستان‌های کوتاه انگلیسی.",
        duration: "20 دقیقه"
      },
      {
        title: "خبرهای انگلیسی",
        description: "News Listening",
        content: "تمرین شنیداری اخبار و گزارش‌های خبری.",
        duration: "25 دقیقه"
      },
      {
        title: "گفتگوهای روزمره",
        description: "Daily Conversations",
        content: "شنیدن مکالمات روزمره و پاسخ به سوالات.",
        duration: "22 دقیقه"
      },
      {
        title: "فیلم‌های آموزشی",
        description: "Educational Videos",
        content: "تماشا و درک محتوای ویدیوهای آموزشی.",
        duration: "30 دقیقه"
      },
      {
        title: "مصاحبه‌ها و گزارش‌ها",
        description: "Interviews & Reports",
        content: "تمرین شنیداری مصاحبه‌ها و گزارش‌های تخصصی.",
        duration: "28 دقیقه"
      }
    ]
  }
};

const gradeNames = {
  "7": "هفتم",
  "8": "هشتم",
  "9": "نهم",
  "10": "دهم",
  "11": "یازدهم",
  "12": "دوازدهم",
  "all": "همه کلاس‌ها"
};

export default function LearningItems() {
  const { gradeId, optionId } = useParams();
  const optionData = learningData[optionId];
  const [customItems, setCustomItems] = useState([]);
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customText, setCustomText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({ sound: null, image: null, pdf: null });
  const audioRef = useRef(null);
  const imageRef = useRef(null);
  const pdfRef = useRef(null);

  const handleFileUpload = (type, file) => {
    if (!file) return;
    setUploadedFiles((prev) => ({ ...prev, [type]: file }));
    window.toastAdd?.({ message: `${file.name} بارگذاری شد.`, type: 'success' });
  };

  const handleAddCustomItem = () => {
    if (!customTitle && !customText && !uploadedFiles.sound && !uploadedFiles.image && !uploadedFiles.pdf) {
      window.toastAdd?.({ message: 'لطفاً عنوان یا متن وارد کنید یا فایلی بارگذاری کنید.', type: 'warning' });
      return;
    }

    setCustomItems((prev) => [
      {
        title: customTitle || 'مورد سفارشی',
        description: customDescription || 'محتوای سفارشی اضافه شد',
        content: customText,
        sound: uploadedFiles.sound?.name,
        image: uploadedFiles.image?.name,
        pdf: uploadedFiles.pdf?.name,
        createdAt: new Date().toLocaleString(),
      },
      ...prev,
    ]);

    setCustomTitle("");
    setCustomDescription("");
    setCustomText("");
    setUploadedFiles({ sound: null, image: null, pdf: null });
    window.toastAdd?.({ message: 'مورد سفارشی با موفقیت ذخیره شد.', type: 'success' });
  };

  const triggerUpload = (type) => {
    if (type === 'sound') audioRef.current?.click();
    if (type === 'image') imageRef.current?.click();
    if (type === 'pdf') pdfRef.current?.click();
  };

  if (!optionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">گزینه یافت نشد</h1>
          <Link to={`/LanguageLearning/${gradeId}`}>
            <Button>بازگشت</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={`/LanguageLearning/${gradeId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  بازگشت
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                {optionData.title} - پایه {gradeNames[gradeId] || gradeId}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${optionData.color} flex items-center justify-center mb-4 mx-auto`}>
              <optionData.icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {optionData.title}
            </h2>
            <p className="text-lg text-gray-600">
              5 بخش آموزشی برای بهبود مهارت {optionData.title.toLowerCase()}
          </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <Card className="clay-element bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">محتوای سفارشی اضافه کنید</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button className="w-full" variant="outline" onClick={() => triggerUpload('sound')}>بارگذاری صدا</Button>
                    <Button className="w-full" variant="outline" onClick={() => triggerUpload('image')}>بارگذاری تصویر</Button>
                    <Button className="w-full" variant="outline" onClick={() => triggerUpload('pdf')}>بارگذاری PDF</Button>
                    <Button className="w-full" variant="outline" onClick={() => setCustomText(prev => prev)}>بارگذاری متن</Button>
                  </div>

                  <input
                    ref={audioRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(event) => handleFileUpload('sound', event.target.files?.[0])}
                  />
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleFileUpload('image', event.target.files?.[0])}
                  />
                  <input
                    ref={pdfRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(event) => handleFileUpload('pdf', event.target.files?.[0])}
                  />

                  <div className="space-y-4 mt-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">عنوان</p>
                      <input
                        type="text"
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-400 focus:outline-none"
                        placeholder="عنوان مورد جدید"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">توضیح</p>
                      <textarea
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-400 focus:outline-none"
                        placeholder="توضیحات کوتاه"
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">متن قابل بارگذاری</p>
                      <textarea
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-400 focus:outline-none"
                        placeholder="متن دانش‌آموز یا تمرین"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white" onClick={handleAddCustomItem}>
                      ذخیره مورد جدید
                    </Button>
                    <div className="text-sm text-gray-600 space-y-1">
                      {uploadedFiles.sound && <p>صدا: {uploadedFiles.sound.name}</p>}
                      {uploadedFiles.image && <p>تصویر: {uploadedFiles.image.name}</p>}
                      {uploadedFiles.pdf && <p>PDF: {uploadedFiles.pdf.name}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {customItems.length > 0 && (
                <Card className="clay-element bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">موارد سفارشی شما</h3>
                    <div className="space-y-4">
                      {customItems.map((item, idx) => (
                        <div key={idx} className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-800">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          {item.content && <p className="text-sm text-gray-600 mt-2">{item.content}</p>}
                          <div className="mt-3 text-xs text-gray-500">
                            {item.sound && <span>صدا: {item.sound} </span>}
                            {item.image && <span>تصویر: {item.image} </span>}
                            {item.pdf && <span>PDF: {item.pdf}</span>}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">ثبت شده در {item.createdAt}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optionData.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="clay-element bg-white border-0 h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>⏱️ {item.duration}</span>
                        </div>
                      </div>
                      <div className="text-2xl">{index + 1}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{item.content}</p>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => window.toastAdd?.({ message: `"${item.title}" به زودی آماده می‌شود!`, type: "info" })}
                      onKeyDown={(e) => e.key === 'Enter' && window.toastAdd?.({ message: `"${item.title}" به زودی آماده می‌شود!`, type: "info" })}
                    >
                      <Play className="w-4 h-4 ml-2" />
                      شروع کنید
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}
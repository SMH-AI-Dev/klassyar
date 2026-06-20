import React, { useRef, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Mic, PenTool, MessageSquare, Headphones, Play, Search, Volume2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/lib/sonner";
import { motion, AnimatePresence } from "framer-motion";
import learningContent from "@/lib/learningContent";

const gradeNames = { "7": "هفتم", "8": "هشتم", "9": "نهم", "10": "دهم", "11": "یازدهم", "12": "دوازدهم", "all": "همه پایه‌ها" };
const skillIcons = { vocabulary: BookOpen, pronunciation: Mic, grammar: PenTool, conversation: MessageSquare, listening: Headphones };
const skillColors = { vocabulary: "from-blue-400 to-cyan-400", pronunciation: "from-green-400 to-emerald-400", grammar: "from-purple-400 to-pink-400", conversation: "from-orange-400 to-red-400", listening: "from-indigo-400 to-purple-400" };
const skillTitles = { vocabulary: "واژگان", pronunciation: "تلفظ", grammar: "گرامر", conversation: "مکالمه", listening: "شنیداری" };

export default function LearningItems() {
  const { gradeId, optionId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customItems, setCustomItems] = useState([]);
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customText, setCustomText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({ sound: null, image: null, pdf: null });
  const audioRef = useRef(null);
  const imageRef = useRef(null);
  const pdfRef = useRef(null);

  const gradeData = gradeId === "all"
    ? Object.keys(learningContent).reduce((acc, g) => {
        acc[g] = learningContent[g][optionId] || [];
        return acc;
      }, {})
    : { [gradeId]: learningContent[gradeId]?.[optionId] || [] };

  const allItems = useMemo(() => {
    const items = Object.values(gradeData).flat();
    if (!searchQuery) return items;
    return items.filter((item) => {
      const s = searchQuery.toLowerCase();
      return (item.en && item.en.toLowerCase().includes(s)) ||
             (item.fa && item.fa.includes(s)) ||
             (item.word && (item.word.toLowerCase().includes(s) || item.fa.includes(s))) ||
             (item.rule && item.rule.includes(s)) ||
             (item.scenario && item.scenario.includes(s)) ||
             (item.sound && item.sound.includes(s));
    });
  }, [gradeData, searchQuery]);

  const perPage = 20;
  const totalPages = Math.ceil(allItems.length / perPage);
  const pagedItems = allItems.slice(page * perPage, (page + 1) * perPage);

  const icon = skillIcons[optionId] || BookOpen;
  const color = skillColors[optionId] || "from-blue-400 to-cyan-400";
  const title = skillTitles[optionId] || optionId;

  if (!learningContent[gradeId] && gradeId !== "all") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">پایه تحصیلی یافت نشد</h1>
          <Link to={`/LanguageLearning/grades`}>
            <Button>بازگشت</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFileUpload = (type, file) => {
    if (!file) return;
    setUploadedFiles((prev) => ({ ...prev, [type]: file }));
    toast.success(`${file.name} بارگذاری شد.`);
  };

  const handleAddCustomItem = () => {
    if (!customTitle && !customText && !uploadedFiles.sound && !uploadedFiles.image && !uploadedFiles.pdf) {
      toast.warning('لطفاً عنوان یا متن وارد کنید یا فایلی بارگذاری کنید.');
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
    toast.success('مورد سفارشی با موفقیت ذخیره شد.');
  };

  const triggerUpload = (type) => {
    if (type === 'sound') audioRef.current?.click();
    if (type === 'image') imageRef.current?.click();
    if (type === 'pdf') pdfRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link to={`/LanguageLearning/${gradeId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  بازگشت
                </Button>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {title} - پایه {gradeNames[gradeId] || gradeId}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{allItems.length} مورد</span>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                  className="pr-9 pl-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-purple-400 focus:outline-none w-40 md:w-56"
                  placeholder="جستجو..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center mb-8">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center mb-3 mx-auto`}>
              {React.createElement(icon, { className: "w-7 h-7 text-white" })}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600">{allItems.length} مورد آموزشی برای پایه {gradeNames[gradeId] || gradeId}</p>
          </motion.div>

          {selectedItem ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="clay-element bg-white border-0 mb-4">
                <CardContent className="p-8">
                  <Button variant="ghost" onClick={() => setSelectedItem(null)} className="mb-4">
                    <ArrowLeft className="w-4 h-4 ml-2" />بازگشت به لیست
                  </Button>
                  {optionId === "vocabulary" && (
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-800 mb-2">{selectedItem.en}</p>
                      <p className="text-xl text-purple-600 mb-1">{selectedItem.phonetic}</p>
                      <p className="text-2xl text-gray-600 mb-4">{selectedItem.fa}</p>
                      <div className="bg-purple-50 rounded-2xl p-4 clay-element">
                        <p className="text-gray-700 text-lg">{selectedItem.example}</p>
                      </div>
                    </div>
                  )}
                  {optionId === "pronunciation" && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 clay-element">
                        <Volume2 className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-green-700 mb-2">{selectedItem.sound}</p>
                      <p className="text-2xl text-gray-800 mb-1">{selectedItem.word}</p>
                      <p className="text-lg text-gray-600 mb-4">{selectedItem.fa}</p>
                      <div className="bg-green-50 rounded-2xl p-4 clay-element">
                        <p className="text-gray-700">{selectedItem.tip}</p>
                      </div>
                    </div>
                  )}
                  {optionId === "grammar" && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 clay-element">
                        <Check className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-purple-700 mb-2">{selectedItem.rule}</p>
                      <div className="bg-purple-50 rounded-2xl p-4 mb-4 clay-element">
                        <p className="text-lg font-mono text-gray-800 mb-1">{selectedItem.pattern}</p>
                        <p className="text-lg text-gray-700">{selectedItem.example}</p>
                      </div>
                      <p className="text-xl text-gray-600">{selectedItem.fa}</p>
                    </div>
                  )}
                  {optionId === "conversation" && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-700 mb-2">{selectedItem.scenario}</p>
                      <div className="bg-orange-50 rounded-2xl p-6 mb-4 clay-element">
                        <p className="text-lg text-gray-800 whitespace-pre-line">{selectedItem.dialogue}</p>
                      </div>
                      <p className="text-lg text-gray-600">{selectedItem.fa}</p>
                    </div>
                  )}
                  {optionId === "listening" && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 clay-element">
                        <Headphones className="w-10 h-10 text-white" />
                      </div>
                      <div className="bg-indigo-50 rounded-2xl p-6 mb-4 clay-element">
                        <p className="text-lg text-gray-800">{selectedItem.text}</p>
                      </div>
                      <div className="space-y-2">
                        {selectedItem.questions?.map((q, i) => (
                          <div key={i} className="bg-white rounded-xl p-3 border border-indigo-200">
                            <p className="font-semibold text-indigo-700 mb-1">سوال {i + 1}: {q}</p>
                            <p className="text-green-700">پاسخ: {selectedItem.answers?.[i]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="clay-element bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">افزودن محتوای سفارشی</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Button className="w-full" variant="outline" size="sm" onClick={() => audioRef.current?.click()}>بارگذاری صدا</Button>
                      <Button className="w-full" variant="outline" size="sm" onClick={() => imageRef.current?.click()}>بارگذاری تصویر</Button>
                      <Button className="w-full" variant="outline" size="sm" onClick={() => pdfRef.current?.click()}>بارگذاری PDF</Button>
                      <Button className="w-full" variant="outline" size="sm" onClick={() => document.getElementById('custom-text-area')?.focus()}>افزودن متن</Button>
                    </div>
                    <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload('sound', e.target.files?.[0])} />
                    <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('image', e.target.files?.[0])} />
                    <input ref={pdfRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload('pdf', e.target.files?.[0])} />
                    <div className="space-y-3 mt-4">
                      <input type="text" className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none" placeholder="عنوان" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} />
                      <textarea id="custom-text-area" className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none" placeholder="متن یا تمرین" value={customText} onChange={(e) => setCustomText(e.target.value)} rows={3} />
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm" onClick={handleAddCustomItem}>ذخیره</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="clay-element bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">آمار یادگیری</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-blue-50 rounded-xl p-4 clay-element">
                        <p className="text-3xl font-bold text-blue-600">{allItems.length}</p>
                        <p className="text-sm text-gray-600">کل موارد</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 clay-element">
                        <p className="text-3xl font-bold text-green-600">{totalPages}</p>
                        <p className="text-sm text-gray-600">صفحات</p>
                      </div>
                    </div>
                    {customItems.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700">موارد سفارشی: {customItems.length}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {customItems.length > 0 && (
                <Card className="clay-element bg-white border-0 shadow-sm mt-4">
                  <CardContent className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {customItems.map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 bg-gray-50 rounded-xl p-3 border border-gray-200 min-w-[200px]">
                          <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                          {item.content && <p className="text-xs text-gray-600 mt-1">{item.content}</p>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {optionId === "vocabulary" && "واژگان"}
                    {optionId === "pronunciation" && "تمرین تلفظ"}
                    {optionId === "grammar" && "دستور زبان و گرامر"}
                    {optionId === "conversation" && "مکالمه"}
                    {optionId === "listening" && "متن شنیداری"}
                  </h3>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="rounded-xl w-8 h-8" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600">صفحه {page + 1} از {totalPages}</span>
                      <Button variant="outline" size="icon" className="rounded-xl w-8 h-8" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={page + searchQuery} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {pagedItems.map((item, idx) => (
                      <motion.div key={page * perPage + idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Card className="clay-element bg-white border-0 h-full cursor-pointer hover:shadow-lg transition-all"
                          onClick={() => setSelectedItem(item)}>
                          <CardContent className="p-4">
                            {optionId === "vocabulary" && (
                              <>
                                <p className="text-lg font-bold text-blue-700 leading-tight">{item.en}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.phonetic}</p>
                                <p className="text-sm text-gray-600 mt-1">{item.fa}</p>
                              </>
                            )}
                            {optionId === "pronunciation" && (
                              <>
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Volume2 className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-sm font-bold text-green-700 text-center leading-tight">{item.sound}</p>
                                <p className="text-xs text-gray-600 text-center mt-1">{item.word}</p>
                              </>
                            )}
                            {optionId === "grammar" && (
                              <>
                                <p className="text-sm font-bold text-purple-700 leading-tight">{item.rule}</p>
                                <p className="text-xs text-gray-500 mt-1 font-mono">{item.pattern}</p>
                                <p className="text-xs text-gray-600 mt-1">{item.fa}</p>
                              </>
                            )}
                            {optionId === "conversation" && (
                              <>
                                <p className="text-sm font-bold text-orange-700 leading-tight">{item.scenario}</p>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.dialogue}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.fa}</p>
                              </>
                            )}
                            {optionId === "listening" && (
                              <>
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Headphones className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-xs text-gray-700 line-clamp-2">{item.text}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.questions?.length} سوال</p>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {allItems.length === 0 && (
                  <Card className="clay-element bg-white/60 border-0 mt-4">
                    <CardContent className="p-12 text-center">
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg text-gray-600">موردی یافت نشد</p>
                    </CardContent>
                  </Card>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="rounded-xl w-10 h-10" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                        const p = start + i;
                        return (
                          <Button key={p} variant={p === page ? "default" : "outline"}
                            className={`rounded-xl w-10 h-10 ${p === page ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
                            onClick={() => setPage(p)}>
                            {p + 1}
                          </Button>
                        );
                      })}
                      <Button variant="outline" size="icon" className="rounded-xl w-10 h-10" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
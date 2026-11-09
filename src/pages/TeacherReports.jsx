import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Download, History, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
  classroom, downloadJson, encryptReport, reportRatingLabels,
} from "@/lib/classroom";

const dateLabel = (value) => value ? new Date(value).toLocaleDateString("fa-IR") : "—";

export default function TeacherReports() {
  const { user } = useAuth();
  const [state] = useState(() => classroom.state(user?.id));
  const [classId, setClassId] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const selectedClass = state.classes.find((item) => item.id === classId) || state.classes[0];
  const [cycleId, setCycleId] = useState("");
  const selectedCycle = selectedClass?.cycles.find((item) => item.id === cycleId) ||
    selectedClass?.cycles.find((item) => item.status === "active") || selectedClass?.cycles[0];
  const cycleReports = useMemo(() => (selectedClass?.reports || []).filter((item) => !selectedCycle || item.cycleId === selectedCycle.id), [selectedClass, selectedCycle]);
  const summary = useMemo(() => (selectedClass?.students || []).map((student) => {
    const results = cycleReports.filter((item) => item.studentId === student.id);
    const average = results.length ? Math.round(results.reduce((sum, item) => sum + item.percent, 0) / results.length) : 0;
    const gameAreas = Object.values(results.reduce((areas, result) => {
      const key = result.gameTitle || "بازی بدون عنوان";
      if (!areas[key]) areas[key] = { title: key, score: 0, count: 0 };
      areas[key].score += result.percent;
      areas[key].count += 1;
      return areas;
    }, {})).map((area) => ({ ...area, average: Math.round(area.score / area.count) }))
      .sort((a, b) => b.average - a.average);
    return {
      student, results, average, gameAreas,
      evaluation: selectedClass.evaluations[`${selectedCycle?.id}:${student.id}`] || {},
    };
  }), [selectedClass, cycleReports, selectedCycle]);
  const total = cycleReports.length;
  const overall = total ? Math.round(cycleReports.reduce((sum, item) => sum + item.percent, 0) / total) : 0;
  const showError = (reason) => { setMessage(reason); setError(true); };
  const showMessage = (text) => { setMessage(text); setError(false); };
  const exportReturns = async (studentIds) => {
    try {
      if (!selectedClass || !selectedCycle) throw new Error("کلاس و دوره را انتخاب کنید");
      if (!studentIds.length) throw new Error("حداقل یک دانش‌آموز را انتخاب کنید");
      const reports = studentIds.map((studentId) =>
        classroom.createTeacherReport(selectedClass.id, studentId, selectedCycle.id, user?.id));
      const encryptedFiles = await Promise.all(reports.map((report) => encryptReport(report, password)));
      encryptedFiles.forEach((file, index) => {
        downloadJson(file, `klassyar-return-${reports[index].student.id}-${selectedCycle.id}.json`);
      });
      showMessage(`کارنامهٔ رمزگذاری‌شده برای ${reports.length} دانش‌آموز ساخته شد. هر کارنامه یک فایل جداگانه است.`);
    } catch (reason) { showError(reason.message); }
  };

  return <main className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50 p-4 sm:p-8" dir="rtl">
    <div className="max-w-6xl mx-auto space-y-5">
      <header className="text-center"><BarChart3 className="w-12 h-12 mx-auto text-violet-600 mb-2" /><h1 className="text-3xl font-black text-slate-800">گزارش‌های معلم</h1><p className="text-slate-600 mt-2">نمایش داده‌های واردشده از فایل‌های رمزگذاری‌شده روی این دستگاه</p></header>
      {message && <div role={error ? "alert" : "status"} className={`rounded-xl p-3 text-center ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>{message}</div>}
      <Card className="border-0 shadow-lg"><CardContent className="p-5 flex flex-wrap items-center gap-3"><label htmlFor="report-class" className="font-bold">کلاس</label><select id="report-class" className="rounded-xl border p-2" value={selectedClass?.id || ""} onChange={(event) => { setClassId(event.target.value); setCycleId(""); }}><option value="">انتخاب کلاس</option>{state.classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>{selectedClass && <><label htmlFor="report-cycle" className="font-bold">دوره</label><select id="report-cycle" className="rounded-xl border p-2" value={selectedCycle?.id || ""} onChange={(event) => setCycleId(event.target.value)}>{selectedClass.cycles.map((cycle) => <option key={cycle.id} value={cycle.id}>{cycle.name} · {cycle.status === "active" ? "فعال" : "پایان‌یافته"}</option>)}</select></>}<Link className="mr-auto text-violet-700 underline" to="/MyClasses">مدیریت کلاس‌ها</Link></CardContent></Card>
      {!selectedClass ? <Card className="border-0 shadow-lg"><CardContent className="p-10 text-center"><Users className="w-10 h-10 mx-auto text-violet-500 mb-3" /><p>هنوز کلاسی ندارید. ابتدا از صفحهٔ کلاس‌های من کلاس بسازید.</p></CardContent></Card> : <>
        <div className="grid sm:grid-cols-3 gap-3"><Card className="border-0 shadow"><CardContent className="p-4"><span className="text-slate-500">دانش‌آموزان</span><strong className="block text-2xl">{selectedClass.students.length}</strong></CardContent></Card><Card className="border-0 shadow"><CardContent className="p-4"><span className="text-slate-500">فعالیت این دوره</span><strong className="block text-2xl">{total}</strong></CardContent></Card><Card className="border-0 shadow"><CardContent className="p-4"><span className="text-slate-500">میانگین کلاس از فعالیت‌های واردشده</span><strong className="block text-2xl">{overall}٪</strong></CardContent></Card></div>
        <Card className="border-0 shadow-lg"><CardHeader><CardTitle>مقایسهٔ پیشرفت دانش‌آموزان</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-xs text-slate-500">میانگین فقط از نتایج بازی واردشده در همین دوره محاسبه شده است. این مقایسه تشخیص آموزشی یا بالینی نیست.</p>{summary.map(({ student, average, results }, index) => <div key={student.id} className="grid grid-cols-[minmax(5rem,auto)_1fr_auto] items-center gap-3"><span className="truncate">{student.name}</span><div role="progressbar" aria-label={`میانگین فعالیت‌های ${student.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={average} className="h-4 overflow-hidden rounded-full bg-slate-100"><motion.div initial={{ width: 0 }} animate={{ width: `${average}%` }} transition={{ duration: 0.65, delay: index * 0.06 }} className="h-full rounded-full bg-gradient-to-l from-violet-600 to-sky-400" /></div><span className="text-sm">{results.length ? `${average}٪` : "داده‌ای نیست"}</span></div>)}</CardContent></Card>
        <Card className="border-0 shadow-lg"><CardHeader><CardTitle>کارنامهٔ دانش‌آموزان · {selectedCycle?.name || "بدون دوره"}</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex flex-wrap gap-2 items-center"><Input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="رمز مورد توافق برای فایل‌های کارنامه (حداقل ۸ نویسه)" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedClass.students.length > 0 && selectedStudents.length === selectedClass.students.length} onChange={(event) => setSelectedStudents(event.target.checked ? selectedClass.students.map((item) => item.id) : [])} />انتخاب همه</label><Button onClick={() => exportReturns(selectedStudents)}><Download className="w-4 h-4 ml-1" />ساخت فایل برای انتخاب‌شده‌ها</Button></div>{summary.length ? summary.map(({ student, results, average, evaluation, gameAreas }) => {
          const answers = (selectedClass.assignmentAnswers || []).filter((item) =>
            item.studentId === student.id && (!selectedCycle || item.cycleId === selectedCycle.id));
          return <article key={student.id} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex flex-wrap justify-between gap-2"><label className="flex items-center gap-2"><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={(event) => setSelectedStudents((ids) => event.target.checked ? [...ids, student.id] : ids.filter((id) => id !== student.id))} /><strong>{student.name}</strong></label><span>میانگین {average}٪ · {results.length} فعالیت</span><Button variant="outline" size="sm" onClick={() => exportReturns([student.id])}>ساخت کارنامهٔ این دانش‌آموز</Button></div>
            {evaluation.rating && <div className="text-sm text-violet-700 mt-2">ارزیابی: {reportRatingLabels[evaluation.rating]}{evaluation.comment ? ` · ${evaluation.comment}` : ""}</div>}
            <div className="mt-3"><div className="flex justify-between text-xs text-slate-500"><span>پیشرفت بر پایهٔ فعالیت‌های واردشده</span><span>{results.length ? `${average}٪` : "بدون داده"}</span></div><div role="progressbar" aria-label={`پیشرفت ثبت‌شدهٔ ${student.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={average} className="mt-1 h-3 overflow-hidden rounded-full bg-white"><motion.div initial={{ width: 0 }} animate={{ width: `${average}%` }} transition={{ duration: 0.7 }} className="h-full rounded-full bg-violet-500" /></div></div>
            {gameAreas.length > 0 && <div className="mt-3 rounded-xl bg-white/70 p-3"><strong className="text-sm">نقاط قوت و زمینه‌های تمرین (بر اساس امتیازها)</strong><p className="text-xs text-slate-500">صرفاً دسته‌بندی توصیفی نمره‌های ثبت‌شده است و تشخیص یا نتیجه‌گیری فراتر از این داده‌ها نیست.</p><div className="mt-2 grid sm:grid-cols-2 gap-3"><div><span className="text-sm font-semibold">بالاترین امتیازهای ثبت‌شده</span>{gameAreas.slice(0, 2).map((area) => <div key={`top-${area.title}`} className="mt-2"><div className="flex justify-between text-xs"><span>{area.title}</span><span>{area.average}٪</span></div><div role="progressbar" aria-label={`امتیاز ${area.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={area.average} className="mt-1 h-2 rounded-full bg-slate-100"><motion.div initial={{ width: 0 }} animate={{ width: `${area.average}%` }} className="h-2 rounded-full bg-emerald-500" /></div></div>)}</div><div><span className="text-sm font-semibold">نیازمند تمرین بیشتر بر اساس امتیاز</span>{gameAreas.slice(-2).reverse().map((area) => <div key={`low-${area.title}`} className="mt-2"><div className="flex justify-between text-xs"><span>{area.title}</span><span>{area.average}٪</span></div><div role="progressbar" aria-label={`امتیاز ${area.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={area.average} className="mt-1 h-2 rounded-full bg-slate-100"><motion.div initial={{ width: 0 }} animate={{ width: `${area.average}%` }} className="h-2 rounded-full bg-amber-500" /></div></div>)}</div></div></div>}
            <div className="mt-3 space-y-2">{results.length ? [...results].sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)).map((item) => <div key={item.id} className="grid sm:grid-cols-[1fr_auto_auto] gap-1 border-t pt-2 text-sm"><span>{item.gameTitle}</span><span>{item.score}/{item.total} ({item.percent}٪)</span><time>{dateLabel(item.recordedAt)}</time></div>) : <p className="text-sm text-slate-500">برای این دوره هنوز گزارشی وارد نشده است.</p>}</div>
            {answers.length > 0 && <div className="mt-3 border-t pt-3"><strong className="text-sm">پاسخ تکلیف‌های سفارشی</strong>{answers.map((answer) => {
              const assignment = selectedClass.assignments.find((item) => item.id === answer.assignmentId);
              return <div key={answer.assignmentId} className="mt-2 text-sm"><span className="font-semibold">{assignment?.title || "تکلیف"} · </span>{answer.answers.map((value, index) => <p key={index} className="text-slate-600">{assignment?.questions?.[index] || `پاسخ ${index + 1}`}: {value || "—"}</p>)}</div>;
            })}</div>}
          </article>;
        }) : <p className="text-slate-500">دانش‌آموزی در این کلاس ثبت نشده است.</p>}</CardContent></Card>
        <Card className="border-0 shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2"><History className="w-5 h-5" />تاریخچهٔ دوره‌ها و واردسازی گزارش</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid sm:grid-cols-2 gap-3">{selectedClass.cycles.map((cycle) => <div key={cycle.id} className="rounded-xl border p-3"><strong>{cycle.name}</strong><span className="text-sm text-slate-500 block">{cycle.status === "active" ? "دورهٔ فعال" : "دورهٔ پایان‌یافته"} · {dateLabel(cycle.startedAt)} تا {dateLabel(cycle.endedAt)}</span><span className="text-sm">{selectedClass.reports.filter((item) => item.cycleId === cycle.id).length} فعالیت و {(selectedClass.assignmentAnswers || []).filter((item) => item.cycleId === cycle.id).length} پاسخ ثبت‌شده</span></div>)}</div><h3 className="font-bold">فایل‌های دریافت‌شده</h3>{state.imports.filter((item) => item.classId === selectedClass.id).length ? <div className="space-y-2">{state.imports.filter((item) => item.classId === selectedClass.id).map((item) => <div key={item.id} className="flex flex-wrap justify-between gap-2 border-b pb-2 text-sm"><span>{item.studentName}</span><span>{item.count} فعالیت · {item.answersImported || 0} پاسخ تازه</span><time>{dateLabel(item.at)}</time></div>)}</div> : <p className="text-sm text-slate-500">تاکنون فایلی وارد نشده است. دریافت و رمزگشایی از صفحهٔ کلاس‌های من انجام می‌شود.</p>}</CardContent></Card>
      </>}
    </div>
  </main>;
}

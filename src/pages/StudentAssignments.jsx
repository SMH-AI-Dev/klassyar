import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { classroom } from "@/lib/classroom";

export default function StudentAssignments() {
  const profile = classroom.student();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const assignments = profile?.assignments || [];
  const submitAssignment = (event, assignment) => {
    event.preventDefault();
    try {
      const form = new FormData(event.currentTarget);
      classroom.submitAssignment(assignment.id, assignment.questions.map((question, index) => {
        const choiceIndex = Number(form.get(`answer-${index}`));
        return {
          choiceIndex, selectedOption: question.options[choiceIndex],
          correct: choiceIndex === question.correctIndex,
        };
      }));
      setError(false);
      setMessage("پاسخ تکلیف در همین دستگاه ذخیره شد؛ با ارسال عملکرد رمزگذاری‌شده برای معلم قابل مشاهده است.");
    } catch (reason) {
      setError(true);
      setMessage(reason.message);
    }
  };
  const selectOption = (assignment, index, value) =>
    setSelectedOptions((options) => ({ ...options, [`${assignment.id}:${index}`]: Number(value) }));

  return <main className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50 p-4 sm:p-8" dir="rtl">
    <div className="max-w-4xl mx-auto space-y-5">
      <header className="text-center"><ClipboardList className="w-12 h-12 mx-auto text-violet-600 mb-2" /><h1 className="text-3xl font-black text-slate-800">تکلیف‌های من</h1><p className="text-slate-600 mt-2">پاسخ‌ها به‌صورت محلی ذخیره می‌شوند و همراه گزارش رمزگذاری‌شده برای معلم فرستاده می‌شوند.</p></header>
      {message && <div role={error ? "alert" : "status"} className={`rounded-xl p-3 ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>{message}</div>}
      {!profile ? <Card className="border-0 shadow-lg"><CardContent className="p-6">ابتدا از <Link className="text-violet-700 underline" to="/MyClasses">کلاس من</Link> دعوت‌نامهٔ معلم را وارد کنید.</CardContent></Card>
        : assignments.length === 0 ? <Card className="border-0 shadow-lg"><CardContent className="p-6">در حال حاضر تکلیفی برای این پروفایل تخصیص نیافته است.</CardContent></Card>
          : assignments.map((assignment) => {
            const previous = classroom.assignmentAnswers(assignment.id);
            return <Card key={assignment.id} className="border-0 shadow-lg"><CardHeader><CardTitle>{assignment.title}</CardTitle></CardHeader><CardContent className="space-y-3">
              {assignment.gameId && <Link className="text-violet-700 underline text-sm" to={`/play-game/${encodeURIComponent(assignment.gameId)}`}>رفتن به بازی: {assignment.gameTitle}</Link>}
              {assignment.questions.length > 0 && <form onSubmit={(event) => submitAssignment(event, assignment)} className="space-y-3">{assignment.questions.map((question, index) => {
                const value = selectedOptions[`${assignment.id}:${index}`] ?? previous?.answers?.[index]?.choiceIndex;
                const correct = value !== undefined && Number(value) === question.correctIndex;
                return <fieldset key={`${assignment.id}-${index}`} className="rounded-xl border bg-white p-3"><legend className="font-semibold">{question.prompt}</legend><div className="space-y-2 mt-2">{question.options.map((option, optionIndex) => <label key={optionIndex} className="flex items-center gap-2"><input required type="radio" name={`answer-${index}`} value={optionIndex} checked={value !== undefined && Number(value) === optionIndex} onChange={(event) => selectOption(assignment, index, event.target.value)} />{option}</label>)}</div>{value !== undefined && <p aria-live="polite" className={correct ? "mt-2 text-emerald-700" : "mt-2 text-amber-700"}>{correct ? "پاسخ درست است. " : "دوباره فکر کن. "}{question.feedback}</p>}</fieldset>;
              })}<Button type="submit" size="sm"><CheckCircle2 className="w-4 h-4 ml-1" />ثبت پاسخ تکلیف</Button>{previous && <span className="text-xs text-slate-500 mr-2">آخرین ذخیره: {new Date(previous.updatedAt).toLocaleDateString("fa-IR")}</span>}</form>}
            </CardContent></Card>;
          })}
    </div>
  </main>;
}

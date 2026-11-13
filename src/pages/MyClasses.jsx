import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Download, FileUp, Plus, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import gameLibrary from "@/lib/gameLibrary";
import {
  classroom, decryptReport, downloadJson, encryptReport, readJsonFile, reportRatingLabels,
} from "@/lib/classroom";

const empty = (userId) => classroom.state(userId);

function Feedback({ message, error }) {
  if (!message) return null;
  return <div role={error ? "alert" : "status"} className={`rounded-xl p-3 text-center ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>{message}</div>;
}

function StudentClasses({ user }) {
  const [profile, setProfile] = useState(classroom.student());
  const [password, setPassword] = useState("");
  const [reportId, setReportId] = useState("");
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const inviteFile = useRef();
  const returnFile = useRef();
  const returnedReports = classroom.returnedReports().filter((item) =>
    (item.sourceStudentId || item.student?.id) === profile?.student?.id &&
    (!profile?.classroom?.id || item.classroom?.id === profile.classroom.id));
  const visibleReport = returnedReports.find((item) => item.responseId === reportId) || returnedReports.at(-1);
  const showError = (reason) => { setMessage(reason); setError(true); };
  const showMessage = (text) => { setMessage(text); setError(false); };
  const activate = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const invitation = await readJsonFile(file);
      if (invitation?.format === "klassyar-invitation-bundle" && invitation.version === 1 &&
          Array.isArray(invitation.invitations) && invitation.invitations.length > 0) {
        setPendingInvitations(invitation.invitations);
        showMessage("پروفایل خود را از فایل دسته‌ای انتخاب کنید.");
      } else {
        setProfile(classroom.activate(invitation, user));
        showMessage("دعوت‌نامه وارد شد؛ نتیجهٔ بازی‌ها روی همین دستگاه ذخیره می‌شود.");
      }
    } catch (reason) { showError(reason.message); }
    event.target.value = "";
  };
  const chooseInvitation = (invitation) => {
    try {
      setProfile(classroom.activate(invitation, user));
      setPendingInvitations([]);
      showMessage("پروفایل دانش‌آموز فعال شد.");
    } catch (reason) { showError(reason.message); }
  };
  const exportResults = async () => {
    try {
      if (!profile) throw new Error("ابتدا دعوت‌نامهٔ کلاس را وارد کنید");
      const report = classroom.report();
      const encrypted = await encryptReport(report, password);
      downloadJson(encrypted, `klassyar-report-${profile.student.accessCode || profile.student.id}.json`);
      setProfile(classroom.archiveStudentCycle(report));
      setPassword("");
      showMessage("گزارش رمزگذاری‌شده دانلود شد. این دوره بایگانی و چرخهٔ تازه‌ای آغاز شد؛ فعالیت‌های پیشین فقط پس از دریافت کارنامهٔ معلم نمایش داده می‌شوند.");
    } catch (reason) { showError(reason.message); }
  };
  const importTeacherReport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const returned = await decryptReport(await readJsonFile(file), password);
      const imported = classroom.importTeacherReport(returned);
      setReportId(imported.responseId);
      showMessage("کارنامهٔ رمزگذاری‌شدهٔ معلم دریافت شد.");
    } catch (reason) { showError(reason.message); }
    event.target.value = "";
  };
  return <main className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50 p-4 sm:p-8" dir="rtl">
    <div className="max-w-4xl mx-auto space-y-5">
      <header className="text-center"><Users className="w-12 h-12 mx-auto text-violet-600 mb-2" /><h1 className="text-3xl font-black text-slate-800">فضای دانش‌آموز</h1><p className="text-slate-600 mt-2">پروفایل دانش‌آموزی · اطلاعات و فعالیت‌ها فقط در فضای ذخیره‌سازی محلی این دستگاه ثبت می‌شوند.</p></header>
      <Feedback message={message} error={error} />
      {!profile ? <Card className="border-0 shadow-lg"><CardHeader><CardTitle>ورود به کلاس</CardTitle></CardHeader><CardContent className="space-y-3"><p>برای اتصال پروفایل مدرسه، فایل دعوت‌نامه‌ای را که معلم برایتان فرستاده وارد کنید.</p><input ref={inviteFile} type="file" accept=".json,application/json" className="hidden" onChange={activate} /><Button onClick={() => inviteFile.current?.click()}><FileUp className="w-4 h-4 ml-2" />انتخاب دعوت‌نامه</Button>{pendingInvitations.length > 0 && <div className="space-y-2"><p className="font-semibold">پروفایل مورد استفاده را انتخاب کنید:</p>{pendingInvitations.map((invitation) => <Button key={invitation.student?.id} variant="outline" className="w-full justify-start" onClick={() => chooseInvitation(invitation)}>{invitation.student?.name || `${invitation.student?.firstName || ""} ${invitation.student?.lastName || ""}`} · {invitation.classroom?.name}</Button>)}</div>}</CardContent></Card>
        : <>
          <Card className="border-0 shadow-lg"><CardContent className="p-5"><h2 className="text-xl font-bold">{profile.student.name}</h2><p className="text-slate-600">{profile.classroom?.name || "پروفایل محلی، هنوز منتسب به کلاس نیست"}{profile.teacher?.name ? ` · معلم: ${profile.teacher.name}` : ""}</p><p className="text-xs text-amber-700 mt-3">ذخیرهٔ محلی از دسترسی مالک دستگاه یا ابزارهای همان دستگاه محافظت نمی‌کند؛ هیچ داده‌ای به سرور ارسال نمی‌شود.</p></CardContent></Card>
          <Card className="border-0 shadow-lg"><CardHeader><CardTitle>عملکرد فعلی و تبادل گزارش</CardTitle></CardHeader><CardContent className="space-y-3"><p>جزئیات عملکرد فقط پس از دریافت کارنامهٔ معلم نمایش داده می‌شود.</p><Input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="رمز گزارش مورد توافق با معلم" /><div className="flex flex-wrap gap-2"><Button onClick={exportResults}><Download className="w-4 h-4 ml-2" />ارسال عملکرد فعلی به معلم</Button><input ref={returnFile} type="file" accept=".json,application/json" className="hidden" onChange={importTeacherReport} /><Button variant="outline" onClick={() => returnFile.current?.click()}><FileUp className="w-4 h-4 ml-2" />دریافت کارنامهٔ معلم</Button></div></CardContent></Card>
          {returnedReports.length > 0 && <Card className="border-0 shadow-lg"><CardHeader><CardTitle>کارنامه‌های دریافت‌شده</CardTitle></CardHeader><CardContent className="space-y-4"><select aria-label="تاریخچهٔ کارنامه‌ها" className="rounded-lg border p-2" value={visibleReport?.responseId || ""} onChange={(event) => setReportId(event.target.value)}>{returnedReports.map((item) => <option key={item.responseId} value={item.responseId}>{item.cycle.name} · {new Date(item.receivedAt).toLocaleDateString("fa-IR")}</option>)}</select>{visibleReport && <motion.div key={visibleReport.responseId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-gradient-to-br from-violet-50 to-sky-50 p-5 space-y-3"><div className="flex flex-wrap justify-between gap-2"><strong>{visibleReport.cycle.name} · {visibleReport.subject || "گزارش پیشرفت"}</strong><span>معلم: {visibleReport.teacher.name}</span></div><div className="text-sm">ارزیابی: {reportRatingLabels[visibleReport.evaluation.rating]}{visibleReport.evaluation.comment && ` · ${visibleReport.evaluation.comment}`}</div><div className="font-bold">میانگین فعالیت‌های بازی: {visibleReport.average}٪</div>{visibleReport.results.map((result, index) => <div key={`${visibleReport.responseId}-${index}`} className="grid grid-cols-[1fr_auto] gap-3 items-center"><span>{result.gameTitle}</span><span>{result.percent}٪</span><div className="col-span-2 h-2 rounded-full bg-white overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${result.percent}%` }} transition={{ duration: 0.6, delay: index * 0.06 }} className="h-full bg-violet-500" /></div></div>)}{visibleReport.assignmentAnswers.map((assignment, index) => <div key={`${visibleReport.responseId}-answer-${index}`} className="border-t pt-2"><strong>{assignment.title}</strong>{assignment.answers.map((answer, answerIndex) => <p key={answerIndex} className="text-sm">{assignment.questions[answerIndex]?.prompt}: {answer}</p>)}</div>)}</motion.div>}</CardContent></Card>}
        </>}
    </div>
  </main>;
}

export default function MyClasses() {
  const { user } = useAuth();
  if (user?.role === "student") return <StudentClasses user={user} />;
  return <TeacherClasses user={user} />;
}

function TeacherClasses({ user }) {
  const [state, setState] = useState(() => empty(user?.id));
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [selected, setSelected] = useState(null);
  const [cycleId, setCycleId] = useState("");
  const [cycleName, setCycleName] = useState("");
  const [studentIds, setStudentIds] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [gameId, setGameId] = useState("");
  const [questionPrompt, setQuestionPrompt] = useState("");
  const [questionOptions, setQuestionOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [questionFeedback, setQuestionFeedback] = useState("");
  const [teacherQuestionGameId, setTeacherQuestionGameId] = useState("");
  const [teacherQuestionEngine, setTeacherQuestionEngine] = useState("quiz");
  const [teacherQuestionPrompt, setTeacherQuestionPrompt] = useState("");
  const [teacherQuestionAnswer, setTeacherQuestionAnswer] = useState("");
  const [teacherQuestionHint, setTeacherQuestionHint] = useState("");
  const [teacherQuestionLabel, setTeacherQuestionLabel] = useState("");
  const [teacherQuestionCategory, setTeacherQuestionCategory] = useState("");
  const [teacherQuestionEmoji, setTeacherQuestionEmoji] = useState("");
  const [teacherQuestionOptions, setTeacherQuestionOptions] = useState(["", "", "", ""]);
  const [teacherQuestionCorrectIndex, setTeacherQuestionCorrectIndex] = useState(0);
  const [teacherQuestionScope, setTeacherQuestionScope] = useState("all");
  const [teacherQuestionStudentIds, setTeacherQuestionStudentIds] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedReportStudents, setSelectedReportStudents] = useState([]);
  const [returnPassword, setReturnPassword] = useState("");
  const [password, setPassword] = useState("");
  const [reportPassword, setReportPassword] = useState("");
  const [importClassId, setImportClassId] = useState("");
  const [importStudentId, setImportStudentId] = useState("__new__");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const inviteFile = useRef();
  const reportFile = useRef();
  const showError = (reason) => { setMessage(reason); setError(true); };
  const showMessage = (text) => { setMessage(text); setError(false); };
  useEffect(() => {
    if (!state.teacher && user?.firstName && user?.lastName) {
      try {
        setState(classroom.setTeacherProfile(user, {
          firstName: user.firstName, lastName: user.lastName, nationalId: user.nationalId,
        }));
      } catch (reason) { showError(reason.message); }
    }
  }, [state.teacher, user]);
  const refresh = (nextSelected = selected) => {
    const next = empty(user?.id);
    setState(next);
    if (nextSelected) setSelected(nextSelected);
  };
  const currentClass = state.classes.find((item) => item.id === selected) || state.classes[0];
  const activeCycle = currentClass?.cycles.find((item) => item.id === cycleId) ||
    currentClass?.cycles.find((item) => item.status === "active") || currentClass?.cycles[0];
  const selectedGame = gameLibrary.find((game) => game.id === gameId);
  const reportsByStudent = useMemo(() => (currentClass?.students || []).map((student) => {
    const entries = currentClass.reports.filter((report) =>
      report.studentId === student.id && (!activeCycle || report.cycleId === activeCycle.id));
    const average = entries.length ? Math.round(entries.reduce((sum, item) => sum + item.percent, 0) / entries.length) : 0;
    return { student, entries, average };
  }), [currentClass, activeCycle]);

  const saveTeacher = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try { setState(classroom.setTeacherProfile(user, { firstName: form.get("firstName"), lastName: form.get("lastName"), nationalId: form.get("nationalId") })); showMessage("پروفایل معلم ذخیره شد."); }
    catch (reason) { showError(reason.message); }
  };
  const createClass = () => {
    try {
      const record = classroom.createClass(className, user?.id);
      classroom.updateClass(record.id, { name: className, subject, grade }, user?.id);
      setClassName(""); setSubject(""); setGrade(""); refresh(record.id); showMessage("کلاس ساخته شد.");
    } catch (reason) { showError(reason.message); }
  };
  const saveClassDetails = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      classroom.updateClass(currentClass.id, {
        name: form.get("className"), subject: form.get("subject"), grade: form.get("grade"),
      }, user?.id);
      refresh(currentClass.id);
      showMessage("نام کلاس، درس و پایه ذخیره شد.");
    } catch (reason) { showError(reason.message); }
  };
  const addStudent = () => {
    try {
      if (!currentClass) throw new Error("ابتدا یک کلاس بسازید و انتخاب کنید");
      const created = classroom.addStudent(currentClass.id, { firstName, lastName, fatherName, nationalId }, user?.id);
      const invite = classroom.invitation(created.class, created.student, state.teacher);
      downloadJson(invite, `klassyar-invite-${created.student.accessCode}.json`);
      setFirstName(""); setLastName(""); setFatherName(""); setNationalId(""); refresh(currentClass.id);
      showMessage("پروفایل کلاس ساخته شد و دعوت‌نامهٔ نسخه‌دار دانلود شد؛ آن را برای دانش‌آموز بفرستید.");
    } catch (reason) { showError(reason.message); }
  };
  const sendProfile = (student) => {
    try {
      downloadJson(classroom.invitation(currentClass, student, state.teacher), `klassyar-invite-${student.accessCode}.json`);
      showMessage(`فایل پروفایل ${student.name} آمادهٔ ارسال است.`);
    } catch (reason) { showError(reason.message); }
  };
  const sendSelectedProfiles = () => {
    const students = currentClass.students.filter((student) => selectedProfiles.includes(student.id));
    if (!students.length) { showError("ابتدا دانش‌آموزان را با کادر انتخاب مشخص کنید"); return; }
    try {
      const bundle = {
        format: "klassyar-invitation-bundle", version: 1,
        classroom: { id: currentClass.id, name: currentClass.name },
        invitations: students.map((student) => classroom.invitation(currentClass, student, state.teacher)),
      };
      downloadJson(bundle, `klassyar-profiles-${currentClass.id}.json`);
      showMessage(`فایل دسته‌ای پروفایل برای ${students.length} دانش‌آموز دانلود شد.`);
    } catch (reason) { showError(reason.message); }
  };
  const exportReturnReports = async (studentIds) => {
    try {
      if (!currentClass || !activeCycle) throw new Error("کلاس و دورهٔ گزارش را انتخاب کنید");
      if (!studentIds.length) throw new Error("حداقل یک دانش‌آموز را انتخاب کنید");
      const exports = await classroom.createTeacherReturnFiles(
        currentClass.id, studentIds, activeCycle.id, user?.id, returnPassword,
      );
      exports.forEach(({ report, file }) =>
        downloadJson(file, `klassyar-return-${report.student.id}-${activeCycle.id}.json`));
      showMessage(`فایل کارنامهٔ رمزگذاری‌شده برای ${exports.length} دانش‌آموز ساخته شد.`);
    } catch (reason) { showError(reason.message); }
  };
  const importReport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const envelope = await readJsonFile(file);
      const report = await decryptReport(envelope, reportPassword);
      const result = classroom.importReport(report, user?.id, {
        classId: importClassId || currentClass?.id,
        studentId: importStudentId,
      });
      refresh(result.class.id);
      showMessage(`${result.imported} فعالیت و ${result.answersImported} پاسخ تکلیف تازه برای ${report.student.name || `${report.student.firstName} ${report.student.lastName}`} وارد شد.`);
    } catch (reason) { showError(reason.message); }
    event.target.value = "";
  };
  const addCycle = () => {
    try { const cycle = classroom.addCycle(currentClass.id, cycleName, user?.id); setCycleName(""); setCycleId(cycle.id); refresh(currentClass.id); showMessage("دورهٔ تازه آغاز شد؛ دورهٔ قبلی در تاریخچه باقی ماند."); }
    catch (reason) { showError(reason.message); }
  };
  const addAssignment = () => {
    try {
      const questions = questionPrompt.trim() ? [{
        prompt: questionPrompt.trim(), options: questionOptions.map((option) => option.trim()),
        correctIndex: Number(correctIndex), feedback: questionFeedback.trim(),
      }] : [];
      classroom.addAssignment(currentClass.id, {
        title: assignmentTitle, gameId, gameTitle: selectedGame?.title || "",
        studentIds, questions,
      }, user?.id);
      setAssignmentTitle(""); setQuestionPrompt(""); setQuestionOptions(["", "", "", ""]);
      setCorrectIndex(0); setQuestionFeedback(""); setStudentIds([]); setGameId("");
      refresh(currentClass.id); showMessage("تکلیف بازی/سوال چندگزینه‌ای به دانش‌آموزان انتخاب‌شده تخصیص یافت.");
    } catch (reason) { showError(reason.message); }
  };
  const teacherGame = teacherQuestionGameId ? gameLibrary.find((game) => game.id === teacherQuestionGameId) || null : null;
  const addTeacherQuestion = () => {
    try {
      if (!currentClass) throw new Error("ابتدا یک کلاس را انتخاب کنید");
      if (!teacherGame) throw new Error("بازی معلم‌ساخته را انتخاب کنید");
      const engine = teacherQuestionEngine || teacherGame.engine || "quiz";
      let item = null;
      if (engine === "quiz") {
        item = {
          question: teacherQuestionPrompt.trim(),
          options: teacherQuestionOptions.map((option) => option.trim()).filter(Boolean),
          correctIndex: Number(teacherQuestionCorrectIndex),
        };
      }
      if (engine === "match" || engine === "memory") {
        item = {
          id: `${teacherGame.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
          text: teacherQuestionPrompt.trim() || teacherQuestionAnswer.trim(),
          emoji: teacherQuestionEmoji.trim(),
        };
      }
      if (engine === "sort") {
        item = {
          id: `${teacherGame.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
          label: teacherQuestionLabel.trim() || teacherQuestionPrompt.trim(),
          category: teacherQuestionCategory.trim() || "دستهٔ معلم",
        };
      }
      if (engine === "scramble") {
        const answer = teacherQuestionAnswer.trim();
        if (!answer) throw new Error("پاسخ کلمهٔ به‌هم‌ریختگی الزامی است");
        item = {
          answer,
          hint: teacherQuestionHint.trim(),
          scrambled: teacherQuestionPrompt.trim() || answer,
        };
      }
      if (engine === "type" || engine === "fillblank") {
        item = {
          answer: teacherQuestionAnswer.trim(),
          hint: teacherQuestionHint.trim(),
          text: teacherQuestionPrompt.trim(),
          question: teacherQuestionPrompt.trim(),
        };
      }
      if (!item) throw new Error("ساختار سؤال معلم نامعتبر است");
      classroom.addTeacherQuestion(currentClass.id, {
        gameId: teacherGame.id,
        gameTitle: teacherGame.title,
        engine,
        question: item,
        scope: teacherQuestionScope,
        studentIds: teacherQuestionScope === "selected" ? teacherQuestionStudentIds : [],
      }, user?.id);
      setTeacherQuestionGameId("");
      setTeacherQuestionEngine("quiz");
      setTeacherQuestionPrompt("");
      setTeacherQuestionAnswer("");
      setTeacherQuestionHint("");
      setTeacherQuestionLabel("");
      setTeacherQuestionCategory("");
      setTeacherQuestionEmoji("");
      setTeacherQuestionOptions(["", "", "", ""]);
      setTeacherQuestionCorrectIndex(0);
      setTeacherQuestionScope("all");
      setTeacherQuestionStudentIds([]);
      refresh(currentClass.id);
      showMessage("سؤال ساخته‌شده معلم به بازی اضافه شد و هنگام بازی دانش‌آموزان اعمال می‌شود.");
    } catch (reason) { showError(reason.message); }
  };
  const updateEvaluation = (student, rating, comment) => {
    try { classroom.evaluate(currentClass.id, student.id, activeCycle.id, rating, comment, user?.id); refresh(currentClass.id); }
    catch (reason) { showError(reason.message); }
  };

  return <main className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50 p-4 sm:p-8" dir="rtl">
    <div className="max-w-6xl mx-auto space-y-5">
      <header className="text-center"><Users className="w-12 h-12 mx-auto text-violet-600 mb-2" /><h1 className="text-3xl font-black text-slate-800">کلاس‌های من</h1><p className="text-slate-600 mt-2">مدیریت آفلاین کلاس‌ها، پروفایل‌ها، تکلیف‌ها و گزارش عملکرد</p></header>
      <Feedback message={message} error={error} />
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="border-0 shadow-lg"><CardHeader><CardTitle>پروفایل معلم</CardTitle></CardHeader><CardContent><form onSubmit={saveTeacher} className="space-y-3"><Input name="firstName" required defaultValue={state.teacher?.firstName || user?.firstName || ""} placeholder="نام" /><Input name="lastName" required defaultValue={state.teacher?.lastName || user?.lastName || ""} placeholder="نام خانوادگی" /><Input name="nationalId" defaultValue={state.teacher?.nationalId || user?.nationalId || ""} placeholder="کد ملی (اختیاری)" /><Button type="submit" className="w-full">ذخیرهٔ پروفایل</Button></form><p className="text-xs text-slate-500 mt-3">اطلاعات فقط در همین دستگاه نگهداری می‌شود و در برابر مالک دستگاه محرمانه نیست.</p></CardContent></Card>
        <Card className="border-0 shadow-lg"><CardHeader><CardTitle>ایجاد کلاس</CardTitle></CardHeader><CardContent className="space-y-2"><Input value={className} onChange={(event) => setClassName(event.target.value)} placeholder="نام کلاس، مثلاً پنجم الف" /><div className="flex gap-2"><Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="درس" /><Input value={grade} onChange={(event) => setGrade(event.target.value)} placeholder="پایه" /></div><Button onClick={createClass}><Plus className="w-4 h-4 ml-1" />ایجاد</Button></CardContent></Card>
        <Card className="border-0 shadow-lg"><CardHeader><CardTitle>دریافت گزارش رمزگذاری‌شده</CardTitle></CardHeader><CardContent className="space-y-2"><Input type="password" autoComplete="current-password" value={reportPassword} onChange={(event) => setReportPassword(event.target.value)} placeholder="رمز گزارش دانش‌آموز" /><p className="text-xs text-slate-500">گزارش دعوت‌نامه‌ای با شناسهٔ کلاس/دانش‌آموز تطبیق داده می‌شود. برای گزارش حساب مستقل، کلاس و پروفایل موجود یا ساخت پروفایل تازه را مشخص کنید.</p><div className="grid gap-2"><select aria-label="کلاس مقصد گزارش دانش‌آموز مستقل" className="rounded-xl border p-2" value={importClassId || currentClass?.id || ""} onChange={(event) => { setImportClassId(event.target.value); setImportStudentId("__new__"); }}><option value="">انتخاب کلاس مقصد</option>{state.classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select aria-label="دانش‌آموز مقصد گزارش مستقل" className="rounded-xl border p-2" value={importStudentId} onChange={(event) => setImportStudentId(event.target.value)}><option value="__new__">ساخت پروفایل دانش‌آموز تازه</option>{(state.classes.find((item) => item.id === (importClassId || currentClass?.id))?.students || []).map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></div><input ref={reportFile} type="file" accept=".json,application/json" className="hidden" onChange={importReport} /><Button className="w-full" variant="outline" onClick={() => reportFile.current?.click()}><FileUp className="w-4 h-4 ml-1" />انتخاب گزارش و وارد کردن</Button></CardContent></Card>
      </div>
      <section className="grid lg:grid-cols-[270px_1fr] gap-5">
        <Card className="border-0 shadow-lg"><CardHeader><CardTitle>کلاس‌ها</CardTitle></CardHeader><CardContent className="space-y-2">{state.classes.length ? state.classes.map((item) => <button key={item.id} onClick={() => { setSelected(item.id); setCycleId(""); setSelectedProfiles([]); setSelectedReportStudents([]); }} className={`w-full rounded-xl p-3 text-right ${currentClass?.id === item.id ? "bg-violet-600 text-white" : "bg-slate-100"}`}>{item.name}<span className="block text-xs opacity-70">{item.students.length} دانش‌آموز · {item.cycles.length} دوره</span></button>) : <p className="text-slate-500 text-sm">هنوز کلاسی ندارید.</p>}</CardContent></Card>
        <div className="space-y-5">
          {currentClass && <>
            <Card className="border-0 shadow-lg"><CardHeader><CardTitle>{currentClass.name} · فهرست دانش‌آموزان</CardTitle></CardHeader><CardContent className="space-y-3">
              <form onSubmit={saveClassDetails} className="grid sm:grid-cols-4 gap-2 rounded-xl bg-slate-50 p-3"><Input name="className" required defaultValue={currentClass.name} aria-label="نام کلاس" placeholder="نام کلاس" /><Input name="subject" defaultValue={currentClass.subject || ""} aria-label="درس" placeholder="درس" /><Input name="grade" defaultValue={currentClass.grade || ""} aria-label="پایه" placeholder="پایه" /><Button type="submit" variant="outline">ذخیرهٔ مشخصات کلاس</Button></form>
              <div className="grid sm:grid-cols-4 gap-2"><Input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="نام دانش‌آموز" /><Input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="نام خانوادگی" /><Input value={fatherName} onChange={(event) => setFatherName(event.target.value)} placeholder="نام پدر" /><Input value={nationalId} onChange={(event) => setNationalId(event.target.value)} placeholder="کد ملی (اختیاری)" /></div>
              <Button onClick={addStudent}><UserPlus className="w-4 h-4 ml-1" />افزودن و دانلود دعوت‌نامه</Button>
              <div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={currentClass.students.length > 0 && selectedProfiles.length === currentClass.students.length} onChange={(event) => setSelectedProfiles(event.target.checked ? currentClass.students.map((student) => student.id) : [])} />انتخاب همهٔ پروفایل‌ها</label><Button variant="outline" size="sm" onClick={sendSelectedProfiles}>دانلود دسته‌ای پروفایل‌ها</Button></div>
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-violet-50 p-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={currentClass.students.length > 0 && selectedReportStudents.length === currentClass.students.length} onChange={(event) => setSelectedReportStudents(event.target.checked ? currentClass.students.map((student) => student.id) : [])} />انتخاب همه برای کارنامه</label><Input type="password" autoComplete="new-password" value={returnPassword} onChange={(event) => setReturnPassword(event.target.value)} placeholder="رمز مشترک کارنامه‌ها (حداقل ۸ نویسه)" /><Button size="sm" onClick={() => exportReturnReports(selectedReportStudents)}>ساخت کارنامه برای انتخاب‌شده‌ها</Button></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[1150px] text-right text-sm"><thead><tr className="border-b text-slate-500"><th className="p-2">پروفایل</th><th className="p-2">گزارش</th><th className="p-2">کد ملی</th><th className="p-2">نام</th><th className="p-2">نام خانوادگی</th><th className="p-2">نام پدر</th><th className="p-2">کلاس</th><th className="p-2">معلم</th><th className="p-2">درس</th><th className="p-2">پایه</th><th className="p-2">ارسال پروفایل</th><th className="p-2">کارنامه</th></tr></thead><tbody>{currentClass.students.map((student) => <tr key={student.id} className="border-b"><td className="p-2"><input aria-label={`انتخاب پروفایل ${student.name}`} type="checkbox" checked={selectedProfiles.includes(student.id)} onChange={(event) => setSelectedProfiles((ids) => event.target.checked ? [...ids, student.id] : ids.filter((id) => id !== student.id))} /></td><td className="p-2"><input aria-label={`انتخاب کارنامه ${student.name}`} type="checkbox" checked={selectedReportStudents.includes(student.id)} onChange={(event) => setSelectedReportStudents((ids) => event.target.checked ? [...ids, student.id] : ids.filter((id) => id !== student.id))} /></td><td className="p-2">{student.nationalId || "—"}</td><td className="p-2">{student.firstName}</td><td className="p-2">{student.lastName}</td><td className="p-2">{student.fatherName || "—"}</td><td className="p-2">{currentClass.name}</td><td className="p-2">{state.teacher?.name || "—"}</td><td className="p-2">{currentClass.subject || "—"}</td><td className="p-2">{currentClass.grade || "—"}</td><td className="p-2"><Button variant="outline" size="sm" onClick={() => sendProfile(student)}>ارسال پروفایل</Button></td><td className="p-2"><Button variant="outline" size="sm" onClick={() => exportReturnReports([student.id])}>ساخت کارنامه</Button></td></tr>)}</tbody></table></div>
            </CardContent></Card>
            <Card className="border-0 shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />گزارش عملکرد و ارزیابی</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex flex-wrap gap-2 items-center"><select aria-label="دورهٔ گزارش" className="rounded-xl border p-2" value={activeCycle?.id || ""} onChange={(event) => setCycleId(event.target.value)}>{currentClass.cycles.map((cycle) => <option value={cycle.id} key={cycle.id}>{cycle.name} {cycle.status === "active" ? "(فعال)" : "(پایان‌یافته)"}</option>)}</select><Input value={cycleName} onChange={(event) => setCycleName(event.target.value)} placeholder="نام دورهٔ جدید" /><Button variant="outline" onClick={addCycle}>شروع دوره</Button></div>
              {reportsByStudent.length ? reportsByStudent.map(({ student, entries, average }) => {
                const evaluation = currentClass.evaluations[`${activeCycle?.id}:${student.id}`] || {};
                return <div key={student.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between"><strong>{student.name}</strong><strong>{average}٪ · {entries.length} فعالیت</strong></div><div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-violet-500" style={{ width: `${average}%` }} /></div>{entries.length > 0 && <p className="text-xs text-slate-600 mt-2">آخرین بازی: {entries.at(-1).gameTitle} · {entries.at(-1).percent}٪</p>}<div className="grid sm:grid-cols-2 gap-2 mt-3"><select className="rounded-lg border p-2" aria-label={`ارزیابی ${student.name}`} value={evaluation.rating || ""} onChange={(event) => updateEvaluation(student, event.target.value, evaluation.comment || "")}><option value="">انتخاب سطح ارزیابی</option>{Object.entries(reportRatingLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><Input key={`${student.id}-${evaluation.updatedAt || ""}`} defaultValue={evaluation.comment || ""} placeholder="یادداشت معلم دربارهٔ این دوره" onBlur={(event) => { if (evaluation.rating) updateEvaluation(student, evaluation.rating, event.target.value); }} /></div></div>;
              }) : <p className="text-slate-500">هنوز دانش‌آموزی ثبت نشده است.</p>}
              <Link to="/TeacherReports" className="inline-block text-violet-700 underline">گزارش‌ها و تاریخچهٔ کامل دوره‌ها</Link>
            </CardContent></Card>
            <Card className="border-0 shadow-lg"><CardHeader><CardTitle>تکلیف هدفمند و سوال چندگزینه‌ای</CardTitle></CardHeader><CardContent className="space-y-3"><Input value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} placeholder="عنوان تکلیف" /><select className="w-full rounded-xl border p-2" value={gameId} onChange={(event) => setGameId(event.target.value)}><option value="">بدون بازی (سوال سفارشی)</option>{gameLibrary.map((game) => <option key={game.id} value={game.id}>{game.title}</option>)}</select><Input value={questionPrompt} onChange={(event) => setQuestionPrompt(event.target.value)} placeholder="متن سوال سفارشی (اختیاری)" /><div className="grid sm:grid-cols-2 gap-2">{questionOptions.map((option, index) => <div key={index} className="flex items-center gap-2"><input aria-label={`گزینه ${index + 1} پاسخ درست`} type="radio" name="correct-option" checked={Number(correctIndex) === index} onChange={() => setCorrectIndex(index)} /><Input value={option} onChange={(event) => setQuestionOptions((options) => options.map((value, optionIndex) => optionIndex === index ? event.target.value : value))} placeholder={`گزینهٔ ${index + 1}`} /></div>)}</div><p className="text-xs text-slate-500">دکمهٔ کنار گزینه، پاسخ درست را تعیین می‌کند؛ دانش‌آموز گزینه را انتخاب می‌کند و بازخورد را می‌بیند.</p><Input value={questionFeedback} onChange={(event) => setQuestionFeedback(event.target.value)} placeholder="بازخورد پاسخ (مثلاً نکتهٔ آموزشی)" /><div className="flex flex-wrap gap-3">{currentClass.students.map((student) => <label key={student.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={studentIds.includes(student.id)} onChange={(event) => setStudentIds((ids) => event.target.checked ? [...ids, student.id] : ids.filter((id) => id !== student.id))} />{student.name}</label>)}</div><Button onClick={addAssignment} disabled={!currentClass.students.length}>تخصیص تکلیف به افراد انتخاب‌شده</Button><ul className="list-disc pr-5 text-sm text-slate-600">{currentClass.assignments.map((item) => <li key={item.id}>{item.title} · {item.studentIds.length} دانش‌آموز</li>)}</ul></CardContent></Card>
          </>}
          <Card className="border-0 shadow-lg"><CardHeader><CardTitle>سوال ساخت‌شدهٔ معلم برای بازی‌ها</CardTitle></CardHeader><CardContent className="space-y-4"><select className="w-full rounded-xl border p-2" value={teacherQuestionGameId} onChange={(event) => { const nextGame = gameLibrary.find((game) => game.id === event.target.value); setTeacherQuestionGameId(event.target.value); setTeacherQuestionEngine(nextGame?.engine || "quiz"); }}><option value="">انتخاب بازی</option>{gameLibrary.map((game) => <option key={game.id} value={game.id}>{game.title}</option>)}</select>{teacherGame && <div className="space-y-3"><div className="flex gap-4 text-sm"><label className="flex items-center gap-2"><input type="radio" name="teacher-question-scope" checked={teacherQuestionScope === "all"} onChange={() => setTeacherQuestionScope("all")} />برای همه</label><label className="flex items-center gap-2"><input type="radio" name="teacher-question-scope" checked={teacherQuestionScope === "selected"} onChange={() => setTeacherQuestionScope("selected")} />فقط برای انتخاب‌شده‌ها</label></div>{teacherQuestionScope === "selected" && <div className="flex flex-wrap gap-3">{currentClass.students.map((student) => <label key={student.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={teacherQuestionStudentIds.includes(student.id)} onChange={(event) => setTeacherQuestionStudentIds((ids) => event.target.checked ? [...ids, student.id] : ids.filter((id) => id !== student.id))} />{student.name}</label>)}</div>}{teacherGame.engine === "quiz" && <div className="space-y-2"><Input value={teacherQuestionPrompt} onChange={(event) => setTeacherQuestionPrompt(event.target.value)} placeholder="متن سؤال" /><div className="grid sm:grid-cols-2 gap-2">{teacherQuestionOptions.map((option, index) => <div key={index} className="flex items-center gap-2"><input aria-label={`گزینهٔ ${index + 1} سؤال معلم`} type="radio" name="teacher-correct-option" checked={Number(teacherQuestionCorrectIndex) === index} onChange={() => setTeacherQuestionCorrectIndex(index)} /><Input value={option} onChange={(event) => setTeacherQuestionOptions((options) => options.map((value, optionIndex) => optionIndex === index ? event.target.value : value))} placeholder={`گزینهٔ ${index + 1}`} /></div>)}</div></div>}{teacherGame.engine === "match" || teacherGame.engine === "memory" ? <div className="grid sm:grid-cols-2 gap-2"><Input value={teacherQuestionPrompt} onChange={(event) => setTeacherQuestionPrompt(event.target.value)} placeholder="متن کارت" /><Input value={teacherQuestionEmoji} onChange={(event) => setTeacherQuestionEmoji(event.target.value)} placeholder="اموجی اختیاری" /></div> : null}{teacherGame.engine === "sort" && <div className="grid sm:grid-cols-2 gap-2"><Input value={teacherQuestionLabel} onChange={(event) => setTeacherQuestionLabel(event.target.value)} placeholder="عنوان گزینهٔ مرتب‌سازی" /><Input value={teacherQuestionCategory} onChange={(event) => setTeacherQuestionCategory(event.target.value)} placeholder="نام دسته" /></div>}{(teacherGame.engine === "scramble" || teacherGame.engine === "type" || teacherGame.engine === "fillblank") && <div className="grid sm:grid-cols-2 gap-2"><Input value={teacherQuestionAnswer} onChange={(event) => setTeacherQuestionAnswer(event.target.value)} placeholder={teacherGame.engine === "scramble" ? "پاسخ کلمه" : "پاسخ درست"} /><Input value={teacherQuestionHint} onChange={(event) => setTeacherQuestionHint(event.target.value)} placeholder="راهنما یا نکته" /><Input value={teacherQuestionPrompt} onChange={(event) => setTeacherQuestionPrompt(event.target.value)} placeholder={teacherGame.engine === "fillblank" ? "متن جمله با جای خالی" : "حروف درهم‌ریخته (اختیاری)"} /></div>}</div>}{currentClass.teacherQuestions?.length > 0 && <ul className="space-y-2 text-sm text-slate-700">{currentClass.teacherQuestions.filter((item) => !teacherQuestionGameId || item.gameId === teacherQuestionGameId).slice(0, 6).map((item) => <li key={item.id} className="rounded-lg bg-slate-50 p-2">{item.gameTitle} · {item.scope === "all" ? "برای همه" : `برای ${item.studentIds.length} دانش‌آموز`} · {item.engine === "quiz" ? item.question.question : item.engine === "sort" ? `${item.question.label} → ${item.question.category}` : item.question.text || item.question.answer || item.question.label || item.question.question}</li>)}</ul>}</CardContent></Card>
        </div>
      </section>
    </div>
  </main>;
}

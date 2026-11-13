const KEY = "klassyar_classroom_v1";
const STUDENT_KEY = "klassyar_student_profile_v1";
const RESULT_KEY = "klassyar_student_results_v1";
const ANSWER_KEY = "klassyar_assignment_answers_v1";
const RETURN_KEY = "klassyar_student_teacher_reports_v1";
const REPORT_FORMAT = "klassyar-performance-report";
const INVITATION_FORMAT = "klassyar-invitation";
const FILE_VERSION = 1;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const RATINGS = ["excellent", "good", "developing", "needs-practice"];

const makeId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
const parse = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const text = (value) => typeof value === "string" ? value.trim() : "";
const validName = (profile) => Boolean(text(profile?.firstName) && text(profile?.lastName));

function freshState() {
  return { version: FILE_VERSION, teacherId: null, teacher: null, classes: [], imports: [] };
}

function normalizeState(state) {
  if (!state || !Array.isArray(state.classes)) return freshState();
  const now = new Date().toISOString();
  return {
    ...freshState(),
    ...state,
    teacher: state.teacher || null,
    imports: Array.isArray(state.imports) ? state.imports : [],
    classes: state.classes.map((item) => {
      const cycles = Array.isArray(item.cycles) ? item.cycles : [];
      return {
        ...item,
        students: Array.isArray(item.students) ? item.students : [],
        reports: Array.isArray(item.reports) ? item.reports : [],
        assignments: Array.isArray(item.assignments) ? item.assignments : [],
        assignmentAnswers: Array.isArray(item.assignmentAnswers) ? item.assignmentAnswers : [],
        teacherQuestions: Array.isArray(item.teacherQuestions) ? item.teacherQuestions : [],
        cycles: cycles.length ? cycles : [{
          id: "legacy-cycle", name: "فعالیت‌های پیشین", startedAt: item.createdAt || now, endedAt: null, status: "active",
        }],
        evaluations: item.evaluations && typeof item.evaluations === "object" ? item.evaluations : {},
      };
    }),
  };
}

function currentState(userId) {
  const state = normalizeState(parse(KEY, freshState()));
  // Existing local class data predates teacher accounts; bind it once, without discarding it.
  if (userId && !state.teacherId && (state.classes.length || state.teacher)) {
    state.teacherId = userId;
    save(KEY, state);
  }
  if (userId && state.teacherId && state.teacherId !== userId) return freshState();
  return state;
}

function ensureClass(state, classId) {
  const target = state.classes.find((item) => item.id === classId);
  if (!target) throw new Error("کلاس پیدا نشد");
  return target;
}

function validateReport(report) {
  const isUnassignedStudent = report?.reportType === "student" && report.unassigned === true;
  if (report?.format !== REPORT_FORMAT || report.version !== FILE_VERSION ||
      (!report.classroom?.id && !isUnassignedStudent) ||
      !report.student?.id || !validName(report.student) || !["student", "teacher"].includes(report.reportType)) {
    throw new Error("ساختار یا نسخهٔ فایل گزارش کلاس‌یار معتبر نیست");
  }
  if (report.reportType === "teacher") {
    if (!report.responseId || !report.sourceCycleId || !report.cycle?.id || !report.cycle?.name ||
        !Array.isArray(report.results) || !Array.isArray(report.assignmentAnswers) ||
        !report.evaluation || !RATINGS.includes(report.evaluation.rating) ||
        typeof report.evaluation.comment !== "string" ||
        !Number.isFinite(report.average) || report.average < 0 || report.average > 100 ||
        report.results.length > 2000) throw new Error("اطلاعات کارنامهٔ معلم معتبر نیست");
    if (report.results.some((item) => !item || typeof item.gameTitle !== "string" ||
      !Number.isFinite(item.score) || !Number.isFinite(item.total) || !Number.isFinite(item.percent) ||
      item.score < 0 || item.total < 0 || item.score > item.total || item.percent < 0 || item.percent > 100)) {
      throw new Error("نتایج داخل کارنامهٔ معلم معتبر نیست");
    }
    if (report.assignmentAnswers.some((item) => !item || typeof item.title !== "string" ||
      !Array.isArray(item.answers) || item.answers.some((answer) => typeof answer !== "string"))) {
      throw new Error("پاسخ‌های تکلیف داخل کارنامهٔ معلم معتبر نیست");
    }
    return;
  }
  if (!Array.isArray(report.results)) throw new Error("ساختار گزارش عملکرد دانش‌آموز معتبر نیست");
  if (report.results.length > 2000 || report.results.some((item) =>
    !item || typeof item.id !== "string" || typeof item.gameTitle !== "string" ||
    !Number.isFinite(item.score) || !Number.isFinite(item.total) || !Number.isFinite(item.percent) ||
    item.score < 0 || item.total < 0 || item.score > item.total || item.percent < 0 || item.percent > 100
  )) throw new Error("اطلاعات عملکرد در فایل گزارش معتبر نیست");
  if (report.assignmentAnswers !== undefined &&
      (!Array.isArray(report.assignmentAnswers) || report.assignmentAnswers.length > 500 ||
       report.assignmentAnswers.some((item) => !item || typeof item.assignmentId !== "string" ||
         typeof item.studentId !== "string" || typeof item.classId !== "string" ||
         !Number.isFinite(Date.parse(item.updatedAt)) ||
         !Array.isArray(item.answers) || item.answers.length > 100 ||
         item.answers.some((answer) => !answer || !Number.isInteger(answer.choiceIndex) ||
           typeof answer.selectedOption !== "string" || typeof answer.correct !== "boolean")))) {
    throw new Error("پاسخ‌های تکلیف در فایل گزارش معتبر نیست");
  }
}

const toBase64 = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};
const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

async function passwordKey(password, salt) {
  if (!globalThis.crypto?.subtle) throw new Error("رمزگذاری فایل در این مرورگر پشتیبانی نمی‌شود");
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 310000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptReport(report, password) {
  validateReport(report);
  if (typeof password !== "string" || password.length < 8) throw new Error("رمز فایل باید حداقل ۸ نویسه باشد");
  if (!globalThis.crypto?.subtle) throw new Error("رمزگذاری فایل در این مرورگر پشتیبانی نمی‌شود");
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const key = await passwordKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(report)));
  return {
    format: REPORT_FORMAT,
    version: FILE_VERSION,
    encrypted: true,
    cipher: "AES-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations: 310000,
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptReport(envelope, password) {
  if (envelope?.format !== REPORT_FORMAT || envelope.version !== FILE_VERSION || envelope.encrypted !== true ||
      envelope.cipher !== "AES-GCM" || envelope.kdf !== "PBKDF2-SHA-256" || envelope.iterations !== 310000 ||
      typeof envelope.salt !== "string" || typeof envelope.iv !== "string" || typeof envelope.data !== "string") {
    throw new Error("قالب یا نسخهٔ فایل رمزگذاری‌شده معتبر نیست");
  }
  let plaintext;
  try {
    const salt = fromBase64(envelope.salt);
    const iv = fromBase64(envelope.iv);
    const data = fromBase64(envelope.data);
    if (salt.length !== 16 || iv.length !== 12 || data.length < 16 || data.length > MAX_FILE_BYTES) {
      throw new Error("اندازهٔ داده نامعتبر است");
    }
    const key = await passwordKey(password, salt);
    plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  } catch {
    throw new Error("رمز اشتباه است یا فایل دست‌کاری/خراب شده است");
  }
  let report;
  try {
    report = JSON.parse(new TextDecoder().decode(plaintext));
  } catch {
    throw new Error("محتوای گزارش رمزگشایی‌شده معتبر نیست");
  }
  validateReport(report);
  return report;
}

export const classroom = {
  state: (userId) => currentState(userId),
  save(state) {
    const normalized = normalizeState(state);
    save(KEY, normalized);
    return normalized;
  },
  student: () => parse(STUDENT_KEY, null),
  setLocalStudentAccount(user) {
    if (user?.role !== "student" || !user.id || !text(user.firstName) || !text(user.lastName)) return null;
    const previous = this.student();
    if (previous?.userId === user.id && previous?.student?.id === user.id) {
      const updated = {
        ...previous,
        student: {
          ...previous.student, firstName: text(user.firstName), lastName: text(user.lastName),
          name: `${text(user.firstName)} ${text(user.lastName)}`,
        },
      };
      save(STUDENT_KEY, updated);
      return updated;
    }
    if (previous?.userId === user.id && previous?.classroom?.id) return previous;
    const localProfile = {
      format: "klassyar-local-student-profile",
      version: FILE_VERSION,
      unassigned: true,
      userId: user.id,
      classroom: null,
      teacher: null,
      student: {
        id: user.id, firstName: text(user.firstName), lastName: text(user.lastName),
        name: `${text(user.firstName)} ${text(user.lastName)}`,
        nationalId: text(user.nationalId) || "",
      },
      currentCycleId: previous?.userId === user.id ? previous.currentCycleId : makeId(),
      localCycles: previous?.userId === user.id ? previous.localCycles || [] : [],
      assignments: [],
    };
    save(STUDENT_KEY, localProfile);
    return localProfile;
  },
  returnedReports: () => {
    const reports = parse(RETURN_KEY, []);
    return Array.isArray(reports) ? reports : [];
  },
  assignmentAnswers: (assignmentId) => {
    const answers = parse(ANSWER_KEY, []);
    return Array.isArray(answers) ? answers.find((item) => item.assignmentId === assignmentId) || null : null;
  },
  results: () => {
    const result = parse(RESULT_KEY, []);
    return Array.isArray(result) ? result : [];
  },
  setTeacherProfile(user, profile) {
    if (!user?.id || !validName(profile)) throw new Error("نام و نام خانوادگی معلم الزامی است");
    const state = currentState(user.id);
    state.teacherId = user.id;
    state.teacher = {
      firstName: text(profile.firstName),
      lastName: text(profile.lastName),
      nationalId: text(profile.nationalId) || "",
      name: `${text(profile.firstName)} ${text(profile.lastName)}`,
      username: user.username || "",
    };
    state.classes.forEach((item) => { item.teacherName = state.teacher.name; });
    save(KEY, state);
    return state;
  },
  updateClass(classId, details, userId) {
    const state = currentState(userId);
    const target = ensureClass(state, classId);
    target.name = text(details.name) || target.name;
    target.subject = text(details.subject);
    target.grade = text(details.grade);
    target.teacherName = state.teacher?.name || "";
    save(KEY, state);
    return target;
  },
  createClass(name, userId) {
    const state = currentState(userId);
    if (!text(name)) throw new Error("نام کلاس الزامی است");
    if (userId) state.teacherId = userId;
    const now = new Date().toISOString();
    const record = {
      id: makeId(), name: text(name), createdAt: now, students: [], reports: [],
      assignments: [], evaluations: {},
      assignmentAnswers: [],
      teacherQuestions: [],
      cycles: [{ id: makeId(), name: "دورهٔ اول", startedAt: now, endedAt: null, status: "active" }],
    };
    state.classes.push(record);
    save(KEY, state);
    return record;
  },
  addStudent(classId, profile, userId) {
    if (!validName(profile)) throw new Error("نام و نام خانوادگی دانش‌آموز الزامی است");
    const state = currentState(userId);
    const target = ensureClass(state, classId);
    const student = {
      id: makeId(), firstName: text(profile.firstName), lastName: text(profile.lastName),
      name: `${text(profile.firstName)} ${text(profile.lastName)}`,
      fatherName: text(profile.fatherName),
      nationalId: text(profile.nationalId) || "",
      className: target.name,
      teacherName: state.teacher?.name || "",
      subject: target.subject || "",
      grade: target.grade || "",
      accessCode: `${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };
    target.students.push(student);
    save(KEY, state);
    return { class: target, student };
  },
  invitation(classroomRecord, student, teacher) {
    return {
      format: INVITATION_FORMAT, version: FILE_VERSION, createdAt: new Date().toISOString(),
      classroom: { id: classroomRecord.id, name: classroomRecord.name },
      student: {
        id: student.id, firstName: student.firstName, lastName: student.lastName,
        name: student.name, fatherName: student.fatherName || "",
        nationalId: student.nationalId || "", className: classroomRecord.name,
        teacherName: teacher?.name || "معلم", subject: classroomRecord.subject || "",
        grade: classroomRecord.grade || "", accessCode: student.accessCode,
      },
      teacher: { name: teacher?.name || "معلم" },
      cycleId: classroomRecord.cycles?.find((cycle) => cycle.status === "active")?.id || null,
      assignments: classroomRecord.assignments.filter((item) => item.studentIds.includes(student.id)),
    };
  },
  activate(invitation, user) {
    const previous = this.student();
    let inviteStudent = invitation?.student;
    if (inviteStudent && !validName(inviteStudent) && typeof inviteStudent.name === "string") {
      const parts = inviteStudent.name.trim().split(/\s+/);
      inviteStudent = {
        ...inviteStudent, firstName: parts.shift() || "", lastName: parts.join(" "),
      };
    }
    if (invitation?.format !== INVITATION_FORMAT || invitation.version !== FILE_VERSION ||
        !invitation.classroom?.id || !inviteStudent?.id || !validName(inviteStudent) ||
        typeof invitation.classroom.name !== "string" ||
        (inviteStudent.fatherName !== undefined && typeof inviteStudent.fatherName !== "string")) {
      throw new Error("ساختار یا نسخهٔ دعوت‌نامهٔ کلاس‌یار معتبر نیست");
    }
    const assignments = Array.isArray(invitation.assignments) ? invitation.assignments.map((item) => {
      if (Array.isArray(item.questions) && item.questions.every((question) => typeof question === "string")) {
        return {
          ...item,
          questions: item.questions.map((prompt) => ({
            prompt,
            options: ["انجام دادم", "هنوز نیاز به تمرین دارم"],
            correctIndex: 0,
            feedback: "این پاسخ را با معلم خود مرور کنید.",
          })),
        };
      }
      return item;
    }) : [];
    if (invitation.assignments !== undefined &&
        (!Array.isArray(assignments) || assignments.length > 200 ||
         assignments.some((item) => !item || typeof item.id !== "string" ||
           !text(item.title) || !Array.isArray(item.questions) ||
           item.questions.some((question) => !question || !text(question.prompt) ||
             !Array.isArray(question.options) || question.options.length < 2 ||
             question.options.some((option) => typeof option !== "string" || !option.trim()) ||
             !Number.isInteger(question.correctIndex) || question.correctIndex < 0 ||
             question.correctIndex >= question.options.length || typeof question.feedback !== "string") ||
           !Array.isArray(item.studentIds) || !item.studentIds.includes(invitation.student.id)))) {
      throw new Error("تکلیف‌های داخل دعوت‌نامه معتبر نیستند");
    }
    const sameStudentClass = previous?.student?.id === inviteStudent.id &&
      previous?.classroom?.id === invitation.classroom.id;
    const sameLocalAccount = Boolean(user?.id && previous?.userId === user.id);
    const currentCycleId = sameStudentClass
      ? invitation.cycleId && invitation.cycleId !== previous.cycleId
        ? invitation.cycleId
        : previous.currentCycleId || invitation.cycleId || makeId()
      : invitation.cycleId || makeId();
    const currentAssignments = assignments.map((item) => ({ ...item, cycleId: currentCycleId }));
    const profile = {
      ...invitation,
      student: inviteStudent,
      userId: user?.id || null,
      activatedAt: new Date().toISOString(),
      currentCycleId,
      localCycles: sameStudentClass || sameLocalAccount
        ? previous.localCycles || []
        : [],
      assignments: currentAssignments,
    };
    save(STUDENT_KEY, profile);
    return profile;
  },
  recordResult(result) {
    const student = this.student();
    if (!student?.student?.id || !validName(student.student)) return false;
    const results = this.results();
    results.push({
      id: makeId(), ...result,
      studentId: student.student.id, classId: student.classroom?.id || null,
      cycleId: student.currentCycleId || student.cycleId || null, recordedAt: new Date().toISOString(),
    });
    save(RESULT_KEY, results.slice(-2000));
    return true;
  },
  report() {
    const student = this.student();
    if (!student?.student?.id || !validName(student.student)) {
      throw new Error("ابتدا با حساب دانش‌آموزی دارای نام و نام خانوادگی وارد شوید");
    }
    const answers = parse(ANSWER_KEY, []);
    const unassigned = !student.classroom?.id;
    return {
      format: REPORT_FORMAT, version: FILE_VERSION, reportType: "student",
      unassigned,
      cycleId: student.currentCycleId || student.cycleId || null,
      exportedAt: new Date().toISOString(), classroom: student.classroom || null, student: student.student,
      sourceStudentId: student.userId || student.student.id,
      results: this.results().filter((item) => item.studentId === student.student.id &&
        item.classId === (student.classroom?.id || null) && item.cycleId === (student.currentCycleId || student.cycleId || null)),
      assignmentAnswers: (unassigned ? [] : (Array.isArray(answers) ? answers : [])
        .filter((item) => item.studentId === student.student.id && item.classId === student.classroom.id &&
          item.cycleId === (student.currentCycleId || student.cycleId || null))
        .map((item) => ({
          ...item,
          answers: item.answers.map((answer) => typeof answer === "string"
            ? { choiceIndex: 0, selectedOption: answer, correct: false }
            : answer),
        }))),
    };
  },
  importReport(report, userId, mapping = {}) {
    validateReport(report);
    if (report.reportType !== "student") throw new Error("این فایل کارنامهٔ بازگشتی معلم است؛ در بخش دانش‌آموز واردش کنید");
    const state = currentState(userId);
    const isUnassigned = report.unassigned === true && !report.classroom?.id;
    const targetClassId = isUnassigned ? mapping.classId : report.classroom.id;
    const target = state.classes.find((item) => item.id === targetClassId);
    if (!target) throw new Error("این گزارش متعلق به هیچ‌یک از کلاس‌های این دستگاه نیست");
    let student;
    if (isUnassigned) {
      if (!text(report.student.firstName) || !text(report.student.lastName)) {
        throw new Error("گزارش دانش‌آموز مستقل باید شامل نام و نام خانوادگی باشد");
      }
      if (mapping.studentId === "__new__") {
        if (target.students.some((item) => item.sourceStudentIds?.includes(report.student.id))) {
          throw new Error("این گزارش دانش‌آموزی قبلاً به همین کلاس متصل شده است؛ همان پروفایل موجود را انتخاب کنید");
        }
        student = {
          id: makeId(), firstName: text(report.student.firstName), lastName: text(report.student.lastName),
          fatherName: "", name: `${text(report.student.firstName)} ${text(report.student.lastName)}`,
          nationalId: text(report.student.nationalId), accessCode: "", createdAt: new Date().toISOString(),
          sourceStudentIds: [report.student.id],
        };
        target.students.push(student);
      } else {
        student = target.students.find((item) => item.id === mapping.studentId);
        if (!student) throw new Error("برای گزارش مستقل، دانش‌آموز موجود را انتخاب کنید یا «ساخت پروفایل تازه» را برگزینید");
        if (student.sourceStudentIds?.length && !student.sourceStudentIds.includes(report.student.id)) {
          throw new Error("این پروفایل قبلاً به حساب دانش‌آموز دیگری متصل شده است؛ برای جلوگیری از ادغام، پروفایل تازه بسازید");
        }
        student.sourceStudentIds = [...new Set([...(student.sourceStudentIds || []), report.student.id])];
      }
    } else {
      student = target.students.find((item) => item.id === report.student.id);
      if (!student) throw new Error("دانش‌آموز گزارش در فهرست این کلاس نیست");
      if (report.sourceStudentId && report.sourceStudentId !== report.student.id) {
        if (student.sourceStudentIds?.length && !student.sourceStudentIds.includes(report.sourceStudentId)) {
          throw new Error("گزارش به حساب دانش‌آموز دیگری متصل است");
        }
        student.sourceStudentIds = [...new Set([...(student.sourceStudentIds || []), report.sourceStudentId])];
      }
    }
    if (report.results.some((item) => item.studentId !== report.student.id ||
      (isUnassigned ? item.classId !== null : item.classId !== target.id))) {
      throw new Error("گزارش شامل فعالیت متعلق به پروفایل دیگری است");
    }
    const incomingCycleId = report.cycleId || report.results[0]?.cycleId || null;
    let cycle = target.cycles.find((item) => item.id === incomingCycleId);
    if (!cycle) cycle = target.cycles.find((item) => item.status === "active") || target.cycles[0];
    if (incomingCycleId && cycle) {
        const mapKey = `${student.id}:${incomingCycleId}`;
      const cycleMap = target.studentCycleMap || {};
      if (cycleMap[mapKey] && cycleMap[mapKey] !== cycle.id) {
        cycle = target.cycles.find((item) => item.id === cycleMap[mapKey]) || cycle;
      } else {
        cycleMap[mapKey] = cycle.id;
        target.studentCycleMap = cycleMap;
      }
    }
    if (report.results.some((item) => item.cycleId && incomingCycleId && item.cycleId !== incomingCycleId)) {
      throw new Error("گزارش عملکرد شامل بیش از یک دوره است");
    }
    const assignmentAnswers = report.assignmentAnswers || [];
    if (!isUnassigned && assignmentAnswers.some((item) => {
      const assignment = target.assignments.find((entry) => entry.id === item.assignmentId);
      return item.studentId !== report.student.id || item.classId !== target.id ||
        !assignment || !assignment.studentIds.includes(report.student.id);
    })) throw new Error("پاسخ تکلیف در این کلاس یا برای این دانش‌آموز ثبت نشده است");
    const existing = new Set(target.reports.map((item) => item.id));
    const additions = report.results.filter((item) => !existing.has(isUnassigned ? `${student.id}:${item.id}` : item.id)).map((item) => ({
      ...item,
      id: isUnassigned ? `${student.id}:${item.id}` : item.id,
      studentId: student.id, classId: target.id,
      cycleId: cycle?.id || item.cycleId || null, sourceCycleId: incomingCycleId,
    }));
    target.reports = [...target.reports, ...additions];
    let answersImported = 0;
    for (const answer of (isUnassigned ? [] : assignmentAnswers)) {
      const index = target.assignmentAnswers.findIndex((item) => item.assignmentId === answer.assignmentId && item.studentId === answer.studentId);
      const importedAnswer = { ...answer, cycleId: cycle?.id || answer.cycleId || null };
      if (index < 0) {
        target.assignmentAnswers.push(importedAnswer);
        answersImported += 1;
      } else if (new Date(answer.updatedAt).getTime() > new Date(target.assignmentAnswers[index].updatedAt).getTime()) {
        target.assignmentAnswers[index] = importedAnswer;
        answersImported += 1;
      }
    }
    state.imports = [{
      id: makeId(), at: new Date().toISOString(), classId: target.id,
      studentId: student.id, studentName: student.name, count: additions.length, answersImported,
      sourceCycleId: incomingCycleId, unassigned: isUnassigned,
      exportedAt: report.exportedAt || null,
    }, ...state.imports].slice(0, 200);
    save(KEY, state);
    return { class: target, imported: additions.length, answersImported, student, cycle };
  },
  createTeacherReport(classId, studentId, cycleId, userId) {
    const state = currentState(userId);
    const target = ensureClass(state, classId);
    const student = target.students.find((item) => item.id === studentId);
    const cycle = target.cycles.find((item) => item.id === cycleId);
    if (!student || !cycle) throw new Error("دانش‌آموز یا دورهٔ گزارش پیدا نشد");
    const evaluation = target.evaluations[`${cycle.id}:${student.id}`];
    if (!evaluation || !RATINGS.includes(evaluation.rating)) {
      throw new Error("برای این دانش‌آموز و دوره ابتدا سطح ارزیابی را ثبت کنید");
    }
    const latestImport = state.imports.find((item) =>
      item.classId === target.id && item.studentId === student.id && item.sourceCycleId &&
      (target.studentCycleMap?.[`${student.id}:${item.sourceCycleId}`] || item.sourceCycleId) === cycle.id);
    const sourceCycleId = latestImport?.sourceCycleId || cycle.id;
    const results = target.reports.filter((item) => item.studentId === student.id && item.cycleId === cycle.id);
    const answers = (target.assignmentAnswers || []).filter((item) =>
      item.studentId === student.id && item.cycleId === cycle.id).map((item) => {
      const assignment = target.assignments.find((entry) => entry.id === item.assignmentId);
      return {
        title: assignment?.title || "تکلیف",
        questions: (assignment?.questions || []).map((question) =>
          typeof question === "string" ? { prompt: question } : question),
        answers: item.answers.map((answer) =>
          typeof answer === "string" ? answer : answer?.selectedOption || ""),
      };
    });
    const average = results.length
      ? Math.round(results.reduce((sum, item) => sum + item.percent, 0) / results.length)
      : 0;
    return {
      format: REPORT_FORMAT, version: FILE_VERSION, reportType: "teacher",
      responseId: makeId(), issuedAt: new Date().toISOString(),
      unassignedSource: Boolean(latestImport?.unassigned),
      classroom: { id: target.id, name: target.name },
      student: {
        id: student.id, firstName: student.firstName, lastName: student.lastName,
        name: student.name, fatherName: student.fatherName || "",
      },
      sourceStudentId: student.sourceStudentIds?.[0] || student.id,
      teacher: { name: target.teacherName || state.teacher?.name || "معلم" },
      subject: target.subject || "", grade: target.grade || "",
      cycle: { id: cycle.id, name: cycle.name },
      sourceCycleId,
      average,
      results,
      assignmentAnswers: answers,
      evaluation: { rating: evaluation.rating, comment: evaluation.comment || "" },
    };
  },
  async createTeacherReturnFiles(classId, studentIds, cycleId, userId, password) {
    if (!Array.isArray(studentIds) || !studentIds.length) throw new Error("حداقل یک دانش‌آموز را انتخاب کنید");
    const reports = studentIds.map((studentId) =>
      this.createTeacherReport(classId, studentId, cycleId, userId));
    const files = await Promise.all(reports.map((report) => encryptReport(report, password)));
    return reports.map((report, index) => ({ report, file: files[index] }));
  },
  importTeacherReport(report) {
    validateReport(report);
    if (report.reportType !== "teacher") throw new Error("این فایل عملکرد دانش‌آموز است؛ باید آن را معلم وارد کند");
    const profile = this.student();
    const reportSourceStudentId = report.sourceStudentId || report.student.id;
    const studentIdentityMatches = reportSourceStudentId === profile?.student?.id ||
      report.student.id === profile?.student?.id;
    const classMatches = profile?.classroom?.id
      ? profile.classroom.id === report.classroom.id
      : report.unassignedSource === true;
    if (!profile || !studentIdentityMatches || !classMatches) {
      throw new Error("کارنامهٔ بازگشتی برای پروفایل دانش‌آموز فعال نیست");
    }
    if (!profile.localCycles?.some((cycle) => cycle.id === report.sourceCycleId)) {
      throw new Error("این کارنامه به هیچ‌یک از دوره‌های ارسالی این پروفایل مربوط نیست");
    }
    const history = this.returnedReports();
    if (history.some((item) => item.responseId === report.responseId)) {
      throw new Error("این کارنامه قبلاً وارد شده است");
    }
    const saved = { ...report, receivedAt: new Date().toISOString() };
    save(RETURN_KEY, [...history, saved].slice(-100));
    return saved;
  },
  archiveStudentCycle(report) {
    const student = this.student();
    if (!student || report?.student?.id !== student.student.id || report?.reportType !== "student") {
      throw new Error("چرخهٔ عملکرد قابل بایگانی نیست");
    }
    const sourceCycleId = student.currentCycleId || student.cycleId || null;
    const nextCycleId = makeId();
    const cycles = Array.isArray(student.localCycles) ? student.localCycles : [];
    if (!cycles.some((cycle) => cycle.id === sourceCycleId)) {
      cycles.push({
        id: sourceCycleId, name: `دورهٔ ارسالی ${cycles.length + 1}`,
        status: "archived", exportedAt: new Date().toISOString(), resultCount: report.results.length,
      });
    }
    const updated = { ...student, localCycles: cycles, currentCycleId: nextCycleId };
    save(STUDENT_KEY, updated);
    return updated;
  },
  submitAssignment(assignmentId, answers) {
    const student = this.student();
    if (!student) throw new Error("ابتدا دعوت‌نامهٔ کلاس را وارد کنید");
    const assignment = (student.assignments || []).find((item) => item.id === assignmentId);
    if (!assignment || !Array.isArray(answers) || answers.length !== assignment.questions.length ||
        answers.some((answer) => !answer || !Number.isInteger(answer.choiceIndex) ||
          typeof answer.selectedOption !== "string" || typeof answer.correct !== "boolean")) {
      throw new Error("تکلیف یا پاسخ‌های واردشده معتبر نیست");
    }
    const records = parse(ANSWER_KEY, []);
    const next = {
      assignmentId, studentId: student.student.id, classId: student.classroom.id,
      cycleId: assignment.cycleId || student.cycleId || null,
      answers: answers.map((answer, index) => {
        const question = assignment.questions[index];
        if (!Number.isInteger(answer.choiceIndex) || answer.choiceIndex < 0 ||
            answer.choiceIndex >= question.options.length ||
            answer.selectedOption !== question.options[answer.choiceIndex] ||
            answer.correct !== (answer.choiceIndex === question.correctIndex)) {
          throw new Error("یکی از پاسخ‌های انتخاب‌شده معتبر نیست");
        }
        return answer;
      }),
      updatedAt: new Date().toISOString(),
    };
    const list = Array.isArray(records) ? records : [];
    const index = list.findIndex((item) => item.assignmentId === assignmentId && item.studentId === student.student.id);
    if (index < 0) list.push(next);
    else list[index] = next;
    save(ANSWER_KEY, list.slice(-1000));
    return next;
  },
  addAssignment(classId, assignment, userId) {
    const state = currentState(userId);
    const target = ensureClass(state, classId);
    if (!text(assignment.title) || !Array.isArray(assignment.studentIds) || !assignment.studentIds.length) {
      throw new Error("عنوان تکلیف و دست‌کم یک دانش‌آموز را انتخاب کنید");
    }
    if (!assignment.studentIds.every((id) => target.students.some((student) => student.id === id))) {
      throw new Error("دانش‌آموز انتخاب‌شده به این کلاس تعلق ندارد");
    }
    if (!Array.isArray(assignment.questions) || assignment.questions.length > 100 ||
        assignment.questions.some((question) => !question || !text(question.prompt) ||
          !Array.isArray(question.options) || question.options.length < 2 || question.options.length > 6 ||
          question.options.some((option) => !text(option)) ||
          !Number.isInteger(question.correctIndex) || question.correctIndex < 0 ||
          question.correctIndex >= question.options.length || typeof question.feedback !== "string")) {
      throw new Error("هر سوال باید متن، حداقل دو گزینه، پاسخ درست و بازخورد داشته باشد");
    }
    const record = {
      id: makeId(), title: text(assignment.title), gameId: text(assignment.gameId),
      gameTitle: text(assignment.gameTitle), studentIds: assignment.studentIds,
      questions: assignment.questions.map((question) => ({
        prompt: text(question.prompt),
        options: question.options.map(text),
        correctIndex: question.correctIndex,
        feedback: text(question.feedback),
      })),
      createdAt: new Date().toISOString(), cycleId: target.cycles.find((cycle) => cycle.status === "active")?.id || null,
    };
    target.assignments.push(record);
    save(KEY, state);
    return record;
  },
  addTeacherQuestion(classId, teacherQuestion, userId) {
    const state = currentState(userId);
    const target = ensureClass(state, classId);
    const gameId = text(teacherQuestion?.gameId);
    const engine = teacherQuestion?.engine || "quiz";
    const scope = teacherQuestion?.scope === "selected" ? "selected" : "all";
    const question = teacherQuestion?.question ?? teacherQuestion;
    if (!gameId) throw new Error("شناسهٔ بازی برای سؤال معلم الزامی است");
    if (!text(teacherQuestion?.gameTitle) && !text(teacherQuestion?.title)) throw new Error("عنوان بازی سؤال معلم الزامی است");
    if (scope === "selected" && (!Array.isArray(teacherQuestion?.studentIds) || !teacherQuestion.studentIds.length)) {
      throw new Error("برای ارسال سؤال به دانش‌آموزان انتخاب‌شده، دست‌کم یک دانش‌آموز را انتخاب کنید");
    }
    if (scope === "selected" && !teacherQuestion.studentIds.every((id) => target.students.some((student) => student.id === id))) {
      throw new Error("دانش‌آموز انتخاب‌شده به این کلاس تعلق ندارد");
    }

    const normalizedStudentIds = scope === "selected"
      ? [...new Set(teacherQuestion.studentIds)]
      : target.students.map((student) => student.id);

    if (engine === "quiz") {
      if (!question || typeof question.question !== "string" || !text(question.question) ||
          !Array.isArray(question.options) || question.options.length < 2 ||
          question.options.some((option) => typeof option !== "string" || !text(option)) ||
          !Number.isInteger(question.correctIndex) || question.correctIndex < 0 ||
          question.correctIndex >= question.options.length) {
        throw new Error("سؤال چهارگزینه‌ای معلم باید متن سؤال، حداقل دو گزینه و پاسخ درست معتبر داشته باشد");
      }
    } else if (engine === "match" || engine === "memory") {
      if (!question || !(text(question.text) || text(question.emoji) || question.id)) {
        throw new Error("سؤال تطبیق معلم باید متن یا اموجی و شناسهٔ معتبر داشته باشد");
      }
    } else if (engine === "sort") {
      if (!question || !text(question.label) || !text(question.category)) {
        throw new Error("سؤال مرتب‌سازی معلم باید برچسب و دستهٔ معتبر داشته باشد");
      }
    } else if (engine === "scramble") {
      if (!question || !text(question.answer) || (!text(question.hint) && !text(question.scrambled))) {
        throw new Error("سؤال به‌هم‌ریختگی معلم باید پاسخ و حداقل راهنما یا حروفِ درهم‌ریخته داشته باشد");
      }
    } else if (engine === "type" || engine === "fillblank") {
      if (!question || !text(question.answer) || (!text(question.hint) && !text(question.text) && !text(question.question))) {
        throw new Error("سؤال تایپ/جای خالی معلم باید پاسخ و متن یا راهنما داشته باشد");
      }
    } else {
      throw new Error("نوع بازی انتخاب‌شده برای سؤال معلم معتبر نیست");
    }

    const record = {
      id: makeId(),
      gameId,
      gameTitle: text(teacherQuestion.gameTitle || teacherQuestion.title),
      engine,
      question: {
        ...question,
        ...(question.id ? {} : { id: makeId() }),
      },
      scope,
      studentIds: normalizedStudentIds,
      createdAt: new Date().toISOString(),
      cycleId: target.cycles.find((cycle) => cycle.status === "active")?.id || null,
    };
    target.teacherQuestions.push(record);
    save(KEY, state);
    return record;
  },
  getTeacherQuestionsForGame(gameId, userId) {
    const state = currentState(userId);
    const studentProfile = parse(STUDENT_KEY, null);
    const studentClassId = studentProfile?.classroom?.id || null;
    const matches = [];
    const addMatch = (classId) => {
      const target = state.classes.find((item) => item.id === classId);
      if (!target) return;
      target.teacherQuestions.forEach((question) => {
        if (question.gameId !== gameId) return;
        if (question.scope === "selected") {
          const allowed = Array.isArray(question.studentIds) ? question.studentIds : [];
          if (!studentProfile?.student?.id || !allowed.includes(studentProfile.student.id)) return;
        }
        matches.push(question);
      });
    };
    if (studentClassId) addMatch(studentClassId);
    if (!matches.length) {
      state.classes.forEach((item) => {
        if (item.id === studentClassId) return;
        item.teacherQuestions.forEach((question) => {
          if (question.gameId !== gameId) return;
          if (question.scope === "selected") {
            const allowed = Array.isArray(question.studentIds) ? question.studentIds : [];
            if (studentProfile?.student?.id && !allowed.includes(studentProfile.student.id)) return;
          }
          matches.push(question);
        });
      });
    }
    return [...new Map(matches.map((question) => [question.id, question])).values()];
  },
  addCycle(classId, name, userId) {
    const state = currentState(userId);
    const target = ensureClass(state, classId);
    if (!text(name)) throw new Error("نام دوره الزامی است");
    const now = new Date().toISOString();
    target.cycles.forEach((cycle) => {
      if (cycle.status === "active") {
        cycle.status = "closed";
        cycle.endedAt = now;
      }
    });
    const cycle = { id: makeId(), name: text(name), startedAt: now, endedAt: null, status: "active" };
    target.cycles.push(cycle);
    save(KEY, state);
    return cycle;
  },
  evaluate(classId, studentId, cycleId, rating, comment, userId) {
    if (!RATINGS.includes(rating)) throw new Error("سطح ارزیابی انتخاب‌شده معتبر نیست");
    const state = currentState(userId);
    const target = ensureClass(state, classId);
    if (!target.students.some((student) => student.id === studentId)) throw new Error("دانش‌آموز پیدا نشد");
    const cycle = target.cycles.find((item) => item.id === cycleId);
    if (!cycle) throw new Error("دورهٔ گزارش پیدا نشد");
    target.evaluations[`${cycleId}:${studentId}`] = {
      rating, comment: text(comment), updatedAt: new Date().toISOString(),
    };
    save(KEY, state);
  },
};

export const reportRatingLabels = {
  excellent: "عالی", good: "خوب", developing: "خیلی خوب", "needs-practice": "نیاز به تلاش",
};

export function downloadJson(data, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function readJsonFile(file) {
  if (!file || file.size > MAX_FILE_BYTES) return Promise.reject(new Error("فایل انتخاب‌شده خالی یا بزرگ‌تر از ۵ مگابایت است"));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خواندن فایل ناموفق بود"));
    reader.onload = () => {
      try {
        const value = JSON.parse(reader.result);
        if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
        resolve(value);
      } catch {
        reject(new Error("فایل JSON معتبر نیست"));
      }
    };
    reader.readAsText(file, "utf-8");
  });
}

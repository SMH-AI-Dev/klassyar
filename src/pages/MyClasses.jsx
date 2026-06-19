import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, Copy, Check, UserPlus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/lib/sonner";

export default function MyClasses() {
  const [step, setStep] = useState("main");
  const [teacherName, setTeacherName] = useState("");
  const [studentData, setStudentData] = useState({ 
    firstName: "", 
    lastName: "", 
    phone: "", 
    email: "" 
  });
  const [newClass, setNewClass] = useState({ name: "", description: "" });
  const [copiedCode, setCopiedCode] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: classes, isLoading } = useQuery({
    queryKey: ['myClasses'],
    queryFn: async () => {
      const me = await base44.auth.me();
      return base44.entities.Class.filter({ teacher_id: me.id });
    },
    initialData: [],
  });

  const createClassMutation = useMutation({
    mutationFn: async (classData) => {
      const me = await base44.auth.me();
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      return base44.entities.Class.create({
        ...classData,
        teacher_id: me.id,
        teacher_name: teacherName,
        code,
        color: 'sky'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClasses'] });
      setNewClass({ name: "", description: "" });
      setTeacherName("");
      setStudentData({ firstName: "", lastName: "", phone: "", email: "" });
      setStep("main");
      toast.success("کلاس با موفقیت ایجاد شد");
    },
    onError: (error) => {
      toast.error("خطا در ایجاد کلاس");
    }
  });

  const addStudentMutation = useMutation({
    mutationFn: async ({ classId, firstName, lastName, phone, email }) => {
      const classItem = classes.find(c => c.id === classId);
      const students = classItem.students || [];
      
      if ((email || phone) && students.some(s => s.phone === phone || s.email === email)) {
        throw new Error("این دانش‌آموز قبلاً اضافه شده است");
      }

      const newStudents = [...students, {
        firstName,
        lastName,
        phone,
        email,
        joined_date: new Date().toISOString()
      }];

      return base44.entities.Class.update(classId, { students: newStudents });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClasses'] });
      setShowAddStudent(null);
      setStudentData({ firstName: "", lastName: "", phone: "", email: "" });
      toast.success("دانش‌آموز اضافه شد");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async ({ classId, studentIndex }) => {
      const classItem = classes.find(c => c.id === classId);
      const students = classItem.students.filter((_, i) => i !== studentIndex);
      return base44.entities.Class.update(classId, { students });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClasses'] });
      toast.success("دانش‌آموز حذف شد");
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (classId) => {
      return base44.entities.Class.delete(classId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myClasses'] });
      toast.success("کلاس حذف شد");
    },
  });

  const handleContinueToClassForm = () => {
    if (studentData.firstName && studentData.lastName && (studentData.phone || studentData.email)) {
      setStep("class-form");
    }
  };

  const handleCreateClass = () => {
    if (newClass.name) {
      createClassMutation.mutate({
        ...newClass,
        students: [{
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          phone: studentData.phone,
          email: studentData.email,
          joined_date: new Date().toISOString()
        }]
      });
    }
  };

  const handleAddStudent = (classId) => {
    if (!studentData.firstName || !studentData.lastName || (!studentData.phone && !studentData.email)) {
      toast.warning('نام، نام خانوادگی و حداقل شماره یا ایمیل دانش‌آموز لازم است.');
      return;
    }

    addStudentMutation.mutate({
      classId,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      phone: studentData.phone,
      email: studentData.email
    });
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (step === "main") {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">کلاس‌های من</h1>
            <p className="text-gray-600 text-lg">مدیریت کلاس‌ها و دانش‌آموزان</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card 
                onClick={() => setStep("teacher-name")}
                onKeyDown={(e) => e.key === 'Enter' && setStep("teacher-name")}
                tabIndex={0}
                className="clay-element bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 cursor-pointer h-full hover:shadow-lg transition-all"
              >
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">کلاس جدید</h3>
                  <p className="text-gray-600">یک کلاس جدید ایجاد کنید</p>
                </CardContent>
              </Card>
            </motion.div>

            {classes.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="clay-element bg-white border-0 h-full shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-gray-800">
                          {classItem.name}
                        </CardTitle>
                        <p className="text-gray-600 text-sm mt-1">
                          👨‍🏫 {classItem.teacher_name || "بدون نام"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteClassMutation.mutate(classItem.id)}
                        className="hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {classItem.description && (
                      <p className="text-gray-600">{classItem.description}</p>
                    )}
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">کد کلاس:</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-3 py-2 rounded border border-gray-300 font-mono font-bold text-purple-600">
                          {classItem.code}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyCode(classItem.code)}
                        >
                          {copiedCode === classItem.code ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          دانش‌آموزان ({classItem.students?.length || 0})
                        </h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowAddStudent(classItem.id)}
                        >
                          <UserPlus className="w-4 h-4 ml-2" />
                          افزودن
                        </Button>
                      </div>

                      {classItem.students && classItem.students.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {classItem.students.map((student, sIdx) => (
                            <motion.div
                              key={sIdx}
                              layout
                              className="bg-gray-50 p-3 rounded-lg flex justify-between items-start hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                  {student.firstName} {student.lastName}
                                </p>
                                {student.phone && (
                                  <p className="text-sm text-gray-600">📱 {student.phone}</p>
                                )}
                                {student.email && (
                                  <p className="text-sm text-gray-600">📧 {student.email}</p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteStudentMutation.mutate({
                                  classId: classItem.id,
                                  studentIndex: sIdx
                                })}
                                className="hover:bg-red-100"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm py-2">هنوز دانش‌آموزی اضافه نشده</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showAddStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAddStudent(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-md w-full clay-element"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">دانش‌آموز جدید</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddStudent(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>نام *</Label>
                    <Input
                      placeholder="نام دانش‌آموز"
                      value={studentData.firstName}
                      onChange={(e) => setStudentData({ ...studentData, firstName: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>نام خانوادگی *</Label>
                    <Input
                      placeholder="نام خانوادگی"
                      value={studentData.lastName}
                      onChange={(e) => setStudentData({ ...studentData, lastName: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>شماره تماس</Label>
                    <Input
                      placeholder="شماره تماس"
                      value={studentData.phone}
                      onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>ایمیل</Label>
                    <Input
                      placeholder="ایمیل"
                      type="email"
                      value={studentData.email}
                      onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    />
                  </div>

                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    💡 شماره تماس یا ایمیل اجباری است
                  </p>

                  <Button
                    onClick={() => handleAddStudent(showAddStudent)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    افزودن دانش‌آموز
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (step === "teacher-name") {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="clay-element bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-gray-800 text-center">نام معلم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">نام کامل معلم:</Label>
                <Input
                  placeholder="نام و نام خانوادگی"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && teacherName && setStep("student-info")}
                  className="mt-2 text-lg py-3"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("main")}
                  variant="outline"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && setStep("main")}
                >
                  بازگشت
                </Button>
                <Button
                  onClick={() => teacherName && setStep("student-info")}
                  disabled={!teacherName}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && teacherName && setStep("student-info")}
                >
                  ادامه
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (step === "student-info") {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="clay-element bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-gray-800 text-center">اطلاعات دانش‌آموز</CardTitle>
              <p className="text-gray-600 text-center mt-2 text-lg">👨‍🏫 {teacherName}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">نام دانش‌آموز:</Label>
                <Input
                  placeholder="نام دانش‌آموز"
                  value={studentData.firstName}
                  onChange={(e) => setStudentData({ ...studentData, firstName: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && studentData.firstName && document.querySelector('input[placeholder*="نام خانوادگی"]')?.focus()}
                  className="mt-2 text-lg py-3"
                  autoFocus
                />
              </div>

              <div>
                <Label className="text-lg font-semibold">نام خانوادگی دانش‌آموز:</Label>
                <Input
                  placeholder="نام خانوادگی دانش‌آموز"
                  value={studentData.lastName}
                  onChange={(e) => setStudentData({ ...studentData, lastName: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && studentData.lastName && document.querySelector('input[placeholder*="شماره تلفن"]')?.focus()}
                  className="mt-2 text-lg py-3"
                />
              </div>

              <div>
                <Label className="text-lg font-semibold">شماره تلفن دانش‌آموز:</Label>
                <Input
                  placeholder="شماره تلفن دانش‌آموز"
                  value={studentData.phone}
                  onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && studentData.phone && document.querySelector('input[placeholder*="ایمیل"]')?.focus()}
                  className="mt-2 text-lg py-3"
                />
              </div>

              <div>
                <Label className="text-lg font-semibold">ایمیل دانش‌آموز:</Label>
                <Input
                  placeholder="ایمیل دانش‌آموز"
                  type="email"
                  value={studentData.email}
                  onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && studentData.email && handleContinueToClassForm()}
                  className="mt-2 text-lg py-3"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("teacher-name")}
                  variant="outline"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && setStep("teacher-name")}
                >
                  بازگشت
                </Button>
                <Button
                  onClick={handleContinueToClassForm}
                  disabled={!studentData.firstName || !studentData.lastName || (!studentData.phone && !studentData.email)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && studentData.firstName && studentData.lastName && (studentData.phone || studentData.email) && handleContinueToClassForm()}
                >
                  ادامه
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (step === "class-form") {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="clay-element bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-gray-800 text-center">کلاس جدید</CardTitle>
              <p className="text-gray-600 text-center mt-2 text-lg">👨‍🏫 {teacherName}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">نام کلاس:</Label>
                <Input
                  placeholder="مثال: ریاضیات دهم"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="mt-2 text-lg py-3"
                  autoFocus
                />
              </div>

              <div>
                <Label className="text-lg font-semibold">توضیحات (اختیاری):</Label>
                <Textarea
                  placeholder="توضیحات کلاس"
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("teacher-name")}
                  variant="outline"
                  className="flex-1"
                >
                  بازگشت
                </Button>
                <Button
                  onClick={handleCreateClass}
                  disabled={!newClass.name}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  ایجاد کلاس
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
}

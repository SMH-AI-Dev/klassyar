import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function TeacherReports() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <Card className="clay-element bg-white border-0 max-w-md">
        <CardContent className="p-12 text-center">
          <Construction className="w-20 h-20 text-purple-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">گزارشات - در حال توسعه</h2>
          <p className="text-gray-600 mb-6">
            صفحه گزارشات معلم با نمودارها و آمار کامل در فایل Code.1.txt موجود است.
          </p>
          <Button onClick={() => navigate("/Dashboard")} className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl clay-element">
            بازگشت به داشبورد
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

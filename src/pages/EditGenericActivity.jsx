import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Save, Code2 } from "lucide-react";
import { localData } from "@/api/localDataClient";
import { toast } from "@/lib/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditGenericActivity() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const id = searchParams.get("id");
  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: async () => {
      const activities = await localData.entities.Activity.list();
      return activities.find((item) => item.id === id) || null;
    },
    enabled: Boolean(id),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("lavender");
  const [contentText, setContentText] = useState("{}");

  useEffect(() => {
    if (!activity) return;
    setTitle(activity.title || "");
    setDescription(activity.description || "");
    setTheme(activity.theme || "lavender");
    setContentText(JSON.stringify(activity.content || {}, null, 2));
  }, [activity]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!id || !activity) throw new Error("فعالیت پیدا نشد");
      const content = JSON.parse(contentText);
      if (!content || typeof content !== "object" || Array.isArray(content)) {
        throw new Error("محتوای فعالیت باید یک شیء JSON معتبر باشد");
      }
      if (JSON.stringify(content).length > 1500000) {
        throw new Error("حجم محتوای فعالیت بیش از حد مجاز است");
      }
      return localData.entities.Activity.update(id, {
        title: title.trim(),
        description: description.trim(),
        theme,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity", id] });
      toast.success("فعالیت ذخیره شد");
      navigate("/SavedActivities");
    },
    onError: (error) => toast.error(error.message || "ذخیرهٔ فعالیت ناموفق بود"),
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری فعالیت…</div>;
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-bold">فعالیت پیدا نشد</p>
        <Button onClick={() => navigate("/SavedActivities")}>بازگشت به فعالیت‌ها</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">ویرایش ساختاری فعالیت</h1>
            <p className="text-sm text-slate-500">قالب: {activity.type} · ویرایش عمومی برای قالب‌هایی که ویرایشگر اختصاصی ندارند</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/SavedActivities")}>
            <ArrowRight className="ml-2 h-4 w-4" />بازگشت
          </Button>
        </div>

        <Card>
          <CardHeader><CardTitle>مشخصات فعالیت</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="عنوان فعالیت" />
            <Input value={theme} onChange={(event) => setTheme(event.target.value)} placeholder="شناسه پوسته" />
            <div className="md:col-span-2">
              <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="توضیحات" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5" />محتوای فعالیت (JSON)</CardTitle>
            <p className="text-sm text-slate-500">برای ترجمه، متن‌ها را تغییر دهید و نام کلیدها، ساختار آرایه‌ها و شناسه‌های جفت‌ها را حفظ کنید.</p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={contentText}
              onChange={(event) => setContentText(event.target.value)}
              rows={22}
              className="min-h-[420px] font-mono text-left text-sm"
              dir="ltr"
              spellCheck={false}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !title.trim()} className="min-w-40">
            <Save className="ml-2 h-4 w-4" />{saveMutation.isPending ? "در حال ذخیره…" : "ذخیره تغییرات"}
          </Button>
        </div>
      </div>
    </div>
  );
}

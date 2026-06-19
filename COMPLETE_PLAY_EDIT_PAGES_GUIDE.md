# 📚 راهنمای کامل ساخت صفحات Play و Edit

## ✅ وضعیت فعلی

### صفحات Play ساخته شده (5 از 30):
- [x] PlayFlashcard.jsx
- [x] PlayMatching.jsx  
- [x] PlayMemory_game.jsx
- [x] PlayGroup_sort.jsx
- [x] PlayWordsearch.jsx

### صفحات Edit ساخته شده (2 از 30):
- [x] EditFlashcard.jsx
- [x] EditQuiz.jsx

---

## 📋 لیست کامل صفحات مورد نیاز

### Play Pages (25 صفحه باقی‌مانده):
1. PlayQuiz.jsx ✅ (موجود)
2. PlayRandom_wheel.jsx ⚠️ (باید کامل شود)
3. PlayTrue_false.jsx ⚠️ (باید کامل شود)
4. PlayUnjumble.jsx ⚠️ (باید کامل شود)
5. PlayWhack_a_mole.jsx ❌
6. PlayFill_blank.jsx ❌
7. PlayRanking.jsx ❌
8. PlayCrossword.jsx ❌
9. PlayTimeline.jsx ❌
10. PlaySpinner.jsx ❌
11. PlayCard_flip.jsx ❌
12. PlayHotspot.jsx ❌
13. PlayDrag_text.jsx ❌
14. PlayBalloon_pop.jsx ❌
15. PlayGameshow_quiz.jsx ❌
16. PlayMaze_chase.jsx ❌
17. PlayAirplane.jsx ❌
18. PlayOpen_the_box.jsx ❌
19. PlayMissing_word.jsx ❌
20. PlayAnagram.jsx ❌
21. PlayHangman.jsx ❌
22. PlayFlip_tiles.jsx ❌
23. PlayImage_quiz.jsx ❌
24. PlayLabelled_diagram.jsx ❌
25. PlayRandom_cards.jsx ❌

### Edit Pages (28 صفحه باقی‌مانده):
1. EditFlashcard.jsx ✅
2. EditQuiz.jsx ✅
3. EditRandom_wheel.jsx ❌
4. EditMatching.jsx ❌
5. EditMemory_game.jsx ❌
6. EditGroup_sort.jsx ❌
7. EditWordsearch.jsx ❌
8. EditUnjumble.jsx ❌
9. EditWhack_a_mole.jsx ❌
10. EditTrue_false.jsx ❌
11. EditFill_blank.jsx ❌
12. EditRanking.jsx ❌
13. EditCrossword.jsx ❌
14. EditTimeline.jsx ❌
15. EditSpinner.jsx ❌
16. EditCard_flip.jsx ❌
17. EditHotspot.jsx ❌
18. EditDrag_text.jsx ❌
19. EditBalloon_pop.jsx ❌
20. EditGameshow_quiz.jsx ❌
21. EditMaze_chase.jsx ❌
22. EditAirplane.jsx ❌
23. EditOpen_the_box.jsx ❌
24. EditMissing_word.jsx ❌
25. EditAnagram.jsx ❌
26. EditHangman.jsx ❌
27. EditFlip_tiles.jsx ❌
28. EditImage_quiz.jsx ❌
29. EditLabelled_diagram.jsx ❌
30. EditRandom_cards.jsx ❌

---

## 🎯 الگوی استاندارد صفحات Play

### ساختار کلی:
```javascript
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw } from "lucide-react";
import { motion } from "framer-motion";

export default function Play[GameName]() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id');

  // State برای بازی
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // گرفتن اطلاعات فعالیت
  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[رنگ]" />
      </div>
    );
  }

  // Not Found State
  if (!activity || !activity.content) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate("/Dashboard")}>
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  // Complete State
  if (isComplete) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-[رنگ1] to-[رنگ2] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آفرین! 🎉</h2>
            <p className="text-xl text-gray-600 mb-8">پیام تبریک...</p>
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gradient-to-r from-[رنگ1] to-[رنگ2] rounded-xl clay-element"
              >
                <RotateCw className="w-5 h-5 ml-2" />
                شروع دوباره
              </Button>
              <Button
                onClick={() => navigate("/Dashboard")}
                variant="outline"
                className="flex-1 rounded-xl clay-element"
              >
                بازگشت
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main Game UI
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[رنگ1] to-[رنگ2]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate("/Dashboard")}
            variant="outline"
            className="rounded-xl clay-element"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title}</h1>
            <p className="text-gray-600">اطلاعات بازی...</p>
          </div>
          <div className="text-2xl font-bold text-[رنگ]">
            {score}
          </div>
        </div>

        {/* منطق بازی اینجا */}
      </div>
    </div>
  );
}
```

---

## 🛠️ الگوی استاندارد صفحات Edit

### ساختار کلی:
```javascript
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Edit[GameName]() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id');

  const [activity, setActivity] = useState({
    title: "",
    description: "",
    type: "[game_type]",
    theme: "[theme_color]",
    content: {
      // ساختار محتوا بر اساس نوع بازی
    }
  });

  // گرفتن فعالیت موجود
  const { data: existingActivity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
    enabled: !!activityId,
  });

  // لود کردن داده‌های موجود
  useEffect(() => {
    if (existingActivity) {
      setActivity(existingActivity);
    }
  }, [existingActivity]);

  // به‌روزرسانی فعالیت
  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.update(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      navigate("/Dashboard");
    },
  });

  // توابع کمکی (add, remove, update)
  const addItem = () => {
    // افزودن آیتم جدید
  };

  const removeItem = (index) => {
    // حذف آیتم
  };

  const updateItem = (index, field, value) => {
    // به‌روزرسانی آیتم
  };

  const handleSave = () => {
    if (!activity.title) {
      alert("لطفاً عنوان را وارد کنید");
      return;
    }
    updateMutation.mutate(activity);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[رنگ]" />
      </div>
    );
  }

  // Not Found
  if (!existingActivity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate("/Dashboard")}>
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  // Main Edit UI
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/Dashboard")}
              variant="outline"
              size="icon"
              className="rounded-xl clay-element"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">ویرایش [نام بازی]</h1>
              <p className="text-gray-600">توضیح کوتاه...</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-[رنگ1] to-[رنگ2] text-white rounded-xl clay-element"
          >
            <Save className="w-5 h-5 ml-2" />
            {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </motion.div>

        {/* فرم اطلاعات */}
        <Card className="clay-element bg-white/80 border-0 mb-6">
          <CardHeader>
            <CardTitle>اطلاعات فعالیت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عنوان</Label>
              <Input
                value={activity.title}
                onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                placeholder="عنوان فعالیت..."
                className="rounded-xl clay-element"
              />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea
                value={activity.description}
                onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                placeholder="توضیحات..."
                className="rounded-xl clay-element"
              />
            </div>
          </CardContent>
        </Card>

        {/* محتوای خاص بازی */}
        {/* ... */}

        {/* دکمه افزودن */}
        <Button
          onClick={addItem}
          variant="outline"
          className="w-full mt-6 h-16 rounded-2xl clay-element border-2 border-dashed"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن آیتم جدید
        </Button>
      </div>
    </div>
  );
}
```

---

## 🎨 تم رنگی هر بازی

| بازی | رنگ اصلی | Gradient From | Gradient To |
|-----|---------|---------------|-------------|
| Flashcard | purple | purple-400 | pink-400 |
| Random_wheel | blue | blue-400 | cyan-400 |
| Matching | green | green-400 | emerald-400 |
| Quiz | orange | orange-400 | red-400 |
| Group_sort | pink | pink-400 | rose-400 |
| Wordsearch | indigo | indigo-400 | purple-400 |
| Unjumble | teal | teal-400 | green-400 |
| Whack_a_mole | red | red-400 | orange-400 |
| True_false | lime | lime-400 | green-400 |
| Memory_game | violet | violet-400 | purple-400 |
| Fill_blank | amber | amber-400 | orange-400 |
| Ranking | sky | sky-400 | blue-400 |
| Crossword | slate | slate-400 | gray-400 |
| Timeline | fuchsia | fuchsia-400 | pink-400 |
| Spinner | emerald | emerald-400 | teal-400 |
| Card_flip | rose | rose-400 | red-400 |
| Hotspot | yellow | yellow-400 | amber-400 |
| Drag_text | cyan | cyan-400 | blue-400 |
| Balloon_pop | violet | violet-400 | purple-400 |
| Gameshow_quiz | orange | orange-400 | red-400 |
| Maze_chase | indigo | indigo-400 | purple-400 |
| Airplane | blue | blue-400 | cyan-400 |
| Open_the_box | teal | teal-400 | green-400 |
| Missing_word | pink | pink-400 | rose-400 |
| Anagram | lime | lime-400 | green-400 |
| Hangman | red | red-400 | orange-400 |
| Flip_tiles | purple | purple-400 | violet-400 |
| Image_quiz | cyan | cyan-400 | blue-400 |
| Labelled_diagram | emerald | emerald-400 | green-400 |
| Random_cards | amber | amber-400 | yellow-400 |

---

## 📌 نکات مهم

### برای Play Pages:
1. حتماً ID فعالیت را از URL دریافت کنید
2. State مناسب برای منطق بازی تعریف کنید
3. صفحه پایان بازی با Trophy و امتیاز
4. دکمه "شروع دوباره" و "بازگشت"
5. Loading و Error handling

### برای Edit Pages:
1. لود کردن داده‌های موجود با useEffect
2. استفاده از UPDATE نه CREATE
3. Invalidate کردن queries بعد از ذخیره
4. نمایش Loading در حین ذخیره
5. Validation قبل از ذخیره

---

## ⚡ نکات سرعت‌بخش

### می‌توانید:
1. از صفحات مشابه کپی کنید و فقط:
   - نام کامپوننت را تغییر دهید
   - type را تغییر دهید
   - رنگ‌ها را تغییر دهید
   - منطق خاص بازی را اضافه کنید

2. ساختار content هر بازی را از Create page همان بازی ببینید

3. برای بازی‌های مشابه (مثل Quiz، Gameshow_quiz، Maze_chase) از یک الگو استفاده کنید

---

## 🚀 اولویت‌بندی

### اول صفحات محبوب:
1. PlayQuiz (موجود) ✅
2. PlayTrue_false
3. PlayWhack_a_mole
4. PlayMatching ✅
5. PlayMemory_game ✅

### Edit pages اصلی:
1. EditQuiz ✅
2. EditFlashcard ✅
3. EditMatching
4. EditTrue_false
5. EditMemory_game

---

## 📝 تست

بعد از ساخت هر صفحه:
1. یک فعالیت نمونه بسازید
2. Play page را تست کنید
3. Edit page را تست کنید
4. مطمئن شوید ذخیره و بازگشت کار می‌کند

---

**موفق باشید! 🎉**

این راهنما را دنبال کنید و تمام 53 صفحه باقی‌مانده را کامل کنید!

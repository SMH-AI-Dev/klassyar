# 🔧 راهنمای رفع مشکل ذخیره‌سازی

## مشکل: فعالیت‌ها ذخیره نمی‌شوند

### مرحله 1️⃣: بررسی Console مرورگر

1. **مرورگر را باز کنید** (Chrome/Edge)
2. **F12** را بزنید تا Developer Tools باز شود
3. به تب **Console** بروید
4. یک فعالیت جدید بسازید
5. **به این پیام‌ها دقت کنید:**
   - 🟢 handleSave called
   - 🟢 Current activity: {...}
   - 🟢 Data to save: {...}
   - 🔵 Creating activity: {...}
   - ✅ Activity saved! Total activities: X

### مرحله 2️⃣: استفاده از صفحه تست

بروید به این آدرس:
```
http://localhost:5173/test-storage.html
```

این صفحه به شما کمک می‌کند:
- ✅ بررسی وضعیت localStorage
- ✅ تست ساخت فعالیت
- ✅ مشاهده فعالیت‌های ذخیره شده
- ✅ اصلاح ساختار داده
- ✅ پاک کردن داده‌های خراب

### مرحله 3️⃣: بررسی localStorage دستی

1. در Developer Tools به تب **Application** بروید
2. در سمت چپ: **Storage** > **Local Storage** > **http://localhost:5173**
3. کلید `klassyar_data` را پیدا کنید
4. روی آن کلیک کنید تا محتوایش را ببینید

**باید این ساختار را ببینید:**
```json
{
  "activities": [...],
  "classes": [...],
  "results": [...],
  "user": {...}
}
```

### مرحله 4️⃣: حل سریع مشکل

#### راه‌حل 1: پاک کردن localStorage
```javascript
// در Console مرورگر این کد را اجرا کنید:
localStorage.clear();
location.reload();
```

#### راه‌حل 2: اصلاح ساختار داده
```javascript
// در Console مرورگر:
const data = {
  activities: [],
  classes: [],
  results: [],
  user: {
    id: Date.now().toString(36),
    email: 'demo@klassyar.com',
    name: 'کاربر آزمایشی',
    created_date: new Date().toISOString()
  }
};
localStorage.setItem('klassyar_data', JSON.stringify(data));
location.reload();
```

#### راه‌حل 3: استفاده از صفحه تست
1. بروید به `http://localhost:5173/test-storage.html`
2. روی دکمه **"اصلاح ساختار داده"** کلیک کنید
3. سپس روی **"تست ساخت فعالیت"** کلیک کنید
4. اگر موفق بود، به اپلیکیشن اصلی برگردید

### مرحله 5️⃣: بررسی خطاهای احتمالی

#### خطا 1: "Cannot read property 'activities' of null"
**علت:** ساختار داده localStorage خراب است  
**راه‌حل:** از راه‌حل 2 استفاده کنید

#### خطا 2: "QuotaExceededError"
**علت:** فضای localStorage پر است  
**راه‌حل:** 
```javascript
localStorage.clear();
```

#### خطا 3: فعالیت ذخیره می‌شود اما در Dashboard نمایش داده نمی‌شود
**علت:** مشکل در query یا filter  
**راه‌حل:**
1. Cache مرورگر را پاک کنید (Ctrl+Shift+Delete)
2. صفحه را Hard Refresh کنید (Ctrl+F5)

### مرحله 6️⃣: تست کامل

پس از حل مشکل، این مراحل را دنبال کنید:

1. ✅ localStorage را پاک کنید
2. ✅ صفحه را رفرش کنید
3. ✅ یک فعالیت جدید بسازید
4. ✅ بررسی کنید که در Dashboard نمایش داده می‌شود
5. ✅ روی "بازی" کلیک کنید
6. ✅ بازی را اجرا کنید

### دستورات مفید Console

```javascript
// نمایش همه داده‌ها
const data = JSON.parse(localStorage.getItem('klassyar_data'));
console.log(data);

// نمایش فعالیت‌ها
console.log(data.activities);

// تعداد فعالیت‌ها
console.log('Total activities:', data.activities.length);

// آخرین فعالیت
console.log('Last activity:', data.activities[data.activities.length - 1]);

// پاک کردن یک فعالیت خاص
data.activities = data.activities.filter(a => a.id !== 'ID_TO_DELETE');
localStorage.setItem('klassyar_data', JSON.stringify(data));

// Backup داده‌ها
const backup = localStorage.getItem('klassyar_data');
console.log('Backup:', backup);
// کپی کنید و در جایی ذخیره کنید
```

## ✅ Checklist عیب‌یابی

- [ ] Console را باز کردم و خطاها را بررسی کردم
- [ ] localStorage را چک کردم
- [ ] ساختار داده را اصلاح کردم
- [ ] صفحه تست را امتحان کردم
- [ ] Cache مرورگر را پاک کردم
- [ ] صفحه را Hard Refresh کردم (Ctrl+F5)
- [ ] یک فعالیت تست ساختم
- [ ] فعالیت در Dashboard نمایش داده شد
- [ ] بازی را اجرا کردم و کار کرد

## 🆘 اگر هنوز مشکل دارد

اگر پس از انجام تمام مراحل بالا، هنوز مشکل دارید:

1. **Screenshot از Console** بگیرید
2. **Screenshot از localStorage** بگیرید
3. **متن کامل خطا** را کپی کنید
4. این اطلاعات را در اختیار من قرار دهید

---

**آخرین بروزرسانی:** 7 نوامبر 2025  
**نسخه:** 1.1.0

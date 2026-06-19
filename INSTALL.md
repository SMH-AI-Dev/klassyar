# 🚀 راهنمای نصب و اجرای کلاس یار

## ✅ پیش‌نیازها

قبل از شروع، مطمئن شوید که موارد زیر نصب شده‌اند:
- **Node.js** نسخه 18 یا بالاتر ([دانلود](https://nodejs.org/))
- **npm** (همراه با Node.js نصب می‌شود)

---

## 📦 مرحله 1: نصب پکیج‌ها

در پوشه پروژه، دستور زیر را اجرا کنید:

```bash
cd D:\SMH\333\KlassYar
npm install
```

این دستور تمام وابستگی‌های پروژه را نصب می‌کند (ممکن است چند دقیقه طول بکشد).

---

## 🎮 مرحله 2: اجرای برنامه (حالت Development)

```bash
npm run dev
```

بعد از اجرای این دستور:
1. Vite شروع به کامپایل پروژه می‌کند
2. یک سرور توسعه روی `http://localhost:3000` اجرا می‌شود
3. مرورگر به صورت خودکار باز می‌شود

اگر مرورگر باز نشد، دستی `http://localhost:3000` را باز کنید.

---

## 🏗️ مرحله 3: ساخت نسخه Production

برای ساخت نسخه نهایی:

```bash
npm run build
```

فایل‌های نهایی در پوشه `dist` ساخته می‌شوند.

برای پیش‌نمایش نسخه build شده:

```bash
npm run preview
```

---

## 🖥️ تبدیل به اپلیکیشن Desktop (Windows)

### گام 1: نصب Electron

```bash
npm install --save-dev electron electron-builder concurrently
```

### گام 2: ایجاد فایل main.js

فایل `electron/main.js` با محتوای زیر بسازید:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'public/logo.png')
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

### گام 3: تنظیم package.json

به `package.json` این خطوط را اضافه کنید:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "concurrently \"npm run dev\" \"electron .\"",
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.klassyar.app",
    "productName": "KlassYar",
    "win": {
      "target": "nsis",
      "icon": "public/logo.png"
    }
  }
}
```

### گام 4: اجرای نسخه Desktop

```bash
npm run electron:dev
```

### گام 5: ساخت فایل نصبی .exe

```bash
npm run electron:build
```

فایل `.exe` در پوشه `dist` ساخته می‌شود.

---

## 📱 تبدیل به اپلیکیشن Android

### روش 1: با Capacitor (توصیه می‌شود)

```bash
# نصب Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# مقداردهی اولیه
npx cap init KlassYar com.klassyar.app --web-dir=dist

# ساخت Build
npm run build

# افزودن Android
npx cap add android

# همگام‌سازی
npx cap sync

# باز کردن در Android Studio
npx cap open android
```

در Android Studio، روی دکمه "Run" کلیک کنید تا اپ روی دستگاه یا emulator اجرا شود.

### روش 2: با Cordova

```bash
# نصب Cordova
npm install -g cordova

# ایجاد پروژه Cordova
cordova create KlassYarMobile com.klassyar.app KlassYar
cd KlassYarMobile

# افزودن پلتفرم Android
cordova platform add android

# کپی فایل‌های build
# محتویات پوشه dist را به www کپی کنید

# ساخت APK
cordova build android

# اجرای روی دستگاه
cordova run android
```

---

## 🔧 رفع مشکلات رایج

### مشکل 1: Port 3000 اشغال است

**راه‌حل:** در `vite.config.js` پورت را تغییر دهید:

```javascript
export default defineConfig({
  server: {
    port: 3001
  }
})
```

### مشکل 2: خطای "Cannot find module"

**راه‌حل:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### مشکل 3: خطاهای Tailwind CSS

خطاهای `@tailwind` و `@apply` در IDE طبیعی هستند و برنامه را مختل نمی‌کنند.

### مشکل 4: صفحه سفید در مرورگر

1. کنسول مرورگر را باز کنید (F12)
2. خطاها را بررسی کنید
3. Cache را پاک کنید (Ctrl+Shift+Delete)
4. سرور را restart کنید

---

## 📝 نکات مهم

### ✅ کامل شده
- ✅ ساختار پروژه React + Vite
- ✅ Routing با React Router
- ✅ State Management با TanStack Query
- ✅ UI با Tailwind CSS + Clay Morphism
- ✅ انیمیشن‌ها با Framer Motion
- ✅ صفحه Home
- ✅ صفحه Dashboard
- ✅ صفحه Features
- ✅ صفحه About
- ✅ صفحه MyClasses
- ✅ صفحه CreateQuiz (نمونه کامل)
- ✅ صفحه PlayQuiz (نمونه کامل)
- ✅ Mock API Client
- ✅ LocalStorage برای ذخیره داده

### 🚧 نیاز به توسعه
- 🔨 8 صفحه Create دیگر (کدها در Code.1.txt)
- 🔨 3 صفحه Play دیگر (کدها در Code.1.txt)
- 🔨 صفحه TeacherReports کامل
- 🔨 کامپوننت‌های IconPicker و ImagePicker

---

## 💡 مراحل بعدی

### 1. کامل کردن صفحات Create

برای هر نوع فعالیت، صفحه Create مربوطه را از فایل `Code.1.txt` کپی کنید:
- `CreateFlashcard.jsx`
- `CreateMatching.jsx`
- `CreateGroup_sort.jsx`
- `CreateMemory_game.jsx`
- `CreateRandom_wheel.jsx`
- `CreateTrue_false.jsx`
- `CreateUnjumble.jsx`
- `CreateWhack_a_mole.jsx`

### 2. کامل کردن صفحات Play

صفحات Play را برای هر نوع بازی بسازید:
- `PlayFlashcard.jsx`
- `PlayMatching.jsx`
- ... و بقیه

### 3. افزودن Backend واقعی

برای production، باید:
1. یک Backend API بسازید (Node.js, Django, Laravel, etc.)
2. فایل `src/api/base44Client.js` را با API واقعی جایگزین کنید
3. Authentication واقعی اضافه کنید

---

## 📞 پشتیبانی

- 📧 Email: klasyar.smh@gmail.com
- 📄 مستندات کامل: [README.md](README.md)
- 💻 کدهای کامل: [Code.1.txt](../Code.1.txt)

---

## ✨ موفق باشید!

با ❤️ برای آموزش ایران ساخته شده

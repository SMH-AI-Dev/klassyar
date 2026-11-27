# راهنمای کلید امضای اختصاصی Android — KlassYar

## ۱. ساخت کلید

در PowerShell ویندوز، در پوشه‌ای خارج از مخزن KlassYar اجرا کنید:

```powershell
keytool -genkeypair -v -keystore klassyar-release.jks -alias klassyar -keyalg RSA -keysize 4096 -validity 10000
```

این کلید فقط برای `com.klassyar.app` است. آن را با کلید LinguaPlay مشترک نکنید. فایل JKS و رمزهای آن را در دو محل امن و رمزگذاری‌شده نگهداری کنید؛ فایل JKS را در Git یا فضای عمومی بارگذاری نکنید.

## ۲. تنظیم GitHub Secrets

در مخزن KlassYar از مسیر **Settings → Secrets and variables → Actions** این چهار Secret را اضافه کنید:

- `KLASSYAR_ANDROID_KEYSTORE_BASE64`
- `KLASSYAR_ANDROID_STORE_PASSWORD`
- `KLASSYAR_ANDROID_KEY_ALIAS` با مقدار `klassyar`
- `KLASSYAR_ANDROID_KEY_PASSWORD`

برای تبدیل فایل JKS به Base64 در PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes(".\\klassyar-release.jks")) | Set-Clipboard
```

خروجی Clipboard را فقط در Secret اول قرار دهید. رمزها را در فایل تنظیمات یا سورس ذخیره نکنید.

## ۳. انتشار

پس از ادغام تغییرات و تنظیم Secretها، تگ نسخه را push کنید:

```bash
git tag v2.2.0
git push origin v2.2.0
```

Workflow نسخه Release را با کلید ثابت امضا می‌کند، APK را با `apksigner` اعتبارسنجی می‌کند و APK و AAB را به GitHub Release همان تگ اضافه می‌کند.

## ۴. نکته بسیار مهم درباره نسخه‌های قبلی

اگر نسخه قبلی KlassYar با کلید دیگری در اختیار کاربران قرار گرفته باشد، Android نصب به‌روزرسانی با کلید جدید را به‌عنوان همان برنامه نمی‌پذیرد. قبل از انتشار عمومی، اثر انگشت گواهی APKهای قبلی را با کلید جدید مقایسه کنید. در صورت تفاوت، باید کلید قبلی بازیابی شود یا برای مهاجرت، شناسه برنامه جدید و مسیر نصب جداگانه در نظر گرفته شود.

## ۵. بررسی امضا

```bash
apksigner verify --verbose --print-certs app-release.apk
```

اثر انگشت SHA-256 گواهی را ثبت کنید و در تمام انتشارهای بعدی ثابت‌ماندن آن را بررسی کنید.

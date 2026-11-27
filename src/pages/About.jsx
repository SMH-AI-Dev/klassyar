import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart, Sparkles, Trophy, BookOpen, Mail, Github,
  BrainCircuit, Gamepad2, ShieldCheck, GraduationCap, Database,
  Smartphone, Lightbulb, Target
} from "lucide-react";
import { motion } from "framer-motion";

// تصاویر صفحه درباره ما، به ترتیب شماره فایل (02.jpg تا 33.jpg)
const aboutImagesModule = import.meta.glob("../assets/about/*.jpg", {
  eager: true,
  import: "default",
});
const aboutImages = Object.keys(aboutImagesModule)
  .sort((a, b) => {
    const na = Number(a.match(/(\d{2})\.jpg$/)?.[1] ?? "99");
    const nb = Number(b.match(/(\d{2})\.jpg$/)?.[1] ?? "99");
    return na - nb;
  })
  .map((key) => aboutImagesModule[key]);

const features = [
  {
    icon: Gamepad2,
    emoji: "🎮",
    title: "بازی‌های آموزشی متنوع",
    description:
      "از فلش‌کارت و تطبیق تا مرتب‌سازی، حافظه، گردونه و بازی‌های تعاملی؛ هر بازی با روش تعامل متناسب با ماهیت خودش.",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: GraduationCap,
    emoji: "👩‍🏫",
    title: "ابزارهای آموزشی معلم",
    description:
      "امکان طراحی فعالیت، مدیریت تجربه یادگیری و پیگیری عملکرد دانش‌آموزان در مسیر توسعه محصول.",
    color: "from-sky-500 to-cyan-500",
  },
  {
    icon: ShieldCheck,
    emoji: "🔒",
    title: "رویکرد محلی و آفلاین",
    description:
      "تمرکز بر نگهداری محلی اطلاعات و فراهم‌کردن تجربه اصلی بدون وابستگی اجباری به سرویس ابری.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Database,
    emoji: "🧩",
    title: "بانک محتوای اختصاصی",
    description:
      "محتوای هر بازی ساختار مخصوص خودش را دارد؛ کارت، جفت، کلمه، دسته و سؤال به یک قالب واحد تبدیل نمی‌شوند.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Smartphone,
    emoji: "📱",
    title: "تجربه چنددستگاهی",
    description:
      "طراحی واکنش‌گرا و مسیر توسعه نسخه‌های قابل نصب برای دستگاه‌های مختلف.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Target,
    emoji: "🎯",
    title: "یادگیری هدفمند",
    description:
      "هدف، تمرین فعال، بازخورد روشن و پیشرفت قابل مشاهده است؛ نه صرفاً نمایش سؤال و پاسخ.",
    color: "from-indigo-500 to-blue-500",
  },
];

const creatorLinks = [
  {
    label: "ایمیل",
    value: "dev.smh.ai@gmail.com",
    href: "mailto:dev.smh.ai@gmail.com",
    icon: Mail,
    color: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    label: "GitHub",
    value: "github.com/SMH-AI-Dev",
    href: "https://github.com/SMH-AI-Dev/",
    icon: Github,
    color: "border-slate-200 bg-slate-50 text-slate-800",
    external: true,
  },
  {
    label: "Hugging Face",
    value: "huggingface.co/SMH-DEV-AI",
    href: "https://huggingface.co/SMH-DEV-AI/",
    icon: BrainCircuit,
    color: "border-amber-200 bg-amber-50 text-amber-900",
    external: true,
  },
];

export default function About() {
  return (
    <div dir="rtl" className="min-h-screen px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10 md:space-y-14">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-sky-100 px-5 py-10 text-center shadow-sm md:px-12 md:py-16"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-fuchsia-300/30 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-8 h-52 w-52 rounded-full bg-sky-300/30 blur-2xl" />
          <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-300/50">
            <Gamepad2 className="h-10 w-10" />
          </div>
          <p className="relative mb-2 text-sm font-bold tracking-widest text-violet-700">
            ✨ LEARN • PLAY • GROW ✨
          </p>
          <h1 className="relative mb-3 text-4xl font-black text-slate-800 md:text-6xl">
            🎮 کلاس‌یار
          </h1>
          <h2 className="relative mb-5 text-2xl font-extrabold text-violet-700 md:text-3xl">
            کلاس، یارِ یادگیری 📚
          </h2>
          <p className="relative mx-auto max-w-3xl text-base leading-8 text-slate-700 md:text-xl">
            پلتفرم بازی‌محور آموزش دروس مدرسه؛ جایی که تمرین، کشف و بازی در کنار
            هم قرار می‌گیرند تا یادگیری فعال‌تر و جذاب‌تر شود.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-2">
            {["🇮🇷 فارسی‌محور", "🧩 بازی‌های تعاملی", "👩‍🏫 ابزار معلم", "🔒 آفلاین‌محور"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-violet-50 shadow-sm">
            <CardContent className="p-6 md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <BookOpen className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">📖 داستان کلاس‌یار</h2>
                  <p className="text-sm text-slate-500">آموزش با مشارکت، تجربه و بازی</p>
                </div>
              </div>
              <div className="space-y-4 text-base leading-8 text-slate-700 md:text-lg">
                <p>
                  کلاس‌یار با این ایده شکل گرفت که تمرین آموزشی می‌تواند فراتر از
                  پاسخ‌دادن به پرسش‌های تکراری باشد. دانش‌آموز باید فرصت کشف،
                  انتخاب، ساختن، مرتب‌کردن، به‌خاطر سپردن و تجربه‌کردن داشته باشد.
                </p>
                <p>
                  به همین دلیل، بازی‌های کلاس‌یار از مکانیک‌های متنوع استفاده
                  می‌کنند. فلش‌کارت باید فلش‌کارت بماند، بازی تطبیق باید بر پایه
                  جفت‌یابی اجرا شود و بازی مرتب‌سازی باید تعامل مرتب‌کردن را حفظ
                  کند؛ محتوای هرکدام نیز از بانک متناسب با همان بازی انتخاب می‌شود.
                </p>
                <div className="rounded-2xl border border-violet-100 bg-violet-50/80 p-5 text-violet-900">
                  <div className="mb-2 flex items-center gap-2 font-bold">
                    <Lightbulb className="h-5 w-5" /> 💡 اصل طراحی
                  </div>
                  فناوری باید در خدمت یادگیری باشد؛ نه اینکه روش یادگیری را به
                  محدودیت‌های یک قالب واحد تقلیل دهد.
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <section>
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-black text-slate-800 md:text-3xl">🌟 ویژگی‌ها و اصول کلیدی</h2>
            <p className="mt-2 text-slate-600">آنچه تجربه آموزشی کلاس‌یار بر پایه آن شکل می‌گیرد</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-0 shadow-sm transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-md`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-lg font-extrabold text-slate-800">
                      {feature.emoji} {feature.title}
                    </h3>
                    <p className="text-sm leading-7 text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-black text-slate-800 md:text-3xl">🖼️ گالری کلاس‌یار</h2>
            <p className="mt-2 text-slate-600">نگاهی به بخش‌های مختلف برنامه</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {aboutImages.map((src, index) => (
              <motion.figure
                key={src}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 8) * 0.04 }}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <img
                  src={src}
                  alt={`تصویر ${index + 1} از محیط کلاس‌یار`}
                  loading="lazy"
                  className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                />
              </motion.figure>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-sky-600 text-white shadow-lg">
            <CardContent className="p-7 text-center md:p-10">
              <Trophy className="mx-auto mb-4 h-12 w-12" />
              <h2 className="mb-4 text-2xl font-black md:text-3xl">🚀 مأموریت ما</h2>
              <p className="mx-auto max-w-3xl text-base leading-8 text-white/95 md:text-lg">
                ساخت ابزارهایی ساده، خلاقانه و در دسترس برای کمک به معلمان و
                دانش‌آموزان؛ ابزارهایی که یادگیری را فعال‌تر کنند و امکان تجربه
                روش‌های گوناگون تمرین را فراهم آورند.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3 text-2xl">
                <span>⭐</span><span>🎯</span><span>🌱</span><span>✨</span>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <section>
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-black text-slate-800 md:text-3xl">👨‍💻 سازنده و توسعه</h2>
            <p className="mt-2 text-slate-600">طراحی و توسعه با تمرکز بر نرم‌افزار و هوش مصنوعی</p>
          </div>
          <Card className="mx-auto max-w-3xl border-0 shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="mb-5 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-right">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 text-4xl text-white shadow-md">
                  👨‍💻
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Seyed Mehdi Hosseini</h3>
                  <p className="mt-1 text-sm font-medium text-violet-700">
                    مهندس نرم‌افزار کامپیوتر و فعال حوزه هوش مصنوعی
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    ایده‌پرداز و توسعه‌دهنده کلاس‌یار
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {creatorLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 transition hover:-translate-y-0.5 hover:shadow-md ${link.color}`}
                  >
                    <link.icon className="h-5 w-5 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-xs opacity-70">{link.label}</span>
                      <span dir="ltr" className="block break-all text-left text-sm font-semibold">{link.value}</span>
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="border-t border-violet-100 py-7 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-slate-700">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            <span className="font-semibold">ساخته‌شده برای تجربه بهتر یادگیری</span>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-sm text-slate-500">کلاس‌یار | © 2026 | SMH-AI-Dev</p>
          <a
            href="https://github.com/SMH-AI-Dev/klassyar"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
          >
            <Github className="h-4 w-4" /> مشاهده مخزن در GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}

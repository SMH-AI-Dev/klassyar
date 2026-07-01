import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock, Loader2, BookOpen, Sparkles, Brain, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  { text: "یادگیری بدون بازی، مثل پرواز بدون بال است", author: "کلاس یار" },
  { text: "هر بازی یک درس، هر درس یک ماجراجویی", author: "کلاس یار" },
  { text: "با بازی یاد بگیر، با خنده رشد کن", author: "کلاس یار" },
  { text: "آموزش جذاب، آینده درخشان", author: "کلاس یار" },
  { text: "بازی بهترین معلم زندگی است", author: "کلاس یار" },
  { text: "دانش آموز شاد، یادگیرنده موفق", author: "کلاس یار" },
];

const floatingIcons = [BookOpen, Star, Brain, Heart, Sparkles, BookOpen, Star, Brain];

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-300/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Login() {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
        <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
      </div>
    );
  }

  if (user) {
    navigate("/Dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("لطفاً نام کاربری و رمز عبور را وارد کنید");
      return;
    }
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate("/Dashboard", { replace: true });
    } catch (e) {
      setError(e.message || "خطا");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
      <ParticleField />

      {/* Floating animated icons */}
      {floatingIcons.map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute text-white/5"
          style={{
            left: `${10 + (i * 12) % 80}%`,
            top: `${5 + (i * 17) % 80}%`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 30, 0],
            rotate: [0, 10 - Math.random() * 20, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 5 + (i % 3) * 2,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        >
          <Icon size={24 + (i % 4) * 12} />
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-md">
        {/* Animated quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-white/80 text-lg font-light italic">
              "{quotes[quoteIdx].text}"
            </p>
            <p className="text-white/40 text-sm mt-1">— {quotes[quoteIdx].author}</p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500" />

            <CardContent className="p-8">
              {/* Logo and welcome */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-8"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  {isRegister ? "ثبت‌نام در کلاس یار" : "به کلاس یار خوش آمدید"}
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 mt-2"
                >
                  {isRegister
                    ? "یک حساب کاربری بسازید و ماجراجویی را شروع کنید"
                    : "برای ادامه، وارد حساب کاربری خود شوید"}
                </motion.p>
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 text-red-600 text-sm p-3 rounded-2xl mb-4 text-center border border-red-200 overflow-hidden"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="relative group">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="نام کاربری"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-14 pr-12 pl-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-right focus:outline-none focus:border-purple-400 focus:bg-white transition-all text-base"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="password"
                    dir="ltr"
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 pr-12 pl-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-right focus:outline-none focus:border-purple-400 focus:bg-white transition-all text-base"
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white rounded-2xl text-lg font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
                  >
                    {submitting ? (
                      <Loader2 className="w-6 h-6 animate-spin ml-2" />
                    ) : null}
                    {isRegister ? "ثبت‌نام" : "ورود به کلاس یار"}
                  </Button>
                </motion.div>
              </motion.form>

              {/* Toggle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-6 text-sm text-gray-500"
              >
                {isRegister ? "قبلاً ثبت‌نام کرده‌اید؟" : "حساب کاربری ندارید؟"}{" "}
                <button
                  onClick={() => { setIsRegister(!isRegister); setError(""); }}
                  className="text-purple-600 font-bold hover:text-purple-800 transition-colors"
                >
                  {isRegister ? "وارد شوید" : "ثبت‌نام کنید"}
                </button>
              </motion.p>

              {/* Features hint */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 pt-6 border-t border-gray-100"
              >
                <div className="flex justify-center gap-6 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> ۳۰ بازی آموزشی
                  </span>
                  <span className="flex items-center gap-1">
                    <Brain className="w-3 h-3" /> یادگیری هوشمند
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> کاملاً رایگان
                  </span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

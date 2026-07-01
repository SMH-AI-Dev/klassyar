import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import englishGames from "@/lib/englishGames";

const categories = ["All", "Vocabulary", "Grammar", "Speaking", "Reading", "Spelling", "Listening"];

const difficultyColors = {
  "Beginner": "bg-green-100 text-green-700",
  "Intermediate": "bg-yellow-100 text-yellow-700",
  "Advanced": "bg-red-100 text-red-700",
};

export default function EnglishGameHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const filtered = englishGames.filter(g => {
    const matchCat = activeCat === "All" || g.category === activeCat;
    const matchSearch = g.title.includes(search) || g.description.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 text-center">
          🎯 باشگاه چالش انگلیسی
        </motion.h1>
        <p className="text-gray-500 text-center mb-8">۵۰ چالش انگلیسی برای تقویت لغات، گرامر، مکالمه و بیشتر</p>

        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجوی بازی..."
            className="w-full p-4 pr-12 rounded-2xl bg-white/90 border-0 clay-element outline-none text-right"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all clay-element ${
                activeCat === cat ? "bg-blue-600 text-white" : "bg-white/80 text-gray-700 hover:bg-blue-50"
              }`}
            >
              {cat === "All" ? "همه" : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 12) * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/play-english/${game.id}`)}
              className="bg-white/90 rounded-3xl p-5 clay-element cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{game.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{game.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{game.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-medium ${difficultyColors[game.difficulty] || "bg-gray-100 text-gray-600"}`}>
                      {game.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-xl text-xs font-medium bg-blue-50 text-blue-600">
                      {game.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">بازی‌ای با این مشخصات یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}

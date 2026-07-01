import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import iconLibrary from "@/lib/iconLibrary";

const allIcons = Object.entries(iconLibrary).flatMap(([cat, icons]) =>
  icons.map(icon => ({ icon, category: cat }))
);

export default function IconPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("همه");
  const categories = ["همه", ...Object.keys(iconLibrary)];

  const filtered = search
    ? allIcons.filter(i => i.icon.includes(search))
    : activeCat === "همه"
      ? allIcons
      : iconLibrary[activeCat].map(icon => ({ icon, category: activeCat }));

  const handleDragStart = (e, icon) => {
    e.dataTransfer.setData("text/plain", icon);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white/95 rounded-3xl clay-element max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-4 border-b border-purple-200/50 flex items-center justify-between sticky top-0 bg-white/95 z-10">
          <h2 className="text-xl font-bold text-gray-800">انتخاب آیکون</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full clay-element flex items-center justify-center hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="جستجوی آیکون..."
              className="w-full p-3 pr-12 rounded-2xl bg-gray-50 border-0 outline-none text-right"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCat(cat); setSearch(""); }}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all clay-element ${
                  activeCat === cat ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-purple-50"
                }`}
              >
                {cat === "همه" ? "همه" : cat}
                {cat !== "همه" && ` (${iconLibrary[cat].length})`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 max-h-[50vh] overflow-y-auto p-2">
            {filtered.map((item, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (idx % 50) * 0.005 }}
                onClick={() => onSelect(item.icon)}
                onDragStart={e => handleDragStart(e, item.icon)}
                draggable
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl rounded-xl hover:bg-purple-100 transition-all clay-element cursor-grab active:cursor-grabbing"
                title={item.category}
              >
                {item.icon}
              </motion.button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400">آیکونی یافت نشد</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

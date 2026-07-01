import React, { useState } from "react";
import { Smile } from "lucide-react";
import IconPicker from "./IconPicker";

export default function AnswerInput({ value, onChange, placeholder, label }) {
  const [showIcons, setShowIcons] = useState(false);

  const insertIcon = (icon) => {
    onChange((value || "") + icon);
    setShowIcons(false);
  };

  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 pl-10 rounded-2xl bg-gray-50 border-2 border-gray-200 outline-none focus:border-purple-400 transition-all text-right"
          dir="rtl"
        />
        <button
          type="button"
          onClick={() => setShowIcons(true)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-purple-100 transition-all"
          title="افزودن آیکون"
        >
          <Smile className="w-5 h-5 text-gray-400 hover:text-purple-500" />
        </button>
      </div>
      {value && (
        <div className="mt-1 text-lg">{value}</div>
      )}
      {showIcons && <IconPicker onSelect={insertIcon} onClose={() => setShowIcons(false)} />}
    </div>
  );
}

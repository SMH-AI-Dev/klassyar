import React from "react";
import { Input } from "@/components/ui/input";

export default function IconPicker({ currentIcon, onSelect }) {
  return (
    <div className="space-y-2">
      <Input
        value={currentIcon || ''}
        onChange={(e) => onSelect(e.target.value)}
        placeholder="نام آیکون را وارد کنید (مثلاً: Star, Heart)"
        className="rounded-xl clay-element"
        dir="ltr"
      />
    </div>
  );
}

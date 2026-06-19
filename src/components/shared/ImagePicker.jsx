import React from "react";
import { Input } from "@/components/ui/input";

export default function ImagePicker({ currentImage, onSelect }) {
  return (
    <div className="space-y-2">
      {currentImage && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border">
          <img src={currentImage} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}
      <Input
        value={currentImage || ''}
        onChange={(e) => onSelect(e.target.value)}
        placeholder="آدرس تصویر را وارد کنید"
        className="rounded-xl clay-element"
        dir="ltr"
      />
    </div>
  );
}

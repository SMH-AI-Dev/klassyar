import React, { useState, useEffect } from 'react';
import { childAnimations } from '@/lib/childAnimations';

const RandomAnimations = () => {
  const [selectedAnimations, setSelectedAnimations] = useState([]);

  useEffect(() => {
    // انتخاب ۵ انیمیشن راندوم از لیست ۵۰ تایی
    const shuffled = [...childAnimations].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    // اضافه کردن موقعیت‌های راندوم به هر انیمیشن
    const animationsWithPositions = selected.map(animation => ({
      ...animation,
      x: Math.random() * 80 + 10, // ۱۰% تا ۹۰% عرض صفحه
      y: Math.random() * 70 + 10, // ۱۰% تا ۸۰% ارتفاع صفحه
    }));

    setSelectedAnimations(animationsWithPositions);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {selectedAnimations.map((animation, index) => {
        const AnimationComponent = animation.component;
        return (
          <AnimationComponent
            key={`${animation.name}-${index}`}
            x={animation.x}
            y={animation.y}
          />
        );
      })}
    </div>
  );
};

export default RandomAnimations;
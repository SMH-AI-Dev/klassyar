import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayFlashcard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.cards) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate("/Dashboard")}>
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  const cards = activity.content.cards;
  const card = cards[currentCard];

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const resetCards = () => {
    setCurrentCard(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <RandomAnimations />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate("/Dashboard")}
            variant="outline"
            className="rounded-xl clay-element"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{activity.title}</h1>
            <p className="text-gray-600">
              کارت {currentCard + 1} از {cards.length}
            </p>
          </div>
          <Button
            onClick={resetCards}
            variant="outline"
            className="rounded-xl clay-element"
          >
            <RotateCw className="w-5 h-5 ml-2" />
            شروع دوباره
          </Button>
        </div>

        <div className="perspective-1000 mb-8">
          <motion.div
            className="relative h-96 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isFlipped ? 'back' : 'front'}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Card className="clay-element bg-white border-0 h-full">
                  <CardContent className="flex flex-col items-center justify-center h-full p-12 text-center">
                    <div className="text-6xl mb-6">{card.icon || "🎴"}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      {isFlipped ? card.back : card.front}
                    </h2>
                    {card.image && (
                      <img
                        src={card.image}
                        alt="تصویر کارت"
                        className="max-h-40 object-contain rounded-2xl clay-element mt-4"
                      />
                    )}
                    <p className="text-sm text-gray-500 mt-8">
                      کلیک کنید برای {isFlipped ? 'دیدن سوال' : 'دیدن جواب'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handlePrev}
            disabled={currentCard === 0}
            variant="outline"
            className="flex-1 h-14 rounded-2xl clay-element"
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            کارت قبلی
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentCard === cards.length - 1}
            className="flex-1 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl clay-element"
          >
            کارت بعدی
            <ChevronLeft className="w-5 h-5 mr-2" />
          </Button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentCard(index);
                setIsFlipped(false);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentCard
                  ? 'bg-purple-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

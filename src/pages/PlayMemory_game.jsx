import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayMemory_game() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  useEffect(() => {
    if (activity?.content?.pairs) {
      const gameCards = [];
      activity.content.pairs.forEach((pair, index) => {
        gameCards.push({ ...pair.item1, id: `${index}-1`, pairId: index });
        gameCards.push({ ...pair.item2, id: `${index}-2`, pairId: index });
      });
      setCards(gameCards.sort(() => Math.random() - 0.5));
    }
  }, [activity]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].pairId === cards[second].pairId) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setIsComplete(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const resetGame = () => {
    if (activity?.content?.pairs) {
      const gameCards = [];
      activity.content.pairs.forEach((pair, index) => {
        gameCards.push({ ...pair.item1, id: `${index}-1`, pairId: index });
        gameCards.push({ ...pair.item2, id: `${index}-2`, pairId: index });
      });
      setCards(gameCards.sort(() => Math.random() - 0.5));
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setIsComplete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.pairs) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد</p>
          <Button onClick={() => navigate("/Dashboard")}>بازگشت به داشبورد</Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آفرین! 🎉</h2>
            <p className="text-xl text-gray-600 mb-4">همه جفت‌ها را پیدا کردید!</p>
            <div className="text-3xl font-bold text-violet-600 mb-8">
              {moves} حرکت
            </div>
            <div className="flex gap-3">
              <Button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl clay-element"
              >
                <RotateCw className="w-5 h-5 ml-2" />
                شروع دوباره
              </Button>
              <Button
                onClick={() => navigate("/Dashboard")}
                variant="outline"
                className="flex-1 rounded-xl clay-element"
              >
                بازگشت
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <RandomAnimations />
      <div className="max-w-5xl mx-auto">
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
            <p className="text-gray-600">حرکت‌ها: {moves}</p>
          </div>
          <Button
            onClick={resetGame}
            variant="outline"
            className="rounded-xl clay-element"
          >
            <RotateCw className="w-5 h-5 ml-2" />
            شروع دوباره
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(index)}
              whileHover={{ scale: matched.includes(index) || flipped.includes(index) ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="aspect-square"
            >
              <Card className={`clay-element border-0 h-full transition-all ${
                flipped.includes(index) || matched.includes(index)
                  ? 'bg-white'
                  : 'bg-gradient-to-br from-violet-400 to-purple-400'
              }`}>
                <CardContent className="flex flex-col items-center justify-center h-full p-4">
                  {(flipped.includes(index) || matched.includes(index)) ? (
                    <>
                      <div className="text-4xl mb-2">{card.icon || "🃏"}</div>
                      <p className="text-sm font-medium text-center">{card.text}</p>
                      {card.image && (
                        <img
                          src={card.image}
                          alt="کارت"
                          className="w-16 h-16 object-contain rounded-lg mt-2"
                        />
                      )}
                    </>
                  ) : (
                    <div className="text-4xl">🃏</div>
                  )}
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

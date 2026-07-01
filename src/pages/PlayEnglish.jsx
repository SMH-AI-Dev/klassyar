import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import GamePlayer from "@/engine/GamePlayer";
import englishGames from "@/lib/englishGames";

export default function PlayEnglish() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = englishGames.find(g => g.id === gameId);

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">بازی یافت نشد</h2>
        <p className="text-gray-500 mb-4">بازی مورد نظر در دسترس نیست</p>
        <button
          onClick={() => navigate("/english-hub")}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl clay-element font-medium"
        >
          بازگشت به بازی‌ها
        </button>
      </div>
    );
  }

  return <GamePlayer game={game} />;
}

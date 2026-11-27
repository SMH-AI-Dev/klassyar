import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import QuizEngine from "./QuizEngine";
import { createQuestionRound, saveQuestionRoundProgress } from "@/lib/questionBank";
import { classroom } from "@/lib/classroom";

export default function GamePlayer({ game, userId = "guest" }) {
  const navigate = useNavigate();
  const [round, setRound] = useState(() => createQuestionRound(game, "open", userId));
  const activeGameId = useRef(`${userId}:${game.id}`);

  useEffect(() => {
    const activeScope = `${userId}:${game.id}`;
    if (activeGameId.current !== activeScope) {
      activeGameId.current = activeScope;
      setRound(createQuestionRound(game, "open", userId));
    }
    const handlePageShow = (event) => {
      if (event.persisted) setRound(createQuestionRound(game, "return", userId));
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [game, userId]);

  const Engine = QuizEngine;

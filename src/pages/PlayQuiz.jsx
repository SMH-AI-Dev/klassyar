import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, RotateCw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayQuiz() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  const saveResultMutation = useMutation({
    mutationFn: async (resultData) => {
      return base44.entities.GameResult.create(resultData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.questions) {
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

  const questions = activity.content.questions;
  const question = questions[currentQuestion];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === question.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setIsComplete(true);
      saveResultMutation.mutate({
        activity_id: activityId,
        score: Math.round((score / questions.length) * 100),
        total_questions: questions.length,
        correct_answers: score
      });
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="clay-element bg-white border-0 p-12 text-center">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آفرین! 🎉</h2>
            <div className="text-6xl font-bold text-green-600 mb-6">
              {score}/{questions.length}
            </div>
            <p className="text-xl text-gray-600 mb-8">
              امتیاز شما: {Math.round((score / questions.length) * 100)}%
            </p>
            <div className="flex gap-3">
              <Button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl clay-element"
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
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
              سوال {currentQuestion + 1} از {questions.length}
            </p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {score}/{questions.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card className="clay-element bg-white border-0 mb-6">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {question.question}
                </h2>

                {question.image && (
                  <img
                    src={question.image}
                    alt="تصویر سوال"
                    className="w-full max-h-64 object-contain rounded-2xl clay-element mb-6"
                  />
                )}

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 text-right rounded-2xl clay-element transition-all ${
                        selectedAnswer === null
                          ? 'hover:bg-green-50 hover:scale-102'
                          : selectedAnswer === index
                          ? index === question.correct_answer
                            ? 'bg-green-200'
                            : 'bg-red-200'
                          : index === question.correct_answer
                          ? 'bg-green-200'
                          : 'opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{option}</span>
                        {selectedAnswer !== null && index === question.correct_answer && (
                          <Check className="w-6 h-6 text-green-600" />
                        )}
                        {selectedAnswer === index && index !== question.correct_answer && (
                          <X className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl clay-element py-6 text-xl"
            >
              {currentQuestion < questions.length - 1 ? 'سوال بعدی' : 'اتمام آزمون'}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

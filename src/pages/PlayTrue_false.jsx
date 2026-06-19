import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, Trophy } from "lucide-react";
import RandomAnimations from "@/components/shared/RandomAnimations";

export default function PlayTrue_false() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const activities = await base44.entities.Activity.list();
      return activities.find(a => a.id === activityId);
    },
  });

  useEffect(() => {
    if (selectedAnswer !== null) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < activity.content.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
        } else {
          setIsComplete(true);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedAnswer, currentQuestionIndex, activity]);

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    
    const currentQuestion = activity.content.questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answer);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsComplete(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500" />
      </div>
    );
  }

  if (!activity || !activity.content?.questions?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="clay-element bg-white/80 border-0 p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">فعالیت یافت نشد یا سوالی وجود ندارد</p>
          <Button onClick={() => navigate("/Dashboard")} className="rounded-xl clay-element">
            <ArrowRight className="w-5 h-5 ml-2" />
            بازگشت به داشبورد
          </Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / activity.content.questions.length) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="clay-element bg-gradient-to-br from-lime-50 to-green-50 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Trophy className="w-20 h-20 md:w-24 md:h-24 text-lime-500 mx-auto mb-6" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                تبریک! تمام شد
              </h2>
              
              <div className="bg-white/80 rounded-2xl p-6 mb-6 clay-element">
                <p className="text-gray-600 mb-2">امتیاز شما:</p>
                <p className="text-5xl font-bold text-lime-600">
                  {score}/{activity.content.questions.length}
                </p>
                <p className="text-2xl font-bold text-lime-500 mt-2">{percentage}%</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={restartQuiz}
                  className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white rounded-xl clay-element px-8 py-6 text-lg"
                >
                  شروع مجدد
                </Button>
                <Button
                  onClick={() => navigate("/Dashboard")}
                  variant="outline"
                  className="rounded-xl clay-element px-8 py-6 text-lg"
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                  بازگشت به داشبورد
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = activity.content.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <RandomAnimations />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/Dashboard")}
              variant="outline"
              size="icon"
              className="rounded-xl clay-element"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{activity.title}</h1>
              {activity.description && (
                <p className="text-gray-600 mt-1">{activity.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white clay-element rounded-xl px-4 py-2">
              <p className="text-sm text-gray-600">امتیاز</p>
              <p className="text-xl font-bold text-lime-600">{score}</p>
            </div>
            <div className="bg-white clay-element rounded-xl px-4 py-2">
              <p className="text-sm text-gray-600">سوال</p>
              <p className="text-xl font-bold text-gray-800">
                {currentQuestionIndex + 1}/{activity.content.questions.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden clay-element">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / activity.content.questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-lime-400 to-green-400"
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="clay-element bg-gradient-to-br from-lime-50 to-green-50 border-0">
              <CardContent className="p-8 md:p-12">
                <div className="mb-12 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* True Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleAnswer(true)}
                      disabled={selectedAnswer !== null}
                      className={`w-full h-32 text-2xl font-bold rounded-2xl clay-element transition-all ${
                        selectedAnswer === null
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white'
                          : selectedAnswer === true
                          ? currentQuestion.correctAnswer === true
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                            : 'bg-gradient-to-br from-red-400 to-red-500 text-white'
                          : currentQuestion.correctAnswer === true
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedAnswer === true && currentQuestion.correctAnswer === true && (
                          <Check className="w-8 h-8" />
                        )}
                        {selectedAnswer === true && currentQuestion.correctAnswer !== true && (
                          <X className="w-8 h-8" />
                        )}
                        {selectedAnswer !== null && selectedAnswer !== true && currentQuestion.correctAnswer === true && (
                          <Check className="w-8 h-8" />
                        )}
                        <span>✓ درست</span>
                      </div>
                    </Button>
                  </motion.div>

                  {/* False Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleAnswer(false)}
                      disabled={selectedAnswer !== null}
                      className={`w-full h-32 text-2xl font-bold rounded-2xl clay-element transition-all ${
                        selectedAnswer === null
                          ? 'bg-gradient-to-br from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white'
                          : selectedAnswer === false
                          ? currentQuestion.correctAnswer === false
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                            : 'bg-gradient-to-br from-red-400 to-red-500 text-white'
                          : currentQuestion.correctAnswer === false
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedAnswer === false && currentQuestion.correctAnswer === false && (
                          <Check className="w-8 h-8" />
                        )}
                        {selectedAnswer === false && currentQuestion.correctAnswer !== false && (
                          <X className="w-8 h-8" />
                        )}
                        {selectedAnswer !== null && selectedAnswer !== false && currentQuestion.correctAnswer === false && (
                          <Check className="w-8 h-8" />
                        )}
                        <span>✗ غلط</span>
                      </div>
                    </Button>
                  </motion.div>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-8 text-center"
                    >
                      <div className={`inline-block px-6 py-3 rounded-xl clay-element ${
                        selectedAnswer === currentQuestion.correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <p className="text-lg font-bold">
                          {selectedAnswer === currentQuestion.correctAnswer ? '✓ صحیح!' : '✗ اشتباه!'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizData } from '../types/quiz';

type InteractiveQuizScreenProps = {
  quiz: QuizData;
  onComplete: (score: number) => void;
  onSkip: () => void;
};

const InteractiveQuizScreen: React.FC<InteractiveQuizScreenProps> = ({ 
  quiz, 
  onComplete, 
  onSkip 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [showCorrectEffect, setShowCorrectEffect] = useState(false);
  const [showWrongEffect, setShowWrongEffect] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Эффект при правильном ответе
  const triggerCorrectEffect = () => {
    setShowCorrectEffect(true);
    setTimeout(() => setShowCorrectEffect(false), 1500);
    
    // XP и достижения
    setXp(prev => prev + 20);
    setStreak(prev => {
      const newStreak = prev + 1;
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
        if (newStreak === 3) {
          setAchievements(prev => [...prev, 'Серия из 3! 🔥']);
          setXp(prev => prev + 30);
        } else if (newStreak === 5) {
          setAchievements(prev => [...prev, 'Невероятная серия! ⚡']);
          setXp(prev => prev + 50);
        }
      }
      return newStreak;
    });
  };

  // Эффект при неправильном ответе
  const triggerWrongEffect = () => {
    setShowWrongEffect(true);
    setTimeout(() => setShowWrongEffect(false), 1500);
    setStreak(0);
    setXp(prev => prev + 5); // Даем хоть что-то за попытку
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation || selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    // Проверка правильности ответа
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      triggerCorrectEffect();
    } else {
      triggerWrongEffect();
    }
    
    // Показываем объяснение через небольшую задержку
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    if (isLastQuestion) {
      // Финальные достижения
      const finalScore = (score / quiz.questions.length) * 100;
      if (finalScore === 100) {
        setAchievements(prev => [...prev, 'Идеальный результат! 🏆']);
        setXp(prev => prev + 100);
      } else if (finalScore >= 80) {
        setAchievements(prev => [...prev, 'Отличный результат! 🌟']);
        setXp(prev => prev + 50);
      }
      
      setTimeout(() => setShowResults(true), 500);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    onComplete(score);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-3xl mx-auto p-2 sm:p-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Фоновые частицы */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {!showResults ? (
        <>
          {/* Header с статистикой */}
          <div className="w-full mb-4 sm:mb-6 z-10">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 rounded-full text-white font-bold text-xs sm:text-sm"
                  animate={{ scale: xp > 0 ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  XP: {xp}
                </motion.div>
                <motion.div
                  className={`px-2 py-1 rounded-full text-white font-bold text-xs sm:text-sm ${
                    streak > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-white/20'
                  }`}
                  animate={{ scale: streak > 0 ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  🔥 {streak}
                </motion.div>
                <div className="text-white/70 text-xs sm:text-sm">
                  {score}/{currentQuestionIndex + 1}
                </div>
              </div>
              <motion.button
                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:bg-white/20 text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSkip}
              >
                Пропустить
              </motion.button>
            </div>

            {/* Анимированный прогресс-бар */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Заголовок квиза */}
            <motion.h1
              className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-center mt-3 sm:mt-4"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {quiz.title}
            </motion.h1>
            
            <p className="text-white/70 text-center mt-1 text-xs sm:text-sm">
              Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
            </p>
          </div>

          {/* Достижения */}
          <AnimatePresence>
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement + index}
                className="absolute top-20 right-4 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg text-white font-bold shadow-lg z-20"
                initial={{ opacity: 0, x: 100, rotate: 10 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: 100, rotate: -10 }}
                transition={{ duration: 0.5 }}
                onAnimationComplete={() => {
                  setTimeout(() => {
                    setAchievements(prev => prev.slice(1));
                  }, 2000);
                }}
              >
                {achievement}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Карточка с вопросом */}
          <motion.div
            className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20"
            layout
            animate={{ 
              scale: showExplanation ? 1.02 : 1,
              borderColor: selectedAnswer !== null 
                ? selectedAnswer === currentQuestion.correctAnswer 
                  ? 'rgba(34, 197, 94, 0.5)' 
                  : 'rgba(239, 68, 68, 0.5)'
                : 'rgba(255, 255, 255, 0.2)'
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="text-lg sm:text-xl text-white font-bold mb-4 sm:mb-6 text-center leading-tight"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {currentQuestion.question}
            </motion.h2>

            <div className="grid gap-2 sm:gap-3 mb-4 sm:mb-6">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all duration-300 relative overflow-hidden text-sm sm:text-base ${
                    selectedAnswer === index
                      ? showExplanation
                        ? index === currentQuestion.correctAnswer
                          ? 'bg-green-500/30 border-2 border-green-500 text-white'
                          : 'bg-red-500/30 border-2 border-red-500 text-white'
                        : 'bg-blue-500/30 border-2 border-blue-500 text-white'
                      : 'bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 text-white/90'
                  }`}
                  whileHover={!showExplanation ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!showExplanation ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation || selectedAnswer !== null}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center relative z-10">
                    <motion.span 
                      className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full mr-2 sm:mr-3 text-xs sm:text-sm font-bold ${
                        selectedAnswer === index
                          ? index === currentQuestion.correctAnswer && showExplanation
                            ? 'bg-green-500 text-white'
                            : selectedAnswer === index && showExplanation && index !== currentQuestion.correctAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-blue-500 text-white'
                          : 'bg-white/20 text-white/80'
                      }`}
                      animate={selectedAnswer === index ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {String.fromCharCode(65 + index)}
                    </motion.span>
                    <span className="flex-1 leading-tight">{option}</span>
                    
                    {/* Иконки результата */}
                    <AnimatePresence>
                      {showExplanation && selectedAnswer === index && (
                        <motion.span
                          className="text-lg sm:text-xl ml-1 sm:ml-2"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.5, type: "spring" }}
                        >
                          {index === currentQuestion.correctAnswer ? '✅' : '❌'}
                        </motion.span>
                      )}
                      {showExplanation && index === currentQuestion.correctAnswer && selectedAnswer !== index && (
                        <motion.span
                          className="text-lg sm:text-xl ml-1 sm:ml-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          ✅
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Shine эффект для правильного ответа */}
                  {showExplanation && index === currentQuestion.correctAnswer && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-300, 300] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Объяснение */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  className="bg-white/5 border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl">💡</span>
                    <div>
                      <p className="text-white/90 leading-relaxed text-sm sm:text-base">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Кнопка "Далее" */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  className="flex justify-center mt-4 sm:mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold relative overflow-hidden text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextQuestion}
                  >
                    <span className="relative z-10">
                      {isLastQuestion ? 'Завершить' : 'Далее →'}
                    </span>
                    {/* Shine эффект */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-100, 200] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      ) : (
        /* Результаты квиза */
        <motion.div
          className="w-full max-w-lg bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/20"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <motion.div
            className="text-3xl sm:text-4xl mb-3 sm:mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            🎉
          </motion.div>
          
          <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-4 sm:mb-6">
            Квиз завершен!
          </h2>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {score} / {quiz.questions.length}
              </div>
              <div className="text-white/70 text-xs sm:text-sm">Правильных</div>
            </div>
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-1">
                {xp}
              </div>
              <div className="text-white/70 text-xs sm:text-sm">XP</div>
            </div>
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">
                {maxStreak}
              </div>
              <div className="text-white/70 text-xs sm:text-sm">Серия</div>
            </div>
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3">
              <div className="text-2xl sm:text-3xl font-bold text-purple-500 mb-1">
                {Math.round((score / quiz.questions.length) * 100)}%
              </div>
              <div className="text-white/70 text-xs sm:text-sm">Точность</div>
            </div>
          </div>
          
          <motion.p 
            className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base leading-tight"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {score === quiz.questions.length 
              ? 'Невероятно! Идеальный результат! 🏆' 
              : score >= quiz.questions.length * 0.8 
                ? 'Отличная работа! 🌟' 
                : score >= quiz.questions.length * 0.6
                  ? 'Хороший результат! 📚'
                  : 'Есть куда расти! 💪'}
          </motion.p>
          
          <motion.button
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-sm sm:text-base relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
          >
            <span className="relative z-10">Продолжить</span>
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
              animate={{ x: [-200, 200] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.button>
        </motion.div>
      )}

      {/* Эффекты правильного/неправильного ответа */}
      <AnimatePresence>
        {showCorrectEffect && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* Зеленые частицы */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-green-500 rounded-full"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 50}%`,
                  top: `${50 + (Math.random() - 0.5) * 50}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [1, 0.8, 0],
                  y: [0, -150],
                  x: [(Math.random() - 0.5) * 300],
                }}
                transition={{ duration: 1.5 }}
              />
            ))}
            <motion.div
              className="absolute inset-0 bg-green-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
        
        {showWrongEffect && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <motion.div
              className="absolute inset-0 bg-red-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{ x: [-5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Финальное конфетти */}
      <AnimatePresence>
        {showResults && score === quiz.questions.length && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${
                  ['bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'][i % 5]
                } rounded-full`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                }}
                initial={{ y: -100 }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 720,
                  x: (Math.random() - 0.5) * 400,
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveQuizScreen; 
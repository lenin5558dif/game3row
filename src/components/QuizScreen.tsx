import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizData } from '../types/quiz';

type QuizScreenProps = {
  quiz: QuizData;
  onComplete: (score: number) => void;
  onSkip: () => void;
};

const QuizScreen: React.FC<QuizScreenProps> = ({ quiz, onComplete, onSkip }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;

    // Добавляем ответ в массив
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);

    // Если ответ правильный, увеличиваем счет
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    // Показываем объяснение
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    onComplete(score);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {!showResults ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-2">
              {quiz.title}
            </h1>
            <p className="text-white/70 text-sm mb-4">
              Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
            </p>
          </div>

          <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
            <h2 className="text-xl text-white font-medium mb-6">
              {currentQuestion.question}
            </h2>

            <div className="flex flex-col gap-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`p-4 rounded-xl text-left transition-colors ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? showExplanation
                        ? index === currentQuestion.correctAnswer
                          ? 'bg-green-500/30 border border-green-500'
                          : 'bg-red-500/30 border border-red-500'
                        : 'bg-violet-500/30 border border-violet-500'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  whileHover={!showExplanation ? { scale: 1.02 } : {}}
                  whileTap={!showExplanation ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 mr-3 text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-white/90">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-white/80 text-sm">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              <motion.button
                className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:bg-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSkip}
              >
                Пропустить
              </motion.button>

              {showExplanation && (
                <motion.button
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                >
                  {isLastQuestion ? 'Завершить' : 'Далее'}
                </motion.button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-4">
            Квиз завершен!
          </h2>
          
          <div className="text-5xl font-bold text-white mb-6">
            {score} / {quiz.questions.length}
          </div>
          
          <p className="text-white/70 mb-8">
            {score === quiz.questions.length 
              ? 'Отличный результат! Вы ответили на все вопросы правильно.' 
              : score >= quiz.questions.length / 2 
                ? 'Хороший результат! Вы знаете большую часть материала.' 
                : 'Неплохой результат. Возможно, стоит повторить материал.'}
          </p>
          
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
          >
            Продолжить
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default QuizScreen; 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Типы для квиза
type QuizOption = {
  text: string;
  isCorrect: boolean;
};

type QuizQuestion = {
  question: string;
  options: QuizOption[];
  explanation: string;
};

type QuizCardProps = {
  question: QuizQuestion;
  onClose: () => void;
  isVisible: boolean;
  onCorrectAnswer: () => void;
};

const QuizCard: React.FC<QuizCardProps> = ({ question, onClose, isVisible, onCorrectAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);
    
    // Если ответ правильный, вызываем колбэк
    if (question.options[index].isCorrect) {
      onCorrectAnswer();
    }
  };

  const handleContinue = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-2xl max-w-md relative m-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-2 -right-2">
              <motion.button
                className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                ×
              </motion.button>
            </div>
            
            <div className="mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">Проверьте ваши знания</h3>
            </div>
            
            <p className="text-gray-800 font-medium mb-4">{question.question}</p>
            
            <div className="space-y-2 mb-4">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${
                    selectedOption === index
                      ? option.isCorrect
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-red-100 border-red-500 text-red-800'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
                  whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
                  disabled={selectedOption !== null}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center border ${
                      selectedOption === index
                        ? option.isCorrect
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-red-500 border-red-500 text-white'
                        : 'border-gray-400'
                    }`}>
                      {selectedOption === index && (
                        option.isCorrect ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )
                      )}
                    </div>
                    {option.text}
                  </div>
                </motion.button>
              ))}
            </div>
            
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  className={`p-4 rounded-lg mt-4 ${
                    question.options[selectedOption!].isCorrect
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className={`text-sm ${
                    question.options[selectedOption!].isCorrect
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}>
                    {question.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {showExplanation && (
              <motion.button
                className="w-full mt-6 px-4 py-2 bg-pink-500 text-white rounded-full font-semibold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Продолжить
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizCard; 
import React from 'react';
import { motion } from 'framer-motion';
import { LessonData } from '../types/quiz';

type LessonScreenProps = {
  lesson: LessonData;
  onComplete: () => void;
  onSkip: () => void;
};

const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onComplete, onSkip }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-2">
          {lesson.title}
        </h1>
      </div>

      <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
        <div className="text-white/90 prose prose-invert prose-sm md:prose-base max-w-none whitespace-pre-line">
          {lesson.content}
        </div>

        <div className="flex justify-between mt-8">
          <motion.button
            className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:bg-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
          >
            Пропустить
          </motion.button>

          <motion.button
            className="px-8 py-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
          >
            Далее
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LessonScreen; 
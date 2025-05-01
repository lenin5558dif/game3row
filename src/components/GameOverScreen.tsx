import React from 'react';
import { motion } from 'framer-motion';

type GameOverScreenProps = {
  score: number;
  onRestart: () => void;
};

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <motion.div 
        className="text-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Время вышло!
        </h2>
        <p className="text-white/70 text-xl mb-2">
          Ваш результат:
        </p>
        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          {score} очков
        </p>
      </motion.div>

      <motion.button
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
      >
        Играть снова
      </motion.button>
    </motion.div>
  );
};

export default GameOverScreen; 
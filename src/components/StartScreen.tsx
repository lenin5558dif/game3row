import React from 'react';
import { motion } from 'framer-motion';

type StartScreenProps = {
  onStart: () => void;
  title?: string;
  subtitle?: string;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart, title = "EVERGLOW", subtitle = "три в ряд" }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div 
        className="text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 filter drop-shadow-lg tracking-wider mb-2">
          {title}
        </h1>
        <p className="text-white/70 text-xl">{subtitle}</p>
      </motion.div>

      <motion.button
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-medium text-lg
                   hover:opacity-90 transition-all transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
      >
        Начать игру
      </motion.button>
    </motion.div>
  );
};

export default StartScreen; 
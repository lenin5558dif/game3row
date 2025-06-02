import React from 'react';
import { motion } from 'framer-motion';

type StartScreenProps = {
  onStart: () => void;
  title: string;
  subtitle: string;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart, title, subtitle }) => {

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Анимированный логотип */}
      <motion.div
        className="text-8xl mb-8"
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1, 1.1, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ✨💎✨
      </motion.div>

      {/* Заголовок */}
      <motion.h1
        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {title}
      </motion.h1>

      {/* Подзаголовок */}
      <motion.p
        className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        {subtitle}
      </motion.p>

      {/* Кнопка начала игры */}
      <motion.button
        className="px-12 py-6 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-bold text-2xl hover:from-pink-600 hover:to-violet-600 transition-colors shadow-2xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Начать игру 🚀
      </motion.button>

      {/* Декоративные элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default StartScreen; 
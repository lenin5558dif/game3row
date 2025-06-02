import React from 'react';
import { motion } from 'framer-motion';

type HeaderProps = {
  score: number;
  currentLevel: number;
  timeLeft: number;
  onMainMenu: () => void;
};

const Header: React.FC<HeaderProps> = ({ score, currentLevel, timeLeft, onMainMenu }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Вычисляем цель уровня динамически
  const levelGoal = 500 + (currentLevel - 1) * 100;
  
  return (
    <motion.header 
      className="bg-white/10 backdrop-blur-sm p-2 sm:p-4 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-2">
        {/* Левая часть - Уровень и счет в компактном виде */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <motion.div 
            className="text-white text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm sm:text-base font-bold">Ур.{currentLevel}</div>
            <div className="text-xs text-white/70 hidden sm:block">
              {currentLevel === 1 ? 'Знакомство' : 
               currentLevel === 2 ? 'Процедуры' : 
               'Техники'}
            </div>
          </motion.div>
          
          <motion.div 
            className="text-white text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm sm:text-base font-bold">{score}/{levelGoal}</div>
            <div className="text-xs text-white/70">Очки</div>
          </motion.div>
        </div>

        {/* Центр - Таймер */}
        <motion.div 
          className="flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 border border-white/30">
            <div className="text-lg sm:text-2xl font-bold text-white text-center">
              {formatTime(timeLeft)}
            </div>
          </div>
        </motion.div>

        {/* Правая часть - Меню */}
        <div className="flex items-center">
          <motion.button
            className="px-2 py-1 sm:px-3 sm:py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-semibold transition-all duration-300 border border-white/30 text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMainMenu}
          >
            Меню
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 
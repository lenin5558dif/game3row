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
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        {/* Левая часть - Уровень и счет */}
        <div className="flex items-center space-x-3 sm:space-x-6 order-2 sm:order-1">
          <motion.div 
            className="text-white text-center sm:text-left"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm sm:text-lg md:text-xl font-bold">
              {currentLevel === 1 ? 'Знакомство с технологией' : 
               currentLevel === 2 ? 'Процедуры и противопоказания' : 
               'Продвинутые техники'}
            </div>
            <div className="text-xs sm:text-sm text-white/70">Уровень {currentLevel}</div>
          </motion.div>
          
          <motion.div 
            className="text-white text-center sm:text-left"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm sm:text-lg md:text-xl font-bold">Цель: {levelGoal}</div>
            <div className="text-xs sm:text-sm text-white/70">Счет: {score}</div>
          </motion.div>
        </div>

        {/* Центр - Таймер */}
        <motion.div 
          className="flex items-center justify-center order-1 sm:order-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1 sm:px-4 sm:py-2 border border-white/30">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-white/70 text-center">
              Времени осталось
            </div>
          </div>
        </motion.div>

        {/* Правая часть - Бренд и меню */}
        <div className="flex items-center space-x-2 sm:space-x-4 order-3">
          <div className="text-right hidden lg:block">
            <div className="text-lg font-bold text-white">Everglow Beauty</div>
            <div className="text-sm text-white/70">Лазерная эпиляция</div>
          </div>
          
          <motion.button
            className="px-3 py-1 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-semibold transition-all duration-300 border border-white/30 text-sm sm:text-base"
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
import React from 'react';
import { motion } from 'framer-motion';
import { LASER_LEVEL_NAMES, STUDIO_NAME } from '../data/laserTheme';

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
  
  // Получаем название уровня из лазерной темы
  const levelName = LASER_LEVEL_NAMES[currentLevel] || `Уровень ${currentLevel}`;
  
  return (
    <motion.header 
      className="bg-white/10 backdrop-blur-sm p-4 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Левая часть - Уровень и счет */}
        <div className="flex items-center space-x-6">
          <motion.div 
            className="text-white"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-lg md:text-xl font-bold">
              {currentLevel === 1 ? 'Знакомство с технологией' : 
               currentLevel === 2 ? 'Процедуры и противопоказания' : 
               'Продвинутые техники'}
            </div>
            <div className="text-sm text-white/70">Уровень {currentLevel}</div>
          </motion.div>
          
          <motion.div 
            className="text-white"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-lg md:text-xl font-bold">Цель: {levelGoal} очков</div>
            <div className="text-sm text-white/70">Счет: {score}</div>
          </motion.div>
        </div>

        {/* Центр - Таймер */}
        <motion.div 
          className="flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <div className="text-2xl md:text-3xl font-bold text-white text-center">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-white/70 text-center">
              Времени осталось
            </div>
          </div>
        </motion.div>

        {/* Правая часть - Бренд и меню */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <div className="text-lg font-bold text-white">Everglow Beauty</div>
            <div className="text-sm text-white/70">Лазерная эпиляция</div>
          </div>
          
          <motion.button
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-semibold transition-all duration-300 border border-white/30"
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
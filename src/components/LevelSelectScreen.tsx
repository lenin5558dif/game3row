import React from 'react';
import { motion } from 'framer-motion';
import { LASER_LEVEL_NAMES, STUDIO_NAME, STUDIO_TAGLINE } from '../data/laserTheme';

type LevelSelectScreenProps = {
  onLevelSelect: (level: number) => void;
  onBack: () => void;
  unlockedLevels: number;
};

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ onLevelSelect, onBack, unlockedLevels }) => {
  const levels = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div 
        className="text-center mb-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 filter drop-shadow-lg tracking-wider mb-2">
          {STUDIO_NAME}
        </h1>
        <p className="text-white/70 text-lg font-light italic mb-6">
          {STUDIO_TAGLINE}
        </p>
        <h2 className="text-2xl font-semibold text-white/90 mb-2">
          Учебные уровни
        </h2>
        <p className="text-white/60 text-sm max-w-md mx-auto">
          Пройдите все уровни, чтобы узнать о лазерной эпиляции и получить скидки на услуги
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 max-w-4xl">
        {levels.map((level) => {
          const isLocked = level > unlockedLevels;
          const levelName = LASER_LEVEL_NAMES[level];
          
          return (
            <motion.button
              key={level}
              className={`w-full md:w-64 py-6 px-4 backdrop-blur-sm rounded-2xl 
                       flex flex-col items-center justify-center gap-2 border
                       transition-all transform
                       ${isLocked 
                         ? 'bg-gray-500/20 border-white/5 cursor-not-allowed' 
                         : 'bg-gradient-to-br from-pink-500/20 to-violet-500/20 border-white/10 hover:border-white/30 hover:shadow-lg'
                       }`}
              whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              onClick={() => !isLocked && onLevelSelect(level)}
            >
              <span className={`text-3xl font-bold mb-1 ${isLocked ? 'text-white/30' : 'text-white/90'}`}>
                {level}
              </span>
              <span className={`text-md text-center ${isLocked ? 'text-white/30' : 'text-white/80 font-medium'}`}>
                {isLocked ? 'Закрыт' : levelName}
              </span>
              {!isLocked && (
                <div className="mt-2 bg-pink-500/20 px-3 py-1 rounded-full text-xs text-pink-200">
                  {level < unlockedLevels ? 'Пройден' : 'Доступен'}
                </div>
              )}
              {isLocked && (
                <div className="mt-2 flex items-center text-white/40 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Пройдите предыдущий уровень
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        className="mt-8 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 
                   hover:bg-white/20 transition-all transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
      >
        Назад
      </motion.button>
    </motion.div>
  );
};

export default LevelSelectScreen; 
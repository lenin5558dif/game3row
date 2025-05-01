import React from 'react';
import { motion } from 'framer-motion';

type LevelSelectScreenProps = {
  onLevelSelect: (level: number) => void;
  onBack: () => void;
  unlockedLevels: number;
};

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ onLevelSelect, onBack, unlockedLevels }) => {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div 
        className="text-center mb-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 filter drop-shadow-lg tracking-wider mb-2">
          Выберите уровень
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4 max-w-2xl">
        {levels.map((level) => {
          const isLocked = level > unlockedLevels;
          return (
            <motion.button
              key={level}
              className={`w-32 h-32 backdrop-blur-sm rounded-2xl 
                       flex flex-col items-center justify-center gap-2 border
                       transition-all transform
                       ${isLocked 
                         ? 'bg-gray-500/20 border-white/5 cursor-not-allowed' 
                         : 'bg-gradient-to-br from-pink-500/20 to-violet-500/20 border-white/10 hover:border-white/30 hover:scale-105'
                       }`}
              whileHover={!isLocked ? { scale: 1.05 } : {}}
              whileTap={!isLocked ? { scale: 0.95 } : {}}
              onClick={() => !isLocked && onLevelSelect(level)}
            >
              <span className={`text-4xl font-bold ${isLocked ? 'text-white/30' : 'text-white/90'}`}>
                {level}
              </span>
              <span className={`text-sm ${isLocked ? 'text-white/30' : 'text-white/70'}`}>
                {isLocked ? 'Закрыт' : 'Уровень'}
              </span>
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
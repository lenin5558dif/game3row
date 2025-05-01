import * as React from 'react';
import { motion } from 'framer-motion';
import Timer from './Timer';
import ScoreBoard from './ScoreBoard';

interface HeaderProps {
  score: number;
}

const Header: React.FC<HeaderProps> = ({ score }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full"
    >
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 blur-xl" />
      
      <div className="flex flex-col items-center gap-3">
        {/* Название и подзаголовок */}
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 filter drop-shadow-lg tracking-wider">
            EVERGLOW
          </h1>
          <p className="text-white/70 text-xs mt-0.5 uppercase tracking-wide">
            три в ряд
          </p>
        </motion.div>
        
        {/* Время и очки */}
        <div className="w-full flex justify-between items-center px-4">
          <Timer />
          <ScoreBoard score={score} />
        </div>
      </div>
    </motion.div>
  );
};

export default Header; 
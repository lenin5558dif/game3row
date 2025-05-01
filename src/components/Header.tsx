import React from 'react';
import { motion } from 'framer-motion';
import Timer from './Timer';

type HeaderProps = {
  score: number;
  onTimeUp: () => void;
  currentLevel: number;
};

const Header: React.FC<HeaderProps> = ({ score, onTimeUp, currentLevel }) => {
  return (
    <motion.div 
      className="flex justify-between items-center w-full px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
          <div className="text-sm text-white/70">Уровень</div>
          <div className="text-2xl font-bold text-white/90">{currentLevel}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
          <div className="text-sm text-white/70">Очки</div>
          <div className="text-2xl font-bold text-white/90">{score}</div>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
        <div className="text-sm text-white/70">Время</div>
        <Timer onTimeUp={onTimeUp} />
      </div>
    </motion.div>
  );
};

export default Header; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type TimerProps = {
  onTimeUp: () => void;
  extraTime?: number;
};

const Timer: React.FC<TimerProps> = ({ onTimeUp, extraTime = 0 }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 1 минута
  const [showExtraTime, setShowExtraTime] = useState(false);

  // Обновляем таймер при изменении extraTime
  useEffect(() => {
    if (extraTime > 0) {
      setTimeLeft(prev => prev + extraTime);
      setShowExtraTime(true);
      
      // Скрываем индикатор дополнительного времени через 2 секунды
      const timeout = setTimeout(() => {
        setShowExtraTime(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [extraTime]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative">
      <motion.div
        key={timeLeft}
        initial={{ scale: 1 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
        className="text-2xl font-bold text-white/90"
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </motion.div>
      
      {/* Индикатор дополнительного времени */}
      {showExtraTime && (
        <motion.div 
          className="absolute -top-6 left-0 right-0 text-center text-green-300 font-medium text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          +{extraTime} сек
        </motion.div>
      )}
    </div>
  );
};

export default Timer; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type TimerProps = {
  onTimeUp: () => void;
};

const Timer: React.FC<TimerProps> = ({ onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 1 минута

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
    <motion.div
      key={timeLeft}
      initial={{ scale: 1 }}
      animate={{ scale: 1.2 }}
      transition={{ duration: 0.2 }}
      className="text-2xl font-bold text-white/90"
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </motion.div>
  );
};

export default Timer; 
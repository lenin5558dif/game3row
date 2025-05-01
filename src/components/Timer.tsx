import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Timer = () => {
  const [time, setTime] = useState(300); // 5 минут в секундах

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime: number) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-white shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-sm font-medium">Время</div>
      <motion.div 
        className="text-3xl font-bold"
        key={time}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {formatTime(time)}
      </motion.div>
    </motion.div>
  );
};

export default Timer; 
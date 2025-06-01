import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type TimerProps = {
  onTimeUp: () => void;
  extraTime: number;
  onTimeUpdate: (time: number) => void;
};

const Timer: React.FC<TimerProps> = ({ onTimeUp, extraTime, onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const lastExtraTimeRef = useRef(0);
  const boosterUsageCountRef = useRef(0);

  useEffect(() => {
    // Только первый раз устанавливаем время, при последующих рендерах не сбрасываем
    if (timeLeft === 60 && lastExtraTimeRef.current === 0) {
      setTimeLeft(60);
    }
  }, []);

  useEffect(() => {
    // Передаем время в родительский компонент
    onTimeUpdate(timeLeft);
  }, [timeLeft, onTimeUpdate]);

  useEffect(() => {
    if (extraTime > lastExtraTimeRef.current) {
      const timeToAdd = extraTime - lastExtraTimeRef.current;
      console.log(`Добавляем время: +${timeToAdd}сек`);
      setTimeLeft(prev => {
        const newTime = prev + timeToAdd;
        console.log(`Новое время: ${newTime}сек`);
        return newTime;
      });
      
      lastExtraTimeRef.current = extraTime;
      boosterUsageCountRef.current += 1;
    }
  }, [extraTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  // Компонент теперь невидимый, так как время отображается в Header
  return null;
};

export default Timer; 
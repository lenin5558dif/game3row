import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type TimerProps = {
  onTimeUp: () => void;
  extraTime?: number;
};

const Timer: React.FC<TimerProps> = ({ onTimeUp, extraTime = 0 }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 1 минута
  const [showExtraTime, setShowExtraTime] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const extraTimeAddedRef = useRef<number>(0);
  
  // Запускаем таймер при монтировании
  useEffect(() => {
    // Инициализируем начальное время только при первом рендере
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    
    // Создаем функцию обновления таймера
    const updateTimer = () => {
      if (startTimeRef.current === null) return;
      
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTimeRef.current + pausedTimeRef.current) / 1000);
      const newTimeLeft = Math.max(0, 60 - elapsedSeconds + extraTimeAddedRef.current);
      
      // Обновляем состояние timeLeft
      setTimeLeft(newTimeLeft);
      
      // Если время вышло, вызываем колбэк
      if (newTimeLeft === 0) {
        onTimeUp();
        if (timerRef.current) {
          cancelAnimationFrame(timerRef.current);
          timerRef.current = null;
        }
        return;
      }
      
      // Запрашиваем следующий кадр
      timerRef.current = requestAnimationFrame(updateTimer);
    };
    
    // Запускаем анимацию
    timerRef.current = requestAnimationFrame(updateTimer);
    
    // Очищаем таймер при размонтировании
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [onTimeUp]);

  // Обновляем таймер при изменении extraTime
  useEffect(() => {
    if (extraTime > 0 && extraTime !== extraTimeAddedRef.current) {
      const additionalTime = extraTime - extraTimeAddedRef.current;
      extraTimeAddedRef.current = extraTime;
      setShowExtraTime(true);
      
      // Скрываем индикатор дополнительного времени через 2 секунды
      const timeout = setTimeout(() => {
        setShowExtraTime(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [extraTime]);

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
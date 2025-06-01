import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type LevelResultScreenProps = {
  isWon: boolean;
  score: number;
  targetScore: number;
  currentLevel: number;
  onContinue: () => void;
  onMainMenu: () => void;
};

const LevelResultScreen: React.FC<LevelResultScreenProps> = ({
  isWon,
  score,
  targetScore,
  currentLevel,
  onContinue,
  onMainMenu
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isWon) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 2000);
  }, [isWon]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Конфетти для победы */}
      <AnimatePresence>
        {showConfetti && isWon && (
          <div className="fixed inset-0 pointer-events-none z-30">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${
                  ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-pink-400', 'bg-purple-400'][i % 5]
                } rounded-full`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                }}
                initial={{ y: -100, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 720 + Math.random() * 720,
                  x: (Math.random() - 0.5) * 300,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Частицы для любого результата */}
      <AnimatePresence>
        {showParticles && (
          <div className="fixed inset-0 pointer-events-none z-20">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 ${
                  isWon ? 'bg-yellow-300' : 'bg-gray-400'
                } rounded-full`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 1,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Основное содержимое */}
      <motion.div
        className="bg-gradient-to-br from-indigo-900/95 via-purple-800/95 to-pink-800/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12 border border-white/20 shadow-2xl max-w-lg w-full mx-auto text-center relative overflow-hidden my-auto"
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          damping: 20, 
          stiffness: 300,
          delay: 0.2 
        }}
      >
        {/* Фоновое свечение */}
        <div className={`absolute inset-0 ${
          isWon 
            ? 'bg-gradient-to-r from-green-500/10 to-yellow-500/10' 
            : 'bg-gradient-to-r from-red-500/10 to-orange-500/10'
        } rounded-3xl`} />

        {/* Иконка результата */}
        <motion.div
          className="text-6xl md:text-8xl mb-4 md:mb-6 relative z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            damping: 15, 
            stiffness: 200,
            delay: 0.5 
          }}
        >
          {isWon ? '🏆' : '💥'}
        </motion.div>

        {/* Заголовок */}
        <motion.h1
          className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 ${
            isWon
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400'
              : 'bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {isWon ? 'Победа!' : 'Время вышло!'}
        </motion.h1>

        {/* Подзаголовок */}
        <motion.p
          className="text-lg md:text-xl text-white/90 mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {isWon 
            ? `Уровень ${currentLevel} пройден!` 
            : `Уровень ${currentLevel} не пройден`
          }
        </motion.p>

        {/* Статистика */}
        <motion.div
          className="bg-white/10 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl md:text-2xl font-bold text-white">{score}</div>
              <div className="text-white/70 text-sm">Ваш счет</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-white">{targetScore}</div>
              <div className="text-white/70 text-sm">Цель</div>
            </div>
          </div>
          
          {/* Прогресс бар */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                className={`h-3 rounded-full ${
                  isWon 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                    : 'bg-gradient-to-r from-red-400 to-orange-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((score / targetScore) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 1.3 }}
              />
            </div>
            <div className="text-white/70 text-sm mt-2">
              {Math.round((score / targetScore) * 100)}% от цели
            </div>
          </div>
        </motion.div>

        {/* Результат */}
        <motion.div
          className={`text-base md:text-lg font-semibold mb-6 md:mb-8 p-3 md:p-4 rounded-xl ${
            isWon
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          {isWon 
            ? `Отлично! Вы набрали ${score - targetScore} дополнительных очков!`
            : `Не хватило ${targetScore - score} очков до победы`
          }
        </motion.div>

        {/* Кнопки */}
        <div className="space-y-3 md:space-y-4">
          {/* Кнопка продолжения */}
          <motion.button
            className={`w-full px-6 md:px-8 py-3 md:py-4 rounded-full text-white font-bold text-base md:text-lg shadow-lg transition-all duration-300 relative overflow-hidden ${
              isWon
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
          >
            <span className="relative z-10">
              {isWon 
                ? 'Идем дальше'
                : 'Попробовать снова'
              }
            </span>
            
            {/* Shine эффект */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.button>

          {/* Кнопка выхода в меню */}
          <motion.button
            className="w-full px-6 md:px-8 py-3 md:py-4 rounded-full text-white font-bold text-base md:text-lg shadow-lg transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onMainMenu}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
          >
            <span className="relative z-10">
              В главное меню
            </span>
            
            {/* Shine эффект */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LevelResultScreen; 
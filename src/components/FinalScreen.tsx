import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FinalScreenProps = {
  onMainMenu: () => void;
  totalScore: number;
};

const FinalScreen: React.FC<FinalScreenProps> = ({ onMainMenu, totalScore }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [promocodeCopied, setPromocodeCopied] = useState(false);

  const promocode = "ИГРА";
  const discount = 5;

  const copyPromocode = async () => {
    try {
      await navigator.clipboard.writeText(promocode);
      setPromocodeCopied(true);
      setTimeout(() => setPromocodeCopied(false), 3000);
    } catch (err) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = promocode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setPromocodeCopied(true);
      setTimeout(() => setPromocodeCopied(false), 3000);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto p-6 text-center relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Конфетти */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-30">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-3 h-3 ${
                  ['bg-pink-500', 'bg-violet-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-red-500'][i % 6]
                } rounded-full`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                }}
                initial={{ y: -100, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 720 + Math.random() * 720,
                  x: (Math.random() - 0.5) * 400,
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  ease: "easeOut",
                  delay: Math.random() * 3,
                }}
                onAnimationComplete={() => {
                  if (i === 50) setShowConfetti(false);
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Поздравительный блок */}
      <motion.div
        className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-2xl w-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* Иконка трофея */}
        <motion.div
          className="text-8xl md:text-9xl mb-6"
          animate={{ 
            rotate: [0, -10, 10, -5, 5, 0],
            scale: [1, 1.1, 1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🏆
        </motion.div>

        {/* Заголовок */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-violet-500 mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Поздравляем!
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Вы успешно прошли все уровни!
        </motion.p>

        {/* Статистика */}
        <motion.div
          className="bg-white/5 rounded-2xl p-6 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-4xl font-bold text-white mb-2">{totalScore}</div>
          <div className="text-white/70">Общий счет за игру</div>
        </motion.div>

        {/* Промокод */}
        <motion.div
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <div className="text-green-300 font-bold text-lg mb-2">
            🎁 Специальное предложение!
          </div>
          <div className="text-white/90 mb-4">
            Вы получили промокод на дополнительную скидку <span className="font-bold text-green-300">{discount}%</span> в нашей клинике лазерной эпиляции!
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-mono font-bold text-white tracking-wider">
              {promocode}
            </div>
            <motion.button
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-w-[100px] ${
                promocodeCopied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyPromocode}
            >
              {promocodeCopied ? '✓ Скопировано!' : 'Скопировать'}
            </motion.button>
          </div>
          
          <div className="text-white/70 text-sm mt-3">
            Предъявите этот промокод при записи на процедуру
          </div>
        </motion.div>

        {/* Благодарность */}
        <motion.div
          className="text-white/80 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <p className="mb-4">
            Спасибо за игру! Теперь вы знаете все важные аспекты лазерной эпиляции.
          </p>
          <p>
            Мы будем рады видеть вас в нашей клинике! 💖
          </p>
        </motion.div>

        {/* Кнопка в главное меню */}
        <motion.button
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-bold text-lg hover:from-pink-600 hover:to-violet-600 transition-colors relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMainMenu}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <span className="relative z-10">Вернуться в главное меню</span>
          {/* Shine эффект */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-100, 300] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.button>
      </motion.div>

      {/* Фоновые частицы */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FinalScreen; 
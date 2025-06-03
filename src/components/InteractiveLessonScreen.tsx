import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { LessonData } from '../types/quiz';

type InteractiveLessonScreenProps = {
  lesson: LessonData;
  onComplete: () => void;
  onSkip: () => void;
};

// Разбиваем контент урока на блоки для карточек
const splitContentIntoCards = (content: string) => {
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  return paragraphs.map((paragraph, index) => ({
    id: index,
    content: paragraph.trim(),
    type: paragraph.includes('•') ? 'list' : 'text'
  }));
};

const InteractiveLessonScreen: React.FC<InteractiveLessonScreenProps> = ({ 
  lesson, 
  onComplete, 
  onSkip 
}) => {
  const cards = splitContentIntoCards(lesson.content);
  const [currentCard, setCurrentCard] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showParticles, setShowParticles] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  const progress = ((currentCard + 1) / cards.length) * 100;

  // Particle эффект при переходе на новую карточку
  const triggerParticles = () => {
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
  };

  // Конфетти при завершении урока
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Переход к следующей карточке
  const nextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setXp(prev => prev + 10);
      triggerParticles();
      
      // Достижения
      if (currentCard + 1 === Math.floor(cards.length / 2)) {
        setAchievements(prev => [...prev, 'Половина пути! 🔥']);
      }
    } else {
      // Завершение урока
      setXp(prev => prev + 50);
      setAchievements(prev => [...prev, 'Урок завершен! 🎓']);
      triggerConfetti();
      setTimeout(onComplete, 2000);
    }
  };

  // Swipe навигация
  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x < -threshold && currentCard < cards.length - 1) {
      nextCard();
    } else if (info.offset.x > threshold && currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  // Flip карточки
  const flipCard = (cardId: number) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
      setXp(prev => prev + 5);
    }
    setFlippedCards(newFlipped);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-3xl mx-auto p-2 sm:p-4 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Фоновые частицы */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header с прогрессом и статистикой */}
      <div className="w-full mb-4 sm:mb-6 z-10">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 rounded-full text-white font-bold text-xs sm:text-sm"
              animate={{ scale: xp > 0 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              XP: {xp}
            </motion.div>
            <div className="text-white/70 text-xs sm:text-sm">
              {currentCard + 1} / {cards.length}
            </div>
          </div>
          <motion.button
            className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:bg-white/20 text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
          >
            Пропустить
          </motion.button>
        </div>

        {/* Анимированный прогресс-бар */}
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Заголовок урока */}
        <motion.h1
          className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-center mt-3 sm:mt-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {lesson.title}
        </motion.h1>
      </div>

      {/* Достижения */}
      <AnimatePresence>
        {achievements.map((achievement, _) => (
          <motion.div
            key={achievement}
            className="absolute top-16 right-2 sm:right-4 bg-gradient-to-r from-green-500 to-emerald-500 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-white font-bold shadow-lg z-20 text-xs sm:text-sm"
            initial={{ opacity: 0, x: 100, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: 100, rotate: -10 }}
            transition={{ duration: 0.5 }}
          >
            {achievement}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Главная карточка */}
      <div className="relative w-full max-w-lg h-[250px] sm:h-[300px] md:h-[350px] perspective-1000">
        <motion.div
          className="w-full h-full cursor-pointer"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 0.95 }}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ 
              rotateY: flippedCards.has(currentCard) ? 180 : 0 
            }}
            transition={{ duration: 0.6 }}
            onClick={() => flipCard(currentCard)}
          >
            {/* Передняя сторона карточки */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg sm:rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 p-3 sm:p-6 flex flex-col justify-center">
              <div className="text-white/90 text-sm sm:text-base leading-relaxed">
                {cards[currentCard]?.type === 'list' ? (
                  <div className="space-y-2 sm:space-y-3">
                    {cards[currentCard].content.split('\n').map((line, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-2 sm:gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {line.trim().startsWith('•') ? (
                          <>
                            <span className="text-pink-400 mt-0.5 text-xs sm:text-sm">🔸</span>
                            <span className="text-xs sm:text-sm">{line.replace('•', '').trim()}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-violet-300 text-sm sm:text-base">{line}</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm leading-relaxed">{cards[currentCard]?.content}</p>
                )}
              </div>
              
              <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-white/50 text-xs">
                Нажмите для поворота
              </div>
            </div>

            {/* Задняя сторона карточки */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-600/30 to-pink-600/30 backdrop-blur-sm border border-violet-400/30 p-3 sm:p-6 flex flex-col justify-center"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎓</div>
                <div className="text-white text-sm sm:text-base mb-2 sm:mb-3">
                  Отлично! Вы изучили эту информацию
                </div>
                <div className="text-violet-300 text-xs sm:text-sm">
                  +5 XP за изучение карточки
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Навигационные точки */}
      <div className="flex gap-1.5 sm:gap-2 mt-4 sm:mt-6 mb-3 sm:mb-4">
        {cards.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentCard 
                ? 'bg-gradient-to-r from-pink-500 to-violet-500' 
                : index < currentCard 
                  ? 'bg-green-500' 
                  : 'bg-white/20'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentCard(index)}
          />
        ))}
      </div>

      {/* Кнопки управления */}
      <div className="flex gap-3 sm:gap-4">
        <motion.button
          className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white disabled:opacity-50 text-sm sm:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
          disabled={currentCard === 0}
        >
          ← Назад
        </motion.button>

        <motion.button
          className="px-5 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-semibold relative overflow-hidden text-sm sm:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextCard}
        >
          <span className="relative z-10">
            {currentCard === cards.length - 1 ? 'Завершить' : 'Далее →'}
          </span>
          {/* Shine эффект */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-100, 200] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.button>
      </div>

      {/* Particle эффекты при переходах */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 100}%`,
                  top: `${50 + (Math.random() - 0.5) * 100}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [1, 0.8, 0],
                  y: [0, -100],
                  x: [(Math.random() - 0.5) * 200],
                  rotate: [0, 360],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Конфетти при завершении */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-3 h-3 ${
                  ['bg-pink-500', 'bg-violet-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'][i % 5]
                } rounded-full`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                }}
                initial={{ y: -100, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 720,
                  x: (Math.random() - 0.5) * 200,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 1,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveLessonScreen; 
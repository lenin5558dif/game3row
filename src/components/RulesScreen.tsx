import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GamePieceIcon from './GamePieceIcon';

type RulesScreenProps = {
  onContinue: () => void;
  onBack: () => void;
};

const RulesScreen: React.FC<RulesScreenProps> = ({ onContinue, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showParticles] = useState(true);
  const [demoBoard, setDemoBoard] = useState<string[][]>([]);
  const [selectedPieces, setSelectedPieces] = useState<{x: number, y: number}[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Создаем демонстрационную доску
  useEffect(() => {
    const initialBoard = [
      ['manipula', 'couch', 'specialist', 'client'],
      ['client', 'manipula', 'manipula', 'manipula'],
      ['specialist', 'couch', 'client', 'specialist'],
      ['machine', 'machine', 'machine', 'unicorn']
    ];
    setDemoBoard(initialBoard);
  }, []);

  // Анимация демонстрации совпадения
  const demonstrateMatch = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Показываем линию из 3 manipula
    setSelectedPieces([{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}]);
    
    setTimeout(() => {
      setSelectedPieces([]);
      setIsAnimating(false);
    }, 2000);
  };

  const pages = [
    // Страница 1: Добро пожаловать
    {
      title: "🌟 Добро пожаловать!",
      content: (
        <div className="text-center space-y-3 sm:space-y-4">
          <motion.div
            className="text-4xl sm:text-6xl mb-2 sm:mb-4"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            💎✨🎮
          </motion.div>
          
          <motion.p 
            className="text-base sm:text-lg text-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Погрузитесь в мир лазерной эпиляции через увлекательную игру! 
            Соединяйте элементы, изучайте процедуры и становитесь экспертом.
          </motion.p>
          
          <motion.div
            className="flex justify-center space-x-2 sm:space-x-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            {['manipula', 'couch', 'specialist', 'client', 'machine', 'unicorn'].map((type, i) => (
              <motion.div
                key={type}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <GamePieceIcon type={type as any} currentLevel={1} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )
    },

    // Страница 2: Основы игры
    {
      title: "🎯 Основы игры",
      content: (
        <div className="space-y-3 sm:space-y-4">
          <motion.div
            className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 sm:mb-3">🎮 Цель игры</h3>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Соединяйте 3 или более одинаковых элементов в линию, чтобы они исчезли и принесли очки. 
              Достигните целевого счета до окончания времени!
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-2 sm:mb-3">⚡ Управление</h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-3 text-white/90">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl">👆</span>
                <span className="text-xs sm:text-sm">Нажмите на фишку для выбора</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl">🔄</span>
                <span className="text-xs sm:text-sm">Нажмите на соседнюю для обмена</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl">📱</span>
                <span className="text-xs sm:text-sm">Свайпы на мобильных</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl">🎯</span>
                <span className="text-xs sm:text-sm">Соединяйте 3+ одинаковых</span>
              </div>
            </div>
          </motion.div>
        </div>
      )
    },

    // Страница 3: Демонстрация
    {
      title: "🎲 Попробуем!",
      content: (
        <div className="space-y-3 sm:space-y-4">
          <motion.p 
            className="text-sm sm:text-base text-white/90 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Нажмите на доску ниже, чтобы увидеть пример совпадения:
          </motion.p>
          
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div 
              className="grid grid-cols-4 gap-1 sm:gap-2 p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all duration-300"
              onClick={demonstrateMatch}
            >
              {demoBoard.map((row, y) =>
                row.map((type, x) => (
                  <motion.div
                    key={`${x}-${y}`}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      selectedPieces.some(p => p.x === x && p.y === y)
                        ? 'bg-yellow-400/30 ring-2 ring-yellow-400 scale-110'
                        : 'bg-white/20'
                    }`}
                    animate={selectedPieces.some(p => p.x === x && p.y === y) ? {
                      scale: [1, 1.2, 1],
                      boxShadow: ['0 0 0px #facc15', '0 0 20px #facc15', '0 0 0px #facc15']
                    } : {}}
                    transition={{ duration: 0.6, repeat: selectedPieces.length > 0 ? Infinity : 0 }}
                  >
                    <GamePieceIcon type={type as any} currentLevel={1} />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {selectedPieces.length > 0 && (
            <motion.div
              className="text-center text-yellow-400 font-bold text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🎉 Отлично! Эти 3 манипулы исчезнут и принесут очки!
            </motion.div>
          )}

          <motion.div
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-2 sm:p-3 border border-blue-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white/90 text-center text-xs sm:text-sm">
              💡 <strong>Совет:</strong> Ищите возможности создать линии из 4-5 элементов для получения специальных бонусов!
            </p>
          </motion.div>
        </div>
      )
    },

    // Страница 4: Готовы начать
    {
      title: "🎉 Готовы начать?",
      content: (
        <div className="text-center space-y-3 sm:space-y-4">
          <motion.div
            className="text-3xl sm:text-4xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🚀✨🎮✨🚀
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-400/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-2 sm:mb-3">Что вас ждет:</h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-3 text-sm sm:text-base text-white/90">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl">🎯</span>
                <span>3 увлекательных уровня</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl">📚</span>
                <span>Обучающие уроки</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl">🧠</span>
                <span>Интерактивные квизы</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-lg sm:text-xl">🎁</span>
                <span>Промокод на скидку!</span>
              </div>
            </div>
          </motion.div>

          <motion.p 
            className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Пройдите все уровни, изучите секреты лазерной эпиляции и получите 
            <span className="text-yellow-400 font-bold"> промокод на 5% скидку</span> в нашей клинике!
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(251, 191, 36, 0.5)',
                  '0 0 40px rgba(251, 191, 36, 0.8)',
                  '0 0 20px rgba(251, 191, 36, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Готовы к игре? 🎮
            </motion.div>
          </motion.div>
        </div>
      )
    }
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onContinue();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      onBack();
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Анимированные частицы фона */}
      <AnimatePresence>
        {showParticles && (
          <div className="fixed inset-0 pointer-events-none z-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Заголовок */}
      <motion.div
        className="text-center py-2 sm:py-4 relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
          Правила игры
        </h1>
        <p className="text-white/70 text-sm sm:text-base mt-1">
          Страница {currentPage + 1} из {pages.length}
        </p>
      </motion.div>

      {/* Прогресс-бар */}
      <div className="px-4 sm:px-8 mb-2 sm:mb-4 relative z-10">
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-pink-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 px-3 sm:px-4 md:px-6 relative z-10 flex flex-col">
        <div className="max-w-2xl mx-auto flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20 flex-1 flex flex-col justify-center min-h-[300px] max-h-[400px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-base sm:text-lg md:text-xl font-bold text-center mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {pages[currentPage].title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {pages[currentPage].content}
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          {/* Навигация перенесена под контент */}
          <motion.div
            className="flex justify-between items-center py-3 sm:py-4 relative z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              className="px-3 py-2 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white font-semibold transition-all duration-300 border border-white/30 text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevPage}
            >
              {currentPage === 0 ? '← Назад' : '← Пред.'}
            </motion.button>

            <div className="flex space-x-1 sm:space-x-2">
              {pages.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentPage 
                      ? 'bg-yellow-400' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(index)}
                />
              ))}
            </div>

            <motion.button
              className={`px-3 py-2 sm:px-4 sm:py-2 font-semibold rounded-full transition-all duration-300 text-xs sm:text-sm ${
                currentPage === pages.length - 1
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg'
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextPage}
            >
              {currentPage === pages.length - 1 ? 'Играть! 🚀' : 'След. →'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RulesScreen; 
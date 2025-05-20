import { motion } from 'framer-motion';

type Props = {
  score: number;
  onRestart: () => void;
  onMainMenu: () => void;
  onNextLevel: () => void;
  currentLevel: number;
  isLevelCompleted: boolean;
  maxLevel?: number;
};

const GameOverScreen = ({
  score,
  onRestart,
  onMainMenu,
  onNextLevel,
  currentLevel,
  isLevelCompleted,
  maxLevel = 10
}: Props) => {
  // Проверяем, последний ли это уровень
  const isLastLevel = currentLevel >= maxLevel;

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div 
        className="text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 filter drop-shadow-lg tracking-wider mb-2">
          {isLevelCompleted ? (isLastLevel ? 'Поздравляем!' : 'Уровень пройден!') : 'Игра окончена'}
        </h1>
        <p className="text-white/70">Уровень {currentLevel}</p>
      </motion.div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <div className="text-sm text-white/70 mb-2">Ваш результат</div>
        <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          {score}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLevelCompleted ? (
          <>
            {!isLastLevel && (
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextLevel}
            >
              Следующий уровень
            </motion.button>
            )}
            <motion.button
              className="px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
            >
              Играть снова
            </motion.button>
          </>
        ) : (
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
          >
            Играть снова
          </motion.button>
        )}
        <motion.button
          className="px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMainMenu}
        >
          В главное меню
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameOverScreen; 
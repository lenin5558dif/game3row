import { motion } from 'framer-motion';
import { LASER_LEVEL_NAMES, STUDIO_NAME } from '../data/laserTheme';

type Props = {
  score: number;
  currentLevel: number;
  onMainMenu: () => void;
};

const Header = ({ score, currentLevel, onMainMenu }: Props) => {
  // Вычисляем цель уровня
  const levelGoal = 500 + (currentLevel - 1) * 100;
  
  // Получаем название уровня из лазерной темы
  const levelName = LASER_LEVEL_NAMES[currentLevel] || `Уровень ${currentLevel}`;
  
  return (
    <header className="bg-white/10 backdrop-blur-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <div className="text-white/70">{levelName}</div>
          <div className="text-white/70 text-sm">Цель: <span className="font-semibold text-yellow-300">{levelGoal}</span> очков</div>
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            {score}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-white text-xs font-semibold bg-white/10 px-3 py-1 rounded-full">
            {STUDIO_NAME}
          </div>
          <motion.button
            className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMainMenu}
          >
            Меню
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header; 
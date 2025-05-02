import { motion } from 'framer-motion';
import Timer from './Timer';

type Props = {
  score: number;
  onTimeUp: () => void;
  currentLevel: number;
  onMainMenu: () => void;
};

const Header = ({ score, onTimeUp, currentLevel, onMainMenu }: Props) => {
  return (
    <header className="bg-white/10 backdrop-blur-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-white/70">Уровень {currentLevel}</div>
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            {score}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMainMenu}
          >
            Меню
          </motion.button>
          <Timer onTimeUp={onTimeUp} />
        </div>
      </div>
    </header>
  );
};

export default Header; 
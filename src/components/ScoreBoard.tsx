import { motion } from 'framer-motion';

type ScoreBoardProps = {
  score: number;
};

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-white shadow-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-sm font-medium">Очки</div>
      <motion.div 
        className="text-3xl font-bold"
        key={score}
        initial={{ scale: 1.2, color: '#00E0FF' }}
        animate={{ scale: 1, color: '#FFFFFF' }}
        transition={{ duration: 0.3 }}
      >
        {score}
      </motion.div>
    </motion.div>
  );
};

export default ScoreBoard; 
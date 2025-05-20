import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FactCardProps = {
  fact: string;
  onClose: () => void;
  isVisible: boolean;
};

const FactCard: React.FC<FactCardProps> = ({ fact, onClose, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-pink-500 to-purple-600 p-5 rounded-xl shadow-xl max-w-md text-white relative m-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-2 -right-2">
              <motion.button
                className="bg-white text-pink-600 w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                ×
              </motion.button>
            </div>
            
            <div className="mb-2 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold">Полезный факт</h3>
            </div>
            
            <p className="text-white/90 leading-relaxed">{fact}</p>
            
            <motion.div 
              className="mt-4 text-xs text-white/70 italic text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Everglow Beauty
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FactCard; 
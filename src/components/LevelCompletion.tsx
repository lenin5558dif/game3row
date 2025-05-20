import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LASER_LEVEL_COMPLETION } from '../data/laserTheme';
import PromoCode from './PromoCode';

type LevelCompletionProps = {
  level: number;
  onClose: () => void;
  isVisible: boolean;
};

const LevelCompletion: React.FC<LevelCompletionProps> = ({ level, onClose, isVisible }) => {
  const [showPromo, setShowPromo] = useState(false);
  
  // Получаем информацию о завершении уровня
  const completionInfo = LASER_LEVEL_COMPLETION.find(info => info.level === level);
  
  // Если данных нет, не показываем компонент
  if (!completionInfo) return null;
  
  // Парсим код и скидку из строки reward
  const promoMatch = completionInfo.reward.match(/Ваш промокод: (\w+) на (.+)/);
  const promoCode = promoMatch ? promoMatch[1] : '';
  const discount = promoMatch ? promoMatch[2] : '';

  return (
    <>
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
              className="bg-gradient-to-br from-purple-600 to-pink-500 p-6 rounded-xl shadow-2xl max-w-md text-white relative m-4"
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
              
              <div className="text-center">
                <motion.div 
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, delay: 0.2 }}
                >
                  <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold mb-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {completionInfo.title}
                </motion.h2>
                
                <motion.p 
                  className="text-white/80 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {completionInfo.message}
                </motion.p>
                
                <motion.div
                  className="bg-white/20 p-4 rounded-lg backdrop-blur-sm mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-white font-semibold mb-2">Ваша награда:</p>
                  <div className="text-lg font-bold">{completionInfo.reward}</div>
                </motion.div>
                
                <div className="flex justify-center space-x-3">
                  <motion.button
                    className="px-5 py-2 bg-white text-pink-600 rounded-full font-semibold shadow-lg"
                    whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={onClose}
                  >
                    Продолжить
                  </motion.button>
                  
                  <motion.button
                    className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold border border-white/40"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={() => setShowPromo(true)}
                  >
                    Показать промокод
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Компонент с промокодом */}
      <PromoCode 
        code={promoCode} 
        discount={discount} 
        isVisible={showPromo} 
        onClose={() => setShowPromo(false)} 
      />
    </>
  );
};

export default LevelCompletion; 
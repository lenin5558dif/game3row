import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PromoCodeProps = {
  code: string;
  discount: string;
  onClose: () => void;
  isVisible: boolean;
};

const PromoCode: React.FC<PromoCodeProps> = ({ code, discount, onClose, isVisible }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

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
            className="bg-white p-6 rounded-xl shadow-2xl max-w-md relative m-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-2 -right-2">
              <motion.button
                className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                ×
              </motion.button>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-pink-600 mb-2">Ваш промокод</h3>
              <p className="text-gray-600 mb-4">Используйте этот код при записи на процедуру</p>
              
              <motion.div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 px-6 rounded-lg text-xl font-bold tracking-wider mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {code}
              </motion.div>
              
              <div className="text-center mb-2">
                <p className="text-lg font-semibold text-purple-800">{discount}</p>
              </div>
              
              <motion.button
                className={`mt-4 px-6 py-2 rounded-full font-semibold transition-colors flex items-center justify-center mx-auto ${
                  isCopied ? 'bg-green-500 text-white' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                }`}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
              >
                {isCopied ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Скопировано
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Копировать код
                  </>
                )}
              </motion.button>
              
              <p className="mt-4 text-xs text-gray-500">
                Действителен до конца месяца. Промокод нельзя комбинировать с другими акциями.
              </p>
              
              <div className="mt-4 text-center">
                <a 
                  href="https://everglow-beauty.com/booking" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-pink-600 hover:text-pink-800 text-sm font-semibold"
                >
                  Записаться на процедуру →
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoCode; 
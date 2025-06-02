import React from 'react';
import { LASER_PIECE_NAMES, LASER_LEVEL_2_NAMES, LASER_LEVEL_3_NAMES } from '../data/laserTheme';

export type GamePieceType = 
  | 'manipula' | 'couch' | 'specialist' | 'client' | 'machine' | 'unicorn';  // Используются во всех уровнях

// Типы специальных бонусных фишек
export type BonusPieceType = 
  | 'bomb'            // Бомба (L или T образный матч)
  | 'superBomb';      // Супер-бомба (матч из 5 фишек)

type GamePieceIconProps = {
  type: GamePieceType;
  bonusType?: BonusPieceType;
  showTooltip?: boolean;
  currentLevel?: number;
};

const GamePieceIcon: React.FC<GamePieceIconProps> = ({ type, bonusType, showTooltip = false, currentLevel = 1 }) => {
  const getImagePath = () => {
    switch (type) {
      // Иконки для всех уровней
      case 'manipula':
        return '/assets/images/manipula.png';
      case 'couch':
        return '/assets/images/couch.png';
      case 'specialist':
        return '/assets/images/specialist.png';
      case 'client':
        return '/assets/images/client.png';
      case 'machine':
        return '/assets/images/machine.png';
      case 'unicorn':
        return '/assets/images/unicorn.png';
      default:
        return '/assets/images/manipula.png';
    }
  };

  // Получаем альтернативное имя из данных лазерной темы в зависимости от уровня
  const getLaserName = () => {
    switch (currentLevel) {
      case 2:
        return LASER_LEVEL_2_NAMES[type] || type;
      case 3:
        return LASER_LEVEL_3_NAMES[type] || type;
      default:
        return LASER_PIECE_NAMES[type] || type;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative group">
      <img 
        src={getImagePath()} 
        alt={type}
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain" 
        style={{
          filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.2))',
          opacity: 1
        }}
      />

      {bonusType && (
        <div className={`absolute inset-0 flex items-center justify-center ${
          bonusType === 'bomb' ? 'bg-purple-500/30 border-2 border-purple-500' :
          bonusType === 'superBomb' ? 'bg-red-500/30 border-2 border-red-500' :
          ''
        } rounded-lg`}>
          {bonusType === 'bomb' && <div className="w-6 h-6 rounded-full border-2 border-purple-500"></div>}
          {bonusType === 'superBomb' && <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center"><span className="text-xs text-red-500">★</span></div>}
        </div>
      )}

      {/* Всплывающая подсказка с названием фишки */}
      {showTooltip && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {getLaserName()}
        </div>
      )}
    </div>
  );
};

export default GamePieceIcon; 
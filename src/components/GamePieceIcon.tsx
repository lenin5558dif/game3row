import React from 'react';
import { LASER_PIECE_NAMES } from '../data/laserTheme';

export type GamePieceType = 
  | 'manipula' | 'couch' | 'specialist' | 'client' | 'machine' | 'unicorn'  // Уровень 1
  | 'harry' | 'hermione' | 'ron' | 'dumbledore' | 'snape' | 'voldemort'  // Уровень 2
  | 'luke' | 'vader' | 'grogu' | 'chewbacca' | 'yoda' | 'r2d2'  // Уровень 3
  | 'daenerys' | 'tyrion' | 'drogon' | 'nightking' | 'direwolf' | 'snow'  // Уровень 4
  | 'santa' | 'christmasTree' | 'gingerbread' | 'hotChocolate' | 'ornament' | 'dalmatian'  // Уровень 5
  | 'rhinoceros' | 'spitz' | 'cat' | 'lion' | 'elephant' | 'giraffe'  // Уровень 6
  | 'london' | 'thailand' | 'statue-of-liberty' | 'paris' | 'japan' | 'moscow';  // Уровень 7

// Типы специальных бонусных фишек
export type BonusPieceType = 
  | 'bomb'            // Бомба (L или T образный матч)
  | 'superBomb';      // Супер-бомба (матч из 5 фишек)

type GamePieceIconProps = {
  type: GamePieceType;
  bonusType?: BonusPieceType;
  showTooltip?: boolean;
};

const GamePieceIcon: React.FC<GamePieceIconProps> = ({ type, bonusType, showTooltip = false }) => {
  const getImagePath = () => {
    switch (type) {
      // Иконки для первого уровня
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
      // Иконки для второго уровня (Гарри Поттер)
      case 'harry':
        return '/assets/images/harry.png';
      case 'hermione':
        return '/assets/images/hermione.png';
      case 'ron':
        return '/assets/images/ron.png';
      case 'dumbledore':
        return '/assets/images/dumbledore.png';
      case 'snape':
        return '/assets/images/snape.png';
      case 'voldemort':
        return '/assets/images/voldemort.png';
      // Иконки для третьего уровня (Звёздные войны)
      case 'luke':
        return '/assets/images/luke.png';
      case 'vader':
        return '/assets/images/vader.png';
      case 'grogu':
        return '/assets/images/grogu.png';
      case 'chewbacca':
        return '/assets/images/chewbacca.png';
      case 'yoda':
        return '/assets/images/yoda.png';
      case 'r2d2':
        return '/assets/images/r2d2.png';
      // Иконки для четвертого уровня (Игра престолов)
      case 'daenerys':
        return '/assets/images/daenerys.png';
      case 'tyrion':
        return '/assets/images/tyrion.png';
      case 'drogon':
        return '/assets/images/drogon.png';
      case 'nightking':
        return '/assets/images/nightking.png';
      case 'direwolf':
        return '/assets/images/direwolf.png';
      case 'snow':
        return '/assets/images/snow.png';
      // Иконки для пятого уровня (Рождество)
      case 'santa':
        return '/assets/images/santa.png';
      case 'christmasTree':
        return '/assets/images/christmas-tree.png';
      case 'gingerbread':
        return '/assets/images/gingerbread.png';
      case 'hotChocolate':
        return '/assets/images/hot-chocolate.png';
      case 'ornament':
        return '/assets/images/ornament.png';
      case 'dalmatian':
        return '/assets/images/dalmatian.png';
      // Иконки для шестого уровня (Животные)
      case 'rhinoceros':
        return '/assets/images/rhinoceros.png';
      case 'spitz':
        return '/assets/images/spitz.png';
      case 'cat':
        return '/assets/images/cat.png';
      case 'lion':
        return '/assets/images/lion.png';
      case 'elephant':
        return '/assets/images/elephant.png';
      case 'giraffe':
        return '/assets/images/giraffe.png';
      // Иконки для 7-го уровня (Страны)
      case 'london':
        return '/assets/images/london.png';
      case 'thailand':
        return '/assets/images/thailand.png';
      case 'statue-of-liberty':
        return '/assets/images/statue-of-liberty.png';
      case 'paris':
        return '/assets/images/paris.png';
      case 'japan':
        return '/assets/images/japan.png';
      case 'moscow':
        return '/assets/images/moscow.png';
      default:
        return '/assets/images/manipula.png';
    }
  };

  // Получаем альтернативное имя из данных лазерной темы
  const getLaserName = () => {
    return LASER_PIECE_NAMES[type] || type;
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative group">
      <img 
        src={getImagePath()} 
        alt={type}
        className="w-8 h-8 md:w-10 md:h-10 object-contain" 
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
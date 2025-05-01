import React from 'react';

type GamePieceIconProps = {
  type: string;
};

const GamePieceIcon: React.FC<GamePieceIconProps> = ({ type }) => {
  const getImagePath = () => {
    switch (type) {
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
        return '/assets/images/manipula.png'; // используем manipula как дефолтную иконку
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <img 
        src={getImagePath()} 
        alt={type}
        className="w-8 h-8 md:w-10 md:h-10 object-contain" 
        style={{
          filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.2))',
          opacity: 1
        }}
      />
    </div>
  );
};

export default GamePieceIcon; 
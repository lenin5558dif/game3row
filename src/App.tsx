import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import GameBoard from './components/GameBoard';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import LevelSelectScreen from './components/LevelSelectScreen';

type GameState = 'start' | 'levelSelect' | 'playing' | 'gameOver';

// Типы бустеров
export type BoosterType = 'shuffle' | 'bomb' | 'extraTime';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState(10);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [boosters, setBoosters] = useState<{[key in BoosterType]: number}>({
    shuffle: 3,
    bomb: 2,
    extraTime: 1
  });
  const [extraTime, setExtraTime] = useState(0);

  // Загружаем бустеры из localStorage при инициализации
  useEffect(() => {
    const savedBoosters = localStorage.getItem('everglow_boosters');
    if (savedBoosters) {
      setBoosters(JSON.parse(savedBoosters));
    }
  }, []);

  // Сохраняем бустеры в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('everglow_boosters', JSON.stringify(boosters));
  }, [boosters]);

  const handleStartGame = () => {
    setGameState('levelSelect');
  };

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    setGameState('playing');
    setScore(0);
    setIsLevelCompleted(false);
    setExtraTime(0);
  };

  const handleGameOver = (finalScore: number) => {
    const levelThreshold = 500 + (currentLevel - 1) * 100;
    const isCompleted = finalScore >= levelThreshold;
    setIsLevelCompleted(isCompleted);
    
    // Разблокируем следующий уровень при прохождении текущего
    if (isCompleted && currentLevel === unlockedLevels && unlockedLevels < 10) {
      setUnlockedLevels(prev => prev + 1);

      // Даем бустеры в качестве награды за уровень
      setBoosters(prev => ({
        shuffle: prev.shuffle + 1,
        bomb: prev.bomb + 1,
        extraTime: prev.extraTime + 1
      }));
    }
    
    setScore(finalScore);
    setGameState('gameOver');
  };

  const handleRestart = () => {
    setScore(0);
    setGameState('playing');
    setIsLevelCompleted(false);
    setExtraTime(0);
  };

  const handleNextLevel = () => {
    if (currentLevel < 10) {
      setCurrentLevel(prev => prev + 1);
      setScore(0);
      setGameState('playing');
      setIsLevelCompleted(false);
      setExtraTime(0);
    }
  };

  const handleMainMenu = () => {
    setGameState('start');
  };

  const handleTimeUp = () => {
    handleGameOver(score);
  };

  // Обработчики бустеров
  const useBooster = (type: BoosterType) => {
    if (boosters[type] > 0) {
      setBoosters(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));

      if (type === 'extraTime') {
        setExtraTime(prev => prev + 15); // добавляем 15 секунд
      }

      return true;
    }
    return false;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <StartScreen onStart={handleStartGame} key="start" />
        )}
        
        {gameState === 'levelSelect' && (
          <LevelSelectScreen 
            onLevelSelect={handleLevelSelect}
            onBack={handleMainMenu}
            unlockedLevels={unlockedLevels}
            key="levelSelect"
          />
        )}
        
        {gameState === 'playing' && (
          <div className="h-full flex flex-col" key="playing">
            <Header 
              score={score} 
              currentLevel={currentLevel}
              onMainMenu={handleMainMenu}
              boosters={boosters}
              useBooster={useBooster}
              extraTime={extraTime}
              onTimeUp={handleTimeUp}
            />
            <GameBoard 
              onScoreUpdate={points => setScore(prev => prev + points)}
              currentLevel={currentLevel}
              useBomb={(x, y) => useBooster('bomb') ? {x, y} : null}
              useShuffle={() => useBooster('shuffle')}
              useExtraTime={() => useBooster('extraTime')}
              onTimeUp={handleTimeUp}
              extraTime={extraTime}
              boosters={boosters}
            />
          </div>
        )}
        
        {gameState === 'gameOver' && (
          <GameOverScreen
            score={score}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
            onNextLevel={handleNextLevel}
            currentLevel={currentLevel}
            isLevelCompleted={isLevelCompleted}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App; 
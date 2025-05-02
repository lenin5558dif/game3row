import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import GameBoard from './components/GameBoard';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import LevelSelectScreen from './components/LevelSelectScreen';

type GameState = 'start' | 'levelSelect' | 'playing' | 'gameOver';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);

  const handleStartGame = () => {
    setGameState('levelSelect');
  };

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    setGameState('playing');
    setScore(0);
    setIsLevelCompleted(false);
  };

  const handleGameOver = (finalScore: number) => {
    const levelThreshold = currentLevel * 500;
    const isCompleted = finalScore >= levelThreshold;
    setIsLevelCompleted(isCompleted);
    
    if (isCompleted && currentLevel === unlockedLevels && unlockedLevels < 10) {
      setUnlockedLevels(prev => prev + 1);
    }
    
    setScore(finalScore);
    setGameState('gameOver');
  };

  const handleRestart = () => {
    setScore(0);
    setGameState('playing');
    setIsLevelCompleted(false);
  };

  const handleNextLevel = () => {
    if (currentLevel < 10) {
      setCurrentLevel(prev => prev + 1);
      setScore(0);
      setGameState('playing');
      setIsLevelCompleted(false);
    }
  };

  const handleMainMenu = () => {
    setGameState('start');
  };

  const handleTimeUp = () => {
    handleGameOver(score);
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
              onTimeUp={handleTimeUp}
              currentLevel={currentLevel}
              onMainMenu={handleMainMenu}
            />
            <GameBoard 
              onScoreUpdate={points => setScore(prev => prev + points)}
              difficulty={currentLevel}
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
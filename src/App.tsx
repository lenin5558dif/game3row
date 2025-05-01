import { useState, type FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import GameBoard from './components/GameBoard';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';

type GameState = 'start' | 'playing' | 'gameOver';

const App: FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);

  const handleStartGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const handleGameOver = () => {
    setGameState('gameOver');
  };

  const handleScoreUpdate = (points: number) => {
    setScore(prev => prev + points);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 px-2 py-safe">
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <StartScreen onStartGame={handleStartGame} />
        )}
        
        {gameState === 'playing' && (
          <>
            <div className="flex-none">
              <Header score={score} onTimeUp={handleGameOver} />
            </div>
            <div className="flex-1 flex flex-col justify-start pt-8">
              <GameBoard onScoreUpdate={handleScoreUpdate} />
            </div>
          </>
        )}

        {gameState === 'gameOver' && (
          <GameOverScreen 
            score={score} 
            onRestart={handleStartGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App; 
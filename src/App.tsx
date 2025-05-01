import { useState } from 'react';
import GameBoard from './components/GameBoard';
import Header from './components/Header';

function App() {
  const [score, setScore] = useState(0);

  const handleScoreUpdate = (points: number) => {
    setScore(prev => prev + points);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 px-2 py-safe">
      <div className="flex-none">
        <Header score={score} />
      </div>
      <div className="flex-1 flex flex-col justify-start pt-8">
        <GameBoard onScoreUpdate={handleScoreUpdate} />
      </div>
    </div>
  );
}

export default App; 
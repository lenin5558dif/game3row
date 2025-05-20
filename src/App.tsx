import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GameBoard from './components/GameBoard';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import LevelSelectScreen from './components/LevelSelectScreen';
import GameOverScreen from './components/GameOverScreen';
import QuizScreen from './components/QuizScreen';
import LessonScreen from './components/LessonScreen';
import { STUDIO_NAME, STUDIO_TAGLINE } from './data/laserTheme';
import { quizzes } from './data/quizData';
import { lessons } from './data/lessonData';
import { ExtendedGameState, QuizResult } from './types/quiz';

export type BoosterType = 'shuffle' | 'bomb' | 'extraTime';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<ExtendedGameState>('start');
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [boosters, setBoosters] = useState<{[key in BoosterType]: number}>({
    shuffle: 3,
    bomb: 2,
    extraTime: 1
  });
  const [extraTime, setExtraTime] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [lessonsSeen, setLessonsSeen] = useState<string[]>([]);

  // Загружаем данные из localStorage при инициализации
  useEffect(() => {
    const savedBoosters = localStorage.getItem('everglow_boosters');
    if (savedBoosters) {
      setBoosters(JSON.parse(savedBoosters));
    }
    
    const savedUnlockedLevels = localStorage.getItem('everglow_unlocked_levels');
    if (savedUnlockedLevels) {
      setUnlockedLevels(parseInt(savedUnlockedLevels, 10));
    }

    const savedQuizResults = localStorage.getItem('everglow_quiz_results');
    if (savedQuizResults) {
      setQuizResults(JSON.parse(savedQuizResults));
    }

    const savedLessonsSeen = localStorage.getItem('everglow_lessons_seen');
    if (savedLessonsSeen) {
      setLessonsSeen(JSON.parse(savedLessonsSeen));
    }
  }, []);

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('everglow_boosters', JSON.stringify(boosters));
  }, [boosters]);
  
  useEffect(() => {
    localStorage.setItem('everglow_unlocked_levels', unlockedLevels.toString());
  }, [unlockedLevels]);

  useEffect(() => {
    localStorage.setItem('everglow_quiz_results', JSON.stringify(quizResults));
  }, [quizResults]);

  useEffect(() => {
    localStorage.setItem('everglow_lessons_seen', JSON.stringify(lessonsSeen));
  }, [lessonsSeen]);

  const handleStartGame = () => {
    setGameState('levelSelect');
  };

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    
    // Проверяем, видел ли пользователь урок для этого уровня
    const lessonId = `lesson-${level}`;
    if (!lessonsSeen.includes(lessonId)) {
      // Если нет, показываем урок перед игрой
      setGameState('lesson');
    } else {
      // Если да, переходим к игре
      startGame();
    }
  };

  const startGame = () => {
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
    if (isCompleted && currentLevel === unlockedLevels && unlockedLevels < 7) {
      setUnlockedLevels(prev => prev + 1);

      // Даем бустеры в качестве награды за уровень
      setBoosters(prev => ({
        shuffle: prev.shuffle + 1,
        bomb: prev.bomb + 1,
        extraTime: prev.extraTime + 1
      }));
    }
    
    setScore(finalScore);

    // Если уровень пройден и не пройден соответствующий квиз, показываем его
    const quizId = `quiz-${currentLevel}`;
    const quizCompleted = quizResults.some(r => r.quizId === quizId && r.completed);
    
    if (isCompleted && !quizCompleted) {
      setGameState('quiz');
    } else {
      setGameState('gameOver');
    }
  };

  const handleQuizComplete = (quizScore: number) => {
    const quizId = `quiz-${currentLevel}`;
    const totalQuestions = quizzes[currentLevel - 1].questions.length;
    
    // Сохраняем результаты квиза
    setQuizResults(prev => {
      const newResults = [...prev];
      const existingIndex = newResults.findIndex(r => r.quizId === quizId);
      
      const quizResult: QuizResult = {
        quizId,
        answers: [], // мы не сохраняем ответы для упрощения
        score: quizScore,
        completed: true
      };
      
      if (existingIndex !== -1) {
        newResults[existingIndex] = quizResult;
      } else {
        newResults.push(quizResult);
      }
      
      return newResults;
    });
    
    // Даем дополнительные бустеры за хорошие результаты
    if (quizScore === totalQuestions) {
      // 100% правильных ответов
      setBoosters(prev => ({
        shuffle: prev.shuffle + 2,
        bomb: prev.bomb + 2,
        extraTime: prev.extraTime + 2
      }));
    } else if (quizScore >= totalQuestions / 2) {
      // 50%+ правильных ответов
      setBoosters(prev => ({
        shuffle: prev.shuffle + 1,
        bomb: prev.bomb + 1,
        extraTime: prev.extraTime + 1
      }));
    }
    
    setGameState('gameOver');
  };

  const handleQuizSkip = () => {
    setGameState('gameOver');
  };

  const handleLessonComplete = () => {
    // Отмечаем урок как просмотренный
    const lessonId = `lesson-${currentLevel}`;
    if (!lessonsSeen.includes(lessonId)) {
      setLessonsSeen(prev => [...prev, lessonId]);
    }
    
    // Переходим к игре
    startGame();
  };

  const handleLessonSkip = () => {
    // Отмечаем урок как просмотренный, даже если его пропустили
    const lessonId = `lesson-${currentLevel}`;
    if (!lessonsSeen.includes(lessonId)) {
      setLessonsSeen(prev => [...prev, lessonId]);
    }
    
    // Переходим к игре
    startGame();
  };

  const handleRestart = () => {
    setScore(0);
    setGameState('playing');
    setIsLevelCompleted(false);
    setExtraTime(0);
  };

  const handleNextLevel = () => {
    if (currentLevel < 7) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      
      // Проверяем, видел ли пользователь урок для следующего уровня
      const lessonId = `lesson-${nextLevel}`;
      if (!lessonsSeen.includes(lessonId)) {
        // Если нет, показываем урок перед игрой
        setGameState('lesson');
      } else {
        // Если да, переходим к игре
        startGame();
      }
    }
  };

  const handleMainMenu = () => {
    setGameState('start');
  };

  // Обработчики бустеров
  const useBooster = (type: BoosterType) => {
    if (boosters[type] > 0) {
      setBoosters(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));

      if (type === 'extraTime') {
        setExtraTime(15); // добавляем 15 секунд - отправляем новое значение
      }

      return true;
    }
    return false;
  };

  const getCurrentQuiz = () => {
    // Получаем квиз для текущего уровня
    return quizzes[currentLevel - 1];
  };

  const getCurrentLesson = () => {
    // Получаем урок для текущего уровня
    return lessons[currentLevel - 1];
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 min-h-screen flex flex-col">
      {(gameState === 'playing' || gameState === 'quiz' || gameState === 'lesson') && (
        <Header 
          score={score}
          currentLevel={currentLevel}
          onMainMenu={handleMainMenu}
        />
      )}

      <main className="flex-grow flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <StartScreen 
            key="startScreen" 
            onStart={handleStartGame} 
            title={STUDIO_NAME}
            subtitle={STUDIO_TAGLINE}
          />
        )}
        
        {gameState === 'levelSelect' && (
          <LevelSelectScreen 
            key="levelSelect" 
            onLevelSelect={handleLevelSelect}
            onBack={handleMainMenu}
            unlockedLevels={unlockedLevels}
          />
        )}
        
        {gameState === 'playing' && (
          <motion.div 
            key="gameBoardContainer"
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GameBoard 
              onGameOver={handleGameOver} 
              onUpdateScore={(points) => setScore(prev => prev + points)}
              currentLevel={currentLevel}
              boosters={boosters}
              useShuffle={() => useBooster('shuffle')}
              useBomb={() => useBooster('bomb')}
              useBooster={useBooster}
              extraTime={extraTime}
            />
          </motion.div>
        )}
        
        {gameState === 'quiz' && (
          <QuizScreen 
            key="quizScreen"
            quiz={getCurrentQuiz()}
            onComplete={handleQuizComplete}
            onSkip={handleQuizSkip}
          />
        )}
        
        {gameState === 'lesson' && (
          <LessonScreen 
            key="lessonScreen"
            lesson={getCurrentLesson()}
            onComplete={handleLessonComplete}
            onSkip={handleLessonSkip}
          />
        )}
        
        {gameState === 'gameOver' && (
          <GameOverScreen 
            key="gameOverScreen"
            score={score}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
            onNextLevel={handleNextLevel}
            currentLevel={currentLevel}
            isLevelCompleted={isLevelCompleted}
            maxLevel={7}
          />
        )}
      </AnimatePresence>
      </main>
      
      <footer className="py-2 text-center text-white/50 text-xs">
        <p>{STUDIO_NAME} © 2024</p>
      </footer>
    </div>
  );
};

export default App; 
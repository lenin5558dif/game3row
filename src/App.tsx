import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GameBoard from './components/GameBoard';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import RulesScreen from './components/RulesScreen';
import LevelSelectScreen from './components/LevelSelectScreen';
import InteractiveQuizScreen from './components/InteractiveQuizScreen';
import InteractiveLessonScreen from './components/InteractiveLessonScreen';
import FinalScreen from './components/FinalScreen';
import LevelResultScreen from './components/LevelResultScreen';
import Timer from './components/Timer';
import { STUDIO_NAME, STUDIO_TAGLINE } from './data/laserTheme';
import { quizzes } from './data/quizData';
import { lessons } from './data/lessonData';
import { ExtendedGameState, QuizResult } from './types/quiz';

export type BoosterType = 'shuffle' | 'bomb' | 'extraTime';
type GameStateWithFinal = ExtendedGameState | 'final' | 'levelResult' | 'rules';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameStateWithFinal>('start');
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
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
  const [timeLeft, setTimeLeft] = useState(60);

  const MAX_LEVELS = 3; // Изменяем максимальное количество уровней

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

    const savedTotalScore = localStorage.getItem('everglow_total_score');
    if (savedTotalScore) {
      setTotalScore(parseInt(savedTotalScore, 10));
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

  useEffect(() => {
    localStorage.setItem('everglow_total_score', totalScore.toString());
  }, [totalScore]);

  const handleStartGame = () => {
    setGameState('rules');
  };

  const handleRulesComplete = () => {
    setGameState('levelSelect');
  };

  const handleRulesBack = () => {
    setGameState('start');
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
    setTimeLeft(60);
  };

  const handleGameOver = (finalScore: number) => {
    const levelThreshold = 500 + (currentLevel - 1) * 100;
    const isCompleted = finalScore >= levelThreshold;
    setIsLevelCompleted(isCompleted);
    
    // Добавляем очки к общему счету
    setTotalScore(prev => prev + finalScore);
    
    // Разблокируем следующий уровень при прохождении текущего
    if (isCompleted && currentLevel === unlockedLevels && unlockedLevels < MAX_LEVELS) {
      setUnlockedLevels(prev => prev + 1);

      // Даем бустеры в качестве награды за уровень
      setBoosters(prev => ({
        shuffle: prev.shuffle + 1,
        bomb: prev.bomb + 1,
        extraTime: prev.extraTime + 1
      }));
    }
    
    setScore(finalScore);
    
    // Всегда сначала показываем экран результата раунда
    setGameState('levelResult');
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
    
    // Если это третий уровень (последний), то сразу переходим к финальному экрану
    if (currentLevel === MAX_LEVELS) {
      setGameState('final');
    } else {
      // Переходим к следующему уровню без повторной карточки победы
      handleNextLevel();
    }
  };

  const handleQuizSkip = () => {
    // Если это третий уровень (последний), то сразу переходим к финальному экрану
    if (currentLevel === MAX_LEVELS) {
      setGameState('final');
    } else {
      // Переходим к следующему уровню
      handleNextLevel();
    }
  };

  const handleLevelResultContinue = () => {
    // Проверяем, есть ли квиз для текущего уровня и не пройден ли он
    const quizId = `quiz-${currentLevel}`;
    const isQuizCompleted = quizResults.some(result => result.quizId === quizId);
    
    if (isLevelCompleted && !isQuizCompleted) {
      // Если уровень пройден и квиз не пройден, идем на квиз
      setGameState('quiz');
    } else {
      // Иначе переходим к следующему уровню (убираем повторную карточку победы)
      handleNextLevel();
    }
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

  const handleNextLevel = () => {
    if (currentLevel < MAX_LEVELS) {
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
    } else {
      // Если это был последний уровень, показываем финальный экран
      setGameState('final');
    }
  };

  const handleMainMenu = () => {
    setGameState('levelSelect');
  };

  // Обработчики бустеров
  const useBooster = (type: BoosterType) => {
    if (boosters[type] > 0) {
      setBoosters(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));

      if (type === 'extraTime') {
        setExtraTime(prev => prev + 15); // накапливаем дополнительное время
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
          timeLeft={timeLeft}
          onMainMenu={handleMainMenu}
        />
      )}

      <main className="flex-grow flex items-start justify-center p-1 sm:p-2 pt-4">
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <StartScreen 
            key="startScreen" 
            onStart={handleStartGame} 
            title={STUDIO_NAME}
            subtitle={STUDIO_TAGLINE}
          />
        )}

        {gameState === 'rules' && (
          <RulesScreen 
            key="rulesScreen" 
            onContinue={handleRulesComplete}
            onBack={handleRulesBack}
          />
        )}
        
        {gameState === 'levelSelect' && (
          <LevelSelectScreen 
            key="levelSelect" 
            onLevelSelect={handleLevelSelect}
            onBack={() => setGameState('rules')}
            unlockedLevels={unlockedLevels}
          />
        )}
        
        {gameState === 'playing' && (
          <motion.div 
            key="gameBoardContainer"
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl relative px-1 sm:px-2 md:px-4 pt-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Таймер теперь в Header */}
            <Timer 
              key={`timer-${currentLevel}`}
              onTimeUp={() => {
                console.log("Время вышло, счет:", score);
                handleGameOver(score);
              }} 
              extraTime={extraTime}
              onTimeUpdate={setTimeLeft}
            />
            
            <GameBoard 
              onUpdateScore={(points) => setScore(prev => prev + points)}
              currentLevel={currentLevel}
              boosters={boosters}
              useShuffle={() => useBooster('shuffle')}
              useBomb={() => useBooster('bomb')}
              useBooster={useBooster}
            />
          </motion.div>
        )}
        
        {gameState === 'quiz' && (
          <InteractiveQuizScreen 
            key="quizScreen"
            quiz={getCurrentQuiz()}
            onComplete={handleQuizComplete}
            onSkip={handleQuizSkip}
          />
        )}
        
        {gameState === 'lesson' && (
          <InteractiveLessonScreen 
            key="lessonScreen"
            lesson={getCurrentLesson()}
            onComplete={handleLessonComplete}
            onSkip={handleLessonSkip}
          />
        )}

        {gameState === 'levelResult' && (
          <LevelResultScreen 
            key="levelResultScreen"
            isWon={isLevelCompleted}
            score={score}
            targetScore={500 + (currentLevel - 1) * 100}
            currentLevel={currentLevel}
            onContinue={handleLevelResultContinue}
            onMainMenu={handleMainMenu}
          />
        )}

        {gameState === 'final' && (
          <FinalScreen 
            key="finalScreen"
            onMainMenu={handleMainMenu}
            totalScore={totalScore}
          />
        )}
      </AnimatePresence>
      </main>
      
      <footer className="py-1 text-center text-white/50 text-xs">
        <p>{STUDIO_NAME} © 2024</p>
      </footer>
    </div>
  );
};

export default App; 
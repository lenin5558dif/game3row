// Типы для квизов и обучающих материалов
export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // индекс правильного ответа в массиве options
  explanation: string; // объяснение правильного ответа
};

export type LessonData = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string; // опциональная иллюстрация
};

export type QuizData = {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
};

// Тип для хранения ответов пользователя
export type QuizResult = {
  quizId: string;
  answers: number[]; // индексы выбранных ответов
  score: number; // количество правильных ответов
  completed: boolean;
};

// Расширенные состояния игры, включающие квизы и уроки
export type ExtendedGameState = 
  | 'start' 
  | 'levelSelect' 
  | 'playing' 
  | 'gameOver'
  | 'quiz'       // показ квиза между уровнями
  | 'lesson';    // показ обучающего материала 
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GamePieceIcon, { GamePieceType, BonusPieceType } from './GamePieceIcon';

type GamePiece = {
  id: string;
  type: GamePieceType;
  x: number;
  y: number;
  isMatched: boolean;
  yOffset?: number;
  bonusType?: BonusPieceType;
};

type BoosterType = 'shuffle' | 'bomb' | 'extraTime';

type GameBoardProps = {
  onUpdateScore: (points: number) => void;
  currentLevel: number;
  boosters: {[key in BoosterType]: number};
  useShuffle: () => boolean;
  useBomb: () => boolean;
  useBooster: (type: BoosterType) => boolean;
  extraTime: number;
};

const BOARD_SIZE = 6;

// Наборы иконок для всех уровней - теперь одинаковые
const LEVEL_PIECES: GamePieceType[] = ['manipula', 'couch', 'specialist', 'client', 'machine', 'unicorn'];

const GameBoard: React.FC<GameBoardProps> = ({ 
  onUpdateScore, 
  currentLevel, 
  boosters,
  useShuffle,
  useBomb,
  useBooster,
  extraTime
}) => {
  const [board, setBoard] = useState<GamePiece[][]>([]);
  const [selectedPiece, setSelectedPiece] = useState<GamePiece | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [showCombo, setShowCombo] = useState(false);
  const [bombTarget, setBombTarget] = useState<{x: number, y: number} | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getPieceTypes = () => {
    // Все уровни теперь используют одинаковые иконки
    return LEVEL_PIECES;
  };

  const updateComboMultiplier = () => {
    setComboMultiplier(prev => {
      const newMultiplier = Math.min(prev + 0.5, 4); // Максимальный множитель 4x
      return newMultiplier;
    });
    setShowCombo(true);
    
    // Сбрасываем предыдущий таймаут, если он есть
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
    }
    
    // Сбрасываем множитель через 3 секунды бездействия
    comboTimeoutRef.current = setTimeout(() => {
      setComboMultiplier(1);
      setShowCombo(false);
    }, 3000);
  };

  // Функция для встряски экрана
  const triggerScreenShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 500); // Длительность встряски
  };

  const handleScoreUpdate = (points: number) => {
    // Применяем множитель к очкам
    const multipliedPoints = Math.floor(points * comboMultiplier);
    // Обновляем локальный счет
    setTotalScore(prev => prev + multipliedPoints);
    // Передаем очки в родительский компонент напрямую
    onUpdateScore(multipliedPoints);
    updateComboMultiplier();
  };

  const createNewPiece = (x: number, y: number): GamePiece => {
    const pieceTypes = getPieceTypes();
    const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
    return {
      id: `${x}-${y}-${Date.now()}`,
      type: randomType,
      x,
      y,
      isMatched: false
    };
  };

  const hasInitialMatches = (board: GamePiece[][]): boolean => {
    // Проверяем горизонтальные совпадения
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE - 2; x++) {
        if (board[y][x].type === board[y][x + 1].type && 
            board[y][x].type === board[y][x + 2].type) {
          return true;
        }
      }
    }
    
    // Проверяем вертикальные совпадения
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE - 2; y++) {
        if (board[y][x].type === board[y + 1][x].type && 
            board[y][x].type === board[y + 2][x].type) {
          return true;
        }
      }
    }
    return false;
  };

  const initializeBoard = () => {
    let newBoard: GamePiece[][];
    do {
      newBoard = Array(BOARD_SIZE).fill(null)
        .map((_, y) => Array(BOARD_SIZE).fill(null)
          .map((_, x) => createNewPiece(x, y))
        );
    } while (hasInitialMatches(newBoard));
    
    setBoard(newBoard);
    // Сбрасываем счет при новой инициализации доски
    setTotalScore(0);
  };

  useEffect(() => {
    initializeBoard();
  }, [currentLevel]);

  const findMatches = (currentBoard: GamePiece[][]): {
    matchedPieces: Set<string>;
    specialPieces: Array<{
      x: number;
      y: number;
      bonusType: BonusPieceType;
      type: GamePieceType;
    }>;
    lineMatches: Array<{
      isHorizontal: boolean; 
      index: number; 
      type: GamePieceType;
    }>;
  } => {
    const matchedPieces = new Set<string>();
    const specialPieces: Array<{
      x: number;
      y: number;
      bonusType: BonusPieceType;
      type: GamePieceType;
    }> = [];
    
    // Массив для отслеживания линий из 4 фишек
    const lineMatches: Array<{
      isHorizontal: boolean; 
      index: number; 
      type: GamePieceType;
    }> = [];

    // Горизонтальные совпадения
    for (let y = 0; y < BOARD_SIZE; y++) {
      let matchLength = 1;
      let matchType = currentBoard[y][0].type;
      
      for (let x = 1; x <= BOARD_SIZE; x++) {
        const currentType = x < BOARD_SIZE ? currentBoard[y][x].type : null;
        
        if (currentType === matchType && currentType !== null) {
          matchLength++;
        } else {
          // Обработка совпадения если оно 3 или более фишек
          if (matchLength >= 3) {
            // Добавляем все фишки в совпадении
            for (let i = x - matchLength; i < x; i++) {
              matchedPieces.add(`${i}-${y}`);
            }
            
            // Если совпадение из 4 фишек, сохраняем информацию о линии
            if (matchLength === 4) {
              lineMatches.push({
                isHorizontal: true,
                index: y,
                type: matchType
              });
            } 
            // Проверяем на специальные фишки (5 в ряд)
            else if (matchLength >= 5) {
              specialPieces.push({
                x: x - 3, // Центральная позиция для совпадения из 5
                y: y,
                bonusType: 'superBomb',
                type: matchType
              });
            }
          }
          
          // Начинаем новое совпадение
          matchLength = 1;
          matchType = currentType || matchType;
        }
      }
    }
    
    // Вертикальные совпадения
    for (let x = 0; x < BOARD_SIZE; x++) {
      let matchLength = 1;
      let matchType = currentBoard[0][x].type;
      
      for (let y = 1; y <= BOARD_SIZE; y++) {
        const currentType = y < BOARD_SIZE ? currentBoard[y][x].type : null;
        
        if (currentType === matchType && currentType !== null) {
          matchLength++;
        } else {
          // Обработка совпадения если оно 3 или более фишек
          if (matchLength >= 3) {
            // Добавляем все фишки в совпадении
            for (let i = y - matchLength; i < y; i++) {
              matchedPieces.add(`${x}-${i}`);
            }
            
            // Если совпадение из 4 фишек, сохраняем информацию о линии
            if (matchLength === 4) {
              lineMatches.push({
                isHorizontal: false,
                index: x,
                type: matchType
              });
            }
            // Проверяем на специальные фишки (5 в ряд)
            else if (matchLength >= 5) {
              specialPieces.push({
                x: x,
                y: y - 3, // Центральная позиция для совпадения из 5
                type: matchType,
                bonusType: 'superBomb'
              });
        }
      }
          
          // Начинаем новое совпадение
          matchLength = 1;
          matchType = currentType || matchType;
        }
      }
    }

    // Ищем L-образные и T-образные совпадения
    // Проверяем все вертикальные совпадения из 3
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE - 2; y++) {
        if (y + 2 < BOARD_SIZE &&
            currentBoard[y][x].type === currentBoard[y + 1][x].type &&
            currentBoard[y][x].type === currentBoard[y + 2][x].type) {
          
          // Проверяем горизонтальные соседние на совпадения L и T формы
          // L-форма снизу
          if (x + 2 < BOARD_SIZE &&
              currentBoard[y + 2][x].type === currentBoard[y + 2][x + 1].type &&
              currentBoard[y + 2][x].type === currentBoard[y + 2][x + 2].type) {
            // Создаем бомбу
            specialPieces.push({
              x: x,
              y: y + 2,
              bonusType: 'bomb',
              type: currentBoard[y][x].type
            });
          }
          
          // L-форма сверху
          if (x + 2 < BOARD_SIZE &&
              currentBoard[y][x].type === currentBoard[y][x + 1].type &&
              currentBoard[y][x].type === currentBoard[y][x + 2].type) {
            // Создаем бомбу
            specialPieces.push({
              x: x,
              y: y,
              bonusType: 'bomb',
              type: currentBoard[y][x].type
            });
          }
          
          // T-форма слева
          if (x > 0 && x + 1 < BOARD_SIZE &&
              currentBoard[y + 1][x].type === currentBoard[y + 1][x - 1].type &&
              currentBoard[y + 1][x].type === currentBoard[y + 1][x + 1].type) {
            // Создаем бомбу
            specialPieces.push({
              x: x,
              y: y + 1,
              bonusType: 'bomb',
              type: currentBoard[y][x].type
            });
          }
        }
      }
    }

    // Аналогично проверяем горизонтальные совпадения из 3 для L и T форм
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE - 2; x++) {
        if (x + 2 < BOARD_SIZE &&
            currentBoard[y][x].type === currentBoard[y][x + 1].type &&
            currentBoard[y][x].type === currentBoard[y][x + 2].type) {
          
          // Проверяем вертикальные соседние на совпадения L и T формы
          // L-форма справа
          if (y + 2 < BOARD_SIZE &&
              currentBoard[y][x + 2].type === currentBoard[y + 1][x + 2].type &&
              currentBoard[y][x + 2].type === currentBoard[y + 2][x + 2].type) {
            // Создаем бомбу
            specialPieces.push({
              x: x + 2,
              y: y,
              bonusType: 'bomb',
              type: currentBoard[y][x].type
            });
          }
          
          // L-форма слева
          if (y + 2 < BOARD_SIZE &&
              currentBoard[y][x].type === currentBoard[y + 1][x].type &&
              currentBoard[y][x].type === currentBoard[y + 2][x].type) {
            // Создаем бомбу
            specialPieces.push({
              x: x,
              y: y,
              bonusType: 'bomb',
              type: currentBoard[y][x].type
            });
          }
          
          // T-форма сверху
          if (y > 0 && y + 1 < BOARD_SIZE &&
              currentBoard[y][x + 1].type === currentBoard[y - 1][x + 1].type &&
              currentBoard[y][x + 1].type === currentBoard[y + 1][x + 1].type) {
            // Создаем бомбу
            specialPieces.push({
              x: x + 1,
              y: y,
              bonusType: 'bomb',
              type: currentBoard[y][x].type
            });
          }
        }
      }
    }

    return { matchedPieces, specialPieces, lineMatches };
  };

  const handlePieceClick = async (piece: GamePiece) => {
    if (isProcessing) return;

    if (!selectedPiece) {
      setSelectedPiece(piece);
    } else if (selectedPiece.id !== piece.id) {
      const isAdjacent = (
        Math.abs(selectedPiece.x - piece.x) === 1 && selectedPiece.y === piece.y ||
        Math.abs(selectedPiece.y - piece.y) === 1 && selectedPiece.x === piece.x
      );

      // Проверка на активацию бонусной фишки
      if (selectedPiece.bonusType || piece.bonusType) {
        await activateBonusPiece(selectedPiece, piece);
      } else if (isAdjacent) {
        await swapPieces(selectedPiece, piece);
      }
      setSelectedPiece(null);
    }
  };

  const swapPieces = async (piece1: GamePiece, piece2: GamePiece) => {
    setIsProcessing(true);

    // Создаем новую копию доски
    const newBoard = board.map(row => [...row]);
    
    // Меняем местами элементы
    const temp = { ...newBoard[piece1.y][piece1.x] };
    newBoard[piece1.y][piece1.x] = { 
      ...newBoard[piece2.y][piece2.x], 
      x: piece1.x, 
      y: piece1.y 
    };
    newBoard[piece2.y][piece2.x] = { 
      ...temp, 
      x: piece2.x, 
      y: piece2.y 
    };

    // Анимируем свап в любом случае
    setBoard(newBoard);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Проверяем, есть ли совпадения после свапа
    const { matchedPieces, specialPieces, lineMatches } = findMatches(newBoard);
    
    if (matchedPieces.size > 0) {
      await processMatches(newBoard, matchedPieces, specialPieces, lineMatches);
    } else {
      // Если совпадений нет, возвращаем элементы обратно с анимацией
      const revertBoard = board.map(row => [...row]);
      setBoard(revertBoard);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsProcessing(false);
    }
  };

  const processMatches = async (currentBoard: GamePiece[][], matchedPieces: Set<string>, specialPieces: Array<{
    x: number;
    y: number;
    bonusType: BonusPieceType;
    type: GamePieceType;
  }>, lineMatches?: Array<{
    isHorizontal: boolean; 
    index: number; 
    type: GamePieceType;
  }>) => {
    // Помечаем совпавшие элементы
    const matchedBoard = currentBoard.map((row, y) =>
      row.map((piece, x) => ({
        ...piece,
        isMatched: matchedPieces.has(`${x}-${y}`)
      }))
    );
    
    // Добавляем элементы линий к совпавшим, если есть совпадения из 4 фишек
    if (lineMatches && lineMatches.length > 0) {
      for (const lineMatch of lineMatches) {
        if (lineMatch.isHorizontal) {
          // Уничтожаем всю горизонтальную линию
          for (let x = 0; x < BOARD_SIZE; x++) {
            matchedBoard[lineMatch.index][x].isMatched = true;
            matchedPieces.add(`${x}-${lineMatch.index}`);
          }
          
          // Показываем эффект горизонтальной молнии
          const animateHorizontalLineEffect = async () => {
            // Запускаем встряску экрана
            triggerScreenShake();
            
            // Создаем SVG элемент для ветвящейся молнии
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'absolute z-30 pointer-events-none');
            svg.style.left = '0';
            svg.style.top = `${lineMatch.index * 76 + 28}px`; // 56px плитка + 20px gap = 76px между центрами
            svg.style.width = '100%';
            svg.style.height = '8px';
            svg.style.opacity = '0';
            
            // Создаем путь молнии
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const boardWidth = BOARD_SIZE * 76 - 12; // полная ширина доски (56px * 6 + 20px * 5)
            
            // Генерируем зигзагообразный путь молнии
            let pathData = `M 0 4`;
            const segments = 20;
            for (let i = 1; i <= segments; i++) {
              const x = (boardWidth / segments) * i;
              const y = 4 + (Math.random() - 0.5) * 6; // случайные отклонения
              pathData += ` L ${x} ${y}`;
              
              // Добавляем ветки
              if (i % 4 === 0 && Math.random() > 0.5) {
                const branchX = x + (Math.random() - 0.5) * 20;
                const branchY = y + (Math.random() - 0.5) * 8;
                pathData += ` M ${x} ${y} L ${branchX} ${branchY} M ${x} ${y}`;
              }
            }
            
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', '#60a5fa');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('filter', 'drop-shadow(0 0 8px #60a5fa)');
            
            svg.appendChild(path);
            
            // Добавляем элемент на игровое поле
            const gameBoard = document.querySelector('.grid-cols-6');
            if (gameBoard) {
              (gameBoard as HTMLElement).appendChild(svg);
              
              // Анимируем появление
              requestAnimationFrame(() => {
                svg.style.transition = 'opacity 0.2s ease-in-out';
                svg.style.opacity = '1';
                
                // Добавляем искры
                setTimeout(() => {
                  for (let i = 0; i < 8; i++) {
                    const spark = document.createElement('div');
                    spark.className = 'absolute w-1 h-1 bg-blue-400 rounded-full z-30';
                    spark.style.left = `${Math.random() * 100}%`;
                    spark.style.top = `${lineMatch.index * 76 + 28 + Math.random() * 8}px`;
                    spark.style.opacity = '1';
                    spark.style.transform = 'scale(0)';
                    spark.style.boxShadow = '0 0 4px #60a5fa';
                    (gameBoard as HTMLElement).appendChild(spark);
                    
                    requestAnimationFrame(() => {
                      spark.style.transition = 'all 0.6s ease-out';
                      spark.style.transform = 'scale(2)';
                      spark.style.opacity = '0';
                      setTimeout(() => spark.remove(), 600);
                    });
                  }
                }, 100);
                
                // Удаляем через некоторое время
                setTimeout(() => {
                  svg.style.opacity = '0';
                  setTimeout(() => {
                    svg.remove();
                  }, 300);
                }, 1000);
              });
            }
          };
          
          // Запускаем анимацию
          animateHorizontalLineEffect();
        } else {
          // Уничтожаем весь вертикальный столбец
          for (let y = 0; y < BOARD_SIZE; y++) {
            matchedBoard[y][lineMatch.index].isMatched = true;
            matchedPieces.add(`${lineMatch.index}-${y}`);
          }
          
          // Показываем эффект вертикальной молнии
          const animateVerticalLineEffect = async () => {
            // Запускаем встряску экрана
            triggerScreenShake();
            
            // Создаем SVG элемент для ветвящейся молнии
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'absolute z-30 pointer-events-none');
            svg.style.left = `${lineMatch.index * 76 + 28}px`; // 56px плитка + 20px gap = 76px между центрами
            svg.style.top = '0';
            svg.style.width = '8px';
            svg.style.height = '100%';
            svg.style.opacity = '0';
            
            // Создаем путь молнии
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const boardHeight = BOARD_SIZE * 76 - 12; // полная высота доски (56px * 6 + 20px * 5)
            
            // Генерируем зигзагообразный путь молнии
            let pathData = `M 4 0`;
            const segments = 20;
            for (let i = 1; i <= segments; i++) {
              const y = (boardHeight / segments) * i;
              const x = 4 + (Math.random() - 0.5) * 6; // случайные отклонения
              pathData += ` L ${x} ${y}`;
              
              // Добавляем ветки
              if (i % 4 === 0 && Math.random() > 0.5) {
                const branchX = x + (Math.random() - 0.5) * 8;
                const branchY = y + (Math.random() - 0.5) * 20;
                pathData += ` M ${x} ${y} L ${branchX} ${branchY} M ${x} ${y}`;
              }
            }
            
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', '#22c55e');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('filter', 'drop-shadow(0 0 8px #22c55e)');
            
            svg.appendChild(path);
            
            // Добавляем элемент на игровое поле
            const gameBoard = document.querySelector('.grid-cols-6');
            if (gameBoard) {
              (gameBoard as HTMLElement).appendChild(svg);
              
              // Анимируем появление
              requestAnimationFrame(() => {
                svg.style.transition = 'opacity 0.2s ease-in-out';
                svg.style.opacity = '1';
                
                // Добавляем искры
                setTimeout(() => {
                  for (let i = 0; i < 8; i++) {
                    const spark = document.createElement('div');
                    spark.className = 'absolute w-1 h-1 bg-green-400 rounded-full z-30';
                    spark.style.left = `${lineMatch.index * 76 + 28 + Math.random() * 8}px`;
                    spark.style.top = `${Math.random() * 100}%`;
                    spark.style.opacity = '1';
                    spark.style.transform = 'scale(0)';
                    spark.style.boxShadow = '0 0 4px #22c55e';
                    (gameBoard as HTMLElement).appendChild(spark);
                    
                    requestAnimationFrame(() => {
                      spark.style.transition = 'all 0.6s ease-out';
                      spark.style.transform = 'scale(2)';
                      spark.style.opacity = '0';
                      setTimeout(() => spark.remove(), 600);
                    });
                  }
                }, 100);
                
                // Удаляем через некоторое время
                setTimeout(() => {
                  svg.style.opacity = '0';
                  setTimeout(() => {
                    svg.remove();
                  }, 300);
                }, 1000);
              });
            }
          };
          
          // Запускаем анимацию
          animateVerticalLineEffect();
        }
      }
    }
    
    setBoard(matchedBoard);
    
    // Считаем общее количество уничтоженных фишек после обработки линий
    const totalMatchedPieces = matchedPieces.size;
    handleScoreUpdate(totalMatchedPieces * 10);

    // Показываем анимацию для специальных фишек, если они создаются
    if (specialPieces.length > 0) {
      for (const special of specialPieces) {
        // Создаем анимацию в зависимости от типа бонуса
        const animateSpecialPieceCreation = () => {
          // Создаем элемент эффекта
          const effectElement = document.createElement('div');
          
          if (false) {
            // Убираем эффект для lineHorizontal, который больше не используется
            effectElement.className = 'absolute z-40';
            effectElement.style.left = `${special.x * 48}px`;
            effectElement.style.top = `${special.y * 48}px`;
            effectElement.style.width = '48px';
            effectElement.style.height = '48px';
            effectElement.style.background = 'rgba(59, 130, 246, 0.3)';
            effectElement.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.8)';
            effectElement.style.borderRadius = '8px';
            effectElement.style.opacity = '0';
            
            // Добавляем элемент на игровое поле
            const gameBoard = document.querySelector('.grid-cols-6');
            if (gameBoard) {
              (gameBoard as HTMLElement).appendChild(effectElement);
              
              // Анимируем появление
              requestAnimationFrame(() => {
                effectElement.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
                effectElement.style.opacity = '1';
                effectElement.style.transform = 'scale(1.2)';
                
                // Анимация мигания
                let flashCount = 0;
                const flashInterval = setInterval(() => {
                  effectElement.style.opacity = flashCount % 2 ? '1' : '0.5';
                  flashCount++;
                  if (flashCount > 5) {
                    clearInterval(flashInterval);
                    // Удаляем элемент
                    setTimeout(() => {
                      effectElement.style.opacity = '0';
                      setTimeout(() => {
                        effectElement.remove();
                      }, 300);
                    }, 100);
                  }
                }, 100);
              });
            }
          } else if (false) {
            // Убираем эффект для lineVertical, который больше не используется
            effectElement.className = 'absolute z-40';
            effectElement.style.left = `${special.x * 48}px`;
            effectElement.style.top = `${special.y * 48}px`;
            effectElement.style.width = '48px';
            effectElement.style.height = '48px';
            effectElement.style.background = 'rgba(34, 197, 94, 0.3)';
            effectElement.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.8)';
            effectElement.style.borderRadius = '8px';
            effectElement.style.opacity = '0';
            
            // Добавляем элемент на игровое поле
            const gameBoard = document.querySelector('.grid-cols-6');
            if (gameBoard) {
              (gameBoard as HTMLElement).appendChild(effectElement);
              
              // Анимируем появление
              requestAnimationFrame(() => {
                effectElement.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
                effectElement.style.opacity = '1';
                effectElement.style.transform = 'scale(1.2)';
                
                // Анимация мигания
                let flashCount = 0;
                const flashInterval = setInterval(() => {
                  effectElement.style.opacity = flashCount % 2 ? '1' : '0.5';
                  flashCount++;
                  if (flashCount > 5) {
                    clearInterval(flashInterval);
                    // Удаляем элемент
                    setTimeout(() => {
                      effectElement.style.opacity = '0';
                      setTimeout(() => {
                        effectElement.remove();
                      }, 300);
                    }, 100);
                  }
                }, 100);
              });
            }
          } else if (special.bonusType === 'bomb') {
            // Эффект для бомбы
            effectElement.className = 'absolute z-40';
            effectElement.style.left = `${special.x * 76 + 28}px`; // Центр ячейки (56px плитка + 20px gap)
            effectElement.style.top = `${special.y * 76 + 28}px`;
            effectElement.style.width = '48px';
            effectElement.style.height = '48px';
            effectElement.style.background = 'rgba(147, 51, 234, 0.3)';
            effectElement.style.boxShadow = '0 0 20px rgba(147, 51, 234, 0.8)';
            effectElement.style.borderRadius = '8px';
            effectElement.style.opacity = '0';
            
            // Добавляем элемент на игровое поле
            const gameBoard = document.querySelector('.grid-cols-6');
            if (gameBoard) {
              (gameBoard as HTMLElement).appendChild(effectElement);
              
              // Анимируем появление
              requestAnimationFrame(() => {
                effectElement.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
                effectElement.style.opacity = '1';
                effectElement.style.transform = 'scale(1.2)';
                
                // Анимация мигания
                let flashCount = 0;
                const flashInterval = setInterval(() => {
                  effectElement.style.opacity = flashCount % 2 ? '1' : '0.5';
                  flashCount++;
                  if (flashCount > 5) {
                    clearInterval(flashInterval);
                    // Удаляем элемент
                    setTimeout(() => {
                      effectElement.style.opacity = '0';
                      setTimeout(() => {
                        effectElement.remove();
                      }, 300);
                    }, 100);
                  }
                }, 100);
              });
            }
          } else if (special.bonusType === 'superBomb') {
            // Эффект для супер-бомбы
            effectElement.className = 'absolute z-40';
            effectElement.style.left = `${special.x * 48}px`;
            effectElement.style.top = `${special.y * 48}px`;
            effectElement.style.width = '48px';
            effectElement.style.height = '48px';
            effectElement.style.background = 'rgba(244, 63, 94, 0.3)';
            effectElement.style.boxShadow = '0 0 20px rgba(244, 63, 94, 0.8)';
            effectElement.style.borderRadius = '8px';
            effectElement.style.opacity = '0';
            
            // Добавляем элемент на игровое поле
            const gameBoard = document.querySelector('.grid-cols-6');
            if (gameBoard) {
              (gameBoard as HTMLElement).appendChild(effectElement);
              
              // Анимируем появление
              requestAnimationFrame(() => {
                effectElement.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
                effectElement.style.opacity = '1';
                effectElement.style.transform = 'scale(1.2)';
                
                // Анимация мигания
                let flashCount = 0;
                const flashInterval = setInterval(() => {
                  effectElement.style.opacity = flashCount % 2 ? '1' : '0.5';
                  effectElement.style.transform = flashCount % 2 ? 'scale(1.2)' : 'scale(1.5)';
                  flashCount++;
                  if (flashCount > 5) {
                    clearInterval(flashInterval);
                    // Удаляем элемент
                    setTimeout(() => {
                      effectElement.style.opacity = '0';
                      setTimeout(() => {
                        effectElement.remove();
                      }, 300);
                    }, 100);
                  }
                }, 100);
              });
            }
          }
        };
        
        // Запускаем анимацию
        animateSpecialPieceCreation();
      }
      
      // Ждем немного, чтобы анимация была заметна
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Ждем анимацию исчезновения
    await new Promise(resolve => setTimeout(resolve, 300));

    // Создаем новую доску для падения элементов
    let newBoard = matchedBoard.map(row => [...row]);

    // Map для специальных фишек, которые нужно создать
    const specialPiecesMap = new Map<string, {
      bonusType: BonusPieceType;
      type: GamePieceType;
    }>();
    
    // Добавляем специальные фишки в map
    specialPieces.forEach(special => {
      specialPiecesMap.set(`${special.x}-${special.y}`, {
        bonusType: special.bonusType,
        type: special.type
      });
    });

    // Обрабатываем каждую колонку отдельно
    for (let x = 0; x < BOARD_SIZE; x++) {
      let bottomY = BOARD_SIZE - 1;
      
      // Двигаемся снизу вверх, перемещая неисчезнувшие элементы вниз
      for (let y = BOARD_SIZE - 1; y >= 0; y--) {
        if (!newBoard[y][x].isMatched) {
          if (bottomY !== y) {
            newBoard[bottomY][x] = {
              ...newBoard[y][x],
              y: bottomY,
              yOffset: bottomY - y
            };
            newBoard[y][x] = createNewPiece(x, y);
          }
          bottomY--;
        }
      }

      // Заполняем пустые места новыми элементами или специальными фишками
      for (let y = bottomY; y >= 0; y--) {
        // Проверяем, должна ли здесь быть специальная фишка
        const specialKey = `${x}-${y}`;
        if (specialPiecesMap.has(specialKey)) {
          const special = specialPiecesMap.get(specialKey)!;
          newBoard[y][x] = {
            ...createNewPiece(x, y),
            type: special.type,
            bonusType: special.bonusType,
            yOffset: BOARD_SIZE
          };
        } else {
        newBoard[y][x] = {
          ...createNewPiece(x, y),
          yOffset: BOARD_SIZE
        };
        }
      }
    }

    setBoard(newBoard);

    // Ждем анимацию падения
    await new Promise(resolve => setTimeout(resolve, 500));

    // Очищаем временные данные
    newBoard = newBoard.map(row =>
      row.map(piece => ({
        ...piece,
        isMatched: false,
        yOffset: undefined
      }))
    );
    setBoard(newBoard);

    // Проверяем новые совпадения
    const { matchedPieces: newMatchedPieces, specialPieces: newSpecialPieces, lineMatches: newLineMatches } = findMatches(newBoard);
    if (newMatchedPieces.size > 0) {
      await processMatches(newBoard, newMatchedPieces, newSpecialPieces, newLineMatches);
    } else {
      setIsProcessing(false);
    }
  };

  // Функция для активации бонусной фишки
  const activateBonusPiece = async (piece1: GamePiece, piece2: GamePiece) => {
    setIsProcessing(true);
    
    // Создаем новую копию доски
    const newBoard = board.map(row => [...row]);
    
    // Функция для получения всех координат фишек, которые нужно уничтожить
    const getPiecesToDestroy = (piece: GamePiece): Array<{x: number, y: number}> => {
      const piecesToDestroy: Array<{x: number, y: number}> = [];
      
      if (!piece.bonusType) {
        // Если это обычная фишка, возвращаем только её
        return [{x: piece.x, y: piece.y}];
      }
      
      switch (piece.bonusType) {
        
        case 'bomb':
          // Анимируем бомбу
          const animateBomb = async () => {
            // Создаем элемент эффекта для бомбы
            const bombEffect = document.createElement('div');
            bombEffect.className = 'absolute rounded-full z-30 animate-ping';
            bombEffect.style.left = `${piece.x * 76 + 28}px`; // Центр ячейки (56px плитка + 20px gap)
            bombEffect.style.top = `${piece.y * 76 + 28}px`;
            bombEffect.style.width = '48px';
            bombEffect.style.height = '48px';
            bombEffect.style.background = 'radial-gradient(circle, rgba(147,51,234,0.8) 0%, rgba(147,51,234,0) 70%)';
            bombEffect.style.transform = 'translate(-50%, -50%)';
            bombEffect.style.opacity = '0';
            
            // Добавляем элемент на игровое поле
            const gameBoard = document.querySelector('.grid-cols-6');
            if (gameBoard) {
              (gameBoard as HTMLElement).appendChild(bombEffect);
              
              // Анимируем появление и расширение
              requestAnimationFrame(() => {
                bombEffect.style.transition = 'opacity 0.2s ease-in-out, width 0.5s ease-out, height 0.5s ease-out';
                bombEffect.style.opacity = '1';
                bombEffect.style.width = '200px';
                bombEffect.style.height = '200px';
                
                // Удаляем через некоторое время
                setTimeout(() => {
                  bombEffect.style.opacity = '0';
                  setTimeout(() => {
                    bombEffect.remove();
                  }, 300);
                }, 500);
              });
            }
          };
          
          // Запускаем анимацию
          animateBomb();
          
          // Уничтожаем 3x3 область вокруг фишки
          for (let y = Math.max(0, piece.y - 1); y <= Math.min(BOARD_SIZE - 1, piece.y + 1); y++) {
            for (let x = Math.max(0, piece.x - 1); x <= Math.min(BOARD_SIZE - 1, piece.x + 1); x++) {
              piecesToDestroy.push({x, y});
            }
          }
          break;
        
        case 'superBomb':
          // Анимируем супер-бомбу
          const animateSuperBomb = async () => {
            // Создаем элемент эффекта для супер-бомбы
            const bombEffect = document.createElement('div');
            bombEffect.className = 'absolute rounded-full z-30 animate-ping';
            bombEffect.style.left = `${piece.x * 76 + 28}px`; // Центр ячейки (56px плитка + 20px gap)
            bombEffect.style.top = `${piece.y * 76 + 28}px`;
            bombEffect.style.width = `${BOARD_SIZE * 76}px`;
            bombEffect.style.height = `${BOARD_SIZE * 76}px`;
            bombEffect.style.background = 'radial-gradient(circle, rgba(244,63,94,0.8) 0%, rgba(244,63,94,0) 70%)';
            bombEffect.style.transform = 'translate(-50%, -50%)';
            bombEffect.style.opacity = '0';
            
            // Добавляем элемент на игровое поле
            const gameBoard = document.querySelector('.grid-cols-6');
            if (gameBoard) {
              (gameBoard as HTMLElement).appendChild(bombEffect);
              
              // Анимируем появление и расширение
              requestAnimationFrame(() => {
                bombEffect.style.transition = 'opacity 0.2s ease-in-out, width 0.5s ease-out, height 0.5s ease-out';
                bombEffect.style.opacity = '1';
                bombEffect.style.width = `${BOARD_SIZE * 76}px`;
                bombEffect.style.height = `${BOARD_SIZE * 76}px`;
                
                // Удаляем через некоторое время
                setTimeout(() => {
                  bombEffect.style.opacity = '0';
                  setTimeout(() => {
                    bombEffect.remove();
                  }, 300);
                }, 500);
              });
            }
          };
          
          // Запускаем анимацию
          animateSuperBomb();
          
          // Уничтожаем все фишки того же типа, что и вторая фишка
          const targetType = piece2.type;
          for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
              if (newBoard[y][x].type === targetType) {
                piecesToDestroy.push({x, y});
              }
            }
          }
          break;
      }
      
      return piecesToDestroy;
    };
    
    // Получаем все фишки для уничтожения от обеих фишек
    const piecesToDestroy1 = getPiecesToDestroy(piece1);
    const piecesToDestroy2 = piece1.id !== piece2.id ? getPiecesToDestroy(piece2) : [];
    
    // Объединяем и удаляем дубликаты
    const allPiecesToDestroy = [...piecesToDestroy1, ...piecesToDestroy2];
    const uniquePieces = new Set<string>();
    const uniquePiecesToDestroy: Array<{x: number, y: number}> = [];
    
    for (const piece of allPiecesToDestroy) {
      const key = `${piece.x}-${piece.y}`;
      if (!uniquePieces.has(key)) {
        uniquePieces.add(key);
        uniquePiecesToDestroy.push(piece);
      }
    }
    
    // Помечаем фишки как совпавшие
    for (const {x, y} of uniquePiecesToDestroy) {
      if (newBoard[y][x]) {
        newBoard[y][x] = {
          ...newBoard[y][x],
          isMatched: true
        };
      }
    }
    
    // Обновляем доску и начисляем очки
    setBoard(newBoard);
    handleScoreUpdate(uniquePiecesToDestroy.length * 10);
    
    // Ждем анимацию исчезновения
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Обрабатываем падение элементов и заполнение пустот
    let fallingBoard = newBoard.map(row => [...row]);
    
    // Обрабатываем каждую колонку отдельно
    for (let px = 0; px < BOARD_SIZE; px++) {
      let bottomY = BOARD_SIZE - 1;
      
      // Двигаемся снизу вверх, перемещая неисчезнувшие элементы вниз
      for (let py = BOARD_SIZE - 1; py >= 0; py--) {
        if (!fallingBoard[py][px].isMatched) {
          if (bottomY !== py) {
            fallingBoard[bottomY][px] = {
              ...fallingBoard[py][px],
              y: bottomY,
              yOffset: bottomY - py
            };
            fallingBoard[py][px] = createNewPiece(px, py);
          }
          bottomY--;
        }
      }
      
      // Заполняем пустые места новыми элементами
      for (let py = bottomY; py >= 0; py--) {
        fallingBoard[py][px] = {
          ...createNewPiece(px, py),
          yOffset: BOARD_SIZE
        };
      }
    }
    
    setBoard(fallingBoard);
    
    // Ждем анимацию падения
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Очищаем временные данные
    fallingBoard = fallingBoard.map(row =>
      row.map(piece => ({
        ...piece,
        isMatched: false,
        yOffset: undefined
      }))
    );
    
    setBoard(fallingBoard);
    
    // Проверяем новые совпадения
    const { matchedPieces, specialPieces, lineMatches } = findMatches(fallingBoard);
    if (matchedPieces.size > 0) {
      await processMatches(fallingBoard, matchedPieces, specialPieces, lineMatches);
    } else {
      setIsProcessing(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, piece: GamePiece) => {
    e.preventDefault(); // Предотвращаем прокрутку страницы
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
    setSelectedPiece(piece);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Предотвращаем прокрутку страницы
    if (!touchStart || !selectedPiece) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    // Определяем направление свайпа
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Горизонтальный свайп
      const targetX = deltaX > 0 ? selectedPiece.x + 1 : selectedPiece.x - 1;
      if (targetX >= 0 && targetX < BOARD_SIZE) {
        const targetPiece = board[selectedPiece.y][targetX];
        if (targetPiece) {
          swapPieces(selectedPiece, targetPiece);
          setTouchStart(null);
        }
      }
    } else {
      // Вертикальный свайп
      const targetY = deltaY > 0 ? selectedPiece.y + 1 : selectedPiece.y - 1;
      if (targetY >= 0 && targetY < BOARD_SIZE) {
        const targetPiece = board[targetY][selectedPiece.x];
        if (targetPiece) {
          swapPieces(selectedPiece, targetPiece);
          setTouchStart(null);
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Предотвращаем прокрутку страницы
    setTouchStart(null);
    setSelectedPiece(null);
  };

  // Функция для перемешивания доски
  const shuffleBoard = async () => {
    if (isProcessing || !useShuffle) return;
    
    // Проверяем, можно ли использовать бустер
    if (useShuffle()) {
      setIsProcessing(true);
      
      // Создаем новую случайную доску
      let newBoard: GamePiece[][];
      do {
        newBoard = Array(BOARD_SIZE).fill(null)
          .map((_, y) => Array(BOARD_SIZE).fill(null)
            .map((_, x) => createNewPiece(x, y))
          );
      } while (hasInitialMatches(newBoard));
      
      // Сохраняем бонусные фишки с предыдущей доски
      for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
          if (board[y][x].bonusType) {
            newBoard[y][x].bonusType = board[y][x].bonusType;
            newBoard[y][x].type = board[y][x].type;
          }
        }
      }
      
      setBoard(newBoard);
      
      // Эффект перемешивания
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsProcessing(false);
    }
  };

  // Функция для активации бомбы
  const activateBombBooster = async (x: number, y: number) => {
    if (isProcessing || !useBomb || !bombTarget) return;
    
    // Вызываем функцию использования бустера
    const result = useBomb();
    if (result) {
      setIsProcessing(true);
      
      // Добавляем анимацию взрыва бомбы
      const animateBombExplosion = async () => {
        // Создаем элемент эффекта для бомбы-бустера
        const bombEffect = document.createElement('div');
        bombEffect.className = 'absolute rounded-full z-30';
        bombEffect.style.left = `${x * 76 + 28}px`; // Центр ячейки (56px плитка + 20px gap)
        bombEffect.style.top = `${y * 76 + 28}px`;
        bombEffect.style.width = '64px';
        bombEffect.style.height = '64px';
        bombEffect.style.background = 'radial-gradient(circle, rgba(255,69,0,0.9) 0%, rgba(255,140,0,0.8) 30%, rgba(255,69,0,0.4) 60%, transparent 100%)';
        bombEffect.style.transform = 'translate(-50%, -50%)';
        bombEffect.style.opacity = '0';
        bombEffect.style.boxShadow = '0 0 20px rgba(255,69,0,0.6), inset 0 0 20px rgba(255,140,0,0.5)';
        
        // Добавляем элемент на игровое поле
        const gameBoard = document.querySelector('.grid-cols-6');
        if (gameBoard) {
          (gameBoard as HTMLElement).appendChild(bombEffect);
          
          // Анимируем появление и расширение
          requestAnimationFrame(() => {
            bombEffect.style.transition = 'opacity 0.1s ease-in, width 0.4s ease-out, height 0.4s ease-out, box-shadow 0.4s ease-out';
            bombEffect.style.opacity = '1';
            bombEffect.style.width = '240px';
            bombEffect.style.height = '240px';
            bombEffect.style.boxShadow = '0 0 60px rgba(255,69,0,0.8), inset 0 0 40px rgba(255,140,0,0.7)';
            
            // Создаем дополнительные искры
            for (let i = 0; i < 8; i++) {
              const spark = document.createElement('div');
              spark.className = 'absolute rounded-full z-35';
              spark.style.left = `${x * 76 + 28}px`;
              spark.style.top = `${y * 76 + 28}px`;
              spark.style.width = '4px';
              spark.style.height = '4px';
              spark.style.background = 'rgba(255,255,0,0.9)';
              spark.style.transform = 'translate(-50%, -50%)';
              
              const angle = (i / 8) * Math.PI * 2;
              const distance = 80 + Math.random() * 40;
              const targetX = Math.cos(angle) * distance;
              const targetY = Math.sin(angle) * distance;
              
              (gameBoard as HTMLElement).appendChild(spark);
              
              spark.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
              spark.style.transform = `translate(${targetX - 2}px, ${targetY - 2}px)`;
              spark.style.opacity = '0';
              
              setTimeout(() => spark.remove(), 500);
            }
            
            // Удаляем основной эффект через некоторое время
            setTimeout(() => {
              bombEffect.style.opacity = '0';
              setTimeout(() => {
                bombEffect.remove();
              }, 200);
            }, 400);
          });
        }
      };
      
      // Запускаем анимацию взрыва
      animateBombExplosion();
      
      // Запускаем встряску экрана
      triggerScreenShake();
      
      // Получаем все позиции для уничтожения (3x3 область)
      const piecesToDestroy: Array<{x: number, y: number}> = [];
      for (let py = Math.max(0, y - 1); py <= Math.min(BOARD_SIZE - 1, y + 1); py++) {
        for (let px = Math.max(0, x - 1); px <= Math.min(BOARD_SIZE - 1, x + 1); px++) {
          piecesToDestroy.push({x: px, y: py});
        }
      }
      
      // Помечаем фишки как совпавшие
      const newBoard = board.map(row => [...row]);
      for (const {x: px, y: py} of piecesToDestroy) {
        newBoard[py][px] = {
          ...newBoard[py][px],
          isMatched: true
        };
      }
      
      setBoard(newBoard);
      handleScoreUpdate(piecesToDestroy.length * 10);
      
      // Ждем анимацию исчезновения
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Обрабатываем падение элементов и заполнение пустот
      let fallingBoard = newBoard.map(row => [...row]);
      
      // Обрабатываем каждую колонку отдельно
      for (let px = 0; px < BOARD_SIZE; px++) {
        let bottomY = BOARD_SIZE - 1;
        
        // Двигаемся снизу вверх, перемещая неисчезнувшие элементы вниз
        for (let py = BOARD_SIZE - 1; py >= 0; py--) {
          if (!fallingBoard[py][px].isMatched) {
            if (bottomY !== py) {
              fallingBoard[bottomY][px] = {
                ...fallingBoard[py][px],
                y: bottomY,
                yOffset: bottomY - py
              };
              fallingBoard[py][px] = createNewPiece(px, py);
            }
            bottomY--;
          }
        }
        
        // Заполняем пустые места новыми элементами
        for (let py = bottomY; py >= 0; py--) {
          fallingBoard[py][px] = {
            ...createNewPiece(px, py),
            yOffset: BOARD_SIZE
          };
        }
      }
      
      setBoard(fallingBoard);
      
      // Ждем анимацию падения
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Очищаем временные данные
      fallingBoard = fallingBoard.map(row =>
        row.map(piece => ({
          ...piece,
          isMatched: false,
          yOffset: undefined
        }))
      );
      
      setBoard(fallingBoard);
      
      // Проверяем новые совпадения
      const { matchedPieces, specialPieces, lineMatches } = findMatches(fallingBoard);
      if (matchedPieces.size > 0) {
        await processMatches(fallingBoard, matchedPieces, specialPieces, lineMatches);
      } else {
        setIsProcessing(false);
      }
    }
    
    // Сбрасываем целевую позицию
    setBombTarget(null);
  };

  return (
    <motion.div
      className={`p-2 rounded-xl bg-white/10 backdrop-blur-sm mx-auto relative overflow-visible ${
        isShaking ? 'animate-shake' : ''
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ touchAction: 'none' }}
    >
      <div className="grid grid-cols-6 gap-4 sm:gap-5 md:gap-6 relative">
        <AnimatePresence mode="popLayout">
          {board.flat().map((piece) => (
            <motion.div
              key={piece.id}
              className={`w-14 h-14 sm:w-16 sm:h-16 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg cursor-pointer shadow-lg flex items-center justify-center ${
                selectedPiece?.id === piece.id ? 'ring-2 ring-white/90 ring-offset-1 ring-offset-pink-600' : ''
              } ${bombTarget ? 'ring-1 ring-red-500/50' : ''}`}
              style={{
                backgroundColor: 
                piece.type === 'manipula' ? 'rgba(255,64,129,0.75)' :
                piece.type === 'couch' ? 'rgba(0,176,255,0.75)' :
                piece.type === 'specialist' ? 'rgba(171,71,188,0.75)' :
                piece.type === 'client' ? 'rgba(255,193,7,0.75)' :
                piece.type === 'machine' ? 'rgba(76,175,80,0.75)' :
                piece.type === 'unicorn' ? 'rgba(244,67,54,0.75)' :
                'rgba(255,255,255,0.1)',
                boxShadow: selectedPiece?.id === piece.id ? 
                          '0 0 15px rgba(255,255,255,0.5)' : 
                          'none',
                position: 'relative',
                zIndex: bombTarget ? 30 : (piece.isMatched ? 0 : 1),
                transform: `translateZ(0)`
              }}
              initial={piece.yOffset ? { 
                y: -piece.yOffset * 76, // 56px плитка + 20px gap = 76px между центрами
                opacity: 0,
                scale: 0.8
              } : { 
                opacity: 1,
                scale: 1
              }}
              animate={{
                y: 0,
                opacity: piece.isMatched ? 0 : 1,
                scale: piece.isMatched ? 0.8 : 1
              }}
              exit={{ 
                scale: 0.8,
                opacity: 0
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: piece.type === 'manipula' ? 'rgba(255,64,129,0.9)' :
                piece.type === 'couch' ? 'rgba(0,176,255,0.9)' :
                piece.type === 'specialist' ? 'rgba(171,71,188,0.9)' :
                piece.type === 'client' ? 'rgba(255,193,7,0.9)' :
                piece.type === 'machine' ? 'rgba(76,175,80,0.9)' :
                piece.type === 'unicorn' ? 'rgba(244,67,54,0.95)' :
                'rgba(255,255,255,0.2)',
                transition: { duration: 0.1, type: "tween" }
              }}
              onClick={() => bombTarget ? activateBombBooster(piece.x, piece.y) : handlePieceClick(piece)}
              onTouchStart={(e) => {
                if (bombTarget) {
                  e.preventDefault();
                  activateBombBooster(piece.x, piece.y);
                } else {
                  handleTouchStart(e, piece);
                }
              }}
              onTouchMove={(e) => {
                if (!bombTarget) {
                  handleTouchMove(e);
                }
              }}
              onTouchEnd={(e) => {
                if (!bombTarget) {
                  handleTouchEnd(e);
                }
              }}
              transition={{
                y: { type: "spring", stiffness: 300, damping: 25 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              layout
            >
              <GamePieceIcon type={piece.type} bonusType={piece.bonusType} currentLevel={currentLevel} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Индикатор комбо-множителя перемещен вниз */}
      <AnimatePresence>
        {showCombo && (
          <motion.div 
            className="flex justify-center mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 rounded-lg text-white font-bold text-lg shadow-lg whitespace-nowrap">
              Комбо: {comboMultiplier.toFixed(1)}x
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Индикатор локального счета */}
      <div className="absolute top-2 left-2 text-xs text-white/50">
        Счет: {totalScore}, ExtraTime: {extraTime}
      </div>
      
      {/* Кнопки управления */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-8 mt-4 overflow-visible">
        {/* Индикатор выбора места для бомбы вместо обычных кнопок */}
        {bombTarget ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-3 rounded-xl border border-red-300/30 w-full sm:w-auto">
            <div className="text-center">
              <div className="text-white text-sm font-bold mb-1">💣 Выберите место для бомбы</div>
              <div className="text-white/90 text-xs mb-2 sm:mb-0">
                Нажмите на любую фишку для взрыва области 3×3
              </div>
            </div>
            <motion.button
              className="px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 text-sm min-h-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBombTarget(null)}
            >
              Отмена
            </motion.button>
          </div>
        ) : (
          <>
        {/* Кнопка перемешивания */}
        {useShuffle && (
          <motion.button
            className="p-3 bg-blue-500/70 rounded-full text-white shadow-lg hover:bg-blue-500 flex flex-col items-center relative group min-h-[56px] min-w-[56px]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={shuffleBoard}
                onMouseEnter={() => setActiveTooltip('shuffle')}
                onMouseLeave={() => setActiveTooltip(null)}
            title="Перемешать доску"
            disabled={!useShuffle}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8"></polyline>
              <line x1="4" y1="20" x2="21" y2="3"></line>
              <polyline points="21 16 21 21 16 21"></polyline>
              <line x1="15" y1="15" x2="21" y2="21"></line>
              <line x1="4" y1="4" x2="9" y2="9"></line>
            </svg>
            <span className="text-xs mt-1 hidden sm:block">Перемешать</span>
            {/* Индикатор количества */}
            <span className="absolute -top-1 -right-1 bg-white text-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {boosters.shuffle}
            </span>
          </motion.button>
        )}
        
        {/* Кнопка бомбы */}
        {useBomb && !bombTarget && (
          <motion.button
            className="p-3 bg-red-500/70 rounded-full text-white shadow-lg hover:bg-red-500 flex flex-col items-center relative group min-h-[56px] min-w-[56px]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setBombTarget({x: Math.floor(BOARD_SIZE/2), y: Math.floor(BOARD_SIZE/2)})}
                onMouseEnter={() => setActiveTooltip('bomb')}
                onMouseLeave={() => setActiveTooltip(null)}
            title="Активировать бомбу"
            disabled={!useBomb}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12h8"></path>
              <path d="M12 8v8"></path>
            </svg>
            <span className="text-xs mt-1 hidden sm:block">Бомба</span>
            {/* Индикатор количества */}
            <span className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {boosters.bomb}
            </span>
          </motion.button>
        )}
        
        {/* Кнопка времени */}
        <motion.button
          className="p-3 bg-green-500/70 rounded-full text-white shadow-lg hover:bg-green-500 flex flex-col items-center relative group min-h-[56px] min-w-[56px]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => useBooster && useBooster('extraTime')}
              onMouseEnter={() => setActiveTooltip('extraTime')}
              onMouseLeave={() => setActiveTooltip(null)}
          disabled={!useBooster || boosters.extraTime <= 0}
          title="Добавить время"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="text-xs mt-1 hidden sm:block">Время</span>
          {/* Индикатор количества */}
          <span className="absolute -top-1 -right-1 bg-white text-green-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {boosters.extraTime}
          </span>
        </motion.button>
          </>
        )}
        </div>
      
      {/* Контейнер для всплывающих подсказок */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div
            className="fixed left-1/2 bottom-[6rem] -translate-x-1/2 bg-black/95 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap shadow-2xl border border-white/30 backdrop-blur-sm z-[9999]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTooltip === 'shuffle' && 'Перемешать доску. Изменяет расположение всех фишек.'}
            {activeTooltip === 'bomb' && 'Бомба. Уничтожает фишки в области 3×3 вокруг выбранной точки.'}
            {activeTooltip === 'extraTime' && 'Добавляет +15 секунд к оставшемуся времени.'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameBoard; 
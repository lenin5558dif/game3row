import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GamePieceIcon, { GamePieceType } from './GamePieceIcon';

type GamePiece = {
  id: string;
  type: GamePieceType;
  x: number;
  y: number;
  isMatched: boolean;
  yOffset?: number;
};

type GameBoardProps = {
  onScoreUpdate: (score: number) => void;
  currentLevel: number;
};

const BOARD_SIZE = 6;

// Наборы иконок для разных уровней
const LEVEL_1_PIECES: GamePieceType[] = ['manipula', 'couch', 'specialist', 'client', 'machine', 'unicorn'];
const LEVEL_2_PIECES: GamePieceType[] = ['harry', 'hermione', 'ron', 'dumbledore', 'snape', 'voldemort'];
const LEVEL_3_PIECES: GamePieceType[] = ['luke', 'vader', 'grogu', 'chewbacca', 'yoda', 'r2d2'];
const LEVEL_4_PIECES: GamePieceType[] = ['daenerys', 'tyrion', 'drogon', 'nightking', 'direwolf', 'snow'];
const LEVEL_5_PIECES: GamePieceType[] = ['santa', 'christmasTree', 'gingerbread', 'hotChocolate', 'ornament', 'dalmatian'];
const LEVEL_6_PIECES: GamePieceType[] = ['rhinoceros', 'spitz', 'cat', 'lion', 'elephant', 'giraffe'];
const LEVEL_7_PIECES: GamePieceType[] = ['london', 'thailand', 'statue-of-liberty', 'paris', 'japan', 'moscow'];

const GameBoard: React.FC<GameBoardProps> = ({ onScoreUpdate, currentLevel }) => {
  const [board, setBoard] = useState<GamePiece[][]>([]);
  const [selectedPiece, setSelectedPiece] = useState<GamePiece | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const getPieceTypes = () => {
    switch (currentLevel) {
      case 2:
        return LEVEL_2_PIECES;
      case 3:
        return LEVEL_3_PIECES;
      case 4:
        return LEVEL_4_PIECES;
      case 5:
        return LEVEL_5_PIECES;
      case 6:
        return LEVEL_6_PIECES;
      case 7:
        return LEVEL_7_PIECES;
      default:
        return LEVEL_1_PIECES;
    }
  };

  const handleScoreUpdate = (points: number) => {
    onScoreUpdate(points);
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
  };

  useEffect(() => {
    initializeBoard();
  }, [currentLevel]);

  const findMatches = (currentBoard: GamePiece[][]): Set<string> => {
    const matchedPieces = new Set<string>();

    // Проверяем горизонтальные совпадения
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE - 2; x++) {
        const type = currentBoard[y][x].type;
        if (type === currentBoard[y][x + 1].type && 
            type === currentBoard[y][x + 2].type) {
          matchedPieces.add(`${x}-${y}`);
          matchedPieces.add(`${x + 1}-${y}`);
          matchedPieces.add(`${x + 2}-${y}`);
        }
      }
    }

    // Проверяем вертикальные совпадения
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE - 2; y++) {
        const type = currentBoard[y][x].type;
        if (type === currentBoard[y + 1][x].type && 
            type === currentBoard[y + 2][x].type) {
          matchedPieces.add(`${x}-${y}`);
          matchedPieces.add(`${x}-${y + 1}`);
          matchedPieces.add(`${x}-${y + 2}`);
        }
      }
    }

    return matchedPieces;
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

      if (isAdjacent) {
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
    const matches = findMatches(newBoard);
    
    if (matches.size > 0) {
      await processMatches(newBoard, matches);
    } else {
      // Если совпадений нет, возвращаем элементы обратно с анимацией
      const revertBoard = board.map(row => [...row]);
      setBoard(revertBoard);
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsProcessing(false);
    }
  };

  const processMatches = async (currentBoard: GamePiece[][], matches: Set<string>) => {
    // Помечаем совпавшие элементы
    const matchedBoard = currentBoard.map((row, y) =>
      row.map((piece, x) => ({
        ...piece,
        isMatched: matches.has(`${x}-${y}`)
      }))
    );
    setBoard(matchedBoard);
    handleScoreUpdate(matches.size * 10);

    // Ждем анимацию исчезновения
    await new Promise(resolve => setTimeout(resolve, 300));

    // Создаем новую доску для падения элементов
    let newBoard = matchedBoard.map(row => [...row]);

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

      // Заполняем пустые места новыми элементами
      for (let y = bottomY; y >= 0; y--) {
        newBoard[y][x] = {
          ...createNewPiece(x, y),
          yOffset: BOARD_SIZE
        };
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
    const newMatches = findMatches(newBoard);
    if (newMatches.size > 0) {
      await processMatches(newBoard, newMatches);
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

  return (
    <motion.div
      className="p-2 rounded-xl bg-white/10 backdrop-blur-sm mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ touchAction: 'none' }}
    >
      <div className="grid grid-cols-6 gap-2 relative">
        <AnimatePresence mode="popLayout">
          {board.flat().map((piece) => (
            <motion.div
              key={piece.id}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-lg cursor-pointer shadow-lg flex items-center justify-center ${
                selectedPiece?.id === piece.id ? 'ring-2 ring-white/90 ring-offset-1 ring-offset-pink-600' : ''
              }`}
              style={{
                backgroundColor: piece.type === 'manipula' ? 'rgba(255,64,129,0.75)' :
                               piece.type === 'couch' ? 'rgba(0,176,255,0.75)' :
                               piece.type === 'specialist' ? 'rgba(171,71,188,0.75)' :
                               piece.type === 'client' ? 'rgba(255,193,7,0.75)' :
                               piece.type === 'machine' ? 'rgba(76,175,80,0.75)' :
                               piece.type === 'unicorn' ? 'rgba(244,67,54,0.75)' :
                               // Яркие цвета для 2-го уровня
                               piece.type === 'harry' ? 'rgba(255,0,0,0.75)' :
                               piece.type === 'hermione' ? 'rgba(255,165,0,0.75)' :
                               piece.type === 'ron' ? 'rgba(255,255,0,0.75)' :
                               piece.type === 'dumbledore' ? 'rgba(138,43,226,0.75)' :
                               piece.type === 'snape' ? 'rgba(0,255,127,0.75)' :
                               piece.type === 'voldemort' ? 'rgba(255,20,147,0.75)' :
                               // Яркие цвета для 3-го уровня
                               piece.type === 'luke' ? 'rgba(0,191,255,0.75)' :
                               piece.type === 'vader' ? 'rgba(255,69,0,0.75)' :
                               piece.type === 'grogu' ? 'rgba(50,205,50,0.75)' :
                               piece.type === 'chewbacca' ? 'rgba(222,184,135,0.75)' :
                               piece.type === 'yoda' ? 'rgba(173,255,47,0.75)' :
                               piece.type === 'r2d2' ? 'rgba(255,255,0,0.75)' :
                               // Яркие цвета для 4-го уровня
                               piece.type === 'daenerys' ? 'rgba(255,0,0,0.75)' :
                               piece.type === 'tyrion' ? 'rgba(0,0,255,0.75)' :
                               piece.type === 'drogon' ? 'rgba(160,32,240,0.75)' :
                               piece.type === 'nightking' ? 'rgba(0,255,255,0.75)' :
                               piece.type === 'direwolf' ? 'rgba(0,255,0,0.75)' :
                               piece.type === 'snow' ? 'rgba(255,215,0,0.75)' :
                               // Яркие цвета для пятого уровня (Рождество)
                               piece.type === 'santa' ? 'rgba(255,0,0,0.75)' :
                               piece.type === 'christmasTree' ? 'rgba(0,255,0,0.75)' :
                               piece.type === 'gingerbread' ? 'rgba(255,165,0,0.75)' :
                               piece.type === 'hotChocolate' ? 'rgba(139,69,19,0.75)' :
                               piece.type === 'ornament' ? 'rgba(255,0,255,0.75)' :
                               piece.type === 'dalmatian' ? 'rgba(0,255,255,0.75)' :
                               // Яркие цвета для шестого уровня (Животные)
                               piece.type === 'rhinoceros' ? 'rgba(0,191,255,0.75)' :
                               piece.type === 'spitz' ? 'rgba(255,105,180,0.75)' :
                               piece.type === 'cat' ? 'rgba(255,140,0,0.75)' :
                               piece.type === 'lion' ? 'rgba(255,215,0,0.75)' :
                               piece.type === 'elephant' ? 'rgba(75,0,130,0.75)' :
                               piece.type === 'giraffe' ? 'rgba(0,255,0,0.75)' :
                               // Яркие цвета для 7-го уровня (Страны)
                               piece.type === 'london' ? 'rgba(255,0,0,0.75)' :       // Красный
                               piece.type === 'thailand' ? 'rgba(0,191,255,0.75)' :  // Ярко-голубой
                               piece.type === 'statue-of-liberty' ? 'rgba(0,255,0,0.75)' : // Ярко-зеленый
                               piece.type === 'paris' ? 'rgba(255,255,0,0.75)' :     // Желтый
                               piece.type === 'japan' ? 'rgba(255,0,255,0.75)' :     // Розовый
                               piece.type === 'moscow' ? 'rgba(75,0,130,0.75)' :     // Темно-фиолетовый
                               'rgba(255,255,255,0.1)',
                boxShadow: selectedPiece?.id === piece.id ? 
                          '0 0 15px rgba(255,255,255,0.5)' : 
                          'none',
                position: 'relative',
                zIndex: piece.isMatched ? 0 : 1,
                transform: `translateZ(0)`
              }}
              initial={piece.yOffset ? { 
                y: -piece.yOffset * 48,
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
                               // Яркие цвета для 2-го уровня при наведении
                               piece.type === 'harry' ? 'rgba(255,0,0,0.9)' :
                               piece.type === 'hermione' ? 'rgba(255,165,0,0.9)' :
                               piece.type === 'ron' ? 'rgba(255,255,0,0.9)' :
                               piece.type === 'dumbledore' ? 'rgba(138,43,226,0.9)' :
                               piece.type === 'snape' ? 'rgba(0,255,127,0.9)' :
                               piece.type === 'voldemort' ? 'rgba(255,20,147,0.9)' :
                               // Яркие цвета для 3-го уровня при наведении
                               piece.type === 'luke' ? 'rgba(0,191,255,0.9)' :
                               piece.type === 'vader' ? 'rgba(255,69,0,0.9)' :
                               piece.type === 'grogu' ? 'rgba(50,205,50,0.9)' :
                               piece.type === 'chewbacca' ? 'rgba(222,184,135,0.9)' :
                               piece.type === 'yoda' ? 'rgba(173,255,47,0.9)' :
                               piece.type === 'r2d2' ? 'rgba(255,255,0,0.9)' :
                               // Яркие цвета для 4-го уровня при наведении
                               piece.type === 'daenerys' ? 'rgba(255,0,0,0.9)' :
                               piece.type === 'tyrion' ? 'rgba(0,0,255,0.9)' :
                               piece.type === 'drogon' ? 'rgba(160,32,240,0.9)' :
                               piece.type === 'nightking' ? 'rgba(0,255,255,0.9)' :
                               piece.type === 'direwolf' ? 'rgba(0,255,0,0.9)' :
                               piece.type === 'snow' ? 'rgba(255,215,0,0.9)' :
                               // Яркие цвета для пятого уровня при наведении
                               piece.type === 'santa' ? 'rgba(255,0,0,0.9)' :
                               piece.type === 'christmasTree' ? 'rgba(0,255,0,0.9)' :
                               piece.type === 'gingerbread' ? 'rgba(255,165,0,0.9)' :
                               piece.type === 'hotChocolate' ? 'rgba(139,69,19,0.9)' :
                               piece.type === 'ornament' ? 'rgba(255,0,255,0.9)' :
                               piece.type === 'dalmatian' ? 'rgba(0,255,255,0.9)' :
                               // Яркие цвета для шестого уровня при наведении
                               piece.type === 'rhinoceros' ? 'rgba(0,191,255,0.9)' :
                               piece.type === 'spitz' ? 'rgba(255,105,180,0.9)' :
                               piece.type === 'cat' ? 'rgba(255,140,0,0.9)' :
                               piece.type === 'lion' ? 'rgba(255,215,0,0.9)' :
                               piece.type === 'elephant' ? 'rgba(75,0,130,0.9)' :
                               piece.type === 'giraffe' ? 'rgba(0,255,0,0.9)' :
                               // Яркие цвета для 7-го уровня при наведении
                               piece.type === 'london' ? 'rgba(255,0,0,0.9)' :
                               piece.type === 'thailand' ? 'rgba(0,191,255,0.9)' :
                               piece.type === 'statue-of-liberty' ? 'rgba(0,255,0,0.9)' :
                               piece.type === 'paris' ? 'rgba(255,255,0,0.9)' :
                               piece.type === 'japan' ? 'rgba(255,0,255,0.9)' :
                               piece.type === 'moscow' ? 'rgba(75,0,130,0.9)' :
                               'rgba(255,255,255,0.2)',
                transition: { duration: 0.1, type: "tween" }
              }}
              onClick={() => handlePieceClick(piece)}
              onTouchStart={(e) => handleTouchStart(e, piece)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              transition={{
                y: { type: "spring", stiffness: 300, damping: 25 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              layout
            >
              <GamePieceIcon type={piece.type} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GameBoard; 
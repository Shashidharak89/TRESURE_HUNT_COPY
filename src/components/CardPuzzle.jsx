import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import "./styles/CardPuzzle.css";

const CardPuzzle = ({ onComplete = () => {} }) => {
  const [gameState, setGameState] = useState("intro"); // intro, playing, completed
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameBoard, setGameBoard] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const boardRef = useRef(null);
  const { width, height } = useWindowSize();
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });
  const [showHint, setShowHint] = useState(false);

  // Game difficulty settings by level
  const levels = {
    1: { gridSize: 3, pattern: "sequence", timeout: 1000 }, // 3x3 sequential numbers
    2: { gridSize: 4, pattern: "pairs", timeout: 800 }, // 4x4 matching pairs
    3: { gridSize: 5, pattern: "triangle", timeout: 650 }, // 5x5 triangle pattern
    4: { gridSize: 5, pattern: "spiral", timeout: 500 } // 5x5 spiral pattern
  };

  // Patterns for each level
  const generatePattern = (level, gridSize) => {
    const totalTiles = gridSize * gridSize;
    let tiles = [];

    switch (level.pattern) {
      case "sequence":
        // Sequential number pattern - tiles must be selected in numerical order
        for (let i = 0; i < totalTiles; i++) {
          tiles.push({
            id: i,
            value: i + 1,
            revealed: false,
            selected: false,
            row: Math.floor(i / gridSize),
            col: i % gridSize
          });
        }
        return tiles.sort(() => Math.random() - 0.5); // Shuffle

      case "pairs":
        // Matching pairs pattern
        for (let i = 0; i < totalTiles / 2; i++) {
          tiles.push(
            {
              id: i * 2,
              value: i + 1,
              pairId: i,
              revealed: false,
              selected: false,
              row: Math.floor((i * 2) / gridSize),
              col: (i * 2) % gridSize
            },
            {
              id: i * 2 + 1,
              value: i + 1,
              pairId: i,
              revealed: false,
              selected: false,
              row: Math.floor((i * 2 + 1) / gridSize),
              col: (i * 2 + 1) % gridSize
            }
          );
        }
        return tiles.sort(() => Math.random() - 0.5); // Shuffle

      case "triangle":
        // Triangle pattern - select tiles to form a triangle
        for (let i = 0; i < totalTiles; i++) {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          
          // Define which tiles form the triangle pattern
          const isTriangleTile = 
            (row === 0 && col === gridSize/2) || // top
            (row === 1 && (col === gridSize/2-1 || col === gridSize/2+1)) || // second row
            (row === 2 && (col >= gridSize/2-2 && col <= gridSize/2+2)) || // third row
            (row >= 3 && row < gridSize); // bottom rows
            
          tiles.push({
            id: i,
            value: isTriangleTile ? "🔺" : "❌",
            isTarget: isTriangleTile,
            revealed: false,
            selected: false,
            row,
            col
          });
        }
        return tiles;
        
      case "spiral":
        // Spiral pattern - select tiles in a spiral order from outside to inside
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
        let spiralOrder = [];
        let visited = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
        let dir = 0;
        let row = 0;
        let col = 0;
        
        for (let i = 0; i < totalTiles; i++) {
          spiralOrder.push(row * gridSize + col);
          visited[row][col] = true;
          
          // Calculate next position
          const nextRow = row + directions[dir][0];
          const nextCol = col + directions[dir][1];
          
          // Check if we need to change direction
          if (
            nextRow < 0 || 
            nextRow >= gridSize || 
            nextCol < 0 || 
            nextCol >= gridSize || 
            visited[nextRow][nextCol]
          ) {
            dir = (dir + 1) % 4; // Change direction
          }
          
          row += directions[dir][0];
          col += directions[dir][1];
        }
        
        // Create tiles with correct spiral order value
        for (let i = 0; i < totalTiles; i++) {
          const position = spiralOrder.indexOf(i);
          tiles.push({
            id: i,
            value: position + 1,
            correctOrder: position,
            revealed: false,
            selected: false,
            row: Math.floor(i / gridSize),
            col: i % gridSize
          });
        }
        return tiles;
        
      default:
        return [];
    }
  };

  // Initialize game when level changes
  useEffect(() => {
    if (gameState === "playing") {
      const currentLevelConfig = levels[currentLevel];
      const tiles = generatePattern(currentLevelConfig, currentLevelConfig.gridSize);
      setGameBoard(tiles);
      setSelectedTiles([]);
      setAttempts(0);
      
      // Show hint briefly at the start of each level
      setShowHint(true);
      setTimeout(() => {
        setShowHint(false);
      }, 2000);
    }
  }, [currentLevel, gameState]);

  // Update board dimensions
  useEffect(() => {
    if (boardRef.current && gameState === "playing") {
      const container = boardRef.current.parentElement;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const size = Math.min(containerWidth, containerHeight) * 0.9;
      
      setBoardDimensions({
        width: size,
        height: size
      });
    }
  }, [gameState, width, height]);

  // Check if level is completed
  useEffect(() => {
    if (gameState !== "playing" || gameBoard.length === 0) return;

    const currentLevelConfig = levels[currentLevel];
    let isCompleted = false;

    switch (currentLevelConfig.pattern) {
      case "sequence":
        // All tiles must be selected in order
        isCompleted = selectedTiles.length === gameBoard.length &&
          selectedTiles.every((tile, index) => tile.value === index + 1);
        break;
        
      case "pairs":
        // All pairs must be matched
        isCompleted = gameBoard.every(tile => tile.revealed);
        break;
        
      case "triangle":
        // All triangle tiles must be selected, no other tiles
        const targetTiles = gameBoard.filter(tile => tile.isTarget);
        const selectedTargets = selectedTiles.filter(tile => tile.isTarget);
        isCompleted = selectedTargets.length === targetTiles.length &&
          selectedTiles.length === targetTiles.length;
        break;
        
      case "spiral":
        // Tiles must be selected in spiral order
        isCompleted = selectedTiles.length === gameBoard.length &&
          selectedTiles.every((tile, index) => tile.correctOrder === index);
        break;
    }

    if (isCompleted) {
      // Level completed
      setTimeout(() => {
        if (currentLevel < Object.keys(levels).length) {
          // Advance to next level
          setCurrentLevel(prev => prev + 1);
          setGameBoard([]);
          setSelectedTiles([]);
        } else {
          // Game completed
          setGameState("completed");
          onComplete();
        }
      }, 1000);
    }
  }, [selectedTiles, gameBoard, currentLevel, gameState, onComplete]);

  // Handle tile selection
  const handleTileClick = (tile) => {
    if (gameState !== "playing" || tile.revealed) return;

    const currentLevelConfig = levels[currentLevel];
    
    switch (currentLevelConfig.pattern) {
      case "sequence":
        // Check if selecting the correct next number
        const nextExpected = selectedTiles.length + 1;
        if (tile.value === nextExpected) {
          setSelectedTiles(prev => [...prev, tile]);
          setGameBoard(prev => 
            prev.map(t => t.id === tile.id ? { ...t, revealed: true, selected: true } : t)
          );
        } else {
          // Wrong selection, reset
          setAttempts(prev => prev + 1);
          setSelectedTiles([]);
          setGameBoard(prev => 
            prev.map(t => ({ ...t, revealed: false, selected: false }))
          );
          
          // Flash board to indicate error
          setShowHint(true);
          setTimeout(() => setShowHint(false), 300);
        }
        break;
        
      case "pairs":
        // Handle pair matching
        const updatedBoard = [...gameBoard];
        const tileIndex = updatedBoard.findIndex(t => t.id === tile.id);
        
        // Flip tile
        updatedBoard[tileIndex] = { ...updatedBoard[tileIndex], revealed: true };
        setGameBoard(updatedBoard);
        
        // If two tiles are flipped, check if they match
        const revealedTiles = updatedBoard.filter(t => t.revealed && !t.matched);
        
        if (revealedTiles.length === 2) {
          setAttempts(prev => prev + 1);
          
          if (revealedTiles[0].pairId === revealedTiles[1].pairId) {
            // Match found
            setTimeout(() => {
              setGameBoard(prev => 
                prev.map(t => 
                  (t.id === revealedTiles[0].id || t.id === revealedTiles[1].id) 
                    ? { ...t, matched: true } 
                    : t
                )
              );
              setSelectedTiles(prev => [...prev, tile]);
            }, currentLevelConfig.timeout);
          } else {
            // No match, flip back
            setTimeout(() => {
              setGameBoard(prev => 
                prev.map(t => 
                  (!t.matched) ? { ...t, revealed: false } : t
                )
              );
            }, currentLevelConfig.timeout);
          }
        }
        break;
        
      case "triangle":
        // Toggle selection for triangle tiles
        const isSelected = selectedTiles.some(t => t.id === tile.id);
        
        if (isSelected) {
          // Deselect
          setSelectedTiles(prev => prev.filter(t => t.id !== tile.id));
          setGameBoard(prev => 
            prev.map(t => t.id === tile.id ? { ...t, selected: false } : t)
          );
        } else {
          // Select
          setSelectedTiles(prev => [...prev, tile]);
          setGameBoard(prev => 
            prev.map(t => t.id === tile.id ? { ...t, selected: true } : t)
          );
        }
        
        // Count as attempt when selecting non-target
        if (!tile.isTarget) {
          setAttempts(prev => prev + 1);
        }
        break;
        
      case "spiral":
        // Check if selecting the correct next position in spiral
        const nextOrderExpected = selectedTiles.length;
        
        if (tile.correctOrder === nextOrderExpected) {
          setSelectedTiles(prev => [...prev, tile]);
          setGameBoard(prev => 
            prev.map(t => t.id === tile.id ? { ...t, revealed: true, selected: true } : t)
          );
        } else {
          // Wrong selection, reset
          setAttempts(prev => prev + 1);
          setSelectedTiles([]);
          setGameBoard(prev => 
            prev.map(t => ({ ...t, revealed: false, selected: false }))
          );
          
          // Flash board to indicate error
          setShowHint(true);
          setTimeout(() => setShowHint(false), 300);
        }
        break;
    }
  };

  // Start game
  const startGame = () => {
    setGameState("playing");
  };

  // Reset game
  const resetGame = () => {
    setGameState("intro");
    setCurrentLevel(1);
    setGameBoard([]);
    setSelectedTiles([]);
    setAttempts(0);
  };

  // Get hint text based on level
  const getHintText = () => {
    switch (levels[currentLevel].pattern) {
      case "sequence":
        return "Find and select numbers in order (1, 2, 3...)";
      case "pairs":
        return "Find matching pairs of numbers";
      case "triangle":
        return "Select only tiles that form a triangle pattern";
      case "spiral":
        return "Select tiles in spiral order, starting from outside";
      default:
        return "Solve the puzzle";
    }
  };

  // Get level title
  const getLevelTitle = () => {
    switch (currentLevel) {
      case 1: return "Memory Test";
      case 2: return "Paired Minds";
      case 3: return "Triangle of Doom";
      case 4: return "Spiral of Death";
      default: return `Level ${currentLevel}`;
    }
  };

  // Calculate the size of each tile based on grid
  const currentLevelConfig = levels[currentLevel] || { gridSize: 3 };
  const tileSize = boardDimensions.width / currentLevelConfig.gridSize;

  return (
    <div className="squid-puzzle-container">
      {gameState === "intro" && (
        <motion.div 
          className="squid-puzzle-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1>Squid Game: Mind Puzzle</h1>
          <p>Complete all four levels to survive. Each level presents a unique challenge that will test your memory and perception.</p>
          <motion.button 
            className="squid-puzzle-start-button"
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Game
          </motion.button>
        </motion.div>
      )}
      
      {gameState === "playing" && (
        <div className="squid-puzzle-game">
          <div className="squid-puzzle-header">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getLevelTitle()}
            </motion.h2>
            <div className="squid-puzzle-stats">
              <span className="squid-puzzle-level">Level {currentLevel}/{Object.keys(levels).length}</span>
              <span className="squid-puzzle-attempts">Attempts: {attempts}</span>
            </div>
          </div>
          
          <AnimatePresence>
            {showHint && (
              <motion.div 
                className="squid-puzzle-hint"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {getHintText()}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="squid-puzzle-area">
            <div 
              className={`squid-puzzle-board ${showHint ? "squid-puzzle-flash" : ""}`}
              ref={boardRef}
              style={{ 
                width: `${boardDimensions.width}px`,
                height: `${boardDimensions.height}px`,
                gridTemplateColumns: `repeat(${currentLevelConfig.gridSize}, 1fr)`
              }}
            >
              <AnimatePresence>
                {gameBoard.map((tile) => (
                  <motion.div
                    key={tile.id}
                    className={`squid-puzzle-tile ${tile.revealed ? "squid-puzzle-tile-revealed" : ""} ${tile.selected ? "squid-puzzle-tile-selected" : ""} ${tile.matched ? "squid-puzzle-tile-matched" : ""}`}
                    onClick={() => handleTileClick(tile)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotateY: tile.revealed ? "180deg" : "0deg"
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      delay: tile.id * 0.03
                    }}
                    style={{
                      width: `${tileSize}px`,
                      height: `${tileSize}px`
                    }}
                  >
                    <div className="squid-puzzle-tile-inner">
                      <div className="squid-puzzle-tile-front">
                        <span className="squid-puzzle-tile-symbol">?</span>
                      </div>
                      <div className="squid-puzzle-tile-back">
                        <span className="squid-puzzle-tile-symbol">{tile.value}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="squid-puzzle-controls">
            <motion.button 
              className="squid-puzzle-hint-button"
              onClick={() => {
                setShowHint(true);
                setTimeout(() => setShowHint(false), 2000);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Hint
            </motion.button>
            
            <motion.button 
              className="squid-puzzle-reset-button"
              onClick={resetGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          </div>
        </div>
      )}
      
      {gameState === "completed" && (
        <motion.div 
          className="squid-puzzle-victory"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
          />
          <h1>You Survived!</h1>
          <p>Congratulations on completing all the challenges.</p>
          <p>You've proven your mental abilities and earned the prize.</p>
          <motion.button 
            className="squid-puzzle-restart-button"
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Again
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default CardPuzzle;
import React, { useState, useEffect, useRef } from "react";
import "./styles/MazeGame.css";

const MazeGame = ({ onComplete }) => {
  const [maze, setMaze] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [finishPosition, setFinishPosition] = useState({ x: 0, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const mazeRef = useRef(null);
  const countdownInterval = useRef(null);

  // Initialize maze
  useEffect(() => {
    generateMaze();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (gameStarted && !gameWon) {
      countdownInterval.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current);
            resetGame();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, [gameStarted, gameWon]);

  // Check for win condition
  useEffect(() => {
    if (gameStarted && 
        playerPosition.x === finishPosition.x && 
        playerPosition.y === finishPosition.y) {
      setGameWon(true);
      clearInterval(countdownInterval.current);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [playerPosition, finishPosition, gameStarted, onComplete]);

  const generateMaze = () => {
    // Create a 10x10 maze
    const size = 10;
    const newMaze = Array(size).fill().map(() => Array(size).fill(0));
    
    // Add walls randomly (1 = wall, 0 = path)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Ensure there's a path: don't add too many walls
        newMaze[i][j] = Math.random() > 0.3 ? 0 : 1;
      }
    }
    
    // Set start position (always at top-left corner)
    const startX = 0;
    const startY = 0;
    newMaze[startY][startX] = 0; // Ensure start is a path
    
    // Set finish position (always at bottom-right corner)
    const finishX = size - 1;
    const finishY = size - 1;
    newMaze[finishY][finishX] = 0; // Ensure finish is a path
    
    // Ensure there's a path from start to finish
    const ensurePath = (x, y, targetX, targetY) => {
      if (x === targetX && y === targetY) return;
      
      if (x < targetX) {
        newMaze[y][x + 1] = 0; // Right
        ensurePath(x + 1, y, targetX, targetY);
      } else if (y < targetY) {
        newMaze[y + 1][x] = 0; // Down
        ensurePath(x, y + 1, targetX, targetY);
      }
    };
    
    ensurePath(startX, startY, finishX, finishY);
    
    setMaze(newMaze);
    setPlayerPosition({ x: startX, y: startY });
    setFinishPosition({ x: finishX, y: finishY });
  };

  const handleKeyDown = (e) => {
    if (!gameStarted || gameWon) return;
    
    const { x, y } = playerPosition;
    let newX = x;
    let newY = y;
    
    switch (e.key) {
      case "ArrowUp":
        newY = Math.max(0, y - 1);
        break;
      case "ArrowDown":
        newY = Math.min(maze.length - 1, y + 1);
        break;
      case "ArrowLeft":
        newX = Math.max(0, x - 1);
        break;
      case "ArrowRight":
        newX = Math.min(maze[0].length - 1, x + 1);
        break;
      default:
        return;
    }
    
    // Check if the new position is a path (not a wall)
    if (maze[newY][newX] === 0) {
      setPlayerPosition({ x: newX, y: newY });
    }
  };

  const handleTouchStart = (e) => {
    if (!gameStarted || gameWon) return;
    
    const touch = e.touches[0];
    const rect = mazeRef.current.getBoundingClientRect();
    const x = Math.floor((touch.clientX - rect.left) / (rect.width / maze[0].length));
    const y = Math.floor((touch.clientY - rect.top) / (rect.height / maze.length));
    
    // Only allow movement to adjacent cells
    const { x: playerX, y: playerY } = playerPosition;
    const isAdjacent = 
      (Math.abs(x - playerX) === 1 && y === playerY) || 
      (Math.abs(y - playerY) === 1 && x === playerX);
    
    if (isAdjacent && x >= 0 && x < maze[0].length && y >= 0 && y < maze.length && maze[y][x] === 0) {
      setPlayerPosition({ x, y });
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameWon(false);
    setCountdown(60);
    generateMaze();
    // Focus on the maze container to enable keyboard events
    if (mazeRef.current) {
      mazeRef.current.focus();
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameWon(false);
    setCountdown(60);
    generateMaze();
  };

  return (
    <div className="squid-maze-game">
      <div className="squid-maze-instructions">
        <p>Navigate through the maze to reach the finish marker.</p>
        <p>Use arrow keys to move or tap adjacent cells.</p>
      </div>
      
      <div className="squid-maze-status">
        {!gameStarted ? (
          <button className="squid-maze-start-button" onClick={startGame}>
            Start Game
          </button>
        ) : (
          <>
            <div className="squid-maze-timer">
              <div className="squid-maze-timer-value">{countdown}</div>
              <div className="squid-maze-timer-label">seconds</div>
            </div>
            
            <button className="squid-maze-reset-button" onClick={resetGame}>
              Reset
            </button>
          </>
        )}
      </div>
      
      {gameStarted && (
        <div 
          className="squid-maze-container" 
          ref={mazeRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
        >
          {maze.map((row, y) => (
            <div key={y} className="squid-maze-row">
              {row.map((cell, x) => (
                <div 
                  key={`${y}-${x}`} 
                  className={`squid-maze-cell ${cell === 1 ? 'squid-maze-wall' : 'squid-maze-path'} 
                    ${playerPosition.x === x && playerPosition.y === y ? 'squid-maze-player' : ''}
                    ${finishPosition.x === x && finishPosition.y === y ? 'squid-maze-finish' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      
      {gameWon && (
        <div className="squid-maze-win-message">
          <span>Congratulations!</span> You've completed the maze!
        </div>
      )}
    </div>
  );
};

export default MazeGame;
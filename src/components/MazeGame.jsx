import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./styles/MazeGame.css";

const MazeGame = ({ onComplete }) => {
  const [maze, setMaze] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [finishPosition, setFinishPosition] = useState({ x: 0, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const mazeRef = useRef(null);
  const rocketRef = useRef(null);

  // Initialize maze
  useEffect(() => {
    generateMaze();
  }, []);

  // Check for win condition
  useEffect(() => {
    if (
      gameStarted &&
      playerPosition.x === finishPosition.x &&
      playerPosition.y === finishPosition.y
    ) {
      setGameWon(true);
      animateWin();
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
    }
  }, [playerPosition, finishPosition, gameStarted, onComplete]);

  // Animate rocket movement
  useEffect(() => {
    if (rocketRef.current && gameStarted) {
      gsap.to(rocketRef.current, {
        duration: 0.3,
        x: playerPosition.x * 30,
        y: playerPosition.y * 30,
        ease: "power2.out"
      });
    }
  }, [playerPosition, gameStarted]);

  const animateWin = () => {
    if (rocketRef.current) {
      gsap.to(rocketRef.current, {
        duration: 0.5,
        rotation: 360,
        scale: 1.5,
        repeat: 2,
        ease: "bounce.out"
      });
    }
  };

  const generateMaze = () => {
    // Create a more compact but challenging 12x12 maze
    const mazeLayout = [
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
      [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1],
      [0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];







    setMaze(mazeLayout);
    setPlayerPosition({ x: 0, y: 0 });
    setFinishPosition({ x: 11, y: 11 });
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
      setMoveCount(prev => prev + 1);
    }
  };

  const handleDirectionClick = (direction) => {
    if (!gameStarted || gameWon) return;

    const { x, y } = playerPosition;
    let newX = x;
    let newY = y;

    switch (direction) {
      case "up":
        newY = Math.max(0, y - 1);
        break;
      case "down":
        newY = Math.min(maze.length - 1, y + 1);
        break;
      case "left":
        newX = Math.max(0, x - 1);
        break;
      case "right":
        newX = Math.min(maze[0].length - 1, x + 1);
        break;
      default:
        return;
    }

    // Check if the new position is a path (not a wall)
    if (maze[newY][newX] === 0) {
      setPlayerPosition({ x: newX, y: newY });
      setMoveCount(prev => prev + 1);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameWon(false);
    setMoveCount(0);
    generateMaze();
    // Focus on the maze container to enable keyboard events
    if (mazeRef.current) {
      mazeRef.current.focus();
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameWon(false);
    setMoveCount(0);
    generateMaze();
  };

  return (
    <div className="compact-maze-game">
      <div className="compact-maze-header">
        <h1>Space Maze</h1>
        <p>Guide your rocket to Earth</p>
      </div>

      <div className="compact-maze-status">
        {!gameStarted ? (
          <button className="compact-maze-start-button" onClick={startGame}>
            Launch
          </button>
        ) : (
          <div className="compact-maze-stats">
            <div className="compact-maze-moves">
              <span>{moveCount}</span> moves
            </div>
            <button className="compact-maze-reset-button" onClick={resetGame}>
              Reset
            </button>
          </div>
        )}
      </div>

      {gameStarted && (
        <div className="compact-maze-gameplay">
          <div
            className="compact-maze-container"
            ref={mazeRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {maze.map((row, y) => (
              <div key={y} className="compact-maze-row">
                {row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className={`compact-maze-cell ${cell === 1 ? 'compact-maze-wall' : 'compact-maze-path'} 
                      ${finishPosition.x === x && finishPosition.y === y ? 'compact-maze-finish' : ''}`}
                  />
                ))}
              </div>
            ))}

            <div
              ref={rocketRef}
              className="compact-maze-rocket"
              style={{
                transform: `translate(${playerPosition.x * 30}px, ${playerPosition.y * 30}px)`
              }}
            />
          </div>

          <div className="compact-maze-controls">
            <button
              className="compact-maze-control-button up"
              onClick={() => handleDirectionClick("up")}
            >
              ↑
            </button>
            <div className="compact-maze-control-row">
              <button
                className="compact-maze-control-button left"
                onClick={() => handleDirectionClick("left")}
              >
                ←
              </button>
              <button
                className="compact-maze-control-button right"
                onClick={() => handleDirectionClick("right")}
              >
                →
              </button>
            </div>
            <button
              className="compact-maze-control-button down"
              onClick={() => handleDirectionClick("down")}
            >
              ↓
            </button>
          </div>
        </div>
      )}

      {gameWon && (
        <div className="compact-maze-win-message">
          <span>Success!</span>
          <p>Completed in {moveCount} moves</p>
        </div>
      )}
    </div>
  );
};

export default MazeGame;
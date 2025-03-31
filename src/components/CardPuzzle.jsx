import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GSAP from "gsap";
import "./styles/CardPuzzle.css";

const CardPuzzle = ({ onComplete }) => {
  const [pieces, setPieces] = useState([]);
  const [solved, setSolved] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(120); // 2 minutes timer
  const [hint, setHint] = useState(false);
  const boardRef = useRef(null);
  const timerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // This is a triangle puzzle where each piece has a pattern that must connect with neighbors
  // Each piece has 3 sides with connectors (in/out)
  const directions = ["top", "right", "bottom", "left"];
  
  // Initialize the game
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
      // Start timer
      timerRef.current = setInterval(() => {
        setTimer(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            resetGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted]);

  // Use GSAP for background animations when component mounts
  useEffect(() => {
    const timeline = GSAP.timeline({ repeat: -1, yoyo: true });
    timeline.to(".squid-puzzle-background", {
      backgroundPosition: "100% 100%",
      duration: 20,
      ease: "sine.inOut"
    });
    
    return () => timeline.kill();
  }, []);

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (boardRef.current) {
        const { width, height } = boardRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, [gameStarted]);

  // Check if puzzle is solved - the challenging part is that pieces need to connect properly
  useEffect(() => {
    if (!gameStarted || pieces.length === 0) return;
    
    // The puzzle is solved when:
    // 1. All pieces are placed on the board
    // 2. All connections between adjacent pieces match (out connects to in)
    const allPlaced = pieces.every(piece => piece.placed);
    
    if (allPlaced) {
      const gridSize = 3; // 3x3 grid
      let connectionsValid = true;
      
      // Check each piece's connections with its neighbors
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const currentPosition = row * gridSize + col;
          const currentPiece = pieces.find(p => p.currentPosition === currentPosition);
          
          if (!currentPiece) {
            connectionsValid = false;
            break;
          }
          
          // Check right connection
          if (col < gridSize - 1) {
            const rightPosition = row * gridSize + (col + 1);
            const rightPiece = pieces.find(p => p.currentPosition === rightPosition);
            
            if (rightPiece) {
              const currentRightConn = currentPiece.connections.right;
              const rightLeftConn = rightPiece.connections.left;
              
              if (currentRightConn !== (rightLeftConn === "in" ? "out" : "in")) {
                connectionsValid = false;
                break;
              }
            }
          }
          
          // Check bottom connection
          if (row < gridSize - 1) {
            const bottomPosition = (row + 1) * gridSize + col;
            const bottomPiece = pieces.find(p => p.currentPosition === bottomPosition);
            
            if (bottomPiece) {
              const currentBottomConn = currentPiece.connections.bottom;
              const bottomTopConn = bottomPiece.connections.top;
              
              if (currentBottomConn !== (bottomTopConn === "in" ? "out" : "in")) {
                connectionsValid = false;
                break;
              }
            }
          }
        }
        
        if (!connectionsValid) break;
      }
      
      if (connectionsValid) {
        setSolved(true);
        clearInterval(timerRef.current);
        
        // Victory animations using GSAP
        GSAP.to(".squid-puzzle-board", {
          boxShadow: "0 0 30px #ff2d55",
          duration: 1,
          repeat: 3,
          yoyo: true
        });
        
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 3000);
      }
    }
  }, [pieces, onComplete, gameStarted]);

  // Create a set of pieces that can be solved
  const initializeGame = () => {
    const gridSize = 3; // 3x3 puzzle
    const totalPieces = gridSize * gridSize;
    const solution = createSolvablePuzzle(gridSize);
    
    // Create pieces based on solution
    const newPieces = solution.map((piece, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      return {
        id: index,
        row: row,
        col: col,
        rotation: piece.rotation,
        connections: piece.connections,
        correctPosition: index,
        currentPosition: null,
        x: 0,
        y: 0,
        placed: false,
        color: piece.color
      };
    });
    
    // Shuffle pieces
    const shuffledPieces = [...newPieces].sort(() => Math.random() - 0.5);
    
    // Position in staging area
    const updatedPieces = shuffledPieces.map((piece, index) => {
      // Create a circular arrangement
      const angle = (index / totalPieces) * 2 * Math.PI;
      const radius = 150;
      const x = Math.cos(angle) * radius + 150;
      const y = Math.sin(angle) * radius + 150;
      
      return {
        ...piece,
        x: x,
        y: y + 350, // Position below the board
        rotation: Math.random() * 360 // Random initial rotation
      };
    });
    
    setPieces(updatedPieces);
    setAttempts(0);
    setTimer(120);
    setSolved(false);
    setHint(false);
  };

  // Creates a puzzle configuration that is solvable
  const createSolvablePuzzle = (gridSize) => {
    const totalPieces = gridSize * gridSize;
    const solution = [];
    
    // Define connection types for each piece
    // This is the tricky part - we need to ensure connections match
    // For simplicity, we'll use a predefined solution for 3x3
    
    // Connection types: "in" or "out"
    // Colors to make the puzzle visually interesting
    const colors = ["#ff2d55", "#00ff00", "#00ccff", "#ffcc00", "#9900ff"];
    
    // Predetermined solution (for a 3x3 grid)
    // In a real game, we'd generate this dynamically
    const piecesData = [
      { connections: { top: "out", right: "in", bottom: "out", left: "in" }, rotation: 0, color: colors[0] },
      { connections: { top: "in", right: "out", bottom: "in", left: "out" }, rotation: 90, color: colors[1] },
      { connections: { top: "in", right: "in", bottom: "out", left: "out" }, rotation: 180, color: colors[2] },
      { connections: { top: "in", right: "out", bottom: "out", left: "in" }, rotation: 270, color: colors[3] },
      { connections: { top: "out", right: "in", bottom: "in", left: "out" }, rotation: 0, color: colors[4] },
      { connections: { top: "out", right: "out", bottom: "in", left: "in" }, rotation: 90, color: colors[0] },
      { connections: { top: "in", right: "in", bottom: "out", left: "out" }, rotation: 180, color: colors[1] },
      { connections: { top: "out", right: "out", bottom: "in", left: "in" }, rotation: 270, color: colors[2] },
      { connections: { top: "in", right: "in", bottom: "out", left: "out" }, rotation: 0, color: colors[3] }
    ];
    
    for (let i = 0; i < totalPieces; i++) {
      solution.push(piecesData[i]);
    }
    
    return solution;
  };

  const handleDragStart = (id) => {
    // Increase z-index of dragged piece
    setPieces(prevPieces => {
      const updatedPieces = [...prevPieces];
      const index = updatedPieces.findIndex(piece => piece.id === id);
      const [draggedPiece] = updatedPieces.splice(index, 1);
      updatedPieces.push(draggedPiece);
      return updatedPieces;
    });
    
    // Play sound effect
    playSound("drag");
  };

  const handleDragEnd = (id, info) => {
    const pieceWidth = dimensions.width / 3; // 3x3 grid
    const pieceHeight = dimensions.height / 3;
    
    setPieces(prevPieces => {
      return prevPieces.map(piece => {
        if (piece.id !== id) return piece;
        
        // Get board position relative to drag end position
        const boardRect = boardRef.current.getBoundingClientRect();
        const relativeX = info.point.x - boardRect.left;
        const relativeY = info.point.y - boardRect.top;
        
        // Check if within board boundaries
        if (
          relativeX >= 0 && 
          relativeX <= dimensions.width && 
          relativeY >= 0 && 
          relativeY <= dimensions.height
        ) {
          // Calculate which grid position it's closest to
          const col = Math.floor(relativeX / pieceWidth);
          const row = Math.floor(relativeY / pieceHeight);
          const position = row * 3 + col; // 3x3 grid
          
          // Check if position is already occupied
          const isOccupied = prevPieces.some(
            p => p.id !== id && p.currentPosition === position && p.placed
          );
          
          if (!isOccupied) {
            playSound("place");
            setAttempts(prev => prev + 1);
            
            return {
              ...piece,
              x: col * pieceWidth,
              y: row * pieceHeight,
              currentPosition: position,
              placed: true
            };
          }
        }
        
        // If outside board or position occupied, snap back
        playSound("reject");
        return piece;
      });
    });
  };

  const handleRotate = (id) => {
    setPieces(prevPieces => {
      return prevPieces.map(piece => {
        if (piece.id !== id) return piece;
        
        // Rotate by 90 degrees
        const newRotation = (piece.rotation + 90) % 360;
        
        // Also rotate the connections
        const { top, right, bottom, left } = piece.connections;
        const newConnections = {
          top: left,
          right: top,
          bottom: right,
          left: bottom
        };
        
        playSound("rotate");
        
        return {
          ...piece,
          rotation: newRotation,
          connections: newConnections
        };
      });
    });
  };

  const startGame = () => {
    setGameStarted(true);
    playSound("start");
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    setGameStarted(false);
    setPieces([]);
    setSolved(false);
    setTimer(120);
    setAttempts(0);
    playSound("reset");
  };

  const toggleHint = () => {
    setHint(prev => !prev);
    playSound("hint");
  };

  // Simple sound effects
  const playSound = (type) => {
    // In a real implementation, you'd have actual sound effects
    console.log(`Playing sound: ${type}`);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="squid-puzzle-container">
      <div className="squid-puzzle-background"></div>
      
      <div className="squid-puzzle-header">
        <h1>Squid Game Triangle Puzzle</h1>
        <p className="squid-puzzle-instructions">
          Connect all pieces by matching the triangles. "In" triangles must connect to "Out" triangles.
          Drag pieces to position them and click to rotate. Complete before time runs out!
        </p>
      </div>
      
      <div className="squid-puzzle-status">
        {!gameStarted ? (
          <button className="squid-puzzle-start-button" onClick={startGame}>
            Start Game
          </button>
        ) : (
          <div className="squid-puzzle-controls">
            <div className="squid-puzzle-timer">
              <span className="squid-puzzle-timer-icon">⏱</span>
              <span className={timer < 30 ? "squid-puzzle-timer-warning" : ""}>
                {formatTime(timer)}
              </span>
            </div>
            
            <div className="squid-puzzle-attempts">
              Attempts: {attempts}
            </div>
            
            <button 
              className="squid-puzzle-hint-button" 
              onClick={toggleHint}
              disabled={solved}
            >
              {hint ? "Hide Hint" : "Show Hint"}
            </button>
            
            <button 
              className="squid-puzzle-reset-button" 
              onClick={resetGame}
            >
              Reset
            </button>
          </div>
        )}
      </div>
      
      {gameStarted && (
        <div className="squid-puzzle-game-area">
          {/* Puzzle board */}
          <div 
            className={`squid-puzzle-board ${solved ? "squid-puzzle-solved" : ""}`}
            ref={boardRef}
            style={{ 
              aspectRatio: "1/1"
            }}
          >
            {/* Grid */}
            <div className="squid-puzzle-grid">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="squid-puzzle-grid-cell"></div>
              ))}
            </div>
            
            {/* Puzzle pieces */}
            <AnimatePresence>
              {pieces.map((piece) => (
                <motion.div
                  key={piece.id}
                  className={`squid-puzzle-piece ${piece.placed ? "squid-puzzle-piece-placed" : ""}`}
                  drag={!solved}
                  dragMomentum={false}
                  onDragStart={() => handleDragStart(piece.id)}
                  onDragEnd={(_, info) => handleDragEnd(piece.id, info)}
                  onClick={() => handleRotate(piece.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: piece.x,
                    y: piece.y,
                    rotate: piece.rotation,
                    zIndex: piece.placed ? 5 : 10
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                  style={{
                    backgroundColor: piece.color,
                    boxShadow: `0 0 15px ${piece.color}80`
                  }}
                >
                  {/* Connection points */}
                  {directions.map(dir => (
                    <div 
                      key={dir}
                      className={`squid-puzzle-connector squid-puzzle-connector-${dir} squid-puzzle-connector-${piece.connections[dir]}`}
                    />
                  ))}
                  
                  {/* Hint overlay */}
                  {hint && (
                    <div className="squid-puzzle-hint-overlay">
                      <span className="squid-puzzle-hint-id">{piece.id + 1}</span>
                    </div>
                  )}
                  
                  {/* Glow effect */}
                  <div className="squid-puzzle-piece-glow"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Staging area for pieces */}
          <div className="squid-puzzle-staging-area"></div>
        </div>
      )}
      
      {/* Win or Lose messages */}
      <AnimatePresence>
        {solved && (
          <motion.div 
            className="squid-puzzle-win-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5 }}
          >
            <span>Congratulations!</span> You've solved the puzzle!
            <div className="squid-puzzle-stats">
              Time: {formatTime(120 - timer)} | Attempts: {attempts}
            </div>
          </motion.div>
        )}
        
        {timer === 0 && !solved && (
          <motion.div 
            className="squid-puzzle-lose-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <span>Time's up!</span> Try again?
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardPuzzle;
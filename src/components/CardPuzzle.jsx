import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./styles/CardPuzzle.css";

const CardPuzzle = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [currentTarget, setCurrentTarget] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [solved, setSolved] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [gridSize, setGridSize] = useState(3); // 3x3 grid
  const boardRef = useRef(null);

  // Initialize game and create cards
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);

  // Check if puzzle is solved whenever flippedCards changes
  useEffect(() => {
    if (flippedCards.length === gridSize * gridSize) {
      setSolved(true);
      setTimeout(() => {
        onComplete && onComplete();
      }, 2000);
    }
  }, [flippedCards, gridSize, onComplete]);

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const newCards = [];
    
    // Create cards with numbers 1 through 9
    for (let i = 1; i <= totalCards; i++) {
      newCards.push({
        id: i,
        value: i,
        flipped: false
      });
    }
    
    // Shuffle cards
    const shuffledCards = [...newCards].sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setCurrentTarget(1);
    setSolved(false);
    setGameActive(true);
  };

  const handleCardClick = (card) => {
    if (card.flipped || solved || !gameActive) return;

    // Check if this is the correct next card in sequence
    if (card.value === currentTarget) {
      // Flip the card
      setCards(prevCards => 
        prevCards.map(c => 
          c.id === card.id ? { ...c, flipped: true } : c
        )
      );
      
      // Add to flipped cards
      setFlippedCards(prev => [...prev, card.id]);
      
      // Set next target number
      setCurrentTarget(currentTarget + 1);
    } else {
      // Wrong card - instantly reset all cards
      setGameActive(false);
      
      // Immediately reset all cards
      setCards(prevCards => 
        prevCards.map(c => ({ ...c, flipped: false }))
      );
      setFlippedCards([]);
      setCurrentTarget(1);
      
      // Re-enable game interaction
      setTimeout(() => {
        setGameActive(true);
      }, 100);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCards([]);
    setFlippedCards([]);
    setCurrentTarget(1);
    setSolved(false);
  };

  return (
    <div className="squid-card-puzzle">
      <div className="squid-card-instructions">
        <p>Find and flip cards in numerical order from 1 to 9.</p>
        <p className="squid-card-target">Current target: {currentTarget}</p>
      </div>
      
      <div className="squid-card-status">
        {!gameStarted ? (
          <button className="squid-card-start-button" onClick={startGame}>
            Start Game
          </button>
        ) : (
          <button className="squid-card-reset-button" onClick={resetGame}>
            Reset
          </button>
        )}
      </div>
      
      {gameStarted && (
        <div className="squid-card-game-area" ref={boardRef}>
          <div className={`squid-card-grid size-${gridSize}`}>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                className={`squid-card ${card.flipped ? 'flipped' : ''}`}
                onClick={() => handleCardClick(card)}
                whileHover={{ scale: 1.05 }}
                animate={{ scale: card.flipped ? [1, 1.1, 1] : 1 }}
              >
                <div className="squid-card-inner">
                  <div className="squid-card-front">
                    <div className="squid-card-symbol">?</div>
                  </div>
                  <div className="squid-card-back">
                    <div className="squid-card-value">{card.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {solved && (
        <motion.div 
          className="squid-card-win-message"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Congratulations!
          </motion.span>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            You've completed the sequence!
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};

export default CardPuzzle;
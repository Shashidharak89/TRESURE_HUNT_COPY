import React, { useState, useEffect } from "react";
import "./styles/MemoryGame.css";

const MemoryGame = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Squid Game themed card symbols
  const cardSymbols = [
    "△", "○", "□", // Squid Game shapes
    "★", "♠", "♣", "♥", "♦", // Playing card suits
  ];

  // Initialize game
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);

  // Check for win condition
  useEffect(() => {
    if (matchedPairs.length === cardSymbols.length && matchedPairs.length > 0) {
      setGameWon(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [matchedPairs, onComplete]);

  // Card flipping logic
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      
      if (cards[first].symbol === cards[second].symbol) {
        // Cards match
        setMatchedPairs(prev => [...prev, cards[first].symbol]);
      }
      
      // Flip back after delay
      const timer = setTimeout(() => {
        setFlippedIndices([]);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [flippedIndices, cards]);

  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = [...cardSymbols, ...cardSymbols];
    
    // Shuffle cards
    const shuffledCards = cardPairs
      .map(symbol => ({ symbol, id: Math.random() }))
      .sort((a, b) => a.id - b.id)
      .map((card, index) => ({ ...card, index }));
    
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    // Prevent clicking if game hasn't started or card is already flipped/matched
    if (
      !gameStarted ||
      flippedIndices.includes(index) ||
      matchedPairs.includes(cards[index].symbol) ||
      flippedIndices.length >= 2
    ) {
      return;
    }
    
    // Flip card
    setFlippedIndices(prev => [...prev, index]);
    
    // Increment moves
    if (flippedIndices.length === 1) {
      setMoves(prev => prev + 1);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
  };

  return (
    <div className="squid-memory-game">
      <div className="squid-memory-instructions">
        <p>Match pairs of cards to win. Turn over cards by clicking on them.</p>
      </div>
      
      <div className="squid-memory-status">
        {!gameStarted ? (
          <button className="squid-memory-start-button" onClick={startGame}>
            Start Game
          </button>
        ) : (
          <>
            <div className="squid-memory-stats">
              <div className="squid-memory-moves">
                <div className="squid-memory-moves-value">{moves}</div>
                <div className="squid-memory-moves-label">moves</div>
              </div>
            </div>
            
            <button className="squid-memory-reset-button" onClick={resetGame}>
              Reset
            </button>
          </>
        )}
      </div>
      
      {gameStarted && (
        <div className="squid-memory-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`squid-memory-card ${
                flippedIndices.includes(index) || matchedPairs.includes(card.symbol)
                  ? "squid-memory-card-flipped"
                  : ""
              } ${matchedPairs.includes(card.symbol) ? "squid-memory-card-matched" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="squid-memory-card-inner">
                <div className="squid-memory-card-front">
                  <div className="squid-memory-card-logo">SG</div>
                </div>
                <div className="squid-memory-card-back">
                  <div className="squid-memory-card-symbol">{card.symbol}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {gameWon && (
        <div className="squid-memory-win-message">
          <span>Congratulations!</span> You've completed the memory game!
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
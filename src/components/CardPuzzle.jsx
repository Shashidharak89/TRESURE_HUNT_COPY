import React, { useState, useEffect } from "react";
import "./styles/CardPuzzle.css";

const CardPuzzle = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [correctSequence, setCorrectSequence] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [gameWon, setGameWon] = useState(false);
  const [showingSequence, setShowingSequence] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize game
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted, currentLevel]);

  // Handle countdown
  useEffect(() => {
    let timer = null;
    if (gameStarted && !gameWon && countdown > 0 && !showingSequence) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      resetGame();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameWon, countdown, showingSequence]);

  // Check for correct sequence
  useEffect(() => {
    if (selectedCards.length === correctSequence.length && selectedCards.length > 0) {
      const isCorrect = selectedCards.every((card, index) => card === correctSequence[index]);
      
      if (isCorrect) {
        setMessage("Correct sequence!");
        
        if (currentLevel === 3) {
          // Player has completed all levels
          setGameWon(true);
          setTimeout(() => {
            onComplete();
          }, 1000);
        } else {
          // Move to next level
          setTimeout(() => {
            setCurrentLevel(prev => prev + 1);
            setSelectedCards([]);
            setMessage("");
          }, 1500);
        }
      } else {
        setMessage("Wrong sequence. Try again!");
        setAttempts(prev => prev + 1);
        
        // Reset selected cards
        setTimeout(() => {
          setSelectedCards([]);
          setMessage("");
        }, 1500);
      }
    }
  }, [selectedCards, correctSequence, currentLevel, onComplete]);

  const initializeGame = () => {
    // Create cards based on level
    const cardCount = 6 + (currentLevel * 2);
    const newCards = Array.from({ length: cardCount }, (_, index) => ({
      id: index,
      value: index % 4, // 0: triangle, 1: circle, 2: square, 3: star
      selected: false
    }));
    
    // Shuffle cards
    const shuffledCards = [...newCards].sort(() => Math.random() - 0.5);
    
    // Create sequence to remember
    const sequenceLength = 3 + currentLevel;
    const sequence = Array.from({ length: sequenceLength }, () => 
      Math.floor(Math.random() * cardCount)
    );
    
    setCards(shuffledCards);
    setCorrectSequence(sequence);
    setSelectedCards([]);
    
    // Show sequence to player
    setShowingSequence(true);
    
    // Show sequence for 3-5 seconds depending on level
    const sequenceTime = 3000 + (currentLevel * 1000);
    setTimeout(() => {
      setShowingSequence(false);
    }, sequenceTime);
  };

  const handleCardClick = (index) => {
    // Prevent clicking if game hasn't started or showing sequence
    if (!gameStarted || showingSequence || gameWon) {
      return;
    }
    
    // Add to selected cards
    if (selectedCards.length < correctSequence.length) {
      setSelectedCards(prev => [...prev, index]);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentLevel(1);
    setAttempts(0);
    setCountdown(60);
    setGameWon(false);
    setShowingSequence(false);
    setMessage("");
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedCards([]);
    setCorrectSequence([]);
    setAttempts(0);
    setCountdown(60);
    setGameWon(false);
    setShowingSequence(false);
    setMessage("");
  };

  const getCardSymbol = (value) => {
    switch (value) {
      case 0: return "△";
      case 1: return "○";
      case 2: return "□";
      case 3: return "★";
      default: return "?";
    }
  };

  return (
    <div className="squid-card-puzzle">
      <div className="squid-card-instructions">
        <p>Memorize the sequence shown, then click the cards in the same order.</p>
        <p>Level: {currentLevel}/3</p>
      </div>
      
      <div className="squid-card-status">
        {!gameStarted ? (
          <button className="squid-card-start-button" onClick={startGame}>
            Start Game
          </button>
        ) : (
          <>
            <div className="squid-card-stats">
              <div className="squid-card-timer">
                <div className="squid-card-timer-value">{countdown}</div>
                <div className="squid-card-timer-label">seconds</div>
              </div>
              
              <div className="squid-card-attempts">
                <div className="squid-card-attempts-value">{attempts}</div>
                <div className="squid-card-attempts-label">attempts</div>
              </div>
            </div>
            
            <button className="squid-card-reset-button" onClick={resetGame}>
              Reset
            </button>
          </>
        )}
      </div>
      
      {gameStarted && (
        <>
          <div className="squid-card-message">
            {showingSequence ? (
              <span className="squid-card-sequence-message">Memorize the sequence!</span>
            ) : message ? (
              <span className={`squid-card-message-text ${message.includes("Correct") ? "squid-card-correct" : "squid-card-wrong"}`}>{message}</span>
            ) : (
              <span className="squid-card-prompt">Click cards in the sequence shown</span>
            )}
          </div>
          
          <div className="squid-card-sequence-indicators">
            {correctSequence.map((_, index) => (
              <div 
                key={index} 
                className={`squid-card-sequence-dot ${index < selectedCards.length ? "squid-card-sequence-dot-active" : ""}`}
              />
            ))}
          </div>
          
          <div className="squid-card-grid">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`squid-card-item ${
                  showingSequence && correctSequence.includes(index) 
                    ? "squid-card-highlighted" 
                    : ""
                } ${
                  selectedCards.includes(index) 
                    ? "squid-card-selected" 
                    : ""
                }`}
                onClick={() => handleCardClick(index)}
              >
                {getCardSymbol(card.value)}
              </div>
            ))}
          </div>
        </>
      )}
      
      {gameWon && (
        <div className="squid-card-win-message">
          <span>Congratulations!</span> You've solved the card puzzle!
        </div>
      )}
    </div>
  );
};

export default CardPuzzle;
import React, { useState, useEffect, useContext } from "react";
import MazeGame from "./games/MazeGame";
import MemoryGame from "./games/MemoryGame";
import CardPuzzle from "./games/CardPuzzle";
import { Link } from "react-router-dom";
import axios from "axios";
import './styles/Round3.css';
import AuthContext from "../contexts/AuthContext";

function Round3() {
  const [pieces, setPieces] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mazeSolved, setMazeSolved] = useState(false);
  const [memorySolved, setMemorySolved] = useState(false);
  const [cardSolved, setCardSolved] = useState(false);
  const [activeGame, setActiveGame] = useState("maze");
  const [requestSent, setRequestSent] = useState(false);


  const {URL}=useContext(AuthContext);
  // Send API request when component mounts, but only once
  useEffect(() => {
    const sendRoundData = async () => {
      if (requestSent) return; // Skip if request was already sent
      
      try {
        // Get team and participant data from localStorage
        const team = localStorage.getItem("team") || "";
        const participant1 = localStorage.getItem("m1") || "";
        const participant2 = localStorage.getItem("m2") || "";
        
        // Only proceed with API call if we have team data
        if (team) {
          const endTime = new Date().toISOString();
          
          const response = await axios.post(URL+"/api/round3", {
            team,
            participant1,
            participant2,
            endTime
          });
          
          console.log("Round 3 data submitted:", response.data);
          setRequestSent(true); // Mark that request has been sent
        } else {
          console.log("Team information not found, proceeding without API call");
        }
      } catch (error) {
        console.error("Error submitting round data:", error);
      }
    };
    
    sendRoundData();
  }, [requestSent]); // Only depends on requestSent state

  const handleGameComplete = (newPiece, message, setSolved) => {
    if (!pieces.includes(newPiece)) {
      setPieces([...pieces, newPiece]);
      setMessages([...messages, message]);
      setSolved(true);
      
      // Play success sound
      const successSound = new Audio("/success.mp3");
      successSound.play().catch(err => console.log("Audio play failed:", err));
    }
  };

  // Auto-transition to next game when one is completed
  useEffect(() => {
    if (mazeSolved && activeGame === "maze") {
      setTimeout(() => setActiveGame("memory"), 1500);
    } else if (memorySolved && activeGame === "memory") {
      setTimeout(() => setActiveGame("card"), 1500);
    }
  }, [mazeSolved, memorySolved, activeGame]);

  return (
    <div className="squid-round3-container">
      <div className="squid-round3-header">
        <h2 className="squid-round3-title">ROUND 3</h2>
        <p className="squid-round3-subtitle">Complete the games to advance to the final round</p>
        
        <div className="squid-round3-progress">
          {[mazeSolved, memorySolved, cardSolved].map((solved, index) => (
            <div 
              key={index} 
              className={`squid-round3-progress-circle ${solved ? 'squid-round3-progress-complete' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="squid-round3-games-container">
        <div className={`squid-round3-game-panel ${activeGame === "maze" ? "squid-round3-active" : ""}`}>
          <div className="squid-round3-game-header">
            <div className="squid-round3-triangle"></div>
            <h3 className="squid-round3-game-title">Maze Game</h3>
          </div>
          <div className="squid-round3-game-content">
            <MazeGame onComplete={() => handleGameComplete(
              "https://youtu.be/maze123", 
              "Maze Game completed! First piece of the link unlocked!", 
              setMazeSolved
            )} />
            
            <button 
              className={`squid-round3-button ${mazeSolved ? 'squid-round3-button-solved' : ''}`}
              onClick={() => mazeSolved && handleGameComplete(
                "https://youtu.be/maze123", 
                "Maze Game completed! First piece of the link unlocked!", 
                setMazeSolved
              )} 
              disabled={!mazeSolved}
            >
              {mazeSolved ? "Completed" : "Submit"}
            </button>
          </div>
        </div>

        <div className={`squid-round3-game-panel ${activeGame === "memory" ? "squid-round3-active" : ""}`}>
          <div className="squid-round3-game-header">
            <div className="squid-round3-circle"></div>
            <h3 className="squid-round3-game-title">Memory Game</h3>
          </div>
          <div className="squid-round3-game-content">
            <MemoryGame onComplete={() => handleGameComplete(
              "https://youtu.be/memory456", 
              "Memory Game solved! Second piece of the link unlocked!", 
              setMemorySolved
            )} />
            
            <button 
              className={`squid-round3-button ${memorySolved ? 'squid-round3-button-solved' : ''}`}
              onClick={() => memorySolved && handleGameComplete(
                "https://youtu.be/memory456", 
                "Memory Game solved! Second piece of the link unlocked!", 
                setMemorySolved
              )} 
              disabled={!memorySolved}
            >
              {memorySolved ? "Completed" : "Submit"}
            </button>
          </div>
        </div>

        <div className={`squid-round3-game-panel ${activeGame === "card" ? "squid-round3-active" : ""}`}>
          <div className="squid-round3-game-header">
            <div className="squid-round3-square"></div>
            <h3 className="squid-round3-game-title">Card Puzzle</h3>
          </div>
          <div className="squid-round3-game-content">
            <CardPuzzle onComplete={() => handleGameComplete(
              "https://youtu.be/card789", 
              "Card Puzzle cracked! Final piece of the link unlocked!", 
              setCardSolved
            )} />
            
            <button 
              className={`squid-round3-button ${cardSolved ? 'squid-round3-button-solved' : ''}`}
              onClick={() => cardSolved && handleGameComplete(
                "https://youtu.be/card789", 
                "Card Puzzle cracked! Final piece of the link unlocked!", 
                setCardSolved
              )} 
              disabled={!cardSolved}
            >
              {cardSolved ? "Completed" : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <div className="squid-round3-messages">
        {messages.map((msg, index) => (
          <p key={index} className="squid-round3-message">{msg}</p>
        ))}
      </div>

      {pieces.length === 3 && (
        <div className="squid-round3-final-link">
          <p className="squid-round3-final-message">Final Link Unlocked:</p>
          <div className="squid-round3-link-display">{pieces.join(" ")}</div>
          <Link to="/final" className="squid-round3-next-button">
            <span className="squid-round3-next-text">Proceed to Final Round</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Round3;
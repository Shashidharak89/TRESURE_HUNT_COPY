import React, { useState } from "react";


const CardPuzzle = ({ onComplete }) => {
    const [solved, setSolved] = useState(false);
  
    const handleSolve = () => {
      setSolved(true);
      onComplete();
    };
  return (
    <div>
              <h3>Card Puzzle</h3>
        <p>Place the puzzle pieces in the correct order!</p>
        <button onClick={handleSolve} disabled={solved}>Solve Card Puzzle</button>
    </div>
  )
}

export default CardPuzzle

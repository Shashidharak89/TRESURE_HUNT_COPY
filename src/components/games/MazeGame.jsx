import React, { useState } from "react";

// Maze Game Component
const MazeGame = ({ onComplete }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div>
      <h3>Maze Game</h3>
      <p>Navigate through the maze to reach the goal!</p>
      <button onClick={handleComplete} disabled={completed}>Solve Maze</button>
    </div>
  );
};

export default MazeGame;
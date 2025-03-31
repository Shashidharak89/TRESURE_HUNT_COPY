import React, { useState, useEffect } from "react";
import "./NumberPuzzle.css";

function generateNumbers() {
  let numbers = Array.from({ length: 8 }, (_, i) => i + 1);
  numbers = [...numbers, ""];
  return numbers.sort(() => Math.random() - 0.5);
}

function NumberPuzzle({ onComplete }) {
  const [numbers, setNumbers] = useState(generateNumbers());

  useEffect(() => {
    if (JSON.stringify(numbers) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, ""])) {
      onComplete();
    }
  }, [numbers, onComplete]);

  const moveTile = (index) => {
    const emptyIndex = numbers.indexOf("");
    const validMoves = [
      emptyIndex - 1, emptyIndex + 1, emptyIndex - 3, emptyIndex + 3,
    ];

    if (validMoves.includes(index)) {
      const newNumbers = [...numbers];
      [newNumbers[emptyIndex], newNumbers[index]] = [newNumbers[index], newNumbers[emptyIndex]];
      setNumbers(newNumbers);
    }
  };

  return (
    <div>
      <h3>Number Puzzle</h3>
      <p>Arrange the numbers in order!</p>
      <div className="grid">
        {numbers.map((num, i) => (
          <button key={i} className="tile" onClick={() => moveTile(i)}>
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

export default NumberPuzzle;

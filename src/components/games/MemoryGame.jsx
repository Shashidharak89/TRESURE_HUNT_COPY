import React, { useState } from "react";
import "./MemoryGame.css";

const cards = ["🐱", "🐶", "🐱", "🐶"];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function MemoryGame({ onComplete }) {
  const [shuffledCards, setShuffledCards] = useState(shuffle([...cards]));
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);

  const handleClick = (index) => {
    if (selected.length < 2 && !selected.includes(index)) {
      const newSelected = [...selected, index];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        const [first, second] = newSelected;
        if (shuffledCards[first] === shuffledCards[second]) {
          setMatched([...matched, shuffledCards[first]]);
        }
        setTimeout(() => setSelected([]), 500);
      }
    }
  };

  if (matched.length === cards.length / 2) {
    onComplete();
  }

  return (
    <div>
      <h3>Memory Game</h3>
      <div className="grid">
        {shuffledCards.map((card, index) => (
          <button
            key={index}
            className="card"
            onClick={() => handleClick(index)}
            disabled={matched.includes(card)}
          >
            {selected.includes(index) || matched.includes(card) ? card : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MemoryGame;

import React, { useState } from "react";
import "./WordScramble.css";

const words = ["react", "puzzle", "cipher", "hunter"];

function shuffleWord(word) {
  return word.split("").sort(() => Math.random() - 0.5).join("");
}

function WordScramble({ onComplete }) {
  const [word] = useState(words[Math.floor(Math.random() * words.length)]);
  const [scrambled] = useState(shuffleWord(word));
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const checkAnswer = () => {
    if (input.toLowerCase() === word) {
      setMessage("Correct! You unlocked the next piece.");
      onComplete();
    } else {
      setMessage("Try again!");
    }
  };

  return (
    <div>
      <h3>Word Scramble</h3>
      <p>Unscramble this word: <strong>{scrambled}</strong></p>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type answer..." 
      />
      <button onClick={checkAnswer}>Submit</button>
      <p>{message}</p>
    </div>
  );
}

export default WordScramble;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./styles/Round1.css";
import AuthContext from "../contexts/AuthContext";

function Round1() {
  const [visible, setVisible] = useState(false);

  const {URL}=useContext(AuthContext);

  useEffect(() => {
    // Retrieve team and participants from localStorage
    const team = localStorage.getItem("team");
    const participant1 = localStorage.getItem("m1");
    const participant2 = localStorage.getItem("m2");

    if (team && participant1 && participant2) {
      // Prepare request payload
      const requestData = {
        team,
        participant1,
        participant2,
        endTime: "2025-03-31T15:00:00Z" // Default endTime
      };

      // Send POST request to server
      axios.post(URL+"/api/round1", requestData)
        .then(response => {
          console.log("Server Response:", response.data);
        })
        .catch(error => {
          console.error("Error sending data:", error);
        });
    } else {
      console.log("Team or participants not found. Skipping server request.");
    }

    // Log clue to console
    console.log("Your next clue: /round2");

    // Trigger animation after a short delay
    setTimeout(() => {
      setVisible(true);
    }, 500);
  }, []);

  return (
    <div className="squid-game-container">
      <div className={`squid-game-card ${visible ? 'squid-game-card-visible' : ''}`}>
        <div className="squid-game-logo"></div>
        <h2 className="squid-game-title">Round 1</h2>
        <p className="squid-game-text">Find the hidden clue in the console!</p>
        <div className="squid-game-shapes">
          <div className="squid-game-circle"></div>
          <div className="squid-game-triangle"></div>
          <div className="squid-game-square"></div>
        </div>
        <button className="squid-game-button">Inspect Me</button>
      </div>
    </div>
  );
}

export default Round1;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './styles/ViewData.css';
import AuthContext from '../contexts/AuthContext';

const ViewData = () => {
  const [activeRound, setActiveRound] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMask, setShowMask] = useState(true);

  const {URL}=useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${URL}/api/round${activeRound}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. The game host might be eliminating players.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Show mask animation when changing rounds
    setShowMask(true);
    const timer = setTimeout(() => {
      setShowMask(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeRound]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeRemaining = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return "Game Over";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="squid-container">
      {showMask && <div className="squid-mask">
        <div className="squid-mask-inner">
          <div className="squid-mask-circle"></div>
          <div className="squid-mask-triangle"></div>
          <div className="squid-mask-square"></div>
        </div>
      </div>}
      
      <div className="squid-header">
        <h1 className="squid-title">Squid Game <span className="squid-round">Round {activeRound}</span></h1>
        <div className="squid-pink-light"></div>
      </div>
      
      <div className="squid-toggle-container">
        {[1, 2, 3, 4].map((round) => (
          <button 
            key={round}
            className={`squid-toggle ${activeRound === round ? 'squid-toggle-active' : ''}`}
            onClick={() => setActiveRound(round)}
          >
            <span className="squid-toggle-text">Round {round}</span>
          </button>
        ))}
      </div>
      
      <div className="squid-content">
        {loading ? (
          <div className="squid-loading">
            <div className="squid-doll">
              <div className="squid-doll-head"></div>
              <div className="squid-doll-body"></div>
            </div>
            <p className="squid-loading-text">Loading players...</p>
          </div>
        ) : error ? (
          <div className="squid-error">
            <div className="squid-error-icon">!</div>
            <p className="squid-error-message">{error}</p>
          </div>
        ) : (
          <div className="squid-cards">
            {data.map((item) => (
              <div key={item._id} className="squid-card">
                <div className="squid-card-number">{item.team}</div>
                <div className="squid-card-content">
                  <div className="squid-card-players">
                    <div className="squid-player">
                      <div className="squid-player-avatar"></div>
                      <div className="squid-player-name">{item.participant1}</div>
                    </div>
                    <div className="squid-player">
                      <div className="squid-player-avatar"></div>
                      <div className="squid-player-name">{item.participant2}</div>
                    </div>
                  </div>
                  <div className="squid-card-timer">
                    <div className="squid-timer-label">Time Remaining:</div>
                    <div className="squid-timer-value">{getTimeRemaining(item.endTime)}</div>
                  </div>
                  <div className="squid-card-time">
                    <div className="squid-time-item">
                      <span className="squid-time-label">Start:</span>
                      <span className="squid-time-value">{formatTime(item.startTime)}</span>
                    </div>
                    <div className="squid-time-item">
                      <span className="squid-time-label">End:</span>
                      <span className="squid-time-value">{formatTime(item.endTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewData;
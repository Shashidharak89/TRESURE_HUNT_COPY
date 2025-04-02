import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Users, Clock, Skull, Award, AlertCircle } from 'lucide-react';
import './styles/AdminCL.css'; // Import the CSS file with animations
import AuthContext from '../contexts/AuthContext';

const AdminCL = () => {
  const [activeRound, setActiveRound] = useState(1);
  const [roundData, setRoundData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {URL}=useContext(AuthContext);

  const roundTitles = {
    1: "Round 1",
    2: "Round 2",
    3: "Round 3",
    4: "Round 4"
  };

  const fetchRoundData = async (round) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${URL}/api/round${round}`);
      setRoundData(response.data);
    } catch (err) {
      console.error(`Error fetching round ${round} data:`, err);
      setError(`Failed to load Round ${round} data. Please try again.`);
      setRoundData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoundData(activeRound);
  }, [activeRound]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const calculateTimeRemaining = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diffMs = end - now;
    
    if (diffMs <= 0) return "Completed";
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    
    return `${diffHrs}h ${remainingMins}m remaining`;
  };

  return (
    <div className="squid-admin-container">
      {/* Header */}
      <div className="squid-admin-header">
        <h1 className="squid-admin-title">
          <span className="squid-admin-title-number">456</span>
          <span>Squid Game Admin</span>
          <div className="squid-admin-circle-animate"></div>
        </h1>
        <p className="squid-admin-subtitle">Monitor and manage all game rounds</p>
      </div>

      {/* Round Selection */}
      <div className="squid-admin-round-selector">
        {[1, 2, 3, 4].map((round) => (
          <button
            key={round}
            onClick={() => setActiveRound(round)}
            className={`squid-admin-round-button ${
              activeRound === round ? 'squid-admin-round-active' : ''
            }`}
          >
            <span className="squid-admin-round-label">Round</span>
            <span className="squid-admin-round-number">{round}</span>
          </button>
        ))}
      </div>

      {/* Round Title */}
      <div className="squid-admin-round-title-container">
        <div className="squid-admin-round-icon">
          <span>{activeRound}</span>
        </div>
        <div>
          <h2 className="squid-admin-round-title">{roundTitles[activeRound]}</h2>
          <p className="squid-admin-round-subtitle">Participant Status and Progress</p>
        </div>
      </div>

      {/* Data Display */}
      <div className="squid-admin-data-container">
        {loading ? (
          <div className="squid-admin-loader-container">
            <div className="squid-admin-loader"></div>
          </div>
        ) : error ? (
          <div className="squid-admin-error">
            <AlertCircle size={48} className="squid-admin-error-icon" />
            <p className="squid-admin-error-message">{error}</p>
            <button 
              onClick={() => fetchRoundData(activeRound)}
              className="squid-admin-retry-button"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="squid-admin-cards-grid">
            {roundData.length > 0 ? (
              roundData.map((item, index) => (
                <div
                  key={item._id}
                  className="squid-admin-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="squid-admin-card-header">
                    <div className="squid-admin-team-info">
                      <div className="squid-admin-team-icon">
                        <Users size={18} className="squid-admin-icon-color" />
                      </div>
                      <div>
                        <h3 className="squid-admin-team-name">{item.team}</h3>
                        <p className="squid-admin-team-id">Team ID: {item._id.substring(item._id.length - 6)}</p>
                      </div>
                    </div>
                    <div className="squid-admin-round-badge">
                      Round {activeRound}
                    </div>
                  </div>

                  <div className="squid-admin-participants">
                    <div className="squid-admin-participant">
                      <p className="squid-admin-participant-label">Participant 1</p>
                      <p className="squid-admin-participant-name">{item.participant1}</p>
                    </div>
                    <div className="squid-admin-participant">
                      <p className="squid-admin-participant-label">Participant 2</p>
                      <p className="squid-admin-participant-name">{item.participant2}</p>
                    </div>
                  </div>

                  <div className="squid-admin-times">
                    <div className="squid-admin-time">
                      <Clock size={16} className="squid-admin-time-icon-start" />
                      <div>
                        <p className="squid-admin-time-label">Start Time</p>
                        <p className="squid-admin-time-value">{formatTime(item.startTime)}</p>
                        <p className="squid-admin-time-date">{formatDate(item.startTime)}</p>
                      </div>
                    </div>
                    <div className="squid-admin-time">
                      <Skull size={16} className="squid-admin-time-icon-end" />
                      <div>
                        <p className="squid-admin-time-label">End Time</p>
                        <p className="squid-admin-time-value">{formatTime(item.endTime)}</p>
                        <p className="squid-admin-time-remaining">{calculateTimeRemaining(item.endTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="squid-admin-empty">
                <Award size={48} className="squid-admin-empty-icon" />
                <p className="squid-admin-empty-message">No participants found for this round</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="squid-admin-stats">
        {[1, 2, 3, 4].map((round) => (
          <div 
            key={`stat-${round}`}
            className={`squid-admin-stat ${
              activeRound === round ? 'squid-admin-stat-active' : ''
            }`}
          >
            <p className="squid-admin-stat-label">Round {round}</p>
            <p className="squid-admin-stat-title">{roundTitles[round]}</p>
            <div className="squid-admin-progress-container">
              <div 
                className={`squid-admin-progress ${
                  activeRound === round ? 'squid-admin-progress-current' : 
                  activeRound > round ? 'squid-admin-progress-complete' : ''
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCL;
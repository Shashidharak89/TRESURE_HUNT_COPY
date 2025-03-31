import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Begin.css';

const Begin = () => {
  const [teamName, setTeamName] = useState('');
  const [participant1, setParticipant1] = useState('');
  const [participant2, setParticipant2] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const navigate = useNavigate();
  const squidMaskRef = useRef(null);
  
  // Check form validity
  useEffect(() => {
    setIsFormValid(
      teamName.trim() !== '' && 
      participant1.trim() !== '' && 
      participant2.trim() !== '' && 
      isPasswordCorrect
    );
  }, [teamName, participant1, participant2, isPasswordCorrect]);
  
  // Handle password validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordCorrect(value === 'treasure2025');
  };
  
  // Handle form submission
  const handleBegin = () => {
    if (isFormValid) {
      // Save to localStorage
      localStorage.setItem('team', teamName);
      localStorage.setItem('m1', participant1);
      localStorage.setItem('m2', participant2);
      
      // Trigger mask animation before navigating
      squidMaskRef.current.classList.add('squid-mask-zoom');
      
      // Navigate after animation completes
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    }
  };
  
  // Skip intro after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (showIntro) {
    return (
      <div className="cipher-intro-container">
        <div className="cipher-logo-container">
          <h1 className="cipher-title">CIPHER <span>2K25</span></h1>
          <div className="cipher-subtitle">presents</div>
        </div>
        
        <div className="squid-game-intro">
          <div className="squid-shapes">
            <div className="squid-circle"></div>
            <div className="squid-triangle"></div>
            <div className="squid-square"></div>
          </div>
          <h2 className="squid-title">DIGITAL PLAYGROUND</h2>
          <p className="squid-tagline">Will you survive the hunt?</p>
        </div>
        
        <div className="intro-skip-button" onClick={() => setShowIntro(false)}>
          SKIP
        </div>
      </div>
    );
  }
  
  return (
    <div className="begin-container">
      <div ref={squidMaskRef} className="squid-mask"></div>
      
      <div className="begin-content">
        <div className="begin-header">
          <h1 className="begin-title">CIPHER <span>2K25</span></h1>
          <h2 className="begin-subtitle">DIGITAL PLAYGROUND</h2>
        </div>
        
        <div className="begin-form-container">
          <div className="form-glow"></div>
          
          <div className="input-group">
            <label className="neon-label">TEAM NAME</label>
            <input 
              type="text" 
              className="neon-input" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="neon-label">PARTICIPANT 1</label>
            <input 
              type="text" 
              className="neon-input" 
              value={participant1}
              onChange={(e) => setParticipant1(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="neon-label">PARTICIPANT 2</label>
            <input 
              type="text" 
              className="neon-input" 
              value={participant2}
              onChange={(e) => setParticipant2(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="neon-label">TREASURE HUNT PASSWORD</label>
            <input 
              type="password" 
              className={`neon-input ${password && (isPasswordCorrect ? 'password-correct' : 'password-incorrect')}`}
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <button 
            className={`begin-button ${isFormValid ? 'enabled' : 'disabled'}`}
            onClick={handleBegin}
            disabled={!isFormValid}
          >
            BEGIN
          </button>
        </div>
        
        <div className="begin-footer">
          <p>Enter the playground at your own risk</p>
          <div className="doll-silhouette"></div>
        </div>
      </div>
    </div>
  );
};

export default Begin;
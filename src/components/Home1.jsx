import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Home1.css';

const Home1 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show main content after intro animation completes
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setShowContent(true);
    }, 6000);

    return () => clearTimeout(introTimer);
  }, []);

  const handleStart = () => {
    // Set exiting state to trigger animations
    setIsExiting(true);
    
    // Store system time in localStorage only if not already set
    if (!localStorage.getItem('time')) {
      localStorage.setItem('time', new Date().toISOString());
    }
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/round1');
    }, 1500);
  };

  return (
    <div className={`cipher_home_container ${isExiting ? 'cipher_exit_animation' : ''}`}>
      {/* Animated shapes in background */}
      <div className="cipher_shape cipher_triangle"></div>
      <div className="cipher_shape cipher_circle"></div>
      <div className="cipher_shape cipher_square"></div>
      <div className="cipher_shape cipher_hexagon"></div>
      <div className="cipher_shape cipher_star"></div>
      
      {/* Floating elements */}
      <div className="cipher_doll_container">
        <div className="cipher_doll"></div>
      </div>
      
      {/* Intro animation */}
      {showIntro && (
        <div className="cipher_intro_animation">
          <div className="cipher_mask">
            <div className="cipher_title_text">CIPHER 2K25</div>
            <div className="cipher_presents_text">presents</div>
            <div className="cipher_event_name">THE SURVIVAL HUNT</div>
          </div>
        </div>
      )}

      {/* Main content */}
      {showContent && (
        <div className="cipher_main_content">
          <div className="cipher_logo_container">
            <div className="cipher_logo">
              <span className="cipher_logo_text">S</span>
              <span className="cipher_logo_text">U</span>
              <span className="cipher_logo_text">R</span>
              <span className="cipher_logo_text">V</span>
              <span className="cipher_logo_text">I</span>
              <span className="cipher_logo_text">V</span>
              <span className="cipher_logo_text">A</span>
              <span className="cipher_logo_text">L</span>
            </div>
            <div className="cipher_logo_subtitle">HUNT</div>
          </div>
          
          <div className="cipher_description">
            <p>Welcome to the ultimate treasure hunt experience.</p>
            <p>Solve puzzles. Find clues. Win prizes.</p>
            <p>Do you have what it takes to survive?</p>
          </div>
          
          <button 
            className="cipher_start_button"
            onClick={handleStart}
          >
            <span className="cipher_button_text">START</span>
            <span className="cipher_button_hover"></span>
          </button>
          
          {/* Red light, green light effect on button hover */}
          <div className="cipher_traffic_light">
            <div className="cipher_red_light"></div>
            <div className="cipher_green_light"></div>
          </div>
          
          {/* Countdown timer that appears when button is clicked */}
          {isExiting && (
            <div className="cipher_countdown">
              <div className="cipher_countdown_circle">
                <span className="cipher_countdown_number">3</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Guards moved to sides */}
      <div className="cipher_guard_container">
        <div className="cipher_guard cipher_guard_left"></div>
        <div className="cipher_guard cipher_guard_right"></div>
      </div>
      
      {/* Falling money particles */}
      <div className="cipher_money_container">
        {[...Array(15)].map((_, index) => (
          <div key={index} className="cipher_money" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>
    </div>
  );
};

export default Home1;
import { useState, useEffect } from 'react';
import './styles/Timer.css';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 90, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const storedTime = localStorage.getItem('time');
      if (storedTime) {
        const startTime = new Date(storedTime).getTime();
        const endTime = startTime + 90 * 60 * 1000; // 90 minutes from stored time
        const now = new Date().getTime();
        const remainingTime = endTime - now;

        if (remainingTime > 0) {
          setTimeLeft({
            minutes: Math.floor(remainingTime / 1000 / 60),
            seconds: Math.floor((remainingTime / 1000) % 60)
          });
        } else {
          setTimeLeft({ minutes: 0, seconds: 0 });
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="squid_timer_container">
      <div className="squid_timer">
        {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    </div>
  );
};

export default Timer;

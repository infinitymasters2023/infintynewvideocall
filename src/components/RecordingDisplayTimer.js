import React, { useState, useEffect } from 'react';
const RecordingDisplayTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds + 1) % 60);
      if (seconds === 59) {
        setMinutes((prevMinutes) => prevMinutes + 1);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [seconds]);
  return (
    <p className='text-sm text-white px-2'><strong className='px-2'>Recording :</strong>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
  );
};

export default RecordingDisplayTimer;

import React, { useState, useEffect } from 'react';

export const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 59) {
          setMinutes((prevMinutes) => prevMinutes + 1);
          return 0;
        } else {
          return prevSeconds + 1;
        }
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return { minutes, seconds };
};

const DisplayTimer = ({ setMinutes , setSeconds }) => {
  const { minutes, seconds } = Timer();
  setMinutes(minutes)
  setSeconds(seconds)
  return (
    <p className='text-sm text-white px-2'>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </p>
  );
};



export default DisplayTimer;

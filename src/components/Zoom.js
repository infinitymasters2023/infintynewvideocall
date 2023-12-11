import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const ZoomControls = () => {
  const [zoomLevel, setZoomLevel] = useState(100); // Initial zoom level in percentage
  const videoRef = useRef(null);

  useEffect(() => {
    // Access the webcam and attach it to the video element
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error('Error accessing webcam:', error));

    return () => {
      // Cleanup: Stop the video stream when the component unmounts
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []); // Run once on component mount

  const handleZoomIn = () => {
    console.log('Handling Zoom In');
    setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 200));
  };
  
  const handleZoomOut = () => {
    console.log('Handling Zoom Out');
    setZoomLevel((prevZoom) => Math.max(prevZoom - 10, 100));
  };
  

  return (
    <div>
      <div>
        <button onClick={handleZoomIn}>
          <FontAwesomeIcon icon={faPlus} style={{ color: 'white' }} /> Zoom In
        </button>
        <button onClick={handleZoomOut}>
          <FontAwesomeIcon icon={faMinus} style={{ color: 'white' }} /> Zoom Out
        </button>
      </div>
      <div style={{ overflow: 'hidden', width: '640px', height: '480px' }}>
        <video
          ref={videoRef}
          style={{ transform: `scale(${zoomLevel / 100})`, transition: 'transform 0.2s ease-in-out' }}
          width="100%"
          height="100%"
          autoPlay
        ></video>
      </div>
    </div>
  );
};

export default ZoomControls;

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

const CaptureT2 = () => {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [count, setCount] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const navigate = useNavigate();

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  useEffect(() => {
    if (!isCapturing || count >= 8) return;

    // Begin countdown for current shot
    let timeout1 = setTimeout(() => setCountdown(2), 1000);
    let timeout2 = setTimeout(() => setCountdown(1), 2000);
    let timeout3 = setTimeout(() => {
      // Take screenshot at 0
      if (webcamRef.current) {
        const screenshot = webcamRef.current.getScreenshot();
        setPhotos(prev => [...prev, screenshot]);
        setCount(prev => prev + 1);
        setCountdown(3); // reset for next round
      }
    }, 3000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [count, isCapturing]);

  const startCapture = () => {
    setIsCapturing(true);
    setPhotos([]);
    setCount(0);
    setCountdown(3); // Start first countdown
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: '100% 100%',
      }}
    >
      {/* Title */}
      <div className="flex flex-col items-center pt-[40px] mb-[20px]">
        <h1 className="text-5xl font-koh text-[#725D5D] text-opacity-80 font-bold">Kawaii Photobooth</h1>
        <p className="text-3xl font-koh text-white font-bold mt-2">
          {count === 8
            ? 'Picture taking completed!'
            : isCapturing
            ? 'Picture taking in progress...'
            : 'Ready to capture!'}
        </p>
      </div>

      {/* Webcam Preview */}
      <div className="relative w-[685px] h-[414px] bg-black border-[12px] border-white shadow-lg">
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={true}
          videoConstraints={videoConstraints}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
        />
        {isCapturing && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <p className="text-7xl font-koh text-white drop-shadow-lg animate-pulse">
              {count === 8 ? 'Done!' : countdown}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 mt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-[129px] h-[95px] border-4 border-[#D4b2a7] flex items-center justify-center bg-white"
          >
            {photos[i] ? (
              <img src={photos[i]} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col justify-end items-center pb-2">
                <span className="text-xs font-kiwi text-black">{`${i + 1}/8`}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Start button */}
      {!isCapturing && (
        <button
          onClick={startCapture}
          className="mt-3 bg-rose hover:bg-mauve font-koh text-white text-base font-bold px-4 py-1 rounded-md transition-all duration-200"
        >
          BEGIN
        </button>
      )}

      {/* Next button */}
      {count === 8 && (
        <button
          onClick={() => navigate('/result2', { state: { photos } })}
          className="mt-3 bg-rose hover:bg-mauve font-koh text-white text-base font-bold px-4 py-1 rounded-md transition-all duration-200"
        >
          NEXT
        </button>
      )}
    </div>
  );
};

export default CaptureT2;
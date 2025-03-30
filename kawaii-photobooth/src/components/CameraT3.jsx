import React from 'react';
import Webcam from 'react-webcam';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CameraT3 = () => {
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: 'user',
    };

    const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ 
        backgroundImage: "url('/background.png')",
        backgroundSize: '100% 100%'
      }}
    >
            {/* Title section */}
            <div className="flex flex-col items-center pt-[70px] mb-[25px]"> 
        <h1 className="text-5xl font-koh text-[#725D5D] text-opacity-80 font-bold">Kawaii Photobooth</h1>
        <p className="text-3xl font-koh text-white font-bold mt-2">Camera Preview 📷</p>
      </div>

            {/* Camera preview */}
            <div className="w-[685px] h-[414px] bg-black border-[12px] border-white shadow-lg">
                <Webcam
                    audio={false}
                    mirrored={true}
                    videoConstraints={videoConstraints}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Description */}
            <div className="text-center mt-3 text-black font-koh">
            <p className="text-sm">
                Each shot captures automatically every <span className="font-bold">3 seconds</span>,
            </p>
                <p className="text-sm">
                and you’ll get <span className="font-bold">8 fun takes</span> in total!
            </p>
                <p className="text-sm mt-0.5">
                Don’t forget to <span className="font-bold">smile to the camera!</span>
            </p>
            </div>
            <button
                onClick={() => navigate('/capture3')}
                className="mt-3 bg-rose hover:bg-mauve font-koh font-bold text-white text-base px-5 py-2 rounded-md"
            >
                Start 
            </button>
    </div>
  );
}

export default CameraT3;
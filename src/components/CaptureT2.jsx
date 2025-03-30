import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CaptureT2 = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [photos, setPhotos] = useState([]);

  const handleNext = () => {
    if (count < 8) {
      setCount(count + 1);
    } else {
      navigate('/result2', { state: { photos } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Rest of the component content */}

      {/* Next button */}
      {count === 8 && (
        <button
          onClick={handleNext}
          className="mt-3 bg-rose hover:bg-mauve font-koh text-white text-base font-bold px-4 py-1 rounded-md transition-all duration-200"
        >
          NEXT
        </button>
      )}
    </div>
  );
};

export default CaptureT2; 
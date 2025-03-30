import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';

const ResultT1 = () => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [stripColor, setStripColor] = useState('#ffffff');

  const location = useLocation();
  const allPhotos = location.state?.photos || [];
  const stripRef = useRef();

  const handlePhotoClick = (photo) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(prev => prev.filter(p => p !== photo));
    } else if (selectedPhotos.length < 3) {
      setSelectedPhotos(prev => [...prev, photo]);
    }
  };

  const handleDownload = () => {
    if (!stripRef.current) return;

    html2canvas(stripRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'kawaii-photostrip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex flex-col items-center px-10 py-12"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: '100% 100%',
      }}
    >
      {/* Title */}
      <h1 className="text-5xl font-koh text-[#725D5D] text-opacity-80 font-bold mb-10">
        Kawaii Photobooth
      </h1>

      <div className="flex w-full justify-center items-start gap-16">
        {/* Photostrip */}
        <div
          ref={stripRef}
          className="w-[165px] h-[500px] flex flex-col items-center justify-between py-4 shadow-md"
          style={{ backgroundColor: stripColor }}
        >
          <div className="flex flex-col gap-2 items-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-[144px] h-[108px] bg-gray-300 flex items-center justify-center"
              >
                {selectedPhotos[i] && (
                  <img
                    src={selectedPhotos[i]}
                    alt={`strip-photo-${i}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-[8px] font-kiwi text-black">@kawaiiphotobooth</p>
        </div>

        {/* Right: 6 selectable photos */}
        <div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {allPhotos.map((photo, i) => (
              <div
                key={i}
                className={`w-[220px] h-[140px] border-4 cursor-pointer flex items-center justify-center ${
                  selectedPhotos.includes(photo)
                    ? 'border-[#D4b2a7]'
                    : 'border-white'
                }`}
                onClick={() => handlePhotoClick(photo)}
              >
                <img src={photo} alt={`photo-${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Color picker */}
          <div className="flex justify-center gap-4 mb-4">
            {['#ffffff', '#000000', '#e9c2c5', '#cdc6c3', '#a38f85', '#91a5b3'].map((color, i) => (
              <button
                key={i}
                className={`w-[40px] h-[40px] rounded-full border-2 ${
                  stripColor === color ? 'ring-2 ring-rose-400' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setStripColor(color)}
              />
            ))}
          </div>

          {/* Download button */}
          <div className="flex justify-center">
            <button
              className="bg-[#D8B4A0] hover:bg-[#cfa691] font-koh text-white text-base font-bold px-4 py-1 rounded-2xl shadow-md transition-all duration-200"
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultT1;
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

    html2canvas(stripRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: stripColor,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'kawaii-photostrip.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    });
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex flex-col items-center px-10 pt-24 pb-12"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: '100% 100%',
      }}
    >
      <h1 className="text-5xl font-koh text-[#725D5D] text-opacity-80 font-bold mb-[10px]">
        Kawaii Photobooth
      </h1>
      <p className="text-white font-koh text-opacity-80 mb-8 text-center">
        Select your pictures and template, you can click<br />
        DOWNLOAD after to save your pictures! Have fun!
      </p>

      <div className="flex flex-wrap justify-center gap-12">
        {/* Photostrip */}
        <div
          ref={stripRef}
          className="w-[175px] h-[425px] bg-white flex flex-col items-center p-4"
          style={{ backgroundColor: stripColor }}
        >
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-[150px] h-[110px] bg-gray-200 flex items-center justify-center"
              >
                {selectedPhotos[i] && (
                  <img
                    src={selectedPhotos[i]}
                    alt={`strip-photo-${i}`}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-[8px] font-kiwi mt-[25px] text-gray-600">@kawaiiphotobooth</p>
        </div>

        {/* Right side: Photo selection */}
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-[220px] h-[140px] bg-white cursor-pointer ${
                  selectedPhotos.includes(allPhotos[i]) ? 'ring-4 ring-white' : ''
                }`}
                onClick={() => allPhotos[i] && handlePhotoClick(allPhotos[i])}
              >
                {allPhotos[i] && (
                  <img
                    src={allPhotos[i]}
                    alt={`photo-${i}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Color picker */}
          <div className="flex justify-center gap-4 mb-6">
            {[
              '#ffffff',
              '#000000',
              '#e9c2c5',
              '#cdc6c3',
              '#a38f85',
              '#91a5b3'
            ].map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full ${
                  stripColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setStripColor(color)}
              />
            ))}
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="bg-rose hover:bg-mauve text-white px-6 py-2 rounded-lg font-koh transition-colors"
          >
            DOWNLOAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultT1;
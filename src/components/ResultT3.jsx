import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';

const ResultT3 = () => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [stripColor, setStripColor] = useState('#ffffff');

  const location = useLocation();
  const allPhotos = location.state?.photos || [];
  const stripRef = useRef();

  const handlePhotoClick = (photo) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(prev => prev.filter(p => p !== photo));
    } else if (selectedPhotos.length < 4) {
      setSelectedPhotos(prev => [...prev, photo]);
    }
  };

  const handleDownload = () => {
    if (!stripRef.current) return;

    html2canvas(stripRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: stripColor,
      imageTimeout: 0,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'kawaii-photogrid.png';
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
        {/* Photo Grid */}
        <div
          ref={stripRef}
          className="w-[400px] bg-white flex flex-col items-center p-4"
          style={{ backgroundColor: stripColor }}
        >
          <div className="grid grid-cols-2 gap-4 items-center justify-items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[180px] h-[180px] bg-gray-200 flex items-center justify-center"
              >
                {selectedPhotos[i] && (
                  <img
                    src={selectedPhotos[i]}
                    alt={`grid-photo-${i}`}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain'
                    }}
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
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`w-[180px] h-[140px] bg-white cursor-pointer flex items-center justify-center ${
                  selectedPhotos.includes(allPhotos[i]) ? 'ring-4 ring-white' : ''
                }`}
                onClick={() => allPhotos[i] && handlePhotoClick(allPhotos[i])}
              >
                {allPhotos[i] && (
                  <img
                    src={allPhotos[i]}
                    alt={`photo-${i}`}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain'
                    }}
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

export default ResultT3; 
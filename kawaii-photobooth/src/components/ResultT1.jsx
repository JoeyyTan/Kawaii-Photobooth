import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';

const ResultT1 = () => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedVideoIndices, setSelectedVideoIndices] = useState([]);
  const [stripColor, setStripColor] = useState('#ffffff');
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoGenerationProgress, setVideoGenerationProgress] = useState(0);

  const location = useLocation();
  const allPhotos = location.state?.photos || [];
  const allVideoClips = location.state?.videoClips || [];
  const stripRef = useRef();
  const canvasRef = useRef();
  const videosRef = useRef([]);

  useEffect(() => {
    // Create an offscreen canvas for video creation
    const canvas = document.createElement('canvas');
    // Higher resolution for better quality (2x the display size)
    canvas.width = 350; // 2x photostrip width
    canvas.height = 850; // 2x photostrip height
    canvasRef.current = canvas;

    // Initialize video elements refs
    videosRef.current = Array(3).fill().map(() => document.createElement('video'));
  }, []);

  const handlePhotoClick = (photo, index) => {
    if (selectedPhotos.includes(photo)) {
      // Remove the photo
      setSelectedPhotos(prev => prev.filter(p => p !== photo));
      
      // Also remove the corresponding video index
      setSelectedVideoIndices(prev => prev.filter(i => i !== index));
    } else if (selectedPhotos.length < 3) {
      // Add the photo
      setSelectedPhotos(prev => [...prev, photo]);
      
      // Also add the corresponding video index if available
      if (allVideoClips[index]) {
        setSelectedVideoIndices(prev => [...prev, index]);
      }
    }
  };

  const createPhotoStripVideo = async () => {
    if (selectedPhotos.length < 3 || selectedVideoIndices.length < 3) {
      alert('Please select 3 photos with video clips to create your video photostrip.');
      return null;
    }

    try {
      // Get the canvas context for video creation
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Setup MediaRecorder with widely supported format and codecs
      // Higher FPS and bitrate for better quality
      const stream = canvas.captureStream(60); // 60 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9', // VP9 for better quality
        videoBitsPerSecond: 8000000 // 8 Mbps for higher quality
      });
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      return new Promise(async (resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };
        
        // Prepare canvas with background color
        ctx.fillStyle = stripColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set up the 3 video elements with the selected video clips
        const videoElements = [];
        for (let i = 0; i < 3; i++) {
          const videoIndex = selectedVideoIndices[i];
          if (videoIndex !== undefined && allVideoClips[videoIndex]) {
            const videoEl = videosRef.current[i];
            videoEl.src = allVideoClips[videoIndex].url;
            videoEl.muted = true;
            videoEl.crossOrigin = "anonymous";
            // Set video element to highest quality
            videoEl.setAttribute('playsinline', true);
            
            // Wait for video metadata to load
            await new Promise(resolve => {
              videoEl.onloadedmetadata = resolve;
              videoEl.load();
            });
            
            videoElements.push(videoEl);
          } else {
            // Use a placeholder if no video
            videoElements.push(null);
          }
        }
        
        // Start recording
        mediaRecorder.start();
        
        // Calculate positions for the videos in photostrip layout with higher resolution
        const videoWidth = 300; // Double width for better quality
        const videoHeight = 220; // Double height for better quality
        const padding = 8; // Double padding
        
        const positions = [
          { x: (canvas.width - videoWidth) / 2, y: padding },
          { x: (canvas.width - videoWidth) / 2, y: padding + videoHeight + padding },
          { x: (canvas.width - videoWidth) / 2, y: padding + (videoHeight + padding) * 2 }
        ];
        
        // Start all videos
        videoElements.forEach(vid => vid && vid.play());
        
        // Draw function to render the photostrip with videos
        const drawPhotoStrip = () => {
          // Apply anti-aliasing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Clear canvas with background color
          ctx.fillStyle = stripColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw each video in its position
          videoElements.forEach((videoEl, index) => {
            if (videoEl) {
              ctx.drawImage(
                videoEl, 
                positions[index].x, 
                positions[index].y, 
                videoWidth, 
                videoHeight
              );
              
              // Add a border around the video
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 4; // Thicker border for HD
              ctx.strokeRect(
                positions[index].x, 
                positions[index].y, 
                videoWidth, 
                videoHeight
              );
            } else {
              // Draw a placeholder if no video
              ctx.fillStyle = '#f0f0f0';
              ctx.fillRect(
                positions[index].x, 
                positions[index].y, 
                videoWidth, 
                videoHeight
              );
            }
          });
          
          // Add branding at the bottom
          ctx.fillStyle = '#333333';
          ctx.font = 'bold 16px Kiwi Maru, Arial'; // Use Kiwi Maru font
          ctx.textAlign = 'center';
          ctx.fillText('@kawaiiphotobooth', canvas.width / 2, canvas.height - 30);
          
          // Stop recording when the first video ends
          if (videoElements[0] && videoElements[0].ended) {
            mediaRecorder.stop();
            return;
          }
          
          // Update progress
          if (videoElements[0]) {
            const progress = (videoElements[0].currentTime / videoElements[0].duration) * 100;
            setVideoGenerationProgress(Math.round(progress));
          }
          
          requestAnimationFrame(drawPhotoStrip);
        };
        
        // Start the drawing loop
        drawPhotoStrip();
      });
    } catch (error) {
      console.error('Error creating video photostrip:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    if (selectedPhotos.length < 3) {
      alert('Please select 3 photos to create your photostrip and video.');
      return;
    }
    
    setIsDownloading(true);
    setVideoGenerationProgress(0);
    
    try {
      // First download the PNG version of the photostrip
      const canvas = await html2canvas(stripRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: stripColor,
      });
      
      const pngLink = document.createElement('a');
      pngLink.download = 'kawaii-photostrip.png';
      pngLink.href = canvas.toDataURL('image/png', 1.0);
      pngLink.click();
      
      // Now create and download the photostrip video
      const videoBlob = await createPhotoStripVideo();
      
      if (videoBlob) {
        // Create download link
        const videoLink = document.createElement('a');
        videoLink.href = URL.createObjectURL(videoBlob);
        videoLink.download = 'kawaii-photostrip-video.webm';
        videoLink.click();
        
        URL.revokeObjectURL(videoLink.href);
      }
    } catch (error) {
      console.error('Error creating downloads:', error);
      alert('There was an error creating your downloads. Please try again.');
    } finally {
      setIsDownloading(false);
      setVideoGenerationProgress(0);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex flex-col items-center px-10 pt-24 pb-12 overflow-y-auto"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: '100% 100%',
      }}
    >
      <h1 className="text-5xl font-koh text-[#725D5D] text-opacity-80 font-bold mb-[10px]">
        Kawaii Photobooth
      </h1>
      <p className="text-white font-koh text-opacity-80 mb-8 text-center">
        Select 3 pictures for your photostrip, you can click<br />
        DOWNLOAD to save PNG and video versions! Have fun!
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
                className={`relative w-[220px] h-[140px] bg-white cursor-pointer ${
                  selectedPhotos.includes(allPhotos[i]) ? 'ring-4 ring-white' : ''
                }`}
                onClick={() => allPhotos[i] && handlePhotoClick(allPhotos[i], i)}
              >
                {allPhotos[i] && (
                  <img
                    src={allPhotos[i]}
                    alt={`photo-${i}`}
                    className="w-full h-full object-cover"
                  />
                )}
                {allVideoClips[i] && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-rose rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white" />
                  </div>
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
            disabled={isDownloading || selectedPhotos.length < 3}
            className={`bg-rose hover:bg-mauve text-white px-6 py-2 rounded-lg font-koh transition-colors ${
              isDownloading || selectedPhotos.length < 3 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isDownloading ? 'CREATING FILES...' : 'DOWNLOAD'}
          </button>
          
          {isDownloading && videoGenerationProgress > 0 && (
            <div className="w-full max-w-[220px] mt-2">
              <div className="bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-rose h-2.5 rounded-full" 
                  style={{ width: `${videoGenerationProgress}%` }}
                ></div>
              </div>
              <p className="text-white text-xs mt-1 text-center">
                Generating video: {videoGenerationProgress}%
              </p>
            </div>
          )}
          
          {!isDownloading && (
            <p className="text-white text-xs mt-2">
              {selectedPhotos.length < 3 
                ? `Select ${3 - selectedPhotos.length} more photo${selectedPhotos.length === 2 ? '' : 's'}` 
                : 'Your download will include PNG photostrip and HD video!'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultT1;
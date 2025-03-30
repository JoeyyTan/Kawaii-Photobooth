import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Templates from './components/Templates';
import CameraT1 from './components/CameraT1'; 
import CameraT2 from './components/CameraT2';
import CameraT3 from './components/CameraT3';
import CaptureT1 from './components/CaptureT1';
import CaptureT2 from './components/CaptureT2';
import CaptureT3 from './components/CaptureT3';
import ResultT1 from './components/ResultT1';
import ResultT2 from './components/ResultT2';
import ResultT3 from './components/ResultT3';
import './App.css';
import { useState } from 'react';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
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
                <p className="text-3xl font-koh text-white font-bold mt-2">Select your template!</p>
              </div>

              {/* Templates section */}
              <div>
                <Templates />
              </div>
            </div>
          } 
        />
        
        <Route path="/photo" element={<CameraT1 />} />
        <Route path="/photo2" element={<CameraT2 />} />
        <Route path="/photo3" element={<CameraT3 />} />
        <Route path="/capture" element={<CaptureT1 />} />
        <Route path="/capture2" element={<CaptureT2 />} />
        <Route path="/capture3" element={<CaptureT3 />} />
        <Route path="/result1" element={<ResultT1 />} />
        <Route path="/result2" element={<ResultT2 />} />
        <Route path="/result3" element={<ResultT3 />} />
        
      </Routes>
    </Router>
  );
}

export default App;

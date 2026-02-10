
import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../services/audioManager';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [fading, setFading] = useState(false);
  const lastUpdate = useRef(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Limita a atualização a 30fps para poupar CPU
      const now = Date.now();
      if (now - lastUpdate.current < 32) return;
      lastUpdate.current = now;

      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };
    
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleStart = () => {
    audio.playSound('growl');
    setFading(true);
    setTimeout(onStart, 400);
  };

  const startSequence = () => {
    audio.startAmbience();
  };

  return (
    <div 
      onMouseDown={startSequence}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Background Otimizado */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ 
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=40&w=800" 
          className="w-full h-full object-cover grayscale brightness-[0.2] beast-image" 
          alt=""
          loading="eager"
        />
        <div className="absolute top-[41.8%] left-[48.4%] flex gap-[3.8rem]">
           <div className="w-1.5 h-1.5 rounded-full eye-pulse"></div>
           <div className="w-1.5 h-1.5 rounded-full eye-pulse"></div>
        </div>
        <div className="fog-layer"></div>
      </div>
      
      {/* UI Simples e Direta */}
      <div className="relative z-10 text-center space-y-12 p-8">
        <div className="space-y-2">
          <h1 className="text-7xl md:text-9xl font-gothic text-red-950 tracking-tighter leading-none">
            LUNA<br/>SANGUINIS
          </h1>
          <p className="text-[9px] font-serif italic text-gray-800 uppercase tracking-[1em] opacity-40">
            A carne é o pacto
          </p>
        </div>

        <button 
          onClick={handleStart}
          className="group relative px-12 py-4 bg-red-950/5 border border-red-950/20 hover:border-red-800 transition-colors"
        >
          <span className="relative z-10 font-gothic text-2xl text-red-900 group-hover:text-red-600 tracking-[0.2em]">INICIAR</span>
        </button>
      </div>
    </div>
  );
};

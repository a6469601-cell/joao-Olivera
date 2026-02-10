
import React, { useState } from 'react';
import { audio } from '../services/audioManager';

interface LobbyProps {
  onStart: (playerNames: string[], isInfinite: boolean) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onStart }) => {
  const [names, setNames] = useState<string[]>(['O Primogênito']);
  const [isInfinite, setIsInfinite] = useState(false);

  const handleStart = () => {
    audio.playSound('howl');
    onStart(names, isInfinite);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full bg-[#050505] border border-red-950 p-12 rounded-none space-y-10 shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-gothic text-red-950 uppercase tracking-[0.2em] mix-blend-difference">PACTO SANGUÍNEO</h2>
          <p className="text-[8px] text-red-900/60 tracking-[0.5em] uppercase font-bold">Defina sua linhagem</p>
        </div>

        <div className="flex gap-2 p-1 bg-black/50 border border-red-950/30">
          <button 
            onClick={() => setIsInfinite(false)}
            className={`flex-1 py-3 text-[9px] transition-all uppercase tracking-widest ${!isInfinite ? 'bg-red-950/20 text-red-600' : 'text-gray-700'}`}
          >
            Matilha de Caça
          </button>
          <button 
            onClick={() => { setIsInfinite(true); setNames(['O Solitário']); }}
            className={`flex-1 py-3 text-[9px] transition-all uppercase tracking-widest ${isInfinite ? 'bg-red-950/20 text-red-600' : 'text-gray-700'}`}
          >
            Soberania Eterna
          </button>
        </div>

        <div className="space-y-6">
          {names.map((name, idx) => (
            <div key={idx} className="space-y-1">
               <label className="text-[7px] uppercase tracking-widest text-red-900/50">Identidade {idx + 1}</label>
               <input 
                type="text" 
                value={name}
                onChange={(e) => {
                  const n = [...names];
                  n[idx] = e.target.value;
                  setNames(n);
                }}
                className="w-full bg-black border-b border-red-950 px-0 py-3 text-lg text-red-700 font-serif focus:border-red-600 focus:outline-none transition-colors placeholder-red-950/20"
                placeholder="Seu nome..."
              />
            </div>
          ))}
          {!isInfinite && names.length < 4 && (
            <button 
              onClick={() => setNames([...names, `Cria ${names.length + 1}`])}
              className="w-full py-2 border border-dashed border-red-950/30 text-[7px] uppercase tracking-widest text-red-950 hover:border-red-900 transition-all"
            >
              Invocar mais um membro
            </button>
          )}
        </div>

        <button 
          onClick={handleStart}
          className="w-full py-6 bg-red-950/10 border border-red-900 text-red-800 font-gothic text-3xl hover:bg-red-900 hover:text-white transition-all shadow-[0_0_40px_rgba(153,27,27,0.1)] active:scale-95"
        >
          {isInfinite ? 'INICIAR ETERNIDADE' : 'INICIAR MATILHA'}
        </button>
      </div>
    </div>
  );
};

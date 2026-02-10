
import React from 'react';
import { GameState } from '../types';

interface HUDProps {
  state: GameState;
  onUpgrade?: (abilityId: string) => void;
}

export const HUD: React.FC<HUDProps> = ({ state, onUpgrade }) => {
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  return (
    <div className="space-y-8 select-none">
      <div className="text-center pb-4 border-b border-red-950/10">
        <h1 className="text-xl font-gothic text-red-950 tracking-[0.2em] uppercase">
          {state.isInfiniteMode ? 'Soberano' : 'Matilha'}
        </h1>
        <p className="text-[7px] text-gray-700 uppercase tracking-widest mt-1">
          Círculo {state.day} • Lua {state.moonCycle}%
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-end">
          <span className="text-[8px] text-red-950 uppercase font-bold">Essência</span>
          <span className="text-xl font-gothic text-red-800">{currentPlayer.essence}</span>
        </div>
        <div className="h-[1px] bg-red-950/10"></div>
      </div>

      <div className="space-y-4">
        {currentPlayer.abilities.map((ability) => (
          <div key={ability.id} className="space-y-1">
            <div className="flex justify-between text-[9px] text-gray-600 uppercase">
              <span>{ability.name}</span>
              <span>v.{ability.level}</span>
            </div>
            <div className="flex gap-0.5 h-[2px] bg-black">
              {[1, 2, 3, 4, 5].map(step => (
                <div 
                  key={step} 
                  className={`flex-1 ${step <= ability.level ? 'bg-red-900' : 'bg-gray-900'}`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <div className="space-y-1">
          <div className="flex justify-between text-[7px] uppercase text-gray-700">
            <span>Carne</span>
            <span>{currentPlayer.health}%</span>
          </div>
          <div className="h-1 bg-black overflow-hidden">
            <div className="h-full bg-red-900/40" style={{ width: `${currentPlayer.health}%` }}></div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-[7px] uppercase text-red-950">
            <span>Sede</span>
            <span>{currentPlayer.bloodlust}%</span>
          </div>
          <div className="h-1 bg-black overflow-hidden">
            <div className="h-full bg-red-600/30" style={{ width: `${currentPlayer.bloodlust}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

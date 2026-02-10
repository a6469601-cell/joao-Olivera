
import React from 'react';
import { Choice } from '../types';
import { audio } from '../services/audioManager';

interface ActionMenuProps {
  choices: Choice[];
  onChoice: (text: string) => void;
  isBeast: boolean;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ choices, onChoice, isBeast }) => {
  const getDangerText = (level: string) => {
    switch(level) {
      case 'high': return 'ALTO';
      case 'medium': return 'MÉDIO';
      default: return 'BAIXO';
    }
  };

  const handleAction = (text: string) => {
    audio.playSound('crunch');
    onChoice(text);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-center">
      {choices.map((choice) => (
        <button
          key={choice.id}
          onMouseEnter={() => audio.playSound('click')}
          onClick={() => handleAction(choice.text)}
          className={`group relative px-6 py-4 rounded bg-black/80 border transition-colors duration-300 flex-1 overflow-hidden ${
            choice.dangerLevel === 'high' ? 'border-red-900/40 hover:border-red-600' : 
            choice.dangerLevel === 'medium' ? 'border-orange-900/30' : 
            'border-gray-900 hover:border-gray-700'
          }`}
        >
          <div className={`absolute top-0 right-0 p-1 text-[6px] font-bold tracking-tighter ${
            choice.dangerLevel === 'high' ? 'text-red-600' : 'text-gray-700'
          }`}>
            {getDangerText(choice.dangerLevel)}
          </div>

          <span className={`block text-xs md:text-sm font-serif ${
            isBeast ? 'text-red-700 font-bold uppercase' : 'text-gray-400'
          }`}>
            {choice.text}
          </span>
        </button>
      ))}
    </div>
  );
};

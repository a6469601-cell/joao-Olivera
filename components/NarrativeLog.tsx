
import React from 'react';
import { NarrativeResponse } from '../types';

interface NarrativeLogProps {
  history: { role: 'user' | 'assistant'; content: string }[];
  current: NarrativeResponse | null;
  loading: boolean;
}

export const NarrativeLog: React.FC<NarrativeLogProps> = ({ history, current, loading }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 narrative-container">
      {history.slice(0, -1).map((entry, idx) => (
        <div key={idx} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] p-4 border transition-opacity ${
            entry.role === 'user' 
            ? 'bg-black/40 border-red-950/20 italic text-gray-600 text-[11px]' 
            : 'bg-transparent border-transparent text-gray-900 opacity-30'
          }`}>
            {entry.content}
          </div>
        </div>
      ))}

      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-6 py-20">
          <div className="w-8 h-10 border border-red-900/30 rounded-full animate-pulse"></div>
          <p className="text-[8px] font-serif uppercase tracking-[0.5em] text-red-950">Aguente a dor...</p>
        </div>
      ) : current && (
        <div className="space-y-8 animate-in fade-in duration-300">
           <div className="text-xl md:text-2xl leading-[1.5] font-serif text-gray-400">
             {current.description.split('\n').map((line, i) => (
               <p key={i} className="mb-6 first-letter:text-5xl first-letter:font-gothic first-letter:mr-2 first-letter:text-red-900 first-letter:float-left">
                 {line}
               </p>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

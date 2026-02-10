
import React from 'react';
import { Player } from '../types';

interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
}

const MANSION_ROOMS: Room[] = [
  { id: 'hall', name: 'Hall', x: 1, y: 3 },
  { id: 'salao', name: 'Salão', x: 1, y: 2 },
  { id: 'biblioteca', name: 'Biblioteca', x: 0, y: 2 },
  { id: 'jantar', name: 'Jantar', x: 2, y: 2 },
  { id: 'cozinha', name: 'Cozinha', x: 2, y: 1 },
  { id: 'porao', name: 'Porão', x: 1, y: 4 },
  { id: 'escada', name: 'Escada', x: 1, y: 1 },
  { id: 'quarto', name: 'Quarto', x: 1, y: 0 },
];

interface MapProps {
  players: Player[];
  currentPlayerIndex: number;
  visitedRooms: string[];
  npcLocation: string;
  onInvestigateRoom: (roomId: string, action: string) => void;
}

export const MansionMap: React.FC<MapProps> = ({ players, currentPlayerIndex, visitedRooms, npcLocation, onInvestigateRoom }) => {
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="relative w-full aspect-square bg-[#0a0a0a] border border-red-950/50 rounded-lg overflow-hidden">
      <div className="grid grid-cols-3 grid-rows-5 gap-1 h-full p-2 relative">
        {Array.from({ length: 15 }).map((_, i) => {
          const x = i % 3;
          const y = Math.floor(i / 3);
          const room = MANSION_ROOMS.find(r => r.x === x && r.y === y);
          
          if (!room) return <div key={i} className="opacity-0"></div>;
          
          const isVisited = visitedRooms.includes(room.id);
          const playersInRoom = players.filter(p => p.currentRoomId === room.id && !p.isDead);
          const hasNpc = room.id === npcLocation;
          const isCurrentPlayerRoom = currentPlayer.currentRoomId === room.id;

          return (
            <div 
              key={i} 
              onClick={() => isVisited && !isCurrentPlayerRoom && onInvestigateRoom(room.id, "farejar")}
              className={`relative flex flex-col items-center justify-center border transition-all duration-300 ${
                isVisited 
                  ? 'border-red-900/30 bg-red-950/5 hover:bg-red-900/10' 
                  : 'border-black bg-black grayscale opacity-40'
              } ${isCurrentPlayerRoom ? 'ring-1 ring-red-600/50 bg-red-900/10' : ''}`}
            >
              <span className={`text-[7px] uppercase font-gothic mb-1 ${isCurrentPlayerRoom ? 'text-red-500' : 'text-gray-700'}`}>
                {isVisited ? room.name : '?'}
              </span>

              {/* Marcadores de Jogadores */}
              <div className="flex flex-wrap gap-0.5 justify-center">
                {playersInRoom.map(p => (
                  <div 
                    key={p.id} 
                    title={p.name}
                    className={`w-1.5 h-1.5 rounded-full ${p.id === currentPlayer.id ? 'bg-red-500 animate-pulse' : 'bg-white/60'}`}
                  ></div>
                ))}
              </div>

              {/* NPC signature if high bloodlust logic would go here */}
              {hasNpc && currentPlayer.bloodlust > 70 && (
                <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GamePhase, NarrativeResponse, Player, NPC, Ability } from './types';
import { generateNarrative } from './services/geminiService';
import { HUD } from './components/HUD';
import { NarrativeLog } from './components/NarrativeLog';
import { ActionMenu } from './components/ActionMenu';
import { SplashScreen } from './components/SplashScreen';
import { Lobby } from './components/Lobby';
import { MansionMap } from './components/MansionMap';

const INITIAL_ABILITIES: Ability[] = [
  { id: 'senses', name: 'Sentidos Aguçados', level: 1, description: 'Percepção e antecipação.' },
  { id: 'stealth', name: 'Furtividade', level: 1, description: 'Mover-se como sombra.' },
  { id: 'control', name: 'Resistência à Fera', level: 1, description: 'Controle da corrupção.' }
];

const INITIAL_NPC: NPC = {
  name: "Aeliana",
  relation: "Desconhecida",
  bloodlust: 30,
  location: "quarto",
  isHostile: false
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.INTRO);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentNarrative, setCurrentNarrative] = useState<NarrativeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const initGame = (names: string[], isInfinite: boolean) => {
    setIsTransitioning(true);
    
    // Reduzido de 800ms para 300ms para agilizar a entrada
    setTimeout(() => {
      const players: Player[] = names.map((name, idx) => ({
        id: idx + 1,
        name,
        health: 100,
        sanity: 100,
        bloodlust: 10,
        currentRoomId: 'hall',
        isDead: false,
        inventory: [],
        abilities: JSON.parse(JSON.stringify(INITIAL_ABILITIES)),
        essence: 15
      }));

      setGameState({
        players,
        currentPlayerIndex: 0,
        moonCycle: 10,
        visitedRooms: ['hall'],
        roomStates: {},
        day: 1,
        history: [],
        location: 'Hall de Entrada',
        npc: { ...INITIAL_NPC, relation: isInfinite ? "Progenitora" : "Protetora" },
        isInfiniteMode: isInfinite,
        threatLevel: isInfinite ? 5 : 0,
        bestDayReached: 1
      });

      setPhase(GamePhase.HUMAN);
      setIsTransitioning(false);
    }, 300);
  };

  const upgradeAbility = (abilityId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const updatedPlayers = [...prev.players];
      const p = updatedPlayers[prev.currentPlayerIndex];
      const ability = p.abilities.find(a => a.id === abilityId);
      if (ability && ability.level < 5) {
        const cost = ability.level * 15;
        if (p.essence >= cost) {
          p.essence -= cost;
          ability.level += 1;
        }
      }
      return { ...prev, players: updatedPlayers };
    });
  };

  const processAction = useCallback(async (actionText: string) => {
    if (!gameState) return;
    setLoading(true);
    
    const response = await generateNarrative(gameState, actionText);
    
    setGameState(prev => {
      if (!prev) return null;
      let updatedPlayers = [...prev.players];
      
      if (response.effects.players) {
        response.effects.players.forEach(effect => {
          const idx = updatedPlayers.findIndex(p => p.id === effect.id);
          if (idx !== -1) {
            updatedPlayers[idx] = {
              ...updatedPlayers[idx],
              ...effect,
              health: Math.max(0, Math.min(100, (updatedPlayers[idx].health + (effect.health || 0)))),
              sanity: Math.max(0, Math.min(100, (updatedPlayers[idx].sanity + (effect.sanity || 0)))),
              bloodlust: Math.max(0, Math.min(100, (updatedPlayers[idx].bloodlust + (effect.bloodlust || 0)))),
              isDead: (updatedPlayers[idx].health + (effect.health || 0)) <= 0 ? true : updatedPlayers[idx].isDead
            };
          }
        });
      }

      updatedPlayers[prev.currentPlayerIndex].essence += (response.effects.essenceAwarded || 3);
      const dayIncrease = (prev.moonCycle + (response.effects.moonCycle || 1)) >= 100 ? 1 : 0;
      const newMoonCycle = (prev.moonCycle + (response.effects.moonCycle || 2)) % 100;

      let nextIndex = prev.currentPlayerIndex;
      if (!prev.isInfiniteMode) {
        nextIndex = (prev.currentPlayerIndex + 1) % updatedPlayers.length;
        let safety = 0;
        while (updatedPlayers[nextIndex].isDead && safety < updatedPlayers.length) {
          nextIndex = (nextIndex + 1) % updatedPlayers.length;
          safety++;
        }
      }

      if (updatedPlayers.every(p => p.isDead)) setPhase(GamePhase.DEATH);

      return {
        ...prev,
        players: updatedPlayers,
        currentPlayerIndex: nextIndex,
        day: prev.day + dayIncrease,
        moonCycle: newMoonCycle,
        threatLevel: Math.max(0, Math.min(100, (prev.threatLevel + (response.effects.threatLevel || 0)))),
        npc: { ...prev.npc, ...(response.effects.npc || {}) },
        history: [...prev.history, 
          { role: 'user', content: actionText, playerId: prev.players[prev.currentPlayerIndex].id }, 
          { role: 'assistant', content: response.description }
        ]
      };
    });

    setCurrentNarrative(response);
    setLoading(false);
  }, [gameState]);

  useEffect(() => {
    if (phase === GamePhase.HUMAN && gameState && gameState.history.length === 0) {
      processAction("Eu entro na escuridão da Mansão Blackwood. O sangue me chama.");
    }
  }, [phase]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [currentNarrative, loading]);

  if (phase === GamePhase.INTRO) return <SplashScreen onStart={() => setPhase(GamePhase.LOBBY)} />;
  if (phase === GamePhase.LOBBY) return <Lobby onStart={initGame} />;
  if (!gameState) return null;

  const activePlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className={`relative h-screen w-full flex flex-col md:flex-row bg-[#020202] text-gray-400 transition-all duration-300 
      ${activePlayer.bloodlust > 60 ? 'blood-vignette' : ''} 
      ${loading ? 'sensory-overload' : ''} 
      ${isTransitioning ? 'blur-2xl opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
      
      <div className="w-full md:w-80 h-auto md:h-full border-b md:border-b-0 md:border-r border-red-950/40 bg-black/95 p-6 z-20 overflow-y-auto custom-scrollbar shadow-2xl">
        <HUD state={gameState} onUpgrade={upgradeAbility} />
        
        <div className="mt-8 pt-6 border-t border-red-900/20">
          <MansionMap 
            players={gameState.players}
            currentPlayerIndex={gameState.currentPlayerIndex}
            visitedRooms={gameState.visitedRooms}
            npcLocation={gameState.npc.location}
            onInvestigateRoom={(rid, act) => processAction(`Eu uso meus sentidos na sala ${rid}.`)}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-16 space-y-12 pb-48 custom-scrollbar">
          <NarrativeLog history={gameState.history} current={currentNarrative} loading={loading} />
          {phase === GamePhase.DEATH && (
             <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
               <h2 className="text-8xl font-gothic text-red-950 mb-4 tracking-tighter drop-shadow-2xl">FINIS</h2>
               <p className="text-gray-600 uppercase tracking-[0.5em] text-xs mb-10">A maldição foi quebrada pelo aço.</p>
               <button onClick={() => window.location.reload()} className="px-14 py-4 bg-red-950/20 border border-red-900 text-red-700 font-gothic text-2xl hover:bg-red-900 hover:text-white transition-all shadow-lg">RENASCER</button>
             </div>
          )}
        </div>

        {currentNarrative && !loading && phase !== GamePhase.DEATH && (
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/95 to-transparent z-10 transition-transform duration-300 translate-y-0">
            <ActionMenu 
              choices={currentNarrative.choices} 
              onChoice={processAction} 
              isBeast={activePlayer.bloodlust > 80}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

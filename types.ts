
export enum GamePhase {
  INTRO = 'INTRO',
  LOBBY = 'LOBBY',
  HUMAN = 'HUMAN',
  TRANSITION = 'TRANSITION',
  BEAST = 'BEAST',
  DEATH = 'DEATH'
}

export interface Ability {
  id: string;
  name: string;
  level: number;
  description: string;
}

export interface Player {
  id: number;
  name: string;
  health: number;
  sanity: number;
  bloodlust: number;
  currentRoomId: string;
  isDead: boolean;
  inventory: string[];
  abilities: Ability[];
  essence: number;
}

export interface NPC {
  name: string;
  relation: string;
  bloodlust: number;
  location: string;
  isHostile: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  moonCycle: number;
  visitedRooms: string[];
  roomStates: Record<string, string>;
  day: number;
  history: { role: 'user' | 'assistant'; content: string; playerId?: number }[];
  location: string;
  npc: NPC;
  isInfiniteMode: boolean;
  threatLevel: number; // 0 a 100
  bestDayReached: number;
}

export interface NarrativeResponse {
  description: string;
  choices: Choice[];
  effects: {
    players?: Partial<Player>[];
    npc?: Partial<NPC>;
    moonCycle?: number;
    roomStates?: Record<string, string>;
    threatLevel?: number;
    essenceAwarded?: number;
  };
  sensoryDetails: {
    sound?: string;
    smell?: string;
    sight?: string;
    heatSignature?: boolean;
  };
}

export interface Choice {
  id: string;
  text: string;
  dangerLevel: 'low' | 'medium' | 'high';
}

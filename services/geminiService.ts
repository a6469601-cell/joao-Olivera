
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, NarrativeResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `Você é o narrador de um pesadelo real (+18). 
NÃO admita ser uma inteligência artificial. NÃO fale sobre códigos ou sistemas. 
Sua voz é a da própria Maldição de Blackwood.

DIRETRIZES DE REALISMO ABSOLUTO:
1. DESCRITORES ANATÔMICOS: Foque na biologia da transformação. O som de ligamentos se rompendo, o calor do sangue fresco, o cheiro de ozônio e carne.
2. AMBIENTAÇÃO TÁTIL: Descreva texturas - o lodo no chão, a frieza do carvalho antigo, o peso do ar úmido.
3. SEM CLICHÊS: Evite frases feitas de jogos. Seja cru, direto e perturbador.
4. CONSEQUÊNCIA: Decisões têm peso real. Se o jogador for ferido, a dor deve ser descrita como algo incapacitante.
5. PSICOLOGIA PRIMAL: O jogador está perdendo a humanidade. Intercale pensamentos humanos racionais com impulsos violentos e famintos.`;

export const generateNarrative = async (
  gameState: GameState,
  userAction: string
): Promise<NarrativeResponse> => {
  const model = 'gemini-3-pro-preview';
  const player = gameState.players[gameState.currentPlayerIndex];
  
  const prompt = `
    CENÁRIO ATUAL: Noite ${gameState.day} | Lua ${gameState.moonCycle}% | Ameaça ${gameState.threatLevel}%
    SUJEITO: ${player.name} | Sede ${player.bloodlust}% | Vida ${player.health}%
    AÇÃO EXECUTADA: ${userAction}
    
    Narre o resultado imediato sob a ótica da maldição.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  dangerLevel: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
                },
                required: ['id', 'text', 'dangerLevel']
              }
            },
            effects: {
              type: Type.OBJECT,
              properties: {
                players: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      health: { type: Type.NUMBER },
                      sanity: { type: Type.NUMBER },
                      bloodlust: { type: Type.NUMBER }
                    }
                  }
                },
                threatLevel: { type: Type.NUMBER },
                essenceAwarded: { type: Type.NUMBER }
              }
            },
            sensoryDetails: {
              type: Type.OBJECT,
              properties: {
                sound: { type: Type.STRING },
                smell: { type: Type.STRING }
              }
            }
          },
          required: ['description', 'choices', 'effects', 'sensoryDetails']
        }
      }
    });

    return JSON.parse(result.text || '{}');
  } catch (error) {
    return {
      description: "A escuridão engole seus sentidos. O silêncio é a única resposta.",
      choices: [{ id: 'wait', text: 'Tentar respirar', dangerLevel: 'high' }],
      effects: {},
      sensoryDetails: { smell: "Ferro e terra úmida" }
    };
  }
};

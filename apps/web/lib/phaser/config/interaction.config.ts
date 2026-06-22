export type InteractionTier = 'room' | 'object';

export interface InteractionZoneConfig {
  type: string;
  radius: number;
  prompt: string;
  tier: InteractionTier;
}

export interface InteractionZone {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetId: string;
}

export const InteractionZoneTypes: Record<string, InteractionZoneConfig> = {
  meeting_room: {
    type: 'meeting_room',
    radius: 80,
    prompt: 'Enter Meeting Room',
    tier: 'room',
  },
  desk: {
    type: 'desk',
    radius: 40,
    prompt: 'Sit at Desk',
    tier: 'object',
  },
  ai_lab: {
    type: 'ai_lab',
    radius: 80,
    prompt: 'Open AI Workspace',
    tier: 'room',
  },
  whiteboard: {
    type: 'whiteboard',
    radius: 60,
    prompt: 'Collaborate',
    tier: 'object',
  },
  project_board: {
    type: 'project_board',
    radius: 60,
    prompt: 'View Tasks',
    tier: 'object',
  },
};

export const InteractionZones: InteractionZone[] = [
  // Meeting Room
  {
    id: 'meeting-room-1',
    type: 'meeting_room',
    x: 1150,
    y: 800,
    width: 600,
    height: 520,
    targetId: 'meeting-1',
  },
  // AI Labs
  {
    id: 'ai-lab-1',
    type: 'ai_lab',
    x: 1116,
    y: 0,
    width: 1284,
    height: 780,
    targetId: 'ai-lab-1',
  },
  // Open Office Desks
  {
    id: 'desk-o1-1',
    type: 'desk',
    x: 160,
    y: 180,
    width: 200,
    height: 130,
    targetId: 'desk-1',
  },
  {
    id: 'desk-o1-2',
    type: 'desk',
    x: 380,
    y: 180,
    width: 200,
    height: 130,
    targetId: 'desk-2',
  },
  {
    id: 'desk-o1-3',
    type: 'desk',
    x: 600,
    y: 180,
    width: 200,
    height: 130,
    targetId: 'desk-3',
  },
  // Workspace Desks
  {
    id: 'desk-w3-1',
    type: 'desk',
    x: 160,
    y: 800,
    width: 200,
    height: 130,
    targetId: 'desk-4',
  },
  {
    id: 'desk-w3-2',
    type: 'desk',
    x: 380,
    y: 800,
    width: 200,
    height: 130,
    targetId: 'desk-5',
  },
  // AI Labs Desks
  {
    id: 'desk-ai-1',
    type: 'desk',
    x: 1400,
    y: 120,
    width: 180,
    height: 130,
    targetId: 'desk-6',
  },
  {
    id: 'desk-ai-2',
    type: 'desk',
    x: 1650,
    y: 120,
    width: 180,
    height: 130,
    targetId: 'desk-7',
  },
];

export const CollisionLayers = {
  world_bounds: 'world_bounds',
  structural: 'structural',
  furniture_static: 'furniture_static',
  furniture_interactive: 'furniture_interactive',
  players: 'players',
  interaction_zones: 'interaction_zones',
};

export interface CollisionRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type?: string;
}

export const StructuralCollisions: CollisionRect[] = [
  { id: 'wall-horizontal-1', x: 0, y: 720, width: 800, height: 12 },
  { id: 'wall-horizontal-2', x: 1200, y: 720, width: 120, height: 12 },
  { id: 'wall-vertical-top', x: 1100, y: 0, width: 8, height: 290 },
  { id: 'wall-vertical-bottom', x: 1100, y: 410, width: 8, height: 760 },
  { id: 'meeting-top-left', x: 1150, y: 800, width: 200, height: 8 },
  { id: 'meeting-top-right', x: 1450, y: 800, width: 300, height: 8 },
  { id: 'meeting-left', x: 1150, y: 800, width: 8, height: 520 },
  { id: 'meeting-bottom', x: 1150, y: 1306, width: 600, height: 8 },
  { id: 'meeting-right', x: 1736, y: 800, width: 8, height: 520 },
];

export const FurnitureCollisions: CollisionRect[] = [
  // Pod A — Engineering cluster
  { id: 'desk-o1-1', x: 180, y: 200, width: 180, height: 70, type: 'desk' },
  { id: 'desk-o1-2', x: 400, y: 180, width: 180, height: 70, type: 'desk' },
  { id: 'desk-o1-3', x: 380, y: 350, width: 180, height: 70, type: 'desk' },
  // Pod B — Design cluster
  { id: 'desk-o2-1', x: 180, y: 450, width: 180, height: 70, type: 'desk' },
  { id: 'desk-o2-2', x: 400, y: 470, width: 180, height: 70, type: 'desk' },
  { id: 'desk-o2-3', x: 220, y: 610, width: 180, height: 70, type: 'desk' },
  // Workspace Pod C
  { id: 'desk-w3-1', x: 180, y: 830, width: 180, height: 70, type: 'desk' },
  { id: 'desk-w3-2', x: 400, y: 810, width: 180, height: 70, type: 'desk' },
  { id: 'desk-w3-3', x: 280, y: 970, width: 180, height: 70, type: 'desk' },
  // Workspace Pod D
  { id: 'desk-w4-1', x: 160, y: 1100, width: 180, height: 70, type: 'desk' },
  { id: 'desk-w4-2', x: 400, y: 1080, width: 180, height: 70, type: 'desk' },
  // Meeting table
  { id: 'meeting-table', x: 1290, y: 900, width: 340, height: 200, type: 'table' },
  // AI Labs
  { id: 'server-1', x: 1160, y: 80, width: 70, height: 180, type: 'server' },
  { id: 'server-2', x: 1160, y: 340, width: 70, height: 180, type: 'server' },
  { id: 'server-3', x: 1160, y: 580, width: 70, height: 180, type: 'server' },
  { id: 'desk-ai-1', x: 1400, y: 120, width: 160, height: 70, type: 'desk' },
  { id: 'desk-ai-2', x: 1650, y: 120, width: 160, height: 70, type: 'desk' },
  { id: 'desk-ai-3', x: 1400, y: 460, width: 160, height: 70, type: 'desk' },
  { id: 'desk-ai-4', x: 1650, y: 460, width: 160, height: 70, type: 'desk' },
];

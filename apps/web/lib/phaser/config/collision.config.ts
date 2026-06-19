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
  { id: 'wall-horizontal-1', x: 0, y: 720, width: 1000, height: 16 },
  { id: 'wall-horizontal-2', x: 1100, y: 720, width: 220, height: 16 },
  { id: 'wall-vertical-top', x: 1100, y: 0, width: 16, height: 290 },
  { id: 'wall-vertical-bottom', x: 1100, y: 410, width: 16, height: 760 },
  { id: 'meeting-top-left', x: 1150, y: 800, width: 200, height: 14 },
  { id: 'meeting-top-right', x: 1450, y: 800, width: 300, height: 14 },
  { id: 'meeting-left', x: 1150, y: 800, width: 14, height: 520 },
  { id: 'meeting-bottom', x: 1150, y: 1306, width: 600, height: 14 },
  { id: 'meeting-right', x: 1736, y: 800, width: 14, height: 520 },
];

export const FurnitureCollisions: CollisionRect[] = [
  { id: 'desk-o1-1', x: 160, y: 180, width: 180, height: 70, type: 'desk' },
  { id: 'desk-o1-2', x: 380, y: 180, width: 180, height: 70, type: 'desk' },
  { id: 'desk-o1-3', x: 600, y: 180, width: 180, height: 70, type: 'desk' },
  { id: 'desk-o2-1', x: 160, y: 460, width: 180, height: 70, type: 'desk' },
  { id: 'desk-o2-2', x: 380, y: 460, width: 180, height: 70, type: 'desk' },
  { id: 'desk-o2-3', x: 600, y: 460, width: 180, height: 70, type: 'desk' },
  { id: 'desk-w3-1', x: 160, y: 800, width: 180, height: 70, type: 'desk' },
  { id: 'desk-w3-2', x: 380, y: 800, width: 180, height: 70, type: 'desk' },
  { id: 'desk-w3-3', x: 600, y: 800, width: 180, height: 70, type: 'desk' },
  { id: 'desk-w4-1', x: 160, y: 1020, width: 180, height: 70, type: 'desk' },
  { id: 'desk-w4-2', x: 380, y: 1020, width: 180, height: 70, type: 'desk' },
  { id: 'meeting-table', x: 1290, y: 900, width: 340, height: 200, type: 'table' },
  { id: 'server-1', x: 1160, y: 80, width: 70, height: 180, type: 'server' },
  { id: 'server-2', x: 1160, y: 340, width: 70, height: 180, type: 'server' },
  { id: 'server-3', x: 1160, y: 580, width: 70, height: 180, type: 'server' },
  { id: 'desk-ai-1', x: 1400, y: 120, width: 160, height: 70, type: 'desk' },
  { id: 'desk-ai-2', x: 1650, y: 120, width: 160, height: 70, type: 'desk' },
  { id: 'desk-ai-3', x: 1400, y: 460, width: 160, height: 70, type: 'desk' },
  { id: 'desk-ai-4', x: 1650, y: 460, width: 160, height: 70, type: 'desk' },
];

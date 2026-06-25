export interface PlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
}

export enum PlayerAction {
  MOVE_PLAYER = 'MOVE_PLAYER',
  PLAYER_JOINED = 'PLAYER_JOINED',
  PLAYER_LEFT = 'PLAYER_LEFT',
  PLAYER_UPDATED = 'PLAYER_UPDATED',
}

export interface MovePlayerPayload {
  id: string;
  x: number;
  y: number;
}

// ── Space WebSocket types ──

export interface SpaceUser {
  userId: string;
  username: string;
  position: { x: number; y: number };
  color: string;
}

// Server → Client events
export type ServerEvent =
  | { type: 'SPACE_STATE'; users: SpaceUser[]; chatHistory: any[] }
  | { type: 'USER_JOINED'; user: SpaceUser; onlineCount: number }
  | { type: 'USER_LEFT'; userId: string; onlineCount: number }
  | { type: 'PLAYER_MOVED'; userId: string; position: { x: number; y: number } }
  | { type: 'SPACE_PRESENCE_UPDATED'; onlineCount: number }
  | { type: 'CHAT'; workSpaceId: string; userId: string; chatMessage: string; timestamp: number; username: string; color: string }
  | { type: 'INFO'; message: string; activeUsers?: number }
  | { type: 'PONG' }
  | { type: 'ERROR'; message: string };

// Client → Server events
export type ClientEvent =
  | { type: 'SPACE_JOIN'; userId: string; organizationId: string; workspaceId: string; spaceId: string }
  | { type: 'SPACE_LEAVE' }
  | { type: 'PLAYER_MOVE'; payload: { x: number; y: number } }
  | { type: 'CHAT'; payload: { chatMessage: string } }
  | { type: 'PING' };

// Color palette for remote player avatars (matches backend AVATAR_COLORS)
export const AVATAR_COLORS_HEX = [
  0xd06858, // coral
  0x4a70c0, // blue
  0x5a9060, // green
  0x9070b0, // purple
  0xc09030, // amber
  0x708898, // slate
];

export function hexColorToNumber(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

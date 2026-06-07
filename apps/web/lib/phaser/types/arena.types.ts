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

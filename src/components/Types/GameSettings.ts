import type { Player } from "./Player";

export interface GameSettings {
  players: [Player, Player];
  rows: number;
  columns: number;
  playStartingPieces: number;
}

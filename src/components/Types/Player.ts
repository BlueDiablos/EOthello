interface GridPosition {
  posX: number;
  posY: number;
}

export interface Player {
  number: number;
  colorPiece: string;
  goesFirst: boolean;
  pieceCount: number;
  hasTurn: boolean;
  startingIndices: GridPosition[];
  isWinner: boolean;
}

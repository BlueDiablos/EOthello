interface GridPosition {
  posX: number;
  posY: number;
}

export interface Player {
  id: number;
  colorPiece: string;
  goesFirst: boolean;
  pieceCount: number;
  hasTurn: boolean;
  startingIndices: GridPosition[];
  isWinner: boolean;
  hasValidMove: boolean;
  isBot: false;
}

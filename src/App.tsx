import { useState } from "react";
import "./App.css";
import Board from "./components/Game/Board";
import Header from "./components/App/Header";
import BoardPieceColor from "./components/Types/BoardPieceColor";
import type { GameSettings } from "./components/Types/GameSettings";

function App() {
  //default game settings - to be expanded with the setting component for user driven game settings
  const [gameSettings, setGameSettings] = useState<GameSettings>(() => {
    return {
      players: [
        {
          id: 1,
          colorPiece: BoardPieceColor.BLACK,
          goesFirst: true,
          hasTurn: true,
          isWinner: false,
          hasValidMove: true,
          pieceCount: 2,
          isBot: false,
          startingIndices: [
            { posX: 3, posY: 4 },
            { posX: 4, posY: 3 },
          ],
        },
        {
          id: 2,
          colorPiece: BoardPieceColor.WHITE,
          goesFirst: false,
          hasTurn: false,
          hasValidMove: true,
          isWinner: false,
          pieceCount: 2,
          isBot: false,
          startingIndices: [
            { posX: 3, posY: 3 },
            { posX: 4, posY: 4 },
          ],
        },
      ],
      rows: 8,
      columns: 8,
    };
  });

  return (
    <>
      <Header />
      <Board
        players={gameSettings.players}
        rows={gameSettings.rows}
        columns={gameSettings.columns}
      />
    </>
  );
}

export default App;

import { useState } from "react";
import GameStats from "./GameStats";
import type { GridElement } from "../Types/GridElement";
import type { GameSettings } from "../Types/GameSettings";
import SvgCircle from "../App/SvgCircle.tsx";
import type { Player } from "../Types/Player";

function Board(settings: GameSettings) {
  const rows = settings.rows;
  const cols = settings.columns;

  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(() => {
    return settings.players.find((player) => player.goesFirst);
  });

  const [opponent, setOpponent] = useState<Player | undefined>(() => {
    return settings.players.find((player) => !player.goesFirst);
  });

  const [gridData, setGridData] = useState<GridElement[][]>(() => {
    const initialGrid: GridElement[][] = [];

    for (let i = 0; i < rows; i++) {
      initialGrid[i] = [];
      for (let j = 0; j < cols; j++) {
        initialGrid[i][j] = { hasElement: false, canBeSelected: false };
      }
    }

    setInitialGamePieces(initialGrid);

    return initialGrid;
  });

  function setInitialGamePieces(initialGrid: GridElement[][]) {
    for (const player of settings.players) {
      for (const startingPositions of player.startingIndices) {
        initialGrid[startingPositions.posX][startingPositions.posY] = {
          hasElement: true,
          canBeSelected: false,
          color: player.colorPiece,
        };
      }
    }
  }

  //a 2d array of numbers that define the direction on the grid we need to navigate
  function getDirections(): number[][] {
    return [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
  }

  function isGridPositionAValidMove(
    currentRow: number,
    currentCol: number,
  ): boolean {
    const currentElement = gridData[currentRow][currentCol];
    if (currentElement.hasElement) {
      return false;
    }

    for (const [directionX, directionY] of getDirections()) {
      let x = currentRow + directionX;
      let y = currentCol + directionY;
      let foundOpponentColor = false;
      const gridLength = gridData.length;

      while (x >= 0 && x < gridLength && y >= 0 && y < gridLength) {
        const cell = gridData[x][y];
        if (cell.color === opponent?.colorPiece) {
          foundOpponentColor = true;
        } else if (
          cell.color === currentPlayer?.colorPiece &&
          foundOpponentColor
        ) {
          return true;
        } else {
          break;
        }

        x += directionX;
        y += directionY;
      }
    }

    return false;
  }

  function isDirectionOnGridValid(posX: number, posY: number): boolean {
    if (
      posX >= 0 &&
      posX < gridData.length &&
      posY >= 0 &&
      posY < gridData.length
    ) {
      const currentCell = gridData[posX][posY];

      if (currentCell.color === null || currentCell.color === undefined) {
        return false;
      }

      if (currentCell.color === currentPlayer?.colorPiece) {
        return false;
      }
    }

    return true;
  }

  function flipOpponentElements(currentRow: number, currentCol: number) {
    for (const [directionX, directionY] of getDirections()) {
      let x = currentRow + directionX;
      let y = currentCol + directionY;
      const gridLength = gridData.length;

      if (!isDirectionOnGridValid(x, y)) {
        continue;
      }

      for (const validCell of searchForValidCells()) {
        validCell.color = currentPlayer?.colorPiece;
        //reduce the oppponenets piece count for each flipped piece and increase the current players count
        opponent!.pieceCount--;
        currentPlayer!.pieceCount++;
      }

      function searchForValidCells(): GridElement[] {
        const cellsToFlip = [];

        while (x >= 0 && x < gridLength && y >= 0 && y < gridLength) {
          const cell = gridData[x][y];

          if (cell.color === undefined || cell.color === null) {
            return [];
          }

          if (
            cell.color === currentPlayer?.colorPiece &&
            cellsToFlip.length > 0
          ) {
            return cellsToFlip;
          }

          if (cell.color === opponent?.colorPiece) {
            cellsToFlip.push(cell);
          }

          x += directionX;
          y += directionY;
        }

        return [];
      }
    }
  }

  function handleUpdate(row: number, column: number) {
    const cell = gridData[row][column];

    //the cell might have once been available for selection, but now contains an element and should be skipped
    if (cell.hasElement) {
      return;
    }

    if (cell.canBeSelected) {
      cell.color = currentPlayer?.colorPiece;
      cell.hasElement = true;
      currentPlayer!.pieceCount++;

      //search fnd flip the elements on the grid that should be flipped to the current players color
      flipOpponentElements(row, column);

      //update grid elements and rerender
      setGridData(gridData);
      switchPlayers();
    }
  }

  function switchPlayers() {
    const newCurrentPlayer = opponent;
    const newOpponent = currentPlayer;

    newCurrentPlayer!.hasTurn = true;
    newOpponent!.hasTurn = false;

    setOpponent(newOpponent);
    setCurrentPlayer(newCurrentPlayer);
  }

  return (
    <div>
      <GameStats players={settings.players} />
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, colIndex) => (
            <div
              key={`grid-element-${rowIndex}-${colIndex}`}
              style={{
                width: 90,
                height: 90,
                border: "0.5px solid black",
                padding: "10px",
                background: "#00bc8c",
              }}
            >
              <div
                key={`cell-element-${rowIndex}-${colIndex}`}
                style={{ width: 45, height: 45, padding: "-10px" }}
                onClick={() => handleUpdate(rowIndex, colIndex)}
              >
                {cell.hasElement ? SvgCircle(cell.color) : <></>}

                {
                  (cell.canBeSelected = isGridPositionAValidMove(
                    rowIndex,
                    colIndex,
                  ))
                }

                {cell.canBeSelected ? SvgCircle("#00bc8c") : <></>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;

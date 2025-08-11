import { useState } from "react";
import type { GridElement } from "../Types/GridElement";
import BoardPieceColor from "../Types/BoardPieceColor";
import SvgCircle from "./SvgCircle";
import type { Player } from "../Types/Player";

interface GameProperties {
  Players: [Player, Player];
  Rows: number;
  Columns: number;
}

function Board(settings: GameProperties) {
  const rows = settings.Rows;
  const cols = settings.Columns;

  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(() => {
    return settings.Players.find((player) => player.goesFirst);
  });

  const [opponent, setOpponent] = useState<Player | undefined>(() => {
    return settings.Players.find((player) => !player.goesFirst);
  });

  const [gridData, setGridData] = useState<GridElement[][]>(() => {
    const initialGrid: GridElement[][] = [];

    for (let i = 0; i < rows; i++) {
      initialGrid[i] = [];
      for (let j = 0; j < cols; j++) {
        initialGrid[i][j] = isPositionOnGridStartingPoint(i, j);
      }
    }

    return initialGrid;
  });

  function isPositionOnGridStartingPoint(x: number, y: number): GridElement {
    const rowMiddle = Math.ceil(rows / 2);
    const colMiddle = Math.ceil(cols / 2);

    if (x === rowMiddle && y === colMiddle) {
      return {
        HasElement: true,
        CanBeSelected: false,
        Color: BoardPieceColor.WHITE,
      };
    }
    if (x === rowMiddle - 1 && y === colMiddle - 1) {
      return {
        HasElement: true,
        CanBeSelected: false,
        Color: BoardPieceColor.WHITE,
      };
    }
    if (x === rowMiddle && y === colMiddle - 1) {
      return {
        HasElement: true,
        CanBeSelected: false,
        Color: BoardPieceColor.BLACK,
      };
    }
    if (x === rowMiddle - 1 && y === colMiddle) {
      return {
        HasElement: true,
        CanBeSelected: false,
        Color: BoardPieceColor.BLACK,
      };
    }

    return {
      HasElement: false,
      CanBeSelected: false,
    };
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
    if (currentElement.HasElement) {
      return false;
    }

    for (const [directionX, directionY] of getDirections()) {
      let x = currentRow + directionX;
      let y = currentCol + directionY;
      let foundOpponentColor = false;
      const gridLength = gridData.length;

      while (x >= 0 && x < gridLength && y >= 0 && y < gridLength) {
        const cell = gridData[x][y];
        if (cell.Color === opponent?.colorPiece) {
          foundOpponentColor = true;
        } else if (
          cell.Color === currentPlayer?.colorPiece &&
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

      if (currentCell.Color === null || currentCell.Color === undefined) {
        return false;
      }

      if (currentCell.Color === currentPlayer?.colorPiece) {
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
        validCell.Color = currentPlayer?.colorPiece;
      }

      function searchForValidCells(): GridElement[] {
        const cellsToFlip = [];

        while (x >= 0 && x < gridLength && y >= 0 && y < gridLength) {
          const cell = gridData[x][y];

          if (cell.Color === undefined || cell.Color === null) {
            return [];
          }

          if (
            cell.Color === currentPlayer?.colorPiece &&
            cellsToFlip.length > 0
          ) {
            return cellsToFlip;
          }

          if (cell.Color === opponent?.colorPiece) {
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
    if (cell.HasElement) {
      return;
    }

    if (cell.CanBeSelected) {
      cell.Color = currentPlayer?.colorPiece;
      cell.HasElement = true;

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

    setOpponent(newOpponent);
    setCurrentPlayer(newCurrentPlayer);
  }

  return (
    <div>
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
                {cell.HasElement ? SvgCircle(cell.Color) : <></>}

                {
                  (cell.CanBeSelected = isGridPositionAValidMove(
                    rowIndex,
                    colIndex,
                  ))
                }

                {cell.CanBeSelected ? SvgCircle("#00bc8c") : <></>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;

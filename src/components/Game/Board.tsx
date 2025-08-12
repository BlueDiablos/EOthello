import { useEffect, useState } from "react";
import GameStats from "./GameStats";
import type { GridElement } from "../Types/GridElement";
import type { GameSettings } from "../Types/GameSettings";
import SvgCircle from "../App/SvgCircle.tsx";
import type { Player } from "../Types/Player";
import Modal from "../App/Modal.tsx";

function Board(settings: GameSettings) {
  const rows = settings.rows;
  const cols = settings.columns;
  useEffect(() => {
    if (isGameOver() || isInitialStart()) {
      return;
    }

    //if the game is not over but the current player has no possible moves, switch the turn
    if (!currentPlayer?.hasValidMove) {
      switchTurn();
    } else {
      //since this happens after we render we want to reset the currentPlayers valid move state
      //where it will be reevaluated when we re-render
      currentPlayer.hasValidMove = false;
    }
  });

  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(() => {
    return settings.players.find((player) => player.goesFirst);
  });

  const [opponent, setOpponent] = useState<Player | undefined>(() => {
    return settings.players.find((player) => !player.goesFirst);
  });

  //populate the grid
  const [gameBoard, setGameBoard] = useState<GridElement[][]>(() => {
    const grid = createInitialGameBoard();
    setInitialGamePieces(grid);

    return grid;
  });

  function createInitialGameBoard(): GridElement[][] {
    const initialGrid: GridElement[][] = [];

    for (let i = 0; i < rows; i++) {
      initialGrid[i] = [];
      for (let j = 0; j < cols; j++) {
        initialGrid[i][j] = {
          hasElement: false,
          canBeSelected: false,
          posX: i,
          posY: j,
        };
      }
    }

    return initialGrid;
  }

  function setInitialGamePieces(initialGrid: GridElement[][]) {
    for (const player of settings.players) {
      for (const startingPositions of player.startingIndices) {
        initialGrid[startingPositions.posX][startingPositions.posY] = {
          hasElement: true,
          canBeSelected: false,
          color: player.colorPiece,
          posX: startingPositions.posX,
          posY: startingPositions.posY,
        };
      }
    }
  }

  function isInitialStart() {
    return (
      currentPlayer?.pieceCount === currentPlayer?.startingIndices.length &&
      opponent?.pieceCount === opponent?.startingIndices.length
    );
  }

  //game is over once the total collective piece count is that of the total available cells on the grid or both players no longer have moves
  function isGameOver() {
    if (currentPlayer!.pieceCount + opponent!.pieceCount === rows * cols) {
      return true;
    }

    if (
      !isInitialStart() &&
      !opponent?.hasValidMove &&
      !currentPlayer?.hasValidMove
    ) {
      return true;
    }
  }

  function getWinningMessage(): string {
    if (currentPlayer!.pieceCount > opponent!.pieceCount) {
      return currentPlayer!.colorPiece + " Wins!";
    } else if (opponent!.pieceCount > currentPlayer!.pieceCount) {
      return opponent!.colorPiece + " Wins!";
    } else {
      return "Draw!";
    }
  }

  //a 2d array of numbers that define the direction on the grid we need to navigate (up/down/left/right on y and x axis)
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

  //starts at the given row and column on the grid and moves in all directions until a valid cell is found.
  function isGridPositionAValidMove(
    currentRow: number,
    currentCol: number,
  ): boolean {
    const currentElement = gameBoard[currentRow][currentCol];
    if (currentElement.hasElement) {
      return false;
    }

    for (const [directionX, directionY] of getDirections()) {
      let x = currentRow + directionX;
      let y = currentCol + directionY;
      let foundOpponentColor = false;
      const gridLength = gameBoard.length;

      while (x >= 0 && x < gridLength && y >= 0 && y < gridLength) {
        const cell = gameBoard[x][y];
        if (cell.color === opponent?.colorPiece) {
          foundOpponentColor = true;
        } else if (
          cell.color === currentPlayer?.colorPiece &&
          foundOpponentColor
        ) {
          currentPlayer!.hasValidMove = true;
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

  //early exit condition if the cell has no piece on it or is of the same color of the current player
  function isDirectionOnGridValid(posX: number, posY: number): boolean {
    if (
      posX >= 0 &&
      posX < gameBoard.length &&
      posY >= 0 &&
      posY < gameBoard.length
    ) {
      const currentCell = gameBoard[posX][posY];

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
      const gridLength = gameBoard.length;

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
          const cell = gameBoard[x][y];

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

  function handlePlayerSelect(cell: GridElement) {
    //the cell might have once been available for selection, but now contains an element and should be skipped
    if (cell.hasElement) {
      return;
    }

    if (cell.canBeSelected) {
      cell.color = currentPlayer?.colorPiece;
      cell.hasElement = true;
      currentPlayer!.pieceCount++;

      //search fnd flip the elements on the grid that should be flipped to the current players color
      flipOpponentElements(cell.posX, cell.posY);

      //update grid elements and rerender
      setGameBoard(gameBoard);
      switchTurn();
    }
  }

  function switchTurn() {
    const newCurrentPlayer = opponent;
    const newOpponent = currentPlayer;

    newCurrentPlayer!.hasTurn = true;
    newOpponent!.hasTurn = false;

    setOpponent(newOpponent);
    setCurrentPlayer(newCurrentPlayer);
  }

  function resetGame(): boolean {
    for (const player of settings.players) {
      player.pieceCount = player.startingIndices.length;

      if (player.goesFirst) {
        setCurrentPlayer(player);
      }
    }

    const grid = createInitialGameBoard();
    setInitialGamePieces(grid);
    setGameBoard(grid);
    return true;
  }

  return (
    <div>
      <GameStats players={settings.players} />

      {isGameOver() && (
        <Modal
          isOpen={true}
          onClose={resetGame}
          children={<h1>{getWinningMessage()}</h1>}
        ></Modal>
      )}

      {gameBoard.map((row, rowIndex) => (
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
                onClick={() =>
                  handlePlayerSelect(gameBoard[rowIndex][colIndex])
                }
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

# A simple clone of the online game Othello

### To get started

```bash
npm install
npm run
```

visit: <http://localhost:5173/>

# How To Play

- Othello is a strategy board game for two players (Black and White), played on an 8 by 8 board. The game traditionally begins with four discs placed in the middle of the board. Black moves first.

- Black or white must place a black disc on the board, in such a way that there is at least one straight (horizontal, vertical, or diagonal) occupied line between the new disc and another black disc, with one or more contiguous white pieces between them.

- After placing the disc, the player flips all the opposing players discs lying on a straight line between the new disc and any existing black discs. All flipped discs are now the current players discs.

- Players alternate taking turns. If a player does not have any valid moves, the play passes back to the other player. When neither player can move, the game ends. A game of Othello may end before the board is completely filled.

- The player with the most discs on the board wins.

# Thoughts/Ideas

### Initial Thoughts

- Create a 2d array of some type that holds cell state
- Populate the initial array with empty values and the players initial starting indices
- Draw the grid
- When rendering the grid check for "valid" moves, this condition will drive which cells render an unfilled SVG
- All cells will have a clickable event, during this event have early exit conditions for cells that have elements or cells that are not valid selections at the moment
- If the cell is valid, starting at the given row and column search the grid in each direction for pieces that should be flipped
- Ensure there are good early exit conditions to avoid wasting compute

### Some Ideas

- I wanted the initial solution to be implemented in a way that drives a lot of the board state from property values belonging to various types (Settings/Player). This should allow us to easily use the settings component (not fully implemented) to drive various game changes such as:
- The players piece color(s) (you can change this in code now)
- What player starts first, (this can be changed in code - see 'playerGoesFirst')
- Where the players pieces are initially placed on the board (this can be changed in code - see 'startingIndices')
- The overall board size.
- Grid color could also easily be added to the settings type and replace the hard coded color on Board.tsx
- We could also extend with relatively low effort, what shape the pieces should be. At the moment its just a SVG circle but we could add "Player piece" to the settings type and select which piece gets rendered by matching the settings player piece to the players number.
- Something that wasn't implemented that I was thinking of would be to extend the player type or add new types that allow us to set/create new rules for the game. IE Player 1 has a "handicap" and gets an extra move somewhere in the game, or at all times, and we could easily add logic to the function switchTurns() that could account for this.


# Escape the Maze - Game Development Documentation

## Overview
Escape the Maze is a browser game where the player navigates a maze to reach the exit while discovering hidden treasures, teleporting to random locations, collecting hints, leveling up, and enjoying background music and sound effects.

## New Features
- **Teleport Point**: A new teleport point (CellType 9) is introduced. When players enter this cell, they are randomly transported to another location in the maze.
- **Leveling and Power-up Mechanics**: Players can now gain experience points (EXP). Upon reaching certain levels, the player's `maxLife` increases by 1, allowing them to survive longer.
- **MaxLife Limitation**: Players cannot exceed the maximum life defined by their current level, encouraging them to level up strategically.

## Game Components

### 1. Teleportation Mechanic
- The maze introduces random teleport points where players are moved to a random location within the maze when they step into a teleport cell.

### 2. Leveling and Power-ups
- Players gain experience points as they progress through the game.
- The `levelExp` array defines how much EXP is needed to level up. For example:
  - Level 1 requires 500 EXP
  - Level 2 requires 1000 EXP
  - And so on...
- With each new level, `maxLife` increases by 1.

### 3. CellType
The maze is made up of different types of cells. Each cell is represented by a number indicating its type:
- `0`: Empty space.
- `1`: Entrance point.
- `2`: Exit point.
- `3`: Fixed wall.
- `4`: Horizontal movable wall.
- `5`: Vertical movable wall.
- `6`: Horizontal empty space.
- `7`: Vertical empty space.
- `8`: Hidden treasure.
- `9`: **Teleport place** (new).

### 4. CellState
Each cell in the maze has a state that includes:
- `type`: The type of the cell (as listed above).
- `hit`: A boolean indicating if the cell has been hit (used for hidden walls).
- `style`: An object specifying the width, height, and color of the cell.
- `tips`: A number representing the clue or hint provided by the cell.

### 5. GameStatus
The game has four main statuses:
- `0`: Not started.
- `1`: In progress.
- `2`: Game over.
- `3`: Player wins.

### 6. Hidden Treasure and Dead Ends
- **hiddenTreasure**: Tracks the position of hidden treasures in the maze.
- **teleportPlace**: Tracks the teleportation points.
- **deadEnd**: Represents a new type of cell that leads the player to a dead end, adding complexity to the maze.

## Game Initialization

### Maze Generation
The game generates a random maze using the `generateValidMaze` function. This function ensures that the maze has an entrance and an exit, and also places walls, treasures, teleport points, and dead ends while ensuring the maze is solvable.

### Maze Rendering
The maze is rendered as a grid of cells. Each cell has a specific width, height, and background color depending on its type. The player's position is rendered using the player's coordinates (`x`, `y`).

### Player State
The player's state is tracked with the following variables:
- `playerPosition`: The current coordinates of the player in the maze.
- `playerHP`: The player's health points, which decrease when the player hits hidden walls.
- `maxLife`: Defines the maximum health points a player can have, which increases as they level up.
- `steps`: The number of steps the player has taken.
- `hiddenTreasure`, `teleportPlace`, and `deadEnd`: Track the positions of these important features in the maze.

## Player Movement
Player movement is controlled by directional buttons (up, down, left, right). The movement logic checks if the player can move to the next cell based on the cell type and updates the player's position accordingly.

If the player moves into a cell with a hidden wall, their HP decreases. If the player's HP reaches zero, the game ends.

## Conclusion
Escape the Maze is a dynamic, fun game with new features that include treasure hunting, teleportation mechanics, leveling, and power-ups. The game is developed using modern frontend technologies like React, TypeScript, and Tailwind CSS for fast development and scalability.

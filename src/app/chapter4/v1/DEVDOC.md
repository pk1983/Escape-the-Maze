
# Escape the Maze - Game Development Documentation

## Overview
Escape the Maze is a browser game where the player navigates a maze to reach the exit while discovering hidden treasures, collecting hints, and enjoying background music and sound effects to enrich the experience.

## New Features
- **Sound Effects**: Background music and sound effects have been added to enhance the atmosphere of the game. These sounds are sourced from [WeLoveIndies](https://www.weloveindies.com/).
- **Hidden Treasures**: A new feature where treasures are hidden within the maze, represented by a new cell type (type 8).
- **Tips System**: Cells now have a `tips` attribute to provide hints to the player as they explore the maze.
- **Treasure Unlocking**: Players can unlock hidden treasures while exploring the maze.

## Game Components

### 1. Sound Integration
Sound effects and background music are integrated into the game using the browser's native audio capabilities. Sounds are triggered during specific game events (such as moving through the maze or encountering treasures).

### 2. CellType
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

### 3. CellState
Each cell in the maze has a state that includes:
- `type`: The type of the cell (as listed above).
- `hit`: A boolean indicating if the cell has been hit (used for hidden walls).
- `style`: An object specifying the width, height, and color of the cell.
- `tips`: A number representing the clue or hint provided by the cell.

### 4. GameStatus
The game has four main statuses:
- `0`: Not started.
- `1`: In progress.
- `2`: Game over.
- `3`: Player wins.

### 5. Hidden Treasure
- `hiddenTreasure`: Tracks the position of hidden treasures in the maze.
- `unlockTreasure`: A boolean flag indicating whether the treasure has been unlocked by the player.

## Game Initialization

### Maze Generation
The game generates a random maze using the `generateValidMaze` function. This function ensures that the maze has an entrance and an exit, and also places walls and treasures randomly while ensuring the maze is solvable.

### Maze Rendering
The maze is rendered as a grid of cells. Each cell has a specific width, height, and background color depending on its type. The player's position is rendered using the player's coordinates (`x`, `y`).

### Player State
The player's state is tracked with the following variables:
- `playerPosition`: The current coordinates of the player in the maze.
- `playerHP`: The player's health points, which decrease when the player hits hidden walls.
- `steps`: The number of steps the player has taken.
- `hiddenTreasure`: Tracks the position of hidden treasures.
- `unlockTreasure`: Indicates whether the treasure has been unlocked.

## Player Movement
Player movement is controlled by directional buttons (up, down, left, right). The movement logic checks if the player can move to the next cell based on the cell type and updates the player's position accordingly.

If the player moves into a cell with a hidden wall, their HP decreases. If the player's HP reaches zero, the game ends.

## Conclusion
Escape the Maze is a dynamic, fun game with new features that include treasure hunting mechanics and immersive sound effects. The game is developed using modern frontend technologies like React, TypeScript, and Tailwind CSS for fast development and scalability.

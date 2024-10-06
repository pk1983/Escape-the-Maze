
# Escape the Maze - Game Development Documentation

## Overview
Escape the Maze is a simple browser game where the player navigates a maze to reach the exit. The game features dynamic maze generation and player movement control. This document explains the technical aspects of the game's development, including the game logic, component structure, and key features.

## Game Components

### 1. CellType
The maze is made up of different types of cells. Each cell is represented by a number indicating its type:
- `0`: Empty space.
- `1`: Entrance point.
- `2`: Exit point.
- `3`: Fixed wall.
- `4`: Horizontal movable wall.
- `5`: Vertical movable wall.
- `6`: Horizontal empty space.
- `7`: Vertical empty space.

### 2. CellState
Each cell in the maze has a state that includes:
- `type`: The type of the cell (as listed above).
- `hit`: A boolean indicating if the cell has been hit (used for hidden walls).
- `style`: An object specifying the width, height, and color of the cell.

### 3. GameStatus
The game has four main statuses:
- `0`: Not started.
- `1`: In progress.
- `2`: Game over.
- `3`: Player wins.

## Game Initialization

### Maze Generation
The game generates a random maze using the `generateValidMaze` function. This function ensures that the maze has an entrance and an exit. It also randomly places walls within the maze, while ensuring the maze is still solvable.

The entrance is always placed at the top-left corner, and the exit is placed at the bottom-right corner.

### Maze Rendering
The maze is rendered as a grid of cells. Each cell has a specific width, height, and background color depending on its type. The player's position is rendered using the player's coordinates (`x`, `y`).

### Player State
The player's state is tracked with the following variables:
- `playerPosition`: The current coordinates of the player in the maze.
- `playerHP`: The player's health points, which decrease when the player hits hidden walls.
- `steps`: The number of steps the player has taken.
- `hiddenWalls`: The number of hidden walls in the maze.

## Player Movement
Player movement is controlled by directional buttons (up, down, left, right). The movement logic checks if the player can move to the next cell based on the cell type and updates the player's position accordingly.

If the player moves into a cell with a hidden wall, their HP decreases. If the player's HP reaches zero, the game ends.

## Game Logic

### Win Condition
The player wins when they reach the exit point of the maze.

### Lose Condition
The player loses if their HP drops to zero before reaching the exit.

### Scoring
The player's score is calculated based on the number of steps taken. A lower number of steps results in a higher score.

## UI Components

### Maze Grid
The maze is displayed as a grid of div elements, where each div represents a cell. The cell's size and color are determined by its `type` and `style`.

### Player Controls
The player's movement is controlled by arrow buttons rendered on the screen. Each button triggers a function that updates the player's position based on the current direction.

## Conclusion
Escape the Maze is a lightweight and fun game designed to be easy to play yet challenging with the randomly generated maze. The game is developed using modern frontend technologies like React, TypeScript, and Tailwind CSS for fast development and scalability.

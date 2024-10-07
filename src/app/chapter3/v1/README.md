
# Escape the Maze

Escape the Maze is a browser-based game built using React, TypeScript, and Tailwind CSS. The objective of the game is to navigate a player through a randomly generated maze from the entrance to the exit, while unlocking hidden treasures.

## Game Objective
- Move your player through the maze to reach the exit.
- Unlock hidden treasures and collect hints (represented by tips) to aid in navigation.
- Avoid obstacles and hidden walls that may hinder your movement.
- Track your health points (HP) as you navigate the maze.
- Win when the player reaches the exit point.

## New Features
- **Hidden Treasures**: A new cell type (type 8) that represents hidden treasures within the maze.
- **Tips System**: Cells now include a `tips` attribute to provide hints or clues to the player.
- **Treasure Unlocking**: New gameplay mechanics allow players to unlock hidden treasures as they explore the maze.

## Features
- Randomly generated maze with varying wall positions.
- Player controls using directional buttons (up, down, left, right).
- Health point (HP) system: Lose HP when hitting hidden walls.
- Score calculation based on player steps.
- Treasure hunting mechanics for enhanced gameplay.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pk1983/Escape-the-Maze.git
   ```
2. Navigate to the project directory:
   ```bash
   cd escape-the-maze
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Game

To start the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000/chapter3/v1` to play the game.

## Gameplay Controls

- Use the arrow buttons to move the player.
- Navigate through the maze and avoid hidden walls.
- The player loses HP every time they hit a hidden wall.
- The game ends when the player reaches the exit or loses all HP.

## Technologies Used
- **React**: For building the UI components.
- **TypeScript**: To provide type safety and enhance the development experience.
- **Tailwind CSS**: For easy and responsive styling.

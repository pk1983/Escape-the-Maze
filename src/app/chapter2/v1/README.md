
# Escape the Maze

Escape the Maze is a simple browser-based game built using React, TypeScript, and Tailwind CSS. The objective of the game is to navigate a player through a randomly generated maze from the entrance to the exit.

## Game Objective
- Move your player through the maze to reach the exit.
- Avoid obstacles and hidden walls that may hinder your movement.
- Keep track of your health points (HP) as you navigate the maze.
- You win when the player reaches the exit point.

## Features
- Randomly generated maze with varying wall positions.
- Player controls using directional buttons (up, down, left, right).
- Health point (HP) system: Lose HP when hitting hidden walls.
- Dynamic maze generation with random obstacles.
- Score calculation based on player steps.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pk1983/Escape-the-Maze.git
   ```
2. Navigate to the project directory:
   ```bash
   cd escape-the-maze/src
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
Open your browser and navigate to `http://localhost:3000/chapter2/v1` to play the game.

## Gameplay Controls

- Use the arrow buttons to move the player.
- Navigate through the maze and avoid hidden walls.
- The player loses HP every time they hit a hidden wall.
- The game ends when the player reaches the exit or loses all HP.

## Technologies Used
- **React**: For building the UI components.
- **TypeScript**: To provide type safety and enhance the development experience.
- **Tailwind CSS**: For easy and responsive styling.

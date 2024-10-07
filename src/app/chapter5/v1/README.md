
# Escape the Maze

Escape the Maze is a browser-based game built using React, TypeScript, and Tailwind CSS. The objective of the game is to navigate a player through a randomly generated maze from the entrance to the exit, while unlocking hidden treasures, leveling up, and enjoying immersive audio experiences.

## Game Objective
- Move your player through the maze to reach the exit.
- Unlock hidden treasures, collect tips, and discover teleport points to assist in navigation.
- Level up by gaining experience points (EXP) to increase your max life.
- Avoid obstacles, hidden walls, and dead ends.
- Win when the player reaches the exit point.

## New Features
- **Teleport Point**: A new cell type (type 9) that teleports the player to a random location when entered.
- **Leveling and Power-up Mechanics**: As players gain EXP, their level increases. When leveling up, `maxLife` is increased by 1, which enhances survival chances.
- **Balance Mechanism**: Players can't have more life than their current `maxLife`, encouraging strategic leveling up for better chances of survival.

## Features
- Randomly generated maze with varying wall positions and teleport points.
- Player controls using directional buttons (up, down, left, right).
- Health point (HP) and max life system: Players lose HP when hitting hidden walls but can increase their max life by leveling up.
- Experience (EXP) system to track player progression.
- Score calculation based on player steps and level progression.
- Treasure hunting mechanics for enhanced gameplay.
- Immersive sound effects from [WeLoveIndies](https://www.weloveindies.com/).

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
Open your browser and navigate to `http://localhost:3000/chapter5/v1` to play the game.

## Gameplay Controls

- Use the arrow buttons to move the player.
- Navigate through the maze and avoid hidden walls and dead ends.
- Use teleport points to move to random locations.
- The player loses HP every time they hit a hidden wall.
- The game ends when the player reaches the exit or loses all HP.

## Technologies Used
- **React**: For building the UI components.
- **TypeScript**: To provide type safety and enhance the development experience.
- **Tailwind CSS**: For easy and responsive styling.
- **WeLoveIndies Soundtrack**: Background music and sound effects sourced from [WeLoveIndies](https://www.weloveindies.com/).

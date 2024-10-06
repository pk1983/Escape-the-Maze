"use client"

import React, { useState, useEffect } from 'react'

type CellType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7  // 0: empty, 1: entrance, 2: exit, 3: fixed wall, 4: horizontal wall, 5: vertical wall, 6: Horizontal Empty, 7: Vertical Empty
type CellState = {
  type: CellType
  hit: boolean
  style: CellStyle
}
type CellStyle = {
  width: number
  height: number
  color: string
}
type entrance = {
  x: number
  y: number
}
type exit = {
  x: number
  y: number
}

type GameStatus = 0 | 1 | 2 | 3 // 0: Not Started, 1: In Progress, 2: Game Over, 3: You Win

export default function SoloGame() {
  const mazeSize: number = 11
  const totalWalls: number = 20
  const maxPlayerHP: number = 5
  const [maze, setMaze] = useState<CellState[][]>(
      Array(mazeSize)
          .fill(0)
          .map(() =>
              Array(mazeSize).fill(null).map(() => ({
                type: 0,
                hit: false,
                style: { width: 2, height: 2, color: 'white' }
                })))
  )
  const [entrance, setEntrance] = useState<entrance>({ x: 0, y: 0 })
  const [exit, setExit] = useState<exit>({ x: 0, y: 0 })
  const [steps, setSteps] = useState<number>(0)
  const [playerPosition, setPlayerPosition] = useState<{ x: number, y: number }>({ x: 5, y: 5 })
  const [playerHP, setPlayerHP] = useState<number>(maxPlayerHP)
  const [playerWalks, setPlayerWalks] = useState<number>(0)
  const [hiddenWalls, setHiddenWalls] = useState<number>(totalWalls)
  const [playerScore, setPlayerScore] = useState<number>(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>(0)

  // Initialize generate the maze
  useEffect(() => {
    const [newMaze, entrance, exit, steps] = generateValidMaze(mazeSize, totalWalls)
    if (newMaze) {
      // Set all the empty horizontal and vertical walls to type 6 and 7
        for (let i = 0; i < mazeSize; i++) {
          for (let j = 0; j < mazeSize; j++) {
            if (newMaze[i][j].type === 0) {
              // Row is even, column is odd, then vertical empty wall, type 7
              if (i % 2 === 0 && j % 2 === 1) {
                newMaze[i][j].type = 7
                // Set size to 2, 0.5, and color to white
                newMaze[i][j].style = {width: 0.25, height: 2, color: '#e5e7eb'}
              }
              // Row is odd, column is even, then horizontal empty wall, type 6
              if (i % 2 === 1 && j % 2 === 0) {
                newMaze[i][j].type = 6
                // Set size to 0.5, 2, and color to white
                newMaze[i][j].style = {
                  width: 2, height: 0.25, color: '#e5e7eb'
                }
              }
            }
          }
        }
      setMaze(newMaze)
      setPlayerPosition({ x: entrance.x, y: entrance.y })
      setEntrance(entrance)
      setExit(exit)
      setSteps(steps)
      setGameStatus(1)
    }
  }, [])

  const generateMaze = (size: number, entrance: entrance, exit: exit, wall: number): [CellState[][], number] | null => {
    const maze: CellState[][] = Array(size).fill(0).map(() => Array(size).fill(null).map(() => ({ type: 0, hit: false, style: { width: 2, height: 2, color: 'white' } })))

    // Fill the fixed walls - odd row and odd column positions
    for (let i = 1; i < size; i += 2) {
      for (let j = 1; j < size; j += 2) {
        maze[i][j] = { type: 3, hit: true, style: { width: 0.25, height: 0.25, color: 'black' } }
      }
    }
    // Fill the entrance and exit
    maze[entrance.y][entrance.x] = { type: 1, hit: false, style: { width: 2, height: 2, color: 'white' } }
    maze[exit.y][exit.x] = { type: 2, hit: false, style: { width: 2, height: 2, color: 'white' } }

    // Randomly add walls - either horizontal or vertical
    // Fill the horizontal walls - odd row and even column positions
    // Fill the vertical walls - even row and odd column positions
    let wallsAdded = 0
    while (wallsAdded < wall) {
      const x = Math.floor(Math.random() * size)
      const y = Math.floor(Math.random() * size)
      if (x % 2 === 1 && y % 2 === 0) {
        if (maze[y][x].type === 0) {
          maze[y][x] = { type: 4, hit: false, style: { width: 0.25, height: 2, color: '#e5e7eb' } }
          wallsAdded++
        }
      } else if (x % 2 === 0 && y % 2 === 1) {
        if (maze[y][x].type === 0) {
          maze[y][x] = { type: 5, hit: false, style: { width: 2, height: 0.25, color: '#e5e7eb' } }
          wallsAdded++
        }
      }
    }

    // Solve the maze, and get the steps to reach the exit
    const steps = solveMaze(maze, entrance, exit)
    // If the steps < 20, return null, else return the maze and the steps
    return steps < 20 ? null : [maze, steps/2]
  }

  // Generate valid maze, return the maze and the entrance and exit positions and the steps to reach the exit
  const generateValidMaze = (size: number, wall: number): [CellState[][], entrance, exit, number] => {
    const entrance: entrance = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }
    const exit: exit = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }
    // Ensure the entrance and exit are not on odd row or odd column positions
    while (entrance.x % 2 === 1 || entrance.y % 2 === 1) {
      entrance.x = Math.floor(Math.random() * size)
      entrance.y = Math.floor(Math.random() * size)
    }
    while (exit.x % 2 === 1 || exit.y % 2 === 1) {
      exit.x = Math.floor(Math.random() * size)
      exit.y = Math.floor(Math.random() * size)
    }
    // Generate the maze
    const maze = generateMaze(size, entrance, exit, wall)
    return maze ? [maze[0], entrance, exit, maze[1]] : generateValidMaze(size, wall)
  }

  // Solve the maze using BFS algorithm
  const solveMaze = (maze: CellState[][], entrance: entrance, exit: exit): number => {
    const directions = [
      [0, 1],  // right
      [1, 0],  // down
      [0, -1], // left
      [-1, 0], // up
    ];

    const queue = [{ x: entrance.x, y: entrance.y, steps: 0 }]
    const visited = Array.from({ length: maze.length }, () => Array(maze.length).fill(false))
    visited[entrance.y][entrance.x] = true
    while (queue.length > 0) {
      const { x, y, steps } = queue.shift()!
      if (x === exit.x && y === exit.y) {
        return steps
      }
      for (const [dx, dy] of directions) {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < maze.length && ny >= 0 && ny < maze.length && !visited[ny][nx] && maze[ny][nx].type !== 3 && maze[ny][nx].type !== 4 && maze[ny][nx].type !== 5) {
          queue.push({ x: nx, y: ny, steps: steps + 1 })
          visited[ny][nx] = true
        }
      }
    }
    return -1
  }

  const renderCell = (cell: CellState, x: number, y: number): string => {
    if (x === playerPosition.x && y === playerPosition.y && gameStatus !== 3) {
      if (gameStatus === 2) {
        return '💀'
      } else {
        if (gameStatus === 0) {
          // Display the loading icon, if the game is not started
          return '⏳'
        } else {
          return '👾'
        }
      }
    }
    switch (cell.type) {
      case 1: return '🛸' // Entrance, Door
      case 2: return gameStatus === 3 ? '🎉':'💎' // Exit, Pin
      default: return ''
    }
  }

  const movePlayer = (dx: number, dy: number): void => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    const newPlayerX = playerPosition.x + dx * 2;
    const newPlayerY = playerPosition.y + dy * 2;

    // Check boundaries and avoid walls (types 3, 4, 5)
    if (
        newX >= 0 &&
        newX < mazeSize &&
        newY >= 0 &&
        newY < mazeSize &&
        maze[newY][newX].type !== 3 &&
        maze[newY][newX].type !== 4 &&
        maze[newY][newX].type !== 5
    ) {
        setPlayerPosition({ x: newPlayerX, y: newPlayerY });
        setPlayerWalks(playerWalks + 1);
        // Also change the color of the cell, which the player is moving to, to #f9fafb
        // Update the maze
        maze[newPlayerY][newPlayerX].style.color = '#f9fafb'
        setMaze([...maze])
        checkGameStatus(newPlayerX, newPlayerY, playerHP)
    }

    checkHit(newX, newY);
  };

  // Check if the player is hit by the wall, if the wall hit is already hit, do nothing, else reduce the player's HP by 1, and set the wall hit to true
  const checkHit = (x: number, y: number): void => {

    // Check if the move is valid, for example the player is not moving out of the maze
    if (x < 0 || x >= mazeSize || y < 0 || y >= mazeSize) {
      return
    }
    if (maze[y][x].type === 3 || maze[y][x].type === 4 || maze[y][x].type === 5) {
      if (!maze[y][x].hit) {
        setPlayerHP(playerHP - 1)
        maze[y][x].hit = true
        maze[y][x].style.color = 'black'
        // Also reduce the number of hidden walls
        setHiddenWalls(hiddenWalls - 1)
        // Walk + 1
        setPlayerWalks(playerWalks + 1)
        checkGameStatus(x, y, playerHP-1)
      }
    }
  }

  // Check the game status, if the player reaches the exit, display the alert message, You Win, and the number of steps taken
  const checkGameStatus = (x: number, y: number, hp: number): void => {
    let gameEnd = false
    if (hp === 0) {
      alert('Game Over!')
      setGameStatus(2)
      gameEnd = true
    } else if (x === exit.x && y === exit.y) {
      // Calculate the player's score, based on player's remaining HP, and the number of steps taken, and the shortest steps to reach the exit
      // The player's score is the sum of the remaining HP * 100 + difficulty level (shortest steps - player's steps)/shortest steps * 100, then round to the nearest integer
      const score = Math.round((hp * 100 + steps - playerWalks)*(1+steps/100))
      alert(`You Win! Steps: ${steps} - Your Score: ${score}`)
      setPlayerScore(playerScore + 1)
      setGameStatus(3)
      gameEnd = true
    }
    if (gameEnd) {
      // Change all the cell, which type is 4 or 5, and not hit, to purple color
        for (let i = 0; i < mazeSize; i++) {
            for (let j = 0; j < mazeSize; j++) {
            if (maze[i][j].type === 4 || maze[i][j].type === 5) {
                if (!maze[i][j].hit) {
                maze[i][j].style.color = 'red'
                }
            }
            }
        }
    }
  }

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          {/* Display the player's HP, Number of Hidden Walls, Number of Walks and the Shortest steps. All in one row */}
          <div className="flex justify-between w-full">
            <div>💖 {playerHP}</div>
            <div>🔲 {hiddenWalls}</div>
            <div>👣 {playerWalks}</div>
            <div>🏁 {steps}</div>
          </div>
          {/* Display the maze */}
          {/* Dividing line */}
          <hr className="my-4 w-full" />
          {/* Display the maze */}
          <div className="">
            <div className="inline-block border-4 border-black" style={
                {
                    // Set the width to 20px * mazeSize, and height to 20px * mazeSize
                    width: `${273}px`,
                    height: `${273}px`
                }
            }>
              {maze && maze.map((row, y) => (
                  <div key={y} className={`flex c-${y}`} style={
                    {
                      // If y is even, set the height to 10px, else set the height to 40px
                      height: `${y % 2 === 1 ? 5 : 40}px`
                    }
                  }>
                    {row.map((cell, x) => (
                        <div key={`${x}-${y}`} style={{
                          width: `${cell.style.width * 20}px`,
                          height: `${cell.style.height * 20}px`,
                          backgroundColor: cell.style.color
                        }} className="flex items-center justify-center">
                          {renderCell(cell, x, y)}
                        </div>
                    ))}
                    <br/>
                  </div>
              ))}
            </div>
          </div>
          {/* Dividing line */}
          <hr className="my-3 w-full" />
          {/* Only display the player's controller if the game is in progress, gameStatus is 0 or 1. Else, display New Game button */}
          {gameStatus === 0 || gameStatus === 1 ? (
              <div className="grid grid-cols-3 gap-2">
                <button className="col-start-1 col-end-2" disabled={true}></button>
                <button onClick={() => movePlayer(0, -1)} className="col-start-2 col-end-3">
                  ⬆️
                </button>
                <button onClick={() => movePlayer(-1, 0)} className="col-start-1 col-end-2">
                  ⬅️
                </button>
                <button className="col-start-2 col-end-3" disabled={true}>
                  👾
                </button>
                <button onClick={() => movePlayer(1, 0)} className="col-start-3 col-end-4">
                  ➡️
                </button>
                <button onClick={() => movePlayer(0, 1)} className="col-start-2 col-end-3">
                  ⬇️
                </button>
              </div>
          ) : (
              <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
                New Game
              </button>
          )
          }
        </div>
      </div>
  )
}
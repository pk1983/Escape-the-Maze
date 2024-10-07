"use client"

import React, { useState, useEffect } from 'react'
import GameAsset from "@/components/GameAsset";
import PlayerAsset from "@/components/PlayerAsset";

type CellType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9  // 0: empty, 1: entrance, 2: exit, 3: fixed wall, 4: horizontal wall, 5: vertical wall, 6: Horizontal Empty, 7: Vertical Empty, 8: Hidden Treasure, 9: Teleport Place
type CellState = {
    type: CellType
    hit: boolean
    style: CellStyle
    tips: number
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
type hiddenTreasure = {
    x: number
    y: number
}
type teleportPlace = {
    x: number
    y: number
}
type deadEnd = {
    x: number
    y: number
}

type GameStatus = 0 | 1 | 2 | 3 // 0: Not Started, 1: In Progress, 2: Game Over, 3: You Win

export default function SoloGame() {
    const levelExp = [500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000]
    const [level, setLevel] = useState<number>(1)
    const mazeSize: number = 11
    const totalWalls: number = 20
    const maxPlayerHP: number = 4
    const [maxLife, setMaxLife] = useState<number>(3)
    const defaltWallColor: string = '#F0F4BE'
    const [maze, setMaze] = useState<CellState[][]>(
        Array(mazeSize)
            .fill(0)
            .map(() =>
                Array(mazeSize).fill(null).map(() => ({
                    type: 0,
                    hit: false,
                    style: { width: 2, height: 2, color: 'white' },
                    tips: 0
                })))
    )
    const [deadEnds, setDeadEnds] = useState<deadEnd[]>([])
    const [entrance, setEntrance] = useState<entrance>({ x: 0, y: 0 })
    const [exit, setExit] = useState<exit>({ x: 0, y: 0 })
    const [hiddenTreasure, setHiddenTreasure] = useState<hiddenTreasure>({ x: 0, y: 0 })
    const [teleportPlace, setTeleportPlace] = useState<teleportPlace>({ x: 0, y: 0 })
    const [unlockTreasure, setUnlockTreasure] = useState<boolean>(false)
    const [hasTeleport, setHasTeleport] = useState<boolean>(false)
    const [steps, setSteps] = useState<number>(0)
    const [playerPosition, setPlayerPosition] = useState<{ x: number, y: number }>({ x: 5, y: 5 })
    const [playerHP, setPlayerHP] = useState<number>(maxPlayerHP)
    const [playerLife, setPlayerLife] = useState<number>(maxLife)
    const [lifeCost, setLifeCost] = useState<number>(0)
    const [playerWalks, setPlayerWalks] = useState<number>(0)
    const [hiddenWalls, setHiddenWalls] = useState<number>(totalWalls)
    const [playerScore, setPlayerScore] = useState<number>(0)
    const [gameStatus, setGameStatus] = useState<GameStatus>(0)

    // Initialize generate the maze
    useEffect(() => {
    }, [])

    const generateMaze = (size: number, entrance: entrance, exit: exit, hiddenTreasure:hiddenTreasure, teleportPlace:teleportPlace, wall: number): [CellState[][], number] | null => {
        const maze: CellState[][] = Array(size).fill(0).map(() => Array(size).fill(null).map(() => ({ type: 0, hit: false, style: { width: 2, height: 2, color: 'white' }, tips: 0 })))

        // Fill the fixed walls - odd row and odd column positions
        for (let i = 1; i < size; i += 2) {
            for (let j = 1; j < size; j += 2) {
                maze[i][j] = { type: 3, hit: true, style: { width: 0.25, height: 0.25, color: 'black' } , tips:0 }
            }
        }
        // Fill the entrance and exit
        maze[entrance.y][entrance.x] = { type: 1, hit: false, style: { width: 2, height: 2, color: defaltWallColor,}, tips:0 }
        maze[exit.y][exit.x] = { type: 2, hit: false, style: { width: 2, height: 2, color: defaltWallColor}, tips: 0 }
        maze[hiddenTreasure.y][hiddenTreasure.x] = { type: 8, hit: false, style: { width: 2, height: 2, color: 'white'}, tips:0 }
        maze[teleportPlace.y][teleportPlace.x] = { type: 9, hit: false, style: { width: 2, height: 2, color: 'white'}, tips:0 }

        // Randomly add walls - either horizontal or vertical
        // Fill the horizontal walls - odd row and even column positions
        // Fill the vertical walls - even row and odd column positions
        let wallsAdded = 0
        while (wallsAdded < wall) {
            const x = Math.floor(Math.random() * size)
            const y = Math.floor(Math.random() * size)
            if (x % 2 === 1 && y % 2 === 0) {
                if (maze[y][x].type === 0) {
                    maze[y][x] = { type: 4, hit: false, style: { width: 0.25, height: 2, color: defaltWallColor }, tips:0 }
                    wallsAdded++
                }
            } else if (x % 2 === 0 && y % 2 === 1) {
                if (maze[y][x].type === 0) {
                    maze[y][x] = { type: 5, hit: false, style: { width: 2, height: 0.25, color: defaltWallColor }, tips:0 }
                    wallsAdded++
                }
            }
        }

        // Solve the maze, and get the steps to reach the exit
        const steps = solveMaze(maze, entrance, exit)
        // Solve the hidden treasure, and get the steps to reach the hidden treasure
        const treasureSteps = solveMaze(maze, entrance, hiddenTreasure)
        // Both the steps and treasureSteps should be greater than 20, or else regenerate the maze
        let minSteps = 30
        if (gameStatus === 0) {
            minSteps = 20
        }
        if (steps < minSteps || treasureSteps < 20) {
            return null
        } else {
            return [maze, steps/2]
        }
    }

    // Generate valid maze, return the maze and the entrance and exit positions and the steps to reach the exit
    const generateValidMaze = (size: number, wall: number): [CellState[][], entrance, exit, hiddenTreasure, teleportPlace, number] => {
        const entrance: entrance = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }
        const exit: exit = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }
        const hiddenTreasure: hiddenTreasure = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }
        // Ensure the entrance and exit are not on odd row or odd column positions
        while (entrance.x % 2 === 1 || entrance.y % 2 === 1) {
            entrance.x = Math.floor(Math.random() * size)
            entrance.y = Math.floor(Math.random() * size)
        }
        while (exit.x % 2 === 1 || exit.y % 2 === 1 || (exit.x === entrance.x && exit.y === entrance.y)) {
            exit.x = Math.floor(Math.random() * size)
            exit.y = Math.floor(Math.random() * size)
        }
        // Hidden treasure should not within 3 cells of the exit
        while (hiddenTreasure.x % 2 === 1 || hiddenTreasure.y % 2 === 1 || (hiddenTreasure.x === entrance.x && hiddenTreasure.y === entrance.y) || (hiddenTreasure.x === exit.x && hiddenTreasure.y === exit.y) || (Math.abs(hiddenTreasure.x - exit.x) < 6 && Math.abs(hiddenTreasure.y - exit.y) < 6)) {
            hiddenTreasure.x = Math.floor(Math.random() * size)
            hiddenTreasure.y = Math.floor(Math.random() * size)
        }
        // Teleport place should not be on the entrance, exit, or hidden treasure. It can't be on the wall, so it should be on even row and even column positions
        while ((teleportPlace.x === entrance.x && teleportPlace.y === entrance.y) || (teleportPlace.x === exit.x && teleportPlace.y === exit.y) || (teleportPlace.x === hiddenTreasure.x && teleportPlace.y === hiddenTreasure.y) || teleportPlace.x % 2 === 1 || teleportPlace.y % 2 === 1) {
            teleportPlace.x = Math.floor(Math.random() * size)
            teleportPlace.y = Math.floor(Math.random() * size)
        }
        // Generate the maze
        const maze = generateMaze(size, entrance, exit, hiddenTreasure, teleportPlace, wall)
        return maze ? [maze[0], entrance, exit, hiddenTreasure, teleportPlace, maze[1]] : generateValidMaze(size, wall)
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

    const renderCell = (cell: CellState, x: number, y: number)   => {
        // If number of deadEnds is greater than 0, and the cell is in the deadEnds, display the deadEnds
        if (deadEnds.length > 0) {
            for (let i = 0; i < deadEnds.length; i++) {
                if (x === deadEnds[i].x && y === deadEnds[i].y) {
                    return <PlayerAsset src="/assets/game/rip.gif" size={40} />
                }
            }
        }
        if (x === playerPosition.x && y === playerPosition.y && gameStatus !== 3) {
            if (gameStatus === 2) {
                return <PlayerAsset src="/assets/game/player-died.webp" size={40} />
            } else {
                if (gameStatus === 0) {
                    // Display the loading icon, if the game is not started
                    return <PlayerAsset src="/assets/game/entrance.webp" size={40} />
                } else {
                    return <PlayerAsset src="/assets/game/player.webp" size={40} />
                }
            }
        }
        // If tips is greater than 0, display the number of hidden walls around the player
        if (cell.tips > 0) {
            return <div className="text-xs font-bold">{cell.tips}</div>
        }
        switch (cell.type) {
            case 1: return <PlayerAsset src="/assets/game/start-line.gif" size={40} /> // Entrance, Door
            case 2: return gameStatus === 3 ? <PlayerAsset src="/assets/game/player-win.webp" size={40} />:<PlayerAsset src="/assets/game/treasure.gif" size={40} /> // Exit, Pin
            case 8: return unlockTreasure ? <PlayerAsset src="/assets/game/hidden-treasure.gif" size={40} /> : null // Hidden Treasure
            case 9: return hasTeleport ? <PlayerAsset src="/assets/game/teleport.gif" size={40} /> : null // Teleport Place
            default: return null
        }
    }

    const movePlayer = async (dx: number, dy: number) => {
        // Play a sound when the player moves, where the sound is from the public/assets/sound/move.wav
        await new Audio('/assets/sound/move.wav').play();
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
            // Check if the player is moving to the hidden treasure, if so, unlock the treasure
            // console.log(newPlayerX, newPlayerY, " - " ,hiddenTreasure.x, hiddenTreasure.y)
            if (newPlayerX === hiddenTreasure.x && newPlayerY === hiddenTreasure.y) {
                if (!unlockTreasure) {
                    await new Audio('/assets/sound/find-treasure.wav').play();
                    setUnlockTreasure(true)
                    // Also add 2 to the player's Life, maxLife, if life is greater than maxLife
                    if (playerLife + 2 > maxLife) {
                        setPlayerLife(maxLife)
                    } else {
                        setPlayerLife(playerLife + 2)
                    }
                    maze[newPlayerY][newPlayerX].style.color = 'red'
                    setMaze([...maze])
                }
            } else {
                if (maze[newPlayerY][newPlayerX].type === 9) {
                    if (!hasTeleport) {
                        setHasTeleport(true)
                        teleportPlayer()
                    }
                } else {
                    maze[newPlayerY][newPlayerX].style.color = defaltWallColor
                    setMaze([...maze])
                }
            }
            checkGameStatus(newPlayerX, newPlayerY, playerHP)
        }

        checkHit(newX, newY);
    };

    // Check if the player is hit by the wall, if the wall hit is already hit, do nothing, else reduce the player's HP by 1, and set the wall hit to true
    const checkHit = async (x: number, y: number) => {

        // Check if the move is valid, for example the player is not moving out of the maze
        if (x < 0 || x >= mazeSize || y < 0 || y >= mazeSize) {
            return
        }
        if (maze[y][x].type === 3 || maze[y][x].type === 4 || maze[y][x].type === 5) {
            if (!maze[y][x].hit) {
                await new Audio('/assets/sound/bomb.wav').play();
                showTips()
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
    const checkGameStatus = async (x: number, y: number, hp: number) => {
        let gameEnd = false
        if (hp === 0) {
            await new Audio('/assets/sound/game-over.wav').play();
            alert('Game Over!')
            // Check Life, if life is 0, then game over, else reset the game
            if (playerLife <= 1) {
                setGameStatus(2)
                setPlayerLife(playerLife - 1)
                setLifeCost(lifeCost + 1)
                gameEnd = true
            } else {
                setPlayerLife(playerLife - 1)
                setLifeCost(lifeCost + 1)
                resetGame()
            }
        } else if (x === exit.x && y === exit.y) {
            await new Audio('/assets/sound/find-treasure.wav').play();
            // Calculate the player's score, based on player's remaining HP, and the number of steps taken, and the shortest steps to reach the exit
            // The player's score is the sum of the remaining HP * 100 + difficulty level (shortest steps - player's steps)/shortest steps * 100, then round to the nearest integer
            const score = Math.round((hp * 100 + steps - playerWalks)*(1+steps/100))
            alert(`You Win! Steps: ${steps} - Your Score: ${score}`)
            let newMaxLife = maxLife
            if (playerScore + score >= levelExp[level-1]) {
                newMaxLife += 1
                setMaxLife(newMaxLife)
                setLevel(level + 1)
            }
            setPlayerScore(playerScore + score)
            // Life + 2 or maxLife, if life is greater than maxLife
            if (playerLife + 2 > newMaxLife) {
                setPlayerLife(newMaxLife)
            } else {
                setPlayerLife(playerLife + 2)
            }
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
            if (!unlockTreasure) {
                setUnlockTreasure(true)
            }
            if (!hasTeleport) {
                setHasTeleport(true)
            }
        }
    }

    // Reset the game, don't generate the maze again, just reset the player's position, HP, and the game status
    const resetGame = (): void => {

        setPlayerPosition({ x: entrance.x, y: entrance.y })
        setPlayerHP(maxPlayerHP)
        setHiddenWalls(totalWalls)
        setGameStatus(1)
        // Make all the walls.hit to false, and color to default
        for (let i = 0; i < mazeSize; i++) {
            for (let j = 0; j < mazeSize; j++) {
                if (maze[i][j].type === 4 || maze[i][j].type === 5) {
                    maze[i][j].hit = false
                    maze[i][j].style.color = defaltWallColor
                }
            }
        }
        // Also set all the path to white color
        for (let i = 0; i < mazeSize; i++) {
            for (let j = 0; j < mazeSize; j++) {
                if (maze[i][j].type === 0) {
                    maze[i][j].style.color = 'white'
                    // Set the tips to 0
                    maze[i][j].tips = 0
                }
            }
        }
        setMaze([...maze])
    }

    const startGame = async () => {
        await new Audio('/assets/sound/game-start.wav').play();
        try {
            // Check player's life, if life is 0, alert No Life, and return
            if (playerLife === 0) {
                alert('No Life!')
                return
            }
            const [newMaze, entrance, exit, hiddenTreasure, teleportPlace, steps] = generateValidMaze(mazeSize, totalWalls)
            if (newMaze) {
                // Set all the empty horizontal and vertical walls to type 6 and 7
                for (let i = 0; i < mazeSize; i++) {
                    for (let j = 0; j < mazeSize; j++) {
                        if (newMaze[i][j].type === 0) {
                            // Row is even, column is odd, then vertical empty wall, type 7
                            if (i % 2 === 0 && j % 2 === 1) {
                                newMaze[i][j].type = 7
                                // Set size to 2, 0.5, and color to white
                                newMaze[i][j].style = {width: 0.25, height: 2, color: defaltWallColor}
                            }
                            // Row is odd, column is even, then horizontal empty wall, type 6
                            if (i % 2 === 1 && j % 2 === 0) {
                                newMaze[i][j].type = 6
                                // Set size to 0.5, 2, and color to white
                                newMaze[i][j].style = {
                                    width: 2, height: 0.25, color: defaltWallColor
                                }
                            }
                        }
                    }
                }
                setMaze(newMaze)
                setPlayerPosition({x: entrance.x, y: entrance.y})
                setEntrance(entrance)
                setExit(exit)
                setHiddenTreasure(hiddenTreasure)
                setTeleportPlace(teleportPlace)
                setPlayerHP(maxPlayerHP)
                setHiddenWalls(totalWalls)
                setLifeCost(lifeCost)
                setUnlockTreasure(false)
                setHasTeleport(false)
                setSteps(steps)
                setGameStatus(1)
                setDeadEnds([])
            }
        } catch (e) {
            console.log("Game generation error: ", e)
        }
    }

    // When player hit the wall, show tips alert, display the number of hidden walls around the player, and whether the hidden treasure is around the player
    const showTips = (): void => {
        let numberOfHiddenWalls = 0
        let hiddenTreasureAround = false
        // Check within radius of 2 cells, if there is any hidden walls, and hidden treasure
        for (let i = playerPosition.y - 2; i <= playerPosition.y + 2; i++) {
            for (let j = playerPosition.x - 2; j <= playerPosition.x + 2; j++) {
                if (i >= 0 && i < mazeSize && j >= 0 && j < mazeSize) {
                    if (maze[i][j].type === 8) {
                        hiddenTreasureAround = true
                    }
                    if (maze[i][j].type === 4 || maze[i][j].type === 5) {
                        numberOfHiddenWalls++
                    }
                }
            }
        }
        // Display the number of hidden walls at the player's position, mark it as green color if there is hidden treasure around
        if (hiddenTreasureAround) {
            maze[playerPosition.y][playerPosition.x].style.color = '#6ee7b7'
            // Set the tips
        }
        maze[playerPosition.y][playerPosition.x].tips = numberOfHiddenWalls
        setMaze([...maze])
        alert(`Hidden Walls: ${numberOfHiddenWalls} - Hidden Treasure: ${hiddenTreasureAround ? 'Yes' : 'No'}`)
    }

    // When player enter the teleport, teleport the player to a random position that is not a wall, and not the exit, and not the entrance, and hit = false
    const teleportPlayer = async () => {
        await new Audio('/assets/sound/teleport.wav').play();
        let x = Math.floor(Math.random() * mazeSize)
        let y = Math.floor(Math.random() * mazeSize)
        while (maze[y][x].type !== 0 || maze[y][x].hit || (x === entrance.x && y === entrance.y) || (x === exit.x && y === exit.y)) {
            x = Math.floor(Math.random() * mazeSize)
            y = Math.floor(Math.random() * mazeSize)
        }
        // Check if the player can move from the new position to the exit, if not, just die
        const newSteps = solveMaze(maze, {x: x, y: y}, exit)
        if (newSteps < 0) {
            // Add the position to the deadEnds and log the position
            setDeadEnds([...deadEnds, {x: x, y: y}])
            console.log("Dead End: ", x, y)
            setPlayerHP(0)
            checkGameStatus(x, y, 0)
        } else {
            setPlayerPosition({x: x, y: y})
            // Set the new position to blue color
            maze[y][x].style.color = defaltWallColor
            setMaze([...maze])
        }
    }

    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center mt-3 mb-3">
                {/* Display the player's HP, Number of Hidden Walls, Number of Walks and the Shortest steps. All in one row */}
                <div className="flex justify-between w-full">
                    <div>💖 {playerHP}</div>
                    <div>🚧 {hiddenWalls}</div>
                    <div>👣 {steps}</div>
                </div>
                {/* Display the maze */}
                {/* Dividing line */}
                <hr className="my-3 w-full"/>
                {/* Display the maze */}
                <div className="">
                    <div className={
                        gameStatus === 0 ? 'inline-block border-4 border-white' : 'inline-block border-4 border-black'
                    } style={
                        {
                            // Set the width to 20px * mazeSize, and height to 20px * mazeSize
                            width: `${273}px`,
                            height: `${273}px`
                        }
                    }>
                        {gameStatus !== 0 && maze && maze.map((row, y) => (
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
                                    }} className="flex items-center justify-center text-2xl">
                                        {renderCell(cell, x, y)}
                                    </div>
                                ))}
                                <br/>
                            </div>
                        ))}
                        {gameStatus === 0 && <div className="flex items-center justify-center text-2xl" style={
                            {
                                width: `${273}px`,
                                height: `${273}px`
                            }}>
                            <button className="col-start-2 col-end-3"
                                    onClick={() => {
                                        startGame();
                                    }
                                    }
                            >
                                <PlayerAsset src="/assets/game/start.gif" size={250} avatar={"rounded"}/>
                            </button>
                        </div>}
                    </div>
                </div>
                {/* Dividing line */}
                <hr className="my-3 w-full"/>
                {/* Only display the player's controller if the game is in progress, gameStatus is 0 or 1. Else, display New Game button */}
                <div className="grid grid-cols-3 gap-2">
                    <button className="col-start-1 col-end-2" disabled={true}></button>
                    <button onClick={() => movePlayer(0, -1)} className="col-start-2 col-end-3"
                            disabled={gameStatus !== 1 && gameStatus !== 0}>
                        <GameAsset direction="up"/>
                    </button>
                    <button onClick={() => movePlayer(-1, 0)} className="col-start-1 col-end-2"
                            disabled={gameStatus !== 1 && gameStatus !== 0}>
                        <GameAsset direction="left"/>
                    </button>
                    <button className="col-start-2 col-end-3"
                            onClick={() => {
                                if (gameStatus !== 1) {
                                    startGame();
                                }
                            }
                            }
                            disabled={gameStatus === 1}
                    >
                        {gameStatus === 1 ?
                            <PlayerAsset src="/assets/game/player-heart.webp" size={40} avatar={"rounded"}/>
                            :
                            gameStatus === 0 ?
                                <PlayerAsset src="/assets/game/entrance.webp" size={40} avatar={"rounded"}/>
                                :
                                <PlayerAsset src="/assets/game/start.gif" size={40} avatar={"rounded"}/>
                        }
                    </button>
                    <button onClick={() => movePlayer(1, 0)} className="col-start-3 col-end-4"
                            disabled={gameStatus !== 1 && gameStatus !== 0}>
                        <GameAsset direction="right"/>
                    </button>
                    <button onClick={() => movePlayer(0, 1)} className="col-start-2 col-end-3"
                            disabled={gameStatus !== 1 && gameStatus !== 0}>
                        <GameAsset direction="down"/>
                    </button>
                </div>
                {/* Display the player's score, and the number of life cost */}

                <hr className="my-3 w-full"/>
                <div className="flex justify-between w-full">
                    <div>⚡ {playerScore}/{levelExp[level-1]}</div>
                    <div>👾 {playerLife}/{maxLife}</div>
                </div>
            </div>
        </div>
    )
}
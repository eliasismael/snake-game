// Get the canvas and its context
const canvas = document.getElementById("miCanvas");
const ctx = canvas.getContext("2d");

// Get the score element
const score = document.querySelector(".score");

// Set canvas properties
const canvasColor = "black";
const canvasWidth = 300;
const canvasHeight = 300;
const positionSize = 15;

// Set the time between each movement
const milisecondsforNextPosition = 1000 / 15;

// Set snake properties
const snakeStartingLenght = 4;
const snakeColor = "greenyellow";

// At the start this create the snake on the middle of the canvas
let snakeCurrentPosition = [
    canvasWidth / 2 - positionSize,
    canvasHeight / 2 - positionSize,
];

// Set variables to keep track of the game state
const wallCollisions = true;

let ocuppiedPositions = [];
let currentDirection = "right";
let applePosition = [];
let gameStarted = false;
let scoreCounter = 0;

// Set the possible directions of movement
const directions = {
    right: { x: positionSize, y: 0 },
    left: { x: -positionSize, y: 0 },
    up: { x: 0, y: -positionSize },
    down: { x: 0, y: positionSize },
};

// Set an array to hold all possible positions on the canvas
let allPositions = [];

// Set variables for game pausing
let pausedAvailable = true;
let isPaused = false;

// Set the game interval variable
let gameInterval;

function createGame() {
    // Create the display
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Create the score section
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.strokeText(`Score: ${score}`, 0, 0);

    // Set all possible positions on the canvas
    for (let x = 0; x < canvasWidth; x += positionSize) {
        for (let y = 0; y < canvasHeight; y += positionSize) {
            allPositions.push([x, y]);
        }
    }

    // Set the initial ocuppied positions
    let substractFromX = 0;
    for (let i = 0; i < snakeStartingLenght; i++) {
        ocuppiedPositions.push([
            snakeCurrentPosition[0] - substractFromX,
            snakeCurrentPosition[1],
        ]);

        substractFromX += positionSize;
    }

    // Draw the snake
    drawSnake();

    // Create the apple
    createApple();

    // Add event listener for keyboard input
    document.addEventListener("keydown", (e) => {
        // Start the game by pressing the space bar
        if (e.key === " ") {
            // If the game isn't started start it going to the right
            if (!gameStarted) {
                currentDirection = "right";
                gameStarted = true;
                gameLoop();
            } else {
                // Else use te spacebar to put in pause
                togglePause();
            }
        }

        changeDirection(e);
    });
}

function lookIfWon() {
    if (allPositions.length === ocuppiedPositions.length) {
        clearInterval(interval);
        return alert("Felicidades, ganaste el juego");
    }
}

function lookIfSnakeAetTheApple() {
    if (String(snakeCurrentPosition) === String(applePosition)) {
        scoreCounter += 10;
        score.innerHTML = `Score: ${scoreCounter}`;
        return true;
    }
}

function move(direction) {
    if (lookIfWon()) return;

    // Set the new position based on the current direction
    snakeCurrentPosition[0] += directions[direction].x;
    snakeCurrentPosition[1] += directions[direction].y;

    if (verifyColitions()) return;

    if (lookIfSnakeAetTheApple()) {
        createApple();
    } else {
        /* If the snake didn't eat the apple in this move, make the end of the snake move
        by making its last position of the color of the canvas when the new move happen */

        ctx.beginPath();
        ctx.fillStyle = canvasColor;
        ctx.fillRect(
            ocuppiedPositions[ocuppiedPositions.length - 1][0],
            ocuppiedPositions[ocuppiedPositions.length - 1][1],
            positionSize,
            positionSize
        );
        ctx.closePath();

        // Then make that position free
        ocuppiedPositions.pop();
    }

    // Draw the snake adding the new current position
    drawSnake();
}

function verifyColitions() {
    ocuppiedPositions.forEach((ocuppied) => {
        if (
            snakeCurrentPosition[0] === ocuppied[0] &&
            snakeCurrentPosition[1] === ocuppied[1]
        ) {
            clearInterval(gameInterval);
            pausedAvailable = false;
            document.removeEventListener("keydown", () => {});
            alert("Game over");
            return true;
        }
    });

    // If the snake collides with the walls
    if (wallCollisions) {
        if (
            snakeCurrentPosition[0] === canvasWidth ||
            snakeCurrentPosition[0] < 0 ||
            snakeCurrentPosition[1] === canvasHeight ||
            snakeCurrentPosition[1] < 0
        ) {
            pausedAvailable = false;
            clearInterval(gameInterval);
            document.removeEventListener("keydown", () => {});
            alert("Game over");
            return true;
        }
    } else {
        if (snakeCurrentPosition[0] === canvasWidth)
            snakeCurrentPosition[0] = 0;
        else if (snakeCurrentPosition[0] < 0)
            snakeCurrentPosition[0] = canvasWidth;
        else if (snakeCurrentPosition[1] === canvasHeight)
            snakeCurrentPosition[1] = 0;
        else if (snakeCurrentPosition[1] < 0) {
            snakeCurrentPosition[1] = canvasHeight;
        }
    }

    ocuppiedPositions.unshift([
        snakeCurrentPosition[0],
        snakeCurrentPosition[1],
    ]);
}

function changeDirection(e) {
    // Return if the player tries to make a 180° turn
    if (
        ((e.key === "ArrowLeft" || e.key === "ArrowRight") &&
            (currentDirection === "left" || currentDirection === "right")) ||
        ((e.key === "ArrowUp" || e.key === "ArrowDown") &&
            (currentDirection === "up" || currentDirection === "down"))
    ) {
        return;
    }

    directionChanged = true;

    // Set the new direction
    switch (e.key) {
        case "ArrowLeft":
            currentDirection = "left";
            break;
        case "ArrowRight":
            currentDirection = "right";
            break;
        case "ArrowUp":
            currentDirection = "up";
            break;
        case "ArrowDown":
            currentDirection = "down";
            break;
        default:
            break;
    }
}

function createApple() {
    // Convert the occupied positions array to a string array to make it easy to find the free positions
    const strOcupPos = ocuppiedPositions.map(String);

    // Get all positions that are not occupied by also converting each position to string
    const freePositions = allPositions.filter(
        (pos) => !strOcupPos.includes(String(pos))
    );

    // Select a random position from the free positions
    const freePositionIndex = Math.floor(Math.random() * freePositions.length);
    applePosition = freePositions[freePositionIndex];

    // Draw the apple
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(
        applePosition[0] + positionSize / 2,
        applePosition[1] + positionSize / 2,
        positionSize / 2 - 3,
        0,
        2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();

    return true;
}

function drawSnake() {
    ocuppiedPositions.map((ocupPos) => {
        ctx.beginPath();
        ctx.fillStyle = snakeColor;
        ctx.fillRect(ocupPos[0], ocupPos[1], positionSize, positionSize);

        // Make the squares smaller than the position size
        ctx.strokeStyle = canvasColor;
        ctx.lineWidth = positionSize / 5;
        ctx.strokeRect(ocupPos[0], ocupPos[1], positionSize, positionSize);
        ctx.closePath();
    });
}

function togglePause() {
    // Paused will be disabled when the game ends.
    // This is to not allow the player to start the game after he lose
    if (!pausedAvailable) return;

    if (isPaused) {
        // Go back to the game
        gameInterval = setInterval(() => {
            move(currentDirection);
        }, milisecondsforNextPosition);

        isPaused = false;
    } else {
        clearInterval(gameInterval);
        isPaused = true;
    }
}

function gameLoop() {
    gameInterval = setInterval(() => {
        move(currentDirection);
    }, milisecondsforNextPosition);
}

createGame();

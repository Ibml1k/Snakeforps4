const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20; // Size of each grid cell in pixels
canvas.width = 1920; // Full screen width
canvas.height = 1080; // Full screen height
const tileCountX = canvas.width / gridSize; // Number of tiles horizontally
const tileCountY = canvas.height / gridSize; // Number of tiles vertically

let snake = [{x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2)}];
let snakeDirection = 'RIGHT';
let apple = {x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY)};
let gameOver = false;
let score = 0;
let appleCount = Math.floor(Math.random() * 5) + 2; // Random apples between 2 and 6

document.addEventListener('keydown', changeDirection);

function gameLoop() {
    if (gameOver) return;
    moveSnake();
    checkCollision();
    checkAppleCollision();
    draw();
    setTimeout(gameLoop, 100); // Adjust the speed of the game
}

function moveSnake() {
    const head = {...snake[0]};

    switch (snakeDirection) {
        case 'UP': head.y--; break;
        case 'DOWN': head.y++; break;
        case 'LEFT': head.x--; break;
        case 'RIGHT': head.x++; break;
    }

    snake.unshift(head);
    if (snake.length > appleCount) {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
    }
}

function checkAppleCollision() {
    if (snake[0].x === apple.x && snake[0].y === apple.y) {
        score++;
        appleCount = Math.floor(Math.random() * 5) + 2; // Random apples between 2 and 6
        apple = {x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY)};
        snake.push({}); // Grow the snake
    }
}

function changeDirection(event) {
    switch (event.code) {
        case 'ArrowUp': if (snakeDirection !== 'DOWN') snakeDirection = 'UP'; break;
        case 'ArrowDown': if (snakeDirection !== 'UP') snakeDirection = 'DOWN'; break;
        case 'ArrowLeft': if (snakeDirection !== 'RIGHT') snakeDirection = 'LEFT'; break;
        case 'ArrowRight': if (snakeDirection !== 'LEFT') snakeDirection = 'RIGHT'; break;
        case 'KeyX': if (gameOver) restartGame(); break; // Restart game with X key
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
    if (gameOver) drawGameOver();
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function drawGameOver() {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press X to restart', canvas.width / 2, canvas.height / 2 + 40);
}

function restartGame() {
    snake = [{x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2)}];
    snakeDirection = 'RIGHT';
    apple = {x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY)};
    gameOver = false;
    score = 0;
    appleCount = Math.floor(Math.random() * 5) + 2;
    gameLoop();
}

gameLoop();
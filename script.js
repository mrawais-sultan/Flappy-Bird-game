const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.25;
const FLAP = -4.5;
const PIPE_WIDTH = 50;
const PIPE_HEIGHT = 300;
const PIPE_GAP = 100;
const PIPE_SPEED = 2;

let birdY = canvas.height / 2;
let birdVelocity = 0;
let pipes = [];
let score = 0;
let gameOver = false;

// Load images
const birdImage = new Image();
birdImage.src = 'images/bird.png';

const pipeImage = new Image();
pipeImage.src = 'images/pipe.png';

const backgroundImage = new Image();
backgroundImage.src = 'images/background.png';

const gameOverImage = new Image();
gameOverImage.src = 'images/gameover.png';

// Load number images
const numberImages = [];
for (let i = 0; i <= 9; i++) {
    const img = new Image();
    img.src = `images/${i}.png`;  // images/1.png, images/2.png, etc.
    numberImages.push(img);
}

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawBird() {
    ctx.drawImage(birdImage, 50, birdY, 40, 40);  // Adjust bird size if needed
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.save();
        ctx.scale(1, -1);  // Flip for top pipe
        ctx.drawImage(pipeImage, pipe.x, -pipe.top, PIPE_WIDTH, pipe.top);
        ctx.restore();

        ctx.drawImage(pipeImage, pipe.x, canvas.height - pipe.bottom, PIPE_WIDTH, pipe.bottom);
    });
}

function drawScore() {
    const scoreStr = score.toString();
    const digitWidth = 24;  // Adjust digit size if needed
    const totalWidth = scoreStr.length * digitWidth;
    
    for (let i = 0; i < scoreStr.length; i++) {
        const digit = parseInt(scoreStr[i]);
        ctx.drawImage(numberImages[digit], 10 + i * digitWidth, 30, digitWidth, digitWidth);  // Adjust position as needed
    }
}

function drawGameOver() {
    ctx.drawImage(gameOverImage, (canvas.width - 200) / 2, (canvas.height - 100) / 2, 200, 100);  // Adjust size if needed
}

function updateBird() {
    birdVelocity += GRAVITY;
    birdY += birdVelocity;
    if (birdY > canvas.height - 40) {
        birdY = canvas.height - 40;
        birdVelocity = 0;
        gameOver = true;
    } else if (birdY < 0) {
        birdY = 0;
        birdVelocity = 0;
    }
}

function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const top = Math.random() * (canvas.height - PIPE_GAP - 40) + 20;
        const bottom = canvas.height - PIPE_GAP - top;
        pipes.push({ x: canvas.width, top, bottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;
    });

    if (pipes[0] && pipes[0].x < -PIPE_WIDTH) {
        pipes.shift();
        score++;
    }
}

function checkCollision() {
    pipes.forEach(pipe => {
        if (
            50 + 40 > pipe.x &&
            50 < pipe.x + PIPE_WIDTH &&
            (birdY < pipe.top || birdY + 40 > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
        }
    });
}

function gameLoop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGameOver();
        return;
    }

    drawBackground();
    drawBird();
    drawPipes();
    drawScore();
    updateBird();
    updatePipes();
    checkCollision();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('click', () => {
    if (!gameOver) {
        birdVelocity = FLAP;
    } else {
        birdY = canvas.height / 2;
        birdVelocity = 0;
        pipes = [];
        score = 0;
        gameOver = false;
        gameLoop();
    }
});

gameLoop();

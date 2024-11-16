const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Paramètres de jeu et variables
let paddleHeight = 20, paddleWidth = 100;
let ballRadius = 10;
let ballColor = "#ffffff";
let backgroundColor = "#34495e";
let level = 1; // 1 = Facile, 2 = Moyen, 3 = Difficile
let ballSpeedX = 3, ballSpeedY = -3;
let paddleX, ballX, ballY;
let score = 0, points = 0, timeLimit;
let isPlaying = false, startTime;

// Initialisation du jeu
function initializeGame() {
    paddleX = canvas.width / 2 - paddleWidth / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height - paddleHeight - ballRadius;
    score = 0;
    points = 0;
    setDifficulty(level);
    updateMessage(`Niveau ${level} : ${timeLimit} secondes`);
}

// Définir la difficulté
function setDifficulty(level) {
    if (level === 1) {
        ballSpeedX = 3;
        ballSpeedY = -3;
        timeLimit = 10; // Facile - 2 minutes
    } else if (level === 2) {
        ballSpeedX = 5;
        ballSpeedY = -5;
        timeLimit = 240; // Moyen - 4 minutes
    } else if (level === 3) {
        ballSpeedX = 7;
        ballSpeedY = -7;
        timeLimit = 600; // Difficile - 10 minutes
    }
}

// Mettre à jour le score
function updateScore() {
    let elapsed = Math.floor((Date.now() - startTime) / 1000);
    if (elapsed >= timeLimit) {
        levelUp();
    } else {
        score = elapsed;
        updateMessage(`Score : ${score} secondes`);
    }
}

// Passer au niveau suivant
function levelUp() {
    level++;
    if (level > 3) {
        endGame(true);
    } else {
        initializeGame();
    }
}

// Mouvement de la balle
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collisions avec les murs latéraux
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }

    // Collision avec le haut de l'écran
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Collision avec la raquette
    if (
        ballY + ballRadius > canvas.height - paddleHeight &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
    ) {
        ballSpeedY = -ballSpeedY;
        points += 10;
    }

    // Game Over si la balle tombe en bas
    if (ballY + ballRadius > canvas.height) {
        endGame(false);
    }
}

// Fin de partie
function endGame(win) {
    clearInterval(scoreInterval);
    isPlaying = false;
    if (win) {
        document.getElementById("win-screen").style.display = "block";
        updateMessage(`Félicitations ! Niveau terminé, Score : ${score} secondes, Points : ${points}`);
    } else {
        document.getElementById("game-over").style.display = "block";
        updateMessage(`Game Over ! Score : ${score} secondes, Points : ${points}`);
    }
}

// Rejouer le jeu
function resetGame() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("win-screen").style.display = "none";
    initializeGame();
    startGame();
}

// Démarrer le jeu
function startGame() {
    initializeGame();
    isPlaying = true;
    startTime = Date.now();
    scoreInterval = setInterval(updateScore, 1000);
    requestAnimationFrame(gameLoop);
}

// Boucle de jeu
function gameLoop() {
    if (!isPlaying) return;
    clearScreen();
    drawPaddle();
    drawBall();
    moveBall();
    requestAnimationFrame(gameLoop);
}

// Effacer l'écran
function clearScreen() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dessiner la raquette
function drawPaddle() {
    ctx.fillStyle = "white";
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

// Dessiner la balle
function drawBall() {
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Mettre à jour le message
function updateMessage(text) {
    document.getElementById("message").innerText = text;
}

// Contrôles et événements
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("exitButton").addEventListener("click", () => {
    isPlaying = false;
    updateMessage("Merci d'avoir joué !");
});
document.getElementById("settingsButton").addEventListener("click", () => {
    document.querySelector(".settings").style.display = 
        document.querySelector(".settings").style.display === "none" ? "block" : "none";
});

// Personnalisation
document.getElementById("ballColor").addEventListener("change", (e) => {
    ballColor = e.target.value;
});
document.getElementById("backgroundColor").addEventListener("change", (e) => {
    backgroundColor = e.target.value;
});
document.getElementById("difficulty").addEventListener("change", (e) => {
    level = parseInt(e.target.value);
    setDifficulty(level);
});

// Déplacer la raquette avec la souris
canvas.addEventListener("mousemove", (e) => {
    const canvasRect = canvas.getBoundingClientRect();
    paddleX = e.clientX - canvasRect.left - paddleWidth / 2;

    if (paddleX < 0) paddleX = 0;
    if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
});

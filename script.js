const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Con chim màu đỏ
let bird = {
    x: 50,
    y: 300,
    width: 25,
    height: 25,
    gravity: 0.25,
    jump: -5.5,
    velocityY: 0
};

// Ống cống màu xanh & Điểm
let pipes = [];
let score = 0;
let gameOver = false;

// Bắt sự kiện phím Space
document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        bird.velocityY = bird.jump;
        if (gameOver) {
            resetGame();
        }
    }
});

// Tạo ống cống ngẫu nhiên
function spawnPipe() {
    if (gameOver) return;

    let gap = 130;
    let topHeight = Math.floor(Math.random() * (canvas.height / 2)) + 50;

    pipes.push({
        x: canvas.width,
        y: 0,
        width: 50,
        height: topHeight,
        passed: false
    });
    pipes.push({
        x: canvas.width,
        y: topHeight + gap,
        width: 50,
        height: canvas.height - topHeight - gap,
        passed: false
    });
}

setInterval(spawnPipe, 1500);

// Vòng lặp Game
function update() {
    if (gameOver) return;

    requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. CHỮ NỀN "vietanh" MÀU TÍM (Đưa lên cao, thoáng nền)
    ctx.fillStyle = "#8a2be2";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("vietanh", canvas.width / 2, canvas.height / 2 - 80);

    // Vẽ & Cập nhật Chim (Đỏ)
    bird.velocityY += bird.gravity;
    bird.y += bird.velocityY;

    ctx.fillStyle = "red";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        gameOver = true;
    }

    // Vẽ & Cập nhật Ống (Xanh)
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x -= 2;

        ctx.fillStyle = "#2e7d32";
        ctx.fillRect(p.x, p.y, p.width, p.height);

        // Kiểm tra va chạm
        if (bird.x < p.x + p.width &&
            bird.x + bird.width > p.x &&
            bird.y < p.y + p.height &&
            bird.y + bird.height > p.y) {
            gameOver = true;
        }

        // Tính điểm
        if (!p.passed && p.x + p.width < bird.x) {
            score += 0.5;
            p.passed = true;
        }
    }

    // 2. ĐIỂM SỐ
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Điểm: " + Math.floor(score), 15, 35);

    // 3. THÔNG BÁO GAME OVER (Kéo xuống dưới thoáng hẳn)
    if (gameOver) {
        ctx.textAlign = "center";
        
        ctx.fillStyle = "red";
        ctx.font = "bold 32px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 + 30);

        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("Nhấn Space để chơi lại", canvas.width / 2, canvas.height / 2 + 75);
    }
}

function resetGame() {
    bird.y = 300;
    bird.velocityY = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    update();
}

update();
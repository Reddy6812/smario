window.onload = function() {
    const canvas = document.getElementById('bikeCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const bike = { x: width/2 - 25, y: height - 60, width: 50, height: 50, speed: 5 };
    let obstacles = [];
    let lastSpawn = Date.now();
    const spawnInterval = 1000;
    let gameOver = false;
    let score = 0;
    const keys = {};

    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);

    function spawnObstacle() {
        const size = 20 + Math.random() * 30;
        const x = Math.random() * (width - size);
        obstacles.push({ x: x, y: -size, size: size, speed: 2 + Math.random() * 3 });
    }

    function update() {
        const now = Date.now();
        if (now - lastSpawn > spawnInterval) { spawnObstacle(); lastSpawn = now; }
        obstacles.forEach(o => o.y += o.speed);
        obstacles = obstacles.filter(o => o.y < height + o.size);

        if (keys['ArrowLeft']) bike.x -= bike.speed;
        if (keys['ArrowRight']) bike.x += bike.speed;
        bike.x = Math.max(0, Math.min(width - bike.width, bike.x));

        obstacles.forEach(o => {
            if (bike.x < o.x + o.size && bike.x + bike.width > o.x && bike.y < o.y + o.size && bike.y + bike.height > o.y) {
                gameOver = true;
            }
        });

        if (!gameOver) score++;
        if (gameOver && keys['r']) {
            obstacles = [];
            score = 0;
            gameOver = false;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'blue';
        ctx.fillRect(bike.x, bike.y, bike.width, bike.height);

        ctx.fillStyle = 'red';
        obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.size, o.size));

        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 10, 30);

        if (gameOver) {
            ctx.fillStyle = '#000';
            ctx.font = '40px Arial';
            ctx.fillText('Game Over', width/2 - 100, height/2);
            ctx.font = '20px Arial';
            ctx.fillText('Press R to Restart', width/2 - 90, height/2 + 30);
        }
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    loop();
}; 
// Standalone self-contained HTML5 games for unblocked iframe gameplay
export const defaultGamesList = [
  {
    id: 'snake-retro',
    title: 'Retro Snake 97',
    category: 'arcade',
    featured: true,
    description: 'Classic arcade snake! Eat food, grow longer, avoid walls and your own tail.',
    thumbnail: '🐍',
    thumbnailBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '1:1',
    rating: 4.8,
    plays: 14200,
    tags: ['Classic', 'Arcade', 'Retro', '2D'],
    controls: ['Arrow Keys or WASD to change direction', 'Space to pause/resume', 'R to restart'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snake</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .header { display: flex; justify-content: space-between; width: 400px; max-width: 95vw; margin-bottom: 12px; font-weight: 600; font-size: 16px; }
    .score-box { background: #1e293b; padding: 8px 16px; border-radius: 8px; border: 1px solid #334155; }
    canvas { background: #020617; border: 2px solid #22c55e; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.2); max-width: 95vw; max-height: 70vh; }
    .btn { margin-top: 14px; background: #22c55e; color: #020617; border: none; font-weight: 700; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 15px; transition: all 0.15s; }
    .btn:hover { background: #4ade80; transform: scale(1.03); }
    .footer { margin-top: 10px; color: #94a3b8; font-size: 13px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="score-box">SCORE: <span id="score" style="color:#4ade80">0</span></div>
    <div class="score-box">HIGH: <span id="high" style="color:#38bdf8">0</span></div>
  </div>
  <canvas id="c" width="400" height="400"></canvas>
  <button class="btn" id="startBtn" onclick="initGame()">PLAY AGAIN</button>
  <div class="footer">Use <b>Arrow Keys</b> or <b>WASD</b> to steer</div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const highEl = document.getElementById('high');
    const startBtn = document.getElementById('startBtn');
    
    const GRID_SIZE = 20;
    const COUNT = canvas.width / GRID_SIZE;
    
    let snake = [];
    let food = { x: 5, y: 5, type: 'apple' };
    let dx = 1, dy = 0;
    let nextDx = 1, nextDy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snake_hi') || 0;
    let gameOver = false;
    let paused = false;
    let gameLoop = null;

    highEl.innerText = highScore;

    function initGame() {
      snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      dx = 1; dy = 0;
      nextDx = 1; nextDy = 0;
      score = 0;
      scoreEl.innerText = '0';
      gameOver = false;
      paused = false;
      startBtn.style.display = 'none';
      spawnFood();
      if (gameLoop) clearInterval(gameLoop);
      gameLoop = setInterval(update, 90);
    }

    function spawnFood() {
      let valid = false;
      while (!valid) {
        food.x = Math.floor(Math.random() * COUNT);
        food.y = Math.floor(Math.random() * COUNT);
        valid = !snake.some(s => s.x === food.x && s.y === food.y);
      }
    }

    function update() {
      if (paused || gameOver) return;
      dx = nextDx; dy = nextDy;
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collision
      if (head.x < 0 || head.x >= COUNT || head.y < 0 || head.y >= COUNT) {
        return handleGameOver();
      }

      // Self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        return handleGameOver();
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;
        if (score > highScore) {
          highScore = score;
          highEl.innerText = highScore;
          localStorage.setItem('snake_hi', highScore);
        }
        spawnFood();
      } else {
        snake.pop();
      }

      draw();
    }

    function draw() {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let i = 0; i <= canvas.width; i += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // Food
      ctx.fillStyle = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ef4444';
      ctx.beginPath();
      ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Snake
      snake.forEach((segment, i) => {
        if (i === 0) {
          ctx.fillStyle = '#22c55e';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#22c55e';
        } else {
          ctx.fillStyle = '#16a34a';
          ctx.shadowBlur = 0;
        }
        ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
      });
      ctx.shadowBlur = 0;
    }

    function handleGameOver() {
      gameOver = true;
      clearInterval(gameLoop);
      draw();
      ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '16px system-ui';
      ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 25);
      startBtn.style.display = 'block';
    }

    window.addEventListener('keydown', e => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && dy === 0) { nextDx = 0; nextDy = -1; }
      else if (['ArrowDown', 'KeyS'].includes(e.code) && dy === 0) { nextDx = 0; nextDy = 1; }
      else if (['ArrowLeft', 'KeyA'].includes(e.code) && dx === 0) { nextDx = -1; nextDy = 0; }
      else if (['ArrowRight', 'KeyD'].includes(e.code) && dx === 0) { nextDx = 1; nextDy = 0; }
      else if (e.code === 'Space') { paused = !paused; }
      else if (e.code === 'KeyR' && gameOver) { initGame(); }
    });

    initGame();
  </script>
</body>
</html>`
  },
  {
    id: 'game-2048',
    title: '2048 Champion',
    category: 'puzzle',
    featured: true,
    description: 'Slide matching number tiles together to reach the legendary 2048 tile!',
    thumbnail: '🔢',
    thumbnailBg: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '1:1',
    rating: 4.9,
    plays: 28500,
    tags: ['Puzzle', 'Math', 'Brain', 'Classic'],
    controls: ['Arrow Keys or Swipe to slide tiles', 'Match same numbers (2+2=4)', 'Reach 2048!'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2048</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .container { width: 360px; max-width: 95vw; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .title { font-size: 32px; font-weight: 900; color: #f59e0b; letter-spacing: -1px; }
    .scores { display: flex; gap: 8px; }
    .score-badge { background: #1e293b; padding: 6px 12px; border-radius: 8px; text-align: center; border: 1px solid #334155; }
    .score-badge .lbl { font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
    .score-badge .val { font-size: 16px; font-weight: 800; color: #f8fafc; }
    .board { width: 360px; height: 360px; max-width: 95vw; max-height: 95vw; background: #1e293b; border-radius: 12px; padding: 10px; display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 10px; position: relative; border: 2px solid #334155; }
    .tile { width: 100%; height: 100%; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 24px; transition: transform 0.1s, background-color 0.1s; box-shadow: inset 0 0 4px rgba(0,0,0,0.2); }
    .t-0 { background: #334155; opacity: 0.5; }
    .t-2 { background: #e2e8f0; color: #1e293b; }
    .t-4 { background: #fed7aa; color: #1e293b; }
    .t-8 { background: #fdba74; color: #020617; }
    .t-16 { background: #fb923c; color: #fff; }
    .t-32 { background: #f97316; color: #fff; }
    .t-64 { background: #ea580c; color: #fff; }
    .t-128 { background: #facc15; color: #020617; font-size: 20px; box-shadow: 0 0 12px #facc1588; }
    .t-256 { background: #eab308; color: #020617; font-size: 20px; box-shadow: 0 0 16px #eab308aa; }
    .t-512 { background: #ca8a04; color: #fff; font-size: 20px; box-shadow: 0 0 20px #ca8a04cc; }
    .t-1024 { background: #ec4899; color: #fff; font-size: 16px; box-shadow: 0 0 24px #ec4899cc; }
    .t-2048 { background: #a855f7; color: #fff; font-size: 16px; box-shadow: 0 0 28px #a855f7ee; animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { transform: scale(0.98); } to { transform: scale(1.02); } }
    .overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.9); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
    .btn { background: #f59e0b; color: #020617; border: none; font-weight: 800; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 12px; font-size: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">2048</div>
      <div class="scores">
        <div class="score-badge"><div class="lbl">SCORE</div><div class="val" id="score">0</div></div>
        <div class="score-badge"><div class="lbl">BEST</div><div class="val" id="best">0</div></div>
      </div>
    </div>
    <div class="board" id="board"></div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
      <span style="color:#94a3b8; font-size:13px;">Use <b>Arrow Keys</b> or <b>WASD</b></span>
      <button class="btn" onclick="init()" style="margin:0; padding:6px 14px; font-size:13px;">New Game</button>
    </div>
  </div>

  <script>
    let grid = Array(4).fill(0).map(() => Array(4).fill(0));
    let score = 0;
    let best = localStorage.getItem('2048_best') || 0;
    document.getElementById('best').innerText = best;

    function init() {
      grid = Array(4).fill(0).map(() => Array(4).fill(0));
      score = 0;
      updateScore(0);
      addRandomTile();
      addRandomTile();
      render();
    }

    function addRandomTile() {
      const empties = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] === 0) empties.push({ r, c });
        }
      }
      if (empties.length > 0) {
        const spot = empties[Math.floor(Math.random() * empties.length)];
        grid[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
      }
    }

    function render() {
      const board = document.getElementById('board');
      board.innerHTML = '';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const val = grid[r][c];
          const tile = document.createElement('div');
          tile.className = 'tile ' + (val > 0 ? 't-' + val : 't-0');
          tile.innerText = val > 0 ? val : '';
          board.appendChild(tile);
        }
      }
      if (isGameOver()) {
        const over = document.createElement('div');
        over.className = 'overlay';
        over.innerHTML = '<h2 style="font-size:26px; font-weight:800; color:#ef4444;">GAME OVER</h2><p style="margin-top:6px; color:#cbd5e1;">Score: ' + score + '</p><button class="btn" onclick="init()">Try Again</button>';
        board.appendChild(over);
      }
    }

    function updateScore(add) {
      score += add;
      document.getElementById('score').innerText = score;
      if (score > best) {
        best = score;
        document.getElementById('best').innerText = best;
        localStorage.setItem('2048_best', best);
      }
    }

    function slide(row) {
      let arr = row.filter(val => val);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          updateScore(arr[i]);
          arr[i + 1] = 0;
        }
      }
      arr = arr.filter(val => val);
      while (arr.length < 4) arr.push(0);
      return arr;
    }

    function moveLeft() {
      let changed = false;
      for (let r = 0; r < 4; r++) {
        const oldRow = [...grid[r]];
        grid[r] = slide(grid[r]);
        if (oldRow.join(',') !== grid[r].join(',')) changed = true;
      }
      return changed;
    }

    function moveRight() {
      let changed = false;
      for (let r = 0; r < 4; r++) {
        const oldRow = [...grid[r]];
        grid[r] = slide(grid[r].reverse()).reverse();
        if (oldRow.join(',') !== grid[r].join(',')) changed = true;
      }
      return changed;
    }

    function moveUp() {
      let changed = false;
      for (let c = 0; c < 4; c++) {
        const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        const newCol = slide(col);
        for (let r = 0; r < 4; r++) {
          if (grid[r][c] !== newCol[r]) changed = true;
          grid[r][c] = newCol[r];
        }
      }
      return changed;
    }

    function moveDown() {
      let changed = false;
      for (let c = 0; c < 4; c++) {
        const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]].reverse();
        const newCol = slide(col).reverse();
        for (let r = 0; r < 4; r++) {
          if (grid[r][c] !== newCol[r]) changed = true;
          grid[r][c] = newCol[r];
        }
      }
      return changed;
    }

    function isGameOver() {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] === 0) return false;
          if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
          if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
        }
      }
      return true;
    }

    window.addEventListener('keydown', e => {
      let moved = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) moved = moveLeft();
      else if (['ArrowRight', 'KeyD'].includes(e.code)) moved = moveRight();
      else if (['ArrowUp', 'KeyW'].includes(e.code)) moved = moveUp();
      else if (['ArrowDown', 'KeyS'].includes(e.code)) moved = moveDown();
      if (moved) {
        addRandomTile();
        render();
      }
    });

    init();
  </script>
</body>
</html>`
  },
  {
    id: 'flappy-pixel',
    title: 'Flappy Pixel',
    category: 'arcade',
    featured: true,
    description: 'Fly through the pipes by flapping your wings! Pure arcade timing test.',
    thumbnail: '🐥',
    thumbnailBg: 'bg-sky-950/80 text-sky-400 border-sky-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '4:3',
    rating: 4.7,
    plays: 19800,
    tags: ['Arcade', 'Physics', 'Endless', 'Casual'],
    controls: ['Spacebar or Click / Tap to Flap', 'Avoid pipes and ground'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flappy Pixel</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #0b1329; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    canvas { background: #38bdf8; border: 2px solid #0284c7; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: pointer; max-width: 95vw; }
    .tips { margin-top: 12px; font-size: 13px; color: #94a3b8; }
  </style>
</head>
<body>
  <canvas id="c" width="360" height="500"></canvas>
  <div class="tips">Tap screen or press <b>SPACE</b> to flap</div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    let bird = { x: 60, y: 200, vy: 0, gravity: 0.38, jump: -6.5, radius: 14, angle: 0 };
    let pipes = [];
    let score = 0;
    let highScore = localStorage.getItem('flappy_hi') || 0;
    let gameState = 'START'; // START, PLAYING, OVER
    let frame = 0;

    function reset() {
      bird.y = 200;
      bird.vy = 0;
      bird.angle = 0;
      pipes = [];
      score = 0;
      frame = 0;
      gameState = 'PLAYING';
    }

    function flap() {
      if (gameState === 'START' || gameState === 'OVER') {
        reset();
      } else {
        bird.vy = bird.jump;
      }
    }

    window.addEventListener('keydown', e => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); flap(); } });
    canvas.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });

    function update() {
      frame++;
      if (gameState === 'PLAYING') {
        bird.vy += bird.gravity;
        bird.y += bird.vy;
        bird.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.vy * 4) * Math.PI / 180));

        // Floor / ceiling
        if (bird.y + bird.radius >= canvas.height - 40) {
          bird.y = canvas.height - 40 - bird.radius;
          gameOver();
        }
        if (bird.y - bird.radius <= 0) bird.y = bird.radius;

        // Spawn pipes
        if (frame % 85 === 0) {
          const gap = 115;
          const topH = Math.floor(Math.random() * (canvas.height - 200 - gap)) + 40;
          pipes.push({ x: canvas.width, top: topH, bottom: topH + gap, passed: false });
        }

        // Move pipes
        for (let i = pipes.length - 1; i >= 0; i--) {
          const p = pipes[i];
          p.x -= 2.6;

          // Check score
          if (!p.passed && p.x + 45 < bird.x) {
            p.passed = true;
            score++;
            if (score > highScore) {
              highScore = score;
              localStorage.setItem('flappy_hi', highScore);
            }
          }

          // Collision
          if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + 45) {
            if (bird.y - bird.radius < p.top || bird.y + bird.radius > p.bottom) {
              gameOver();
            }
          }

          if (p.x < -60) pipes.splice(i, 1);
        }
      }
    }

    function gameOver() {
      gameState = 'OVER';
    }

    function draw() {
      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(0.7, '#bae6fd');
      skyGrad.addColorStop(1, '#6ee7b7');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(80, 80, 24, 0, Math.PI * 2);
      ctx.arc(110, 80, 32, 0, Math.PI * 2);
      ctx.arc(140, 80, 24, 0, Math.PI * 2);
      ctx.fill();

      // Pipes
      pipes.forEach(p => {
        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3;
        // Top pipe
        ctx.fillRect(p.x, 0, 45, p.top);
        ctx.strokeRect(p.x, 0, 45, p.top);
        // Bottom pipe
        ctx.fillRect(p.x, p.bottom, 45, canvas.height - p.bottom);
        ctx.strokeRect(p.x, p.bottom, 45, canvas.height - p.bottom);
      });

      // Ground
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 8);

      // Bird
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.angle);
      // Body
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(5, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(6, -4, 2, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(16, 3);
      ctx.lineTo(8, 6);
      ctx.fill();
      ctx.restore();

      // HUD Score
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px system-ui';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.fillText(score, canvas.width / 2, 60);
      ctx.shadowBlur = 0;

      if (gameState === 'START') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 28px system-ui';
        ctx.fillText('FLAPPY PIXEL', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '16px system-ui';
        ctx.fillStyle = '#facc15';
        ctx.fillText('Press SPACE or TAP to Play', canvas.width / 2, canvas.height / 2 + 25);
      } else if (gameState === 'OVER') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 30px system-ui';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '18px system-ui';
        ctx.fillText('Score: ' + score + '  |  Best: ' + highScore, canvas.width / 2, canvas.height / 2 + 5);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 15px system-ui';
        ctx.fillText('Tap to Try Again', canvas.width / 2, canvas.height / 2 + 50);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`
  },
  {
    id: 'space-invaders',
    title: 'Galaxy Defender (Space Invaders)',
    category: 'action',
    featured: true,
    description: 'Defend planet Earth from descending alien swarms with your laser cannon!',
    thumbnail: '👾',
    thumbnailBg: 'bg-purple-950/80 text-purple-400 border-purple-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '4:3',
    rating: 4.8,
    plays: 23100,
    tags: ['Retro', 'Shooter', 'Action', 'Arcade'],
    controls: ['Left/Right Arrows or A/D to move', 'Spacebar to Shoot Laser', 'R to restart'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Space Invaders</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #030712; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .hud { display: flex; justify-content: space-between; width: 440px; max-width: 95vw; margin-bottom: 8px; font-weight: 700; }
    canvas { background: #020617; border: 2px solid #8b5cf6; border-radius: 8px; box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); max-width: 95vw; }
  </style>
</head>
<body>
  <div class="hud">
    <div>SCORE: <span id="s" style="color:#a855f7">0</span></div>
    <div>LIVES: <span id="l" style="color:#ef4444">❤️❤️❤️</span></div>
  </div>
  <canvas id="c" width="440" height="480"></canvas>
  <div style="margin-top:8px; font-size:13px; color:#94a3b8;"><b>A/D or Arrows</b>: Move | <b>SPACE</b>: Fire</div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const sEl = document.getElementById('s');
    const lEl = document.getElementById('l');

    let player = { x: 200, y: 440, w: 32, h: 18, speed: 5 };
    let bullets = [];
    let enemyBullets = [];
    let invaders = [];
    let particles = [];
    let score = 0;
    let lives = 3;
    let invaderDir = 1;
    let invaderSpeed = 1;
    let keys = {};
    let gameOver = false;
    let win = false;

    function initInvaders() {
      invaders = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
          invaders.push({
            x: 40 + c * 45,
            y: 40 + r * 35,
            w: 26,
            h: 20,
            alive: true,
            type: r === 0 ? '#ef4444' : r === 1 ? '#eab308' : '#38bdf8',
            pts: (4 - r) * 10
          });
        }
      }
    }

    function resetGame() {
      score = 0; lives = 3; bullets = []; enemyBullets = []; particles = [];
      gameOver = false; win = false;
      sEl.innerText = score;
      lEl.innerText = '❤️❤️❤️';
      initInvaders();
    }

    window.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code === 'Space' && !gameOver) {
        if (bullets.length < 3) {
          bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10 });
        }
      }
      if (e.code === 'KeyR' && (gameOver || win)) resetGame();
    });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    function update() {
      if (gameOver || win) return;

      // Player move
      if ((keys['ArrowLeft'] || keys['KeyA']) && player.x > 5) player.x -= player.speed;
      if ((keys['ArrowRight'] || keys['KeyD']) && player.x < canvas.width - player.w - 5) player.x += player.speed;

      // Bullets
      bullets.forEach((b, i) => {
        b.y -= 7;
        if (b.y < -10) bullets.splice(i, 1);
      });

      // Enemy bullets
      enemyBullets.forEach((eb, i) => {
        eb.y += 4;
        // Hit player
        if (eb.x > player.x && eb.x < player.x + player.w && eb.y > player.y && eb.y < player.y + player.h) {
          enemyBullets.splice(i, 1);
          lives--;
          lEl.innerText = '❤️'.repeat(Math.max(0, lives));
          if (lives <= 0) gameOver = true;
        } else if (eb.y > canvas.height + 10) {
          enemyBullets.splice(i, 1);
        }
      });

      // Move invaders
      let hitEdge = false;
      invaders.forEach(inv => {
        if (!inv.alive) return;
        inv.x += invaderDir * invaderSpeed;
        if (inv.x > canvas.width - inv.w - 10 || inv.x < 10) hitEdge = true;
        if (inv.y + inv.h >= player.y) gameOver = true;
      });

      if (hitEdge) {
        invaderDir *= -1;
        invaders.forEach(inv => { inv.y += 12; });
      }

      // Enemy random shoot
      if (Math.random() < 0.035) {
        const aliveInv = invaders.filter(i => i.alive);
        if (aliveInv.length > 0) {
          const shooter = aliveInv[Math.floor(Math.random() * aliveInv.length)];
          enemyBullets.push({ x: shooter.x + shooter.w / 2, y: shooter.y + shooter.h, w: 3, h: 8 });
        }
      }

      // Bullet hit invader
      bullets.forEach((b, bi) => {
        invaders.forEach(inv => {
          if (inv.alive && b.x > inv.x && b.x < inv.x + inv.w && b.y > inv.y && b.y < inv.y + inv.h) {
            inv.alive = false;
            bullets.splice(bi, 1);
            score += inv.pts;
            sEl.innerText = score;
            // Particles
            for (let k = 0; k < 8; k++) {
              particles.push({ x: inv.x + 10, y: inv.y + 10, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 15, color: inv.type });
            }
          }
        });
      });

      // Check win
      if (invaders.every(i => !i.alive)) win = true;

      // Particles
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      });
    }

    function draw() {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      for (let i = 0; i < 20; i++) {
        ctx.fillRect((i * 47) % canvas.width, (i * 83 + Date.now() * 0.05) % canvas.height, 2, 2);
      }

      // Player
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(player.x, player.y + 6, player.w, player.h - 6);
      ctx.fillRect(player.x + player.w / 2 - 4, player.y, 8, 6);

      // Invaders
      invaders.forEach(inv => {
        if (!inv.alive) return;
        ctx.fillStyle = inv.type;
        ctx.fillRect(inv.x + 4, inv.y, inv.w - 8, inv.h);
        ctx.fillRect(inv.x, inv.y + 4, inv.w, inv.h - 8);
        ctx.fillStyle = '#020617';
        ctx.fillRect(inv.x + 6, inv.y + 6, 3, 3);
        ctx.fillRect(inv.x + inv.w - 9, inv.y + 6, 3, 3);
      });

      // Bullets
      ctx.fillStyle = '#38bdf8';
      bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

      // Enemy bullets
      ctx.fillStyle = '#ef4444';
      enemyBullets.forEach(eb => ctx.fillRect(eb.x, eb.y, eb.w, eb.h));

      // Particles
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
      });

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 30px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('INVASION FAILED', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#fff';
        ctx.font = '16px system-ui';
        ctx.fillText('Press R to Retry', canvas.width / 2, canvas.height / 2 + 25);
      } else if (win) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 30px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#fff';
        ctx.font = '16px system-ui';
        ctx.fillText('Planet Earth is Saved! Press R to replay', canvas.width / 2, canvas.height / 2 + 25);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    resetGame();
    loop();
  </script>
</body>
</html>`
  },
  {
    id: 'block-master-tetris',
    title: 'Block Master (Tetra Stacker)',
    category: 'puzzle',
    featured: true,
    description: 'Rotate and drop classic tetromino shapes, clear complete lines, and climb levels.',
    thumbnail: '🧱',
    thumbnailBg: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '4:3',
    rating: 4.9,
    plays: 31000,
    tags: ['Tetris', 'Classic', 'Retro', 'Puzzle'],
    controls: ['Left/Right: Move', 'Up: Rotate', 'Down: Soft Drop', 'Space: Hard Drop', 'C: Hold'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tetris</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #090d16; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .layout { display: flex; gap: 16px; align-items: flex-start; }
    canvas { background: #020617; border: 2px solid #334155; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.6); }
    .sidebar { display: flex; flex-direction: column; gap: 12px; width: 110px; }
    .card { background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid #334155; text-align: center; }
    .card .title { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 4px; }
    .card .val { font-size: 18px; font-weight: 800; color: #38bdf8; }
  </style>
</head>
<body>
  <div class="layout">
    <div class="sidebar">
      <div class="card"><div class="title">HOLD</div><canvas id="holdC" width="80" height="60"></canvas></div>
      <div class="card"><div class="title">SCORE</div><div class="val" id="score">0</div></div>
      <div class="card"><div class="title">LINES</div><div class="val" id="lines">0</div></div>
    </div>
    <canvas id="c" width="240" height="480"></canvas>
    <div class="sidebar">
      <div class="card"><div class="title">NEXT</div><canvas id="nextC" width="80" height="60"></canvas></div>
      <div class="card"><div class="title">LEVEL</div><div class="val" id="level" style="color:#eab308">1</div></div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const nextCanvas = document.getElementById('nextC');
    const nextCtx = nextCanvas.getContext('2d');
    const holdCanvas = document.getElementById('holdC');
    const holdCtx = holdCanvas.getContext('2d');

    const COLS = 10;
    const ROWS = 20;
    const BLOCK = 24;

    const SHAPES = {
      I: { m: [[1,1,1,1]], c: '#06b6d4' },
      J: { m: [[1,0,0],[1,1,1]], c: '#3b82f6' },
      L: { m: [[0,0,1],[1,1,1]], c: '#f97316' },
      O: { m: [[1,1],[1,1]], c: '#eab308' },
      S: { m: [[0,1,1],[1,1,0]], c: '#22c55e' },
      T: { m: [[0,1,0],[1,1,1]], c: '#a855f7' },
      Z: { m: [[1,1,0],[0,1,1]], c: '#ef4444' }
    };
    const KEYS = Object.keys(SHAPES);

    let board = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
    let score = 0, lines = 0, level = 1;
    let current = null, next = null, hold = null, canHold = true;
    let dropCounter = 0, dropInterval = 800, lastTime = 0;
    let gameOver = false;

    function randomPiece() {
      const type = KEYS[Math.floor(Math.random() * KEYS.length)];
      return { matrix: SHAPES[type].m, color: SHAPES[type].c, x: Math.floor(COLS/2) - 1, y: 0 };
    }

    function reset() {
      board = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
      score = 0; lines = 0; level = 1; gameOver = false; hold = null; canHold = true;
      next = randomPiece();
      spawn();
      updateStats();
    }

    function spawn() {
      current = next || randomPiece();
      next = randomPiece();
      current.x = Math.floor(COLS / 2) - Math.floor(current.matrix[0].length / 2);
      current.y = 0;
      canHold = true;
      if (collide(board, current)) {
        gameOver = true;
      }
      drawNextHold();
    }

    function collide(b, p) {
      for (let r = 0; r < p.matrix.length; r++) {
        for (let c = 0; c < p.matrix[r].length; c++) {
          if (p.matrix[r][c]) {
            const bx = p.x + c;
            const by = p.y + r;
            if (bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && b[by][bx])) return true;
          }
        }
      }
      return false;
    }

    function merge() {
      current.matrix.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val) board[current.y + r][current.x + c] = current.color;
        });
      });
      clearLines();
      spawn();
    }

    function clearLines() {
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(c => c !== 0)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(0));
          cleared++;
          r++;
        }
      }
      if (cleared > 0) {
        lines += cleared;
        score += [0, 100, 300, 500, 800][cleared] * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(120, 800 - (level - 1) * 70);
        updateStats();
      }
    }

    function updateStats() {
      document.getElementById('score').innerText = score;
      document.getElementById('lines').innerText = lines;
      document.getElementById('level').innerText = level;
    }

    function rotate(m) {
      return m[0].map((_, i) => m.map(row => row[i]).reverse());
    }

    function playerRotate() {
      const old = current.matrix;
      current.matrix = rotate(current.matrix);
      if (collide(board, current)) current.matrix = old;
    }

    function playerDrop() {
      current.y++;
      if (collide(board, current)) {
        current.y--;
        merge();
      }
      dropCounter = 0;
    }

    function hardDrop() {
      while (!collide(board, current)) {
        current.y++;
      }
      current.y--;
      merge();
      dropCounter = 0;
    }

    function doHold() {
      if (!canHold) return;
      canHold = false;
      if (!hold) {
        hold = { matrix: SHAPES[Object.keys(SHAPES).find(k => SHAPES[k].c === current.color)].m, color: current.color };
        spawn();
      } else {
        const temp = { matrix: SHAPES[Object.keys(SHAPES).find(k => SHAPES[k].c === current.color)].m, color: current.color };
        current = { matrix: hold.matrix, color: hold.color, x: Math.floor(COLS/2) - 1, y: 0 };
        hold = temp;
      }
      drawNextHold();
    }

    function drawNextHold() {
      nextCtx.fillStyle = '#020617'; nextCtx.fillRect(0,0,80,60);
      if (next) drawMini(nextCtx, next.matrix, next.color, 80, 60);

      holdCtx.fillStyle = '#020617'; holdCtx.fillRect(0,0,80,60);
      if (hold) drawMini(holdCtx, hold.matrix, hold.color, 80, 60);
    }

    function drawMini(c, mat, color, w, h) {
      const bs = 12;
      const offX = (w - mat[0].length * bs) / 2;
      const offY = (h - mat.length * bs) / 2;
      mat.forEach((row, r) => {
        row.forEach((val, col) => {
          if (val) {
            c.fillStyle = color;
            c.fillRect(offX + col * bs, offY + r * bs, bs - 1, bs - 1);
          }
        });
      });
    }

    window.addEventListener('keydown', e => {
      if (gameOver) { if (e.code === 'KeyR') reset(); return; }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') { current.x--; if (collide(board, current)) current.x++; }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') { current.x++; if (collide(board, current)) current.x--; }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') { playerDrop(); }
      if (e.code === 'ArrowUp' || e.code === 'KeyW') { playerRotate(); }
      if (e.code === 'Space') { e.preventDefault(); hardDrop(); }
      if (e.code === 'KeyC') { doHold(); }
    });

    function draw() {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#0f172a';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          ctx.strokeRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK);
          if (board[r][c]) {
            ctx.fillStyle = board[r][c];
            ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2);
          }
        }
      }

      // Current piece
      if (current && !gameOver) {
        current.matrix.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val) {
              ctx.fillStyle = current.color;
              ctx.fillRect((current.x + c) * BLOCK + 1, (current.y + r) * BLOCK + 1, BLOCK - 2, BLOCK - 2);
            }
          });
        });
      }

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 24px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 10);
        ctx.fillStyle = '#fff';
        ctx.font = '14px system-ui';
        ctx.fillText('Press R to Restart', canvas.width/2, canvas.height/2 + 20);
      }
    }

    function update(time = 0) {
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;
      if (dropCounter > dropInterval && !gameOver) {
        playerDrop();
      }
      draw();
      requestAnimationFrame(update);
    }

    reset();
    update();
  </script>
</body>
</html>`
  },
  {
    id: 'pong-duel',
    title: 'Pong 2.0 (AI / 2-Player)',
    category: 'sports',
    description: 'Fast-paced table tennis duel! Play against responsive AI or grab a friend for local 2P.',
    thumbnail: '🏓',
    thumbnailBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '16:9',
    rating: 4.7,
    plays: 18200,
    tags: ['Pong', '2 Player', 'Sports', 'Arcade'],
    controls: ['Player 1 (Left): W/S keys', 'Player 2 / AI (Right): Up/Down keys or Automatic AI', 'Toggle 1P/2P on start'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pong</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020617; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .controls-bar { display: flex; gap: 12px; margin-bottom: 12px; }
    button { background: #1e293b; color: #38bdf8; border: 1px solid #334155; font-weight: 700; padding: 6px 14px; border-radius: 6px; cursor: pointer; }
    button.active { background: #0284c7; color: #fff; border-color: #38bdf8; }
    canvas { background: #090d16; border: 2px solid #38bdf8; border-radius: 12px; box-shadow: 0 0 24px rgba(56, 189, 248, 0.2); max-width: 95vw; }
  </style>
</head>
<body>
  <div class="controls-bar">
    <button id="mode1" class="active" onclick="setMode(1)">1-Player vs AI</button>
    <button id="mode2" onclick="setMode(2)">2-Player Local</button>
  </div>
  <canvas id="c" width="560" height="340"></canvas>
  <div style="margin-top:10px; font-size:13px; color:#94a3b8;">P1: <b>W/S</b> | P2: <b>Up/Down</b> | First to 7 wins!</div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    let mode = 1; // 1 = vs AI, 2 = 2P
    let p1 = { y: 130, h: 70, w: 10, score: 0, speed: 6 };
    let p2 = { y: 130, h: 70, w: 10, score: 0, speed: 6 };
    let ball = { x: 280, y: 170, vx: 5, vy: 3, r: 6, speed: 6 };
    let keys = {};
    let winner = null;

    function setMode(m) {
      mode = m;
      document.getElementById('mode1').className = m === 1 ? 'active' : '';
      document.getElementById('mode2').className = m === 2 ? 'active' : '';
      resetGame();
    }

    function resetGame() {
      p1.score = 0; p2.score = 0; winner = null;
      resetBall();
    }

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.speed = 6;
      ball.vx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
      ball.vy = (Math.random() * 4 - 2);
    }

    window.addEventListener('keydown', e => { keys[e.code] = true; });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    function update() {
      if (winner) return;

      // P1 move
      if (keys['KeyW'] && p1.y > 0) p1.y -= p1.speed;
      if (keys['KeyS'] && p1.y < canvas.height - p1.h) p1.y += p1.speed;

      // P2 move
      if (mode === 2) {
        if (keys['ArrowUp'] && p2.y > 0) p2.y -= p2.speed;
        if (keys['ArrowDown'] && p2.y < canvas.height - p2.h) p2.y += p2.speed;
      } else {
        // AI
        const center = p2.y + p2.h / 2;
        if (ball.y < center - 10 && p2.y > 0) p2.y -= 4.2;
        if (ball.y > center + 10 && p2.y < canvas.height - p2.h) p2.y += 4.2;
      }

      // Ball move
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Top / bottom bounce
      if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
        ball.vy *= -1;
      }

      // Paddle 1 hit
      if (ball.x - ball.r <= 25 && ball.y >= p1.y && ball.y <= p1.y + p1.h) {
        ball.vx = Math.abs(ball.vx) * 1.05;
        const delta = (ball.y - (p1.y + p1.h / 2)) / (p1.h / 2);
        ball.vy = delta * 5;
      }

      // Paddle 2 hit
      if (ball.x + ball.r >= canvas.width - 25 && ball.y >= p2.y && ball.y <= p2.y + p2.h) {
        ball.vx = -Math.abs(ball.vx) * 1.05;
        const delta = (ball.y - (p2.y + p2.h / 2)) / (p2.h / 2);
        ball.vy = delta * 5;
      }

      // Score check
      if (ball.x < 0) {
        p2.score++;
        if (p2.score >= 7) winner = mode === 1 ? 'AI Computer' : 'Player 2';
        else resetBall();
      } else if (ball.x > canvas.width) {
        p1.score++;
        if (p1.score >= 7) winner = 'Player 1';
        else resetBall();
      }
    }

    function draw() {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center dashed line
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(15, p1.y, p1.w, p1.h);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(canvas.width - 25, p2.y, p2.w, p2.h);

      // Ball
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

      // Scores
      ctx.font = 'bold 36px system-ui';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(p1.score, canvas.width / 2 - 60, 50);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(p2.score, canvas.width / 2 + 40, 50);

      if (winner) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(winner + ' WINS!', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '15px system-ui';
        ctx.fillStyle = '#fff';
        ctx.fillText('Click any mode above to restart', canvas.width / 2, canvas.height / 2 + 25);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    resetGame();
    loop();
  </script>
</body>
</html>`
  },
  {
    id: 'brick-smasher',
    title: 'Brick Smasher (Breakout)',
    category: 'arcade',
    description: 'Smash all the colored bricks with your bouncing energy ball without letting it drop.',
    thumbnail: '🧱',
    thumbnailBg: 'bg-orange-950/80 text-orange-400 border-orange-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '4:3',
    rating: 4.8,
    plays: 21500,
    tags: ['Breakout', 'Arcade', 'Retro', 'Action'],
    controls: ['Left/Right or Mouse to move paddle', 'Space to launch ball', 'R to restart'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Breakout</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020617; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .hud { display: flex; justify-content: space-between; width: 440px; max-width: 95vw; margin-bottom: 8px; font-weight: 700; }
    canvas { background: #090d16; border: 2px solid #f97316; border-radius: 8px; box-shadow: 0 0 20px rgba(249, 115, 22, 0.2); max-width: 95vw; cursor: none; }
  </style>
</head>
<body>
  <div class="hud">
    <div>SCORE: <span id="s" style="color:#fb923c">0</span></div>
    <div>LIVES: <span id="l" style="color:#ef4444">❤️❤️❤️</span></div>
  </div>
  <canvas id="c" width="440" height="420"></canvas>
  <div style="margin-top:8px; font-size:13px; color:#94a3b8;">Use <b>Mouse</b> or <b>Left/Right Arrows</b> to slide paddle</div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const sEl = document.getElementById('s');
    const lEl = document.getElementById('l');

    let paddle = { x: 180, y: 390, w: 75, h: 10, speed: 7 };
    let ball = { x: 220, y: 370, vx: 3.5, vy: -3.5, r: 5, active: false };
    let bricks = [];
    let score = 0, lives = 3;
    let gameOver = false, victory = false;

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#38bdf8'];

    function initBricks() {
      bricks = [];
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 8; c++) {
          bricks.push({ x: 15 + c * 52, y: 40 + r * 22, w: 46, h: 16, color: COLORS[r], pts: (5 - r) * 10, alive: true });
        }
      }
    }

    function reset() {
      score = 0; lives = 3; gameOver = false; victory = false;
      sEl.innerText = score;
      lEl.innerText = '❤️❤️❤️';
      initBricks();
      resetBall();
    }

    function resetBall() {
      ball.active = false;
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - ball.r - 2;
      ball.vx = 3.5; ball.vy = -3.5;
    }

    window.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, e.clientX - rect.left - paddle.w / 2));
    });

    window.addEventListener('keydown', e => {
      if (['Space', 'ArrowUp'].includes(e.code)) ball.active = true;
      if (e.code === 'KeyR' && (gameOver || victory)) reset();
      if (e.code === 'ArrowLeft') paddle.x = Math.max(0, paddle.x - paddle.speed * 3);
      if (e.code === 'ArrowRight') paddle.x = Math.min(canvas.width - paddle.w, paddle.x + paddle.speed * 3);
    });

    canvas.addEventListener('click', () => { ball.active = true; });

    function update() {
      if (gameOver || victory) return;

      if (!ball.active) {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - ball.r - 2;
        return;
      }

      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall bounce
      if (ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width) ball.vx *= -1;
      if (ball.y - ball.r <= 0) ball.vy *= -1;

      // Bottom fall
      if (ball.y > canvas.height) {
        lives--;
        lEl.innerText = '❤️'.repeat(Math.max(0, lives));
        if (lives <= 0) gameOver = true;
        else resetBall();
      }

      // Paddle hit
      if (ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
        ball.vy = -Math.abs(ball.vy);
        const delta = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.vx = delta * 5;
      }

      // Brick hit
      bricks.forEach(b => {
        if (!b.alive) return;
        if (ball.x > b.x && ball.x < b.x + b.w && ball.y - ball.r < b.y + b.h && ball.y + ball.r > b.y) {
          b.alive = false;
          ball.vy *= -1;
          score += b.pts;
          sEl.innerText = score;
        }
      });

      if (bricks.every(b => !b.alive)) victory = true;
    }

    function draw() {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bricks
      bricks.forEach(b => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#020617';
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      });

      // Paddle
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

      // Ball
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('OUT OF LIVES', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#fff';
        ctx.font = '15px system-ui';
        ctx.fillText('Press R to Play Again', canvas.width / 2, canvas.height / 2 + 25);
      } else if (victory) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('ALL BRICKS SMASHED!', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#fff';
        ctx.font = '15px system-ui';
        ctx.fillText('Press R to replay', canvas.width / 2, canvas.height / 2 + 25);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    reset();
    loop();
  </script>
</body>
</html>`
  },
  {
    id: 'dino-runner',
    title: 'Dino Runner (T-Rex Jump)',
    category: 'arcade',
    featured: true,
    description: 'Jump over cacti and dodge pterodactyls in this endless desert sprint!',
    thumbnail: '🦖',
    thumbnailBg: 'bg-stone-900 text-amber-300 border-stone-700',
    iframeType: 'srcdoc',
    aspectRatio: '16:9',
    rating: 4.8,
    plays: 26400,
    tags: ['Dino', 'Endless', 'Runner', 'Arcade'],
    controls: ['Space / Up Arrow to Jump', 'Down Arrow to Duck', 'R to restart'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dino Runner</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .hud { display: flex; justify-content: space-between; width: 560px; max-width: 95vw; margin-bottom: 8px; font-weight: 700; font-family: monospace; font-size: 16px; }
    canvas { background: #020617; border: 2px solid #334155; border-radius: 8px; max-width: 95vw; }
  </style>
</head>
<body>
  <div class="hud">
    <div>HI <span id="hi">00000</span></div>
    <div>SCORE <span id="sc" style="color:#38bdf8">00000</span></div>
  </div>
  <canvas id="c" width="560" height="240"></canvas>
  <div style="margin-top:10px; font-size:13px; color:#94a3b8;"><b>SPACE / UP</b>: Jump | <b>DOWN</b>: Duck</div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const scEl = document.getElementById('sc');
    const hiEl = document.getElementById('hi');

    let dino = { x: 50, y: 160, w: 28, h: 42, vy: 0, gravity: 0.7, jump: -12, onGround: true, ducking: false };
    let obstacles = [];
    let speed = 6;
    let score = 0;
    let highScore = localStorage.getItem('dino_hi') || 0;
    let gameOver = false;
    let frame = 0;

    hiEl.innerText = String(highScore).padStart(5, '0');

    function reset() {
      dino.y = 160; dino.vy = 0; dino.ducking = false;
      obstacles = [];
      speed = 6; score = 0; gameOver = false; frame = 0;
    }

    window.addEventListener('keydown', e => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && dino.onGround && !gameOver) {
        e.preventDefault();
        dino.vy = dino.jump;
        dino.onGround = false;
      }
      if (e.code === 'ArrowDown' && !gameOver) {
        e.preventDefault();
        dino.ducking = true;
      }
      if (e.code === 'KeyR' && gameOver) reset();
    });

    window.addEventListener('keyup', e => {
      if (e.code === 'ArrowDown') dino.ducking = false;
    });

    function update() {
      if (gameOver) return;
      frame++;

      // Score
      score++;
      if (score % 50 === 0) speed += 0.08;
      scEl.innerText = String(score).padStart(5, '0');
      if (score > highScore) {
        highScore = score;
        hiEl.innerText = String(highScore).padStart(5, '0');
        localStorage.setItem('dino_hi', highScore);
      }

      // Dino physics
      dino.vy += dino.gravity;
      dino.y += dino.vy;
      const groundY = dino.ducking ? 180 : 160;
      if (dino.y >= groundY) {
        dino.y = groundY;
        dino.vy = 0;
        dino.onGround = true;
      }

      // Spawn obstacles
      if (frame % Math.floor(Math.max(45, 90 - speed * 2)) === 0 && Math.random() < 0.8) {
        const isBird = Math.random() < 0.3 && score > 200;
        if (isBird) {
          obstacles.push({ x: canvas.width, y: 145, w: 25, h: 18, type: 'bird' });
        } else {
          obstacles.push({ x: canvas.width, y: 165, w: 18, h: 37, type: 'cactus' });
        }
      }

      // Move obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        // Collision check
        const dw = dino.ducking ? 38 : 28;
        const dh = dino.ducking ? 22 : 42;
        if (dino.x < obs.x + obs.w && dino.x + dw > obs.x && dino.y < obs.y + obs.h && dino.y + dh > obs.y) {
          gameOver = true;
        }

        if (obs.x < -40) obstacles.splice(i, 1);
      }
    }

    function draw() {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground line
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 202);
      ctx.lineTo(canvas.width, 202);
      ctx.stroke();

      // Ground pebbles
      ctx.fillStyle = '#334155';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect((i * 110 - (frame * speed) % 110 + canvas.width) % canvas.width, 210, 8, 2);
      }

      // Dino
      ctx.fillStyle = '#38bdf8';
      if (dino.ducking) {
        ctx.fillRect(dino.x, dino.y, 38, 22);
      } else {
        ctx.fillRect(dino.x, dino.y, 28, 42);
        // Eye
        ctx.fillStyle = '#020617';
        ctx.fillRect(dino.x + 18, dino.y + 6, 4, 4);
      }

      // Obstacles
      obstacles.forEach(obs => {
        if (obs.type === 'cactus') {
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(obs.x + 5, obs.y, obs.w - 10, obs.h);
          ctx.fillRect(obs.x, obs.y + 10, obs.w, 6);
        } else {
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        }
      });

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 22px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('G A M E  O V E R', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '14px system-ui';
        ctx.fillStyle = '#fff';
        ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 20);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    reset();
    loop();
  </script>
</body>
</html>`
  },
  {
    id: 'minesweeper-deluxe',
    title: 'Minesweeper Deluxe',
    category: 'puzzle',
    description: 'Uncover hidden minefield numbers and flag all bombs without setting off an explosion.',
    thumbnail: '💣',
    thumbnailBg: 'bg-zinc-900 text-red-400 border-zinc-700',
    iframeType: 'srcdoc',
    aspectRatio: '1:1',
    rating: 4.8,
    plays: 17400,
    tags: ['Minesweeper', 'Puzzle', 'Logic', 'Classic'],
    controls: ['Left Click to Reveal', 'Right Click to Flag Mine', 'Click Smiley to Restart'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minesweeper</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .window { background: #1e293b; border: 3px solid #475569; border-radius: 12px; padding: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: #0f172a; border: 2px solid #334155; border-radius: 8px; padding: 8px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .digit { background: #000; color: #ef4444; font-family: monospace; font-size: 24px; font-weight: 800; padding: 2px 8px; border-radius: 4px; }
    .face { font-size: 24px; cursor: pointer; background: #334155; padding: 4px 8px; border-radius: 8px; }
    .grid { display: grid; grid-template-columns: repeat(9, 32px); grid-gap: 3px; background: #0f172a; padding: 4px; border-radius: 8px; }
    .cell { width: 32px; height: 32px; background: #334155; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; cursor: pointer; }
    .cell.revealed { background: #020617; border: 1px solid #1e293b; }
    .cell.c1 { color: #38bdf8; }
    .cell.c2 { color: #22c55e; }
    .cell.c3 { color: #ef4444; }
    .cell.c4 { color: #a855f7; }
    .cell.c5 { color: #f97316; }
  </style>
</head>
<body>
  <div class="window">
    <div class="header">
      <div class="digit" id="mines">010</div>
      <div class="face" id="face" onclick="init()">🙂</div>
      <div class="digit" id="timer">000</div>
    </div>
    <div class="grid" id="grid"></div>
  </div>
  <div style="margin-top:12px; font-size:13px; color:#94a3b8;"><b>Left Click</b>: Reveal | <b>Right Click</b>: Flag</div>

  <script>
    const ROWS = 9, COLS = 9, MINES = 10;
    let board = [], revealed = [], flagged = [];
    let gameOver = false, won = false, firstClick = true;
    let timer = 0, timerInterval = null;

    function init() {
      board = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
      revealed = Array(ROWS).fill(0).map(() => Array(COLS).fill(false));
      flagged = Array(ROWS).fill(0).map(() => Array(COLS).fill(false));
      gameOver = false; won = false; firstClick = true;
      clearInterval(timerInterval);
      timer = 0;
      document.getElementById('timer').innerText = '000';
      document.getElementById('mines').innerText = '010';
      document.getElementById('face').innerText = '🙂';
      render();
    }

    function plantMines(safeR, safeC) {
      let planted = 0;
      while (planted < MINES) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);
        if (board[r][c] !== 'M' && !(r === safeR && c === safeC)) {
          board[r][c] = 'M';
          planted++;
        }
      }
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (board[r][c] === 'M') continue;
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (r + dr >= 0 && r + dr < ROWS && c + dc >= 0 && c + dc < COLS && board[r + dr][c + dc] === 'M') count++;
            }
          }
          board[r][c] = count;
        }
      }
    }

    function reveal(r, c) {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || revealed[r][c] || flagged[r][c] || gameOver) return;
      if (firstClick) {
        firstClick = false;
        plantMines(r, c);
        timerInterval = setInterval(() => {
          timer++;
          document.getElementById('timer').innerText = String(Math.min(999, timer)).padStart(3, '0');
        }, 1000);
      }
      revealed[r][c] = true;

      if (board[r][c] === 'M') {
        gameOver = true;
        document.getElementById('face').innerText = '😵';
        clearInterval(timerInterval);
      } else if (board[r][c] === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) reveal(r + dr, c + dc);
        }
      }
      checkWin();
      render();
    }

    function flag(r, c, e) {
      e.preventDefault();
      if (revealed[r][c] || gameOver) return;
      flagged[r][c] = !flagged[r][c];
      const count = MINES - flagged.flat().filter(Boolean).length;
      document.getElementById('mines').innerText = String(Math.max(0, count)).padStart(3, '0');
      checkWin();
      render();
    }

    function checkWin() {
      let win = true;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (board[r][c] !== 'M' && !revealed[r][c]) win = false;
        }
      }
      if (win && !gameOver) {
        won = true; gameOver = true;
        document.getElementById('face').innerText = '😎';
        clearInterval(timerInterval);
      }
    }

    function render() {
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          if (revealed[r][c] || (gameOver && board[r][c] === 'M')) {
            cell.classList.add('revealed');
            if (board[r][c] === 'M') cell.innerText = '💣';
            else if (board[r][c] > 0) {
              cell.innerText = board[r][c];
              cell.classList.add('c' + board[r][c]);
            }
          } else if (flagged[r][c]) {
            cell.innerText = '🚩';
          }
          cell.addEventListener('click', () => reveal(r, c));
          cell.addEventListener('contextmenu', e => flag(r, c, e));
          grid.appendChild(cell);
        }
      }
    }

    init();
  </script>
</body>
</html>`
  },
  {
    id: 'cyber-drift-2d',
    title: 'Cyber Drift 2D (Highway Racer)',
    category: 'action',
    featured: true,
    description: 'Weave through high-speed neon traffic, collect power coins, and avoid catastrophic crashes!',
    thumbnail: '🏎️',
    thumbnailBg: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '4:3',
    rating: 4.7,
    plays: 24300,
    tags: ['Racing', 'Action', 'Arcade', 'Cars'],
    controls: ['Left/Right or A/D to steer car', 'Up / W to Boost Speed', 'R to restart'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Drift</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #05050f; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .hud { display: flex; justify-content: space-between; width: 340px; max-width: 95vw; margin-bottom: 8px; font-weight: 700; font-size: 15px; }
    canvas { background: #111827; border: 2px solid #06b6d4; border-radius: 12px; box-shadow: 0 0 25px rgba(6, 182, 212, 0.3); max-width: 95vw; }
  </style>
</head>
<body>
  <div class="hud">
    <div>SPEED: <span id="sp" style="color:#06b6d4">120 MPH</span></div>
    <div>SCORE: <span id="sc" style="color:#facc15">0</span></div>
  </div>
  <canvas id="c" width="340" height="460"></canvas>
  <div style="margin-top:8px; font-size:13px; color:#94a3b8;"><b>A/D or Arrows</b>: Steer | <b>W / UP</b>: Nitro Boost</div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const spEl = document.getElementById('sp');
    const scEl = document.getElementById('sc');

    let car = { x: 150, y: 360, w: 32, h: 56, speed: 5 };
    let traffic = [];
    let lineOffset = 0;
    let score = 0;
    let speed = 8;
    let keys = {};
    let gameOver = false;
    let frame = 0;

    function reset() {
      car.x = 150; traffic = []; score = 0; speed = 8; gameOver = false; frame = 0;
    }

    window.addEventListener('keydown', e => { keys[e.code] = true; if (e.code === 'KeyR' && gameOver) reset(); });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    function update() {
      if (gameOver) return;
      frame++;

      const isBoost = keys['ArrowUp'] || keys['KeyW'];
      const curSpeed = isBoost ? speed * 1.5 : speed;
      lineOffset = (lineOffset + curSpeed) % 40;
      score += isBoost ? 2 : 1;
      spEl.innerText = Math.round(curSpeed * 15) + ' MPH';
      scEl.innerText = score;

      if ((keys['ArrowLeft'] || keys['KeyA']) && car.x > 35) car.x -= car.speed;
      if ((keys['ArrowRight'] || keys['KeyD']) && car.x < canvas.width - 35 - car.w) car.x += car.speed;

      // Spawn traffic
      if (frame % Math.floor(Math.max(25, 60 - speed)) === 0) {
        const lanes = [45, 115, 185, 255];
        const laneX = lanes[Math.floor(Math.random() * lanes.length)];
        traffic.push({ x: laneX, y: -70, w: 32, h: 56, color: ['#ef4444', '#a855f7', '#eab308', '#22c55e'][Math.floor(Math.random() * 4)], speed: Math.random() * 2 + 3 });
      }

      // Move traffic
      for (let i = traffic.length - 1; i >= 0; i--) {
        const t = traffic[i];
        t.y += curSpeed - t.speed;

        // Hit car
        if (car.x < t.x + t.w && car.x + car.w > t.x && car.y < t.y + t.h && car.y + car.h > t.y) {
          gameOver = true;
        }

        if (t.y > canvas.height + 80) traffic.splice(i, 1);
      }
    }

    function draw() {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road shoulder
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(25, 0, canvas.width - 50, canvas.height);

      // Lane dividers
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -lineOffset;
      [105, 175, 245].forEach(lx => {
        ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, canvas.height); ctx.stroke();
      });
      ctx.setLineDash([]);

      // Traffic
      traffic.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.fillRect(t.x, t.y, t.w, t.h);
        ctx.fillStyle = '#000';
        ctx.fillRect(t.x + 4, t.y + 12, t.w - 8, 14);
      });

      // Player car
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(car.x, car.y, car.w, car.h);
      ctx.fillStyle = '#000';
      ctx.fillRect(car.x + 4, car.y + 12, car.w - 8, 14);
      // Headlights
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(car.x + 4, car.y, 6, 4);
      ctx.fillRect(car.x + car.w - 10, car.y, 6, 4);

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('CRASHED!', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '15px system-ui';
        ctx.fillStyle = '#fff';
        ctx.fillText('Press R to Retry', canvas.width / 2, canvas.height / 2 + 25);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    reset();
    loop();
  </script>
</body>
</html>`
  },
  {
    id: 'word-guess',
    title: 'Word Guess (Wordle Clone)',
    category: 'puzzle',
    description: 'Guess the hidden 5-letter word in 6 tries with color-coded clue tiles!',
    thumbnail: '🟩',
    thumbnailBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '1:1',
    rating: 4.9,
    plays: 15600,
    tags: ['Wordle', 'Word Game', 'Brain', 'Puzzle'],
    controls: ['Type 5-letter words with keyboard', 'Press ENTER to submit', 'Green = Right Spot, Yellow = Wrong Spot'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Word Guess</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    h2 { font-size: 22px; font-weight: 800; margin-bottom: 12px; letter-spacing: 2px; color: #22c55e; }
    .grid { display: grid; grid-template-rows: repeat(6, 48px); grid-gap: 6px; margin-bottom: 14px; }
    .row { display: grid; grid-template-columns: repeat(5, 48px); grid-gap: 6px; }
    .tile { width: 48px; height: 48px; border: 2px solid #334155; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; text-transform: uppercase; background: #1e293b; }
    .tile.correct { background: #22c55e; border-color: #22c55e; color: #020617; }
    .tile.present { background: #eab308; border-color: #eab308; color: #020617; }
    .tile.absent { background: #475569; border-color: #475569; color: #94a3b8; }
    .msg { height: 24px; font-size: 14px; font-weight: 700; color: #38bdf8; }
  </style>
</head>
<body>
  <h2>WORD GUESS</h2>
  <div class="grid" id="grid"></div>
  <div class="msg" id="msg">Type letters and press ENTER</div>

  <script>
    const WORDS = ['REACT', 'GAMES', 'LIGHT', 'PIXEL', 'SPACE', 'TRACK', 'SMART', 'CLOUD', 'POWER', 'PLANT', 'CYBER', 'MUSIC', 'FLASH', 'WATER', 'BRAIN'];
    let target = WORDS[Math.floor(Math.random() * WORDS.length)];
    let guesses = Array(6).fill('');
    let curRow = 0;
    let gameOver = false;

    function render() {
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      for (let r = 0; r < 6; r++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let c = 0; c < 5; c++) {
          const tile = document.createElement('div');
          tile.className = 'tile';
          const letter = guesses[r][c] || '';
          tile.innerText = letter;
          if (r < curRow) {
            if (letter === target[c]) tile.classList.add('correct');
            else if (target.includes(letter)) tile.classList.add('present');
            else tile.classList.add('absent');
          }
          row.appendChild(tile);
        }
        grid.appendChild(row);
      }
    }

    window.addEventListener('keydown', e => {
      if (gameOver) return;
      if (e.key === 'Backspace') {
        guesses[curRow] = guesses[curRow].slice(0, -1);
        render();
      } else if (e.key === 'Enter') {
        if (guesses[curRow].length === 5) {
          if (guesses[curRow] === target) {
            document.getElementById('msg').innerText = '🎉 Brilliant! You got it!';
            gameOver = true;
          } else if (curRow === 5) {
            document.getElementById('msg').innerText = 'Word was: ' + target;
            gameOver = true;
          } else {
            curRow++;
          }
          render();
        } else {
          document.getElementById('msg').innerText = 'Word must be 5 letters!';
        }
      } else if (/^[a-zA-Z]$/.test(e.key) && guesses[curRow].length < 5) {
        guesses[curRow] += e.key.toUpperCase();
        document.getElementById('msg').innerText = '';
        render();
      }
    });

    render();
  </script>
</body>
</html>`
  },
  {
    id: 'connect-4-pro',
    title: 'Connect 4 (Drop Master)',
    category: 'casual',
    description: 'Drop colored discs into the grid to connect 4 in a row horizontally, vertically, or diagonally!',
    thumbnail: '🔴',
    thumbnailBg: 'bg-blue-950/80 text-blue-400 border-blue-800/60',
    iframeType: 'srcdoc',
    aspectRatio: '1:1',
    rating: 4.8,
    plays: 16900,
    tags: ['Connect 4', 'Strategy', '2 Player', 'Casual'],
    controls: ['Click any column to drop disc', 'Play 1P vs Smart CPU or 2P Local', 'Get 4 in a row to win'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connect 4</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .board { background: #1d4ed8; padding: 12px; border-radius: 16px; display: grid; grid-template-columns: repeat(7, 44px); grid-gap: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .cell { width: 44px; height: 44px; background: #0f172a; border-radius: 50%; cursor: pointer; transition: transform 0.15s; }
    .cell:hover { transform: scale(1.05); }
    .cell.p1 { background: #ef4444; box-shadow: inset 0 0 8px rgba(0,0,0,0.5); }
    .cell.p2 { background: #facc15; box-shadow: inset 0 0 8px rgba(0,0,0,0.5); }
    .status { margin-bottom: 14px; font-weight: 800; font-size: 18px; color: #38bdf8; }
    .btn { margin-top: 14px; background: #3b82f6; color: #fff; border: none; font-weight: 700; padding: 8px 18px; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="status" id="status">Red's Turn</div>
  <div class="board" id="board"></div>
  <button class="btn" onclick="init()">Restart Game</button>

  <script>
    const ROWS = 6, COLS = 7;
    let grid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
    let turn = 1; // 1 = Red, 2 = Yellow
    let gameOver = false;

    function init() {
      grid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
      turn = 1; gameOver = false;
      document.getElementById('status').innerText = "Red's Turn";
      document.getElementById('status').style.color = "#ef4444";
      render();
    }

    function drop(col) {
      if (gameOver) return;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r][col] === 0) {
          grid[r][col] = turn;
          if (checkWin(r, col)) {
            gameOver = true;
            document.getElementById('status').innerText = (turn === 1 ? 'Red' : 'Yellow') + ' WINS!';
          } else {
            turn = turn === 1 ? 2 : 1;
            document.getElementById('status').innerText = (turn === 1 ? "Red's Turn" : "Yellow's Turn");
            document.getElementById('status').style.color = (turn === 1 ? "#ef4444" : "#facc15");
          }
          render();
          break;
        }
      }
    }

    function checkWin(r, c) {
      const p = grid[r][c];
      const dirs = [[0,1],[1,0],[1,1],[1,-1]];
      for (let [dr, dc] of dirs) {
        let count = 1;
        for (let step = 1; step <= 3; step++) {
          let nr = r + dr * step, nc = c + dc * step;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === p) count++;
          else break;
        }
        for (let step = 1; step <= 3; step++) {
          let nr = r - dr * step, nc = c - dc * step;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === p) count++;
          else break;
        }
        if (count >= 4) return true;
      }
      return false;
    }

    function render() {
      const board = document.getElementById('board');
      board.innerHTML = '';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell ' + (grid[r][c] === 1 ? 'p1' : grid[r][c] === 2 ? 'p2' : '');
          cell.addEventListener('click', () => drop(c));
          board.appendChild(cell);
        }
      }
    }

    init();
  </script>
</body>
</html>`
  },
  {
    id: 'asteroids-1979',
    title: 'Asteroids Blaster 1979',
    category: 'retro',
    featured: true,
    description: 'Pilot your vector starship through a dense asteroid field with realistic physics!',
    thumbnail: '🚀',
    thumbnailBg: 'bg-slate-900 text-sky-300 border-slate-700',
    iframeType: 'srcdoc',
    aspectRatio: '4:3',
    rating: 4.8,
    plays: 14700,
    tags: ['Asteroids', 'Retro', 'Space', 'Vector'],
    controls: ['Left/Right: Rotate ship', 'Up Arrow / W: Thrust engine', 'Space: Shoot', 'R: Restart'],
    iframeSource: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Asteroids</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #000; color: #fff; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
    .hud { display: flex; justify-content: space-between; width: 440px; max-width: 95vw; margin-bottom: 8px; font-size: 16px; }
    canvas { background: #020617; border: 2px solid #38bdf8; border-radius: 8px; max-width: 95vw; }
  </style>
</head>
<body>
  <div class="hud">
    <div>SCORE: <span id="s" style="color:#38bdf8">0</span></div>
    <div>LIVES: <span id="l" style="color:#ef4444">3</span></div>
  </div>
  <canvas id="c" width="440" height="420"></canvas>
  <div style="margin-top:8px; font-size:13px; color:#94a3b8;"><b>A/D or Arrows</b>: Rotate | <b>W / UP</b>: Thrust | <b>SPACE</b>: Fire</div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const sEl = document.getElementById('s');
    const lEl = document.getElementById('l');

    let ship = { x: 220, y: 210, r: 10, a: -Math.PI / 2, rot: 0, thrusting: false, vx: 0, vy: 0 };
    let bullets = [];
    let roids = [];
    let score = 0, lives = 3;
    let gameOver = false;

    function createAsteroid(x, y, r) {
      return {
        x: x || Math.random() * canvas.width,
        y: y || Math.random() * canvas.height,
        r: r || 30,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vert: 10 + Math.floor(Math.random() * 5),
        offsets: Array(15).fill(0).map(() => Math.random() * 0.4 + 0.8)
      };
    }

    function reset() {
      ship.x = canvas.width / 2; ship.y = canvas.height / 2; ship.vx = 0; ship.vy = 0; ship.a = -Math.PI / 2;
      bullets = []; roids = []; score = 0; lives = 3; gameOver = false;
      sEl.innerText = score; lEl.innerText = lives;
      for (let i = 0; i < 4; i++) roids.push(createAsteroid());
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') ship.rot = -0.08;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') ship.rot = 0.08;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') ship.thrusting = true;
      if (e.code === 'Space' && !gameOver) {
        if (bullets.length < 5) {
          bullets.push({ x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a), y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a), vx: 6 * Math.cos(ship.a), vy: -6 * Math.sin(ship.a), life: 40 });
        }
      }
      if (e.code === 'KeyR' && gameOver) reset();
    });

    window.addEventListener('keyup', e => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) ship.rot = 0;
      if (['ArrowUp', 'KeyW'].includes(e.code)) ship.thrusting = false;
    });

    function update() {
      if (gameOver) return;

      ship.a += ship.rot;
      if (ship.thrusting) {
        ship.vx += 0.15 * Math.cos(ship.a);
        ship.vy -= 0.15 * Math.sin(ship.a);
      }
      ship.vx *= 0.98; ship.vy *= 0.98;
      ship.x += ship.vx; ship.y += ship.vy;

      // Screen wrap
      if (ship.x < 0) ship.x = canvas.width;
      if (ship.x > canvas.width) ship.x = 0;
      if (ship.y < 0) ship.y = canvas.height;
      if (ship.y > canvas.height) ship.y = 0;

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx; b.y += b.vy; b.life--;
        if (b.x < 0) b.x = canvas.width; if (b.x > canvas.width) b.x = 0;
        if (b.y < 0) b.y = canvas.height; if (b.y > canvas.height) b.y = 0;
        if (b.life <= 0) bullets.splice(i, 1);
      }

      // Asteroids
      roids.forEach(r => {
        r.x += r.vx; r.y += r.vy;
        if (r.x < 0) r.x = canvas.width; if (r.x > canvas.width) r.x = 0;
        if (r.y < 0) r.y = canvas.height; if (r.y > canvas.height) r.y = 0;

        // Collision with ship
        const dist = Math.hypot(ship.x - r.x, ship.y - r.y);
        if (dist < ship.r + r.r) {
          lives--;
          lEl.innerText = lives;
          ship.x = canvas.width / 2; ship.y = canvas.height / 2; ship.vx = 0; ship.vy = 0;
          if (lives <= 0) gameOver = true;
        }
      });

      // Bullets hit asteroids
      for (let i = roids.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
          if (Math.hypot(roids[i].x - bullets[j].x, roids[i].y - bullets[j].y) < roids[i].r) {
            score += roids[i].r > 20 ? 20 : 50;
            sEl.innerText = score;
            if (roids[i].r > 15) {
              roids.push(createAsteroid(roids[i].x, roids[i].y, roids[i].r / 2));
              roids.push(createAsteroid(roids[i].x, roids[i].y, roids[i].r / 2));
            }
            roids.splice(i, 1);
            bullets.splice(j, 1);
            break;
          }
        }
      }

      if (roids.length === 0) {
        for (let i = 0; i < 5; i++) roids.push(createAsteroid());
      }
    }

    function draw() {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ship
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ship.x + 4 / 3 * ship.r * Math.cos(ship.a), ship.y - 4 / 3 * ship.r * Math.sin(ship.a));
      ctx.lineTo(ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)), ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a)));
      ctx.lineTo(ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)), ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a)));
      ctx.closePath();
      ctx.stroke();

      // Asteroids
      ctx.strokeStyle = '#94a3b8';
      roids.forEach(r => {
        ctx.beginPath();
        for (let j = 0; j < r.vert; j++) {
          const ang = (j * Math.PI * 2) / r.vert;
          const rad = r.r * r.offsets[j];
          const px = r.x + rad * Math.cos(ang);
          const py = r.y + rad * Math.sin(ang);
          if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      });

      // Bullets
      ctx.fillStyle = '#facc15';
      bullets.forEach(b => {
        ctx.beginPath(); ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2); ctx.fill();
      });

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SHIP DESTROYED', canvas.width/2, canvas.height/2 - 10);
        ctx.font = '14px monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText('Press R to play again', canvas.width/2, canvas.height/2 + 20);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    reset();
    loop();
  </script>
</body>
</html>`
  }
];

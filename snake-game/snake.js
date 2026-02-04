const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let snake, apple, score, running, speed, frameInterval;
let ranking = JSON.parse(localStorage.getItem('snakeRanking') || '[]');

const SPEEDS = {
  easy: 8,
  normal: 4,
  hard: 2
};

function setSpeed(level) {
  speed = SPEEDS[level];
  document.querySelectorAll('#controls button').forEach(btn => btn.disabled = false);
  document.querySelector(`#controls button[onclick*="${level}"]`).disabled = true;
}

function updateRanking(newScore) {
  ranking.push(newScore);
  ranking = ranking.sort((a, b) => b - a).slice(0, 5);
  localStorage.setItem('snakeRanking', JSON.stringify(ranking));
  renderRanking();
}

function renderRanking() {
  const rankList = document.getElementById('rankList');
  rankList.innerHTML = '';
  ranking.forEach((s, i) => {
    const li = document.createElement('li');
    li.textContent = `${i+1}위: ${s}점`;
    rankList.appendChild(li);
  });
}

function resetGame() {
  snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
  apple = { x: getRandomInt(0, 20) * grid, y: getRandomInt(0, 20) * grid };
  score = 0;
  document.getElementById('score').textContent = score;
  running = false;
  document.getElementById('gameover').style.display = 'none';
  document.getElementById('restartBtn').disabled = true;
  document.getElementById('startBtn').disabled = false;
}

function startGame() {
  resetGame();
  running = true;
  document.getElementById('startBtn').disabled = true;
  document.getElementById('restartBtn').disabled = true;
  document.getElementById('gameover').style.display = 'none';
  requestAnimationFrame(loop);
}

function restartGame() {
  startGame();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function gameOver() {
  running = false;
  document.getElementById('gameover').style.display = 'block';
  document.getElementById('restartBtn').disabled = false;
  document.getElementById('startBtn').disabled = false;
  updateRanking(score);
}

let frameCount = 0;
function loop() {
  if (!running) return;
  requestAnimationFrame(loop);
  if (++frameCount < speed) return;
  frameCount = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // 벽 충돌 시 게임 오버
  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
    gameOver();
    return;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

  ctx.fillStyle = 'lime';
  snake.cells.forEach((cell, index) => {
    ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      document.getElementById('score').textContent = score;
      apple.x = getRandomInt(0, 20) * grid;
      apple.y = getRandomInt(0, 20) * grid;
    }
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
        return;
      }
    }
  });
}

document.addEventListener('keydown', function(e) {
  if (!running) return;
  if (e.key === 'ArrowLeft' && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowUp' && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.key === 'ArrowRight' && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowDown' && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// 초기화
setSpeed('normal');
renderRanking();
resetGame();

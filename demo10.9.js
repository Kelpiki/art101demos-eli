const data = [];
let isTracking = false;
let startTime = null;
let lastPos = { x: 0, y: 0, t: 0 };

const button = document.createElement('button');
button.textContent = 'Start Tracking';
button.style.cssText = 'padding:10px 20px; margin:10px; background-color:green; color:white; border:none; border-radius:5px;';
document.body.appendChild(button);

const chartContainer = document.createElement('div');
chartContainer.style.width = '100%';
chartContainer.style.height = '400px';
document.body.appendChild(chartContainer);

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = 400;
chartContainer.appendChild(canvas);
const ctx = canvas.getContext('2d');

function toggleTracking() {
  isTracking = !isTracking;
  button.textContent = isTracking ? 'Stop Tracking' : 'Start Tracking';
  button.style.backgroundColor = isTracking ? 'red' : 'green';
  if (isTracking) {
    data.length = 0;
    startTime = performance.now();
    lastPos = { x: 0, y: 0, t: startTime };
  }
}

button.addEventListener('click', toggleTracking);

function handleMove(e) {
  if (!isTracking) return;
  const now = performance.now();
  const time = (now - startTime) / 1000;
  const dx = e.clientX - lastPos.x;
  const dy = e.clientY - lastPos.y;
  const dt = (now - lastPos.t) / 1000;
  const velocityX = dx / dt;
  const velocityY = dy / dt;
  const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
  data.push({ time, x: e.clientX, y: e.clientY, speed });
  lastPos = { x: e.clientX, y: e.clientY, t: now };
  drawChart();
}

function drawChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (data.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - data[0].speed / 10);
  for (let i = 1; i < data.length; i++) {
    const x = (i / data.length) * canvas.width;
    const y = canvas.height - data[i].speed / 10;
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'orange';
  ctx.stroke();
}

window.addEventListener('mousemove', handleMove);

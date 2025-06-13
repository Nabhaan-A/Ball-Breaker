// Grab canvas and context
const brickHitSound = new Audio("Brickhit.wav");
const paddleHitSound = new Audio("paddlehit.wav");
const gameOverSound = new Audio("gameover.wav");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let score = 0;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // status = 1 means brick is alive
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x + ballRadius > b.x &&
          x - ballRadius < b.x + brickWidth &&
          y + ballRadius > b.y &&
          y - ballRadius < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += 5;
          brickHitSound.play();
        }
      }
    }
  }

  // ✅ WIN CHECK — outside the loops
  if (score === brickRowCount * brickColumnCount * 5) {
    alert("YOU WIN, LEGEND!!! 🔥🏆");
    document.location.reload();
  }
}

function drawScore(){
  ctx.font="16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score,8, 20);
}



// Ball
let x = canvas.width / 2;
let y = canvas.height-30;
let dx = 3;
let dy = -3;
const ballRadius = 10;

// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#f00";
  ctx.fill();
  ctx.closePath();
}
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e){
  if (e.key == "right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if( e.key == "left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}
function keyUpHandler(e){
  if (e.key == "right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if( e.key == "left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}


function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}


// Update game frame
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();


  // Ball hits side walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // Ball hits top
  if (y + dy < ballRadius) {
    dy = -dy;
  }

  // ✅ BALL HITS BOTTOM
  if (y + dy > canvas.height - ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth){
      paddleHitSound.play();
      dy = -dy;
    }
    else{
      gameOverSound.play();
      console.log("BOTTOM HIT 💀");
      alert("GAME OVER 💀");
      return; // exit the draw loop
    }
  }

  // Move ball
  x += dx;
  y += dy;

  // Move paddle if key is pressed
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  drawScore();
  requestAnimationFrame(draw);
}


draw();

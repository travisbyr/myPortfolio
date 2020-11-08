//NOTE
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 */
// ANCHOR Show/Close DOM selectors
const rulesBtn = document.getElementById('rules-btn')
const closeBtn = document.getElementById('close-btn')
const rules = document.getElementById('rules')

// ANCHOR Canvas DOM selectors
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// TODO
/**
1. Create canvas context
2. Create and drew ball
3. Create and drew paddle
4. Create bricks 
5. Drew score
6. Add update function to animate
7. function for animation frame
8.Move paddle
9. Keyboard event handles to move paddle
10.Move ball 
11. Add wall boundaries
12. Increase score when bricks break
13. Lose - redraw bricks, reset score
 */

let score = 0 // Setting our score board to zero

const brickRowCount = 9; // Setting 9 bricks on a row
const brickColumnCount = 8; // Setting 5 bricks on column

// Create ball props
const ball = {
  x: canvas.width / 2, //Start in the middle
  y: canvas.height / 2,// Start in the middle
  size: 10, // ball 
  speed: 4, // Animation  speed prop
  dx: 4, // Animation direction 
  dy: -4 // Animation direction with - so it does not move down
}

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40, // We are taking half width of the paddle
  y: canvas.height - 20, // Center in the middle
  w: 80,
  h: 10,
  speed: 8,
  dx: 0 // Only moving on the x-axes 
};

// Create brick props
const brickInfo = {
  w: 70, // bricks sharing same props
  h: 20,
  padding: 10,
  offsetX: 45, // position on the x-axes
  offsetY: 60, // position on the y-axes
  visible: true // When hit the brick it will be removed
};

// Create bricks
const bricks = []; // init bricks array
for (let i = 0; i < brickRowCount; i++) { // loop through array row
  bricks[i] = []; //  Set the row bricks array iteration to an empty array
  for (let j = 0; j < brickColumnCount; j++) { // loop through array column
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX; // i is the row iteration for each brick
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY; // we are lopping and getting position
    bricks[i][j] = { x, y, ...brickInfo }; // copy and take the array 2D and give it the values of x,y with the object values
  }
}

console.log(bricks)

// Draw ball on canvas - check MDN canvas drawing paths
function drawBall() {
  ctx.beginPath(); // Create a path
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); // Draw an arc to build a circle 
  ctx.fillStyle = '#0095dd'; // style the property 
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

// Draw the score board
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => { // For columns
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent'; // This will be conditional 
      ctx.fill();
      ctx.closePath();
    });
  });
}

// REVIEW Move paddle on canvas
function movePaddle() { // Every time draw  on the canvas with can re-draw with certain element 
  paddle.x += paddle.dx; // paddle will not move until we use the keyboards events

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) { // entire width of the canvas
    paddle.x = canvas.width - paddle.w; // minus the paddle width
  }

  if (paddle.x < 0) { // 0 from the x-axes  and this is for the borders detection 
    paddle.x = 0;
  }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx; // append the ball on x-axes
  ball.y += ball.dy; // append the ball on y-axes

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) { // right and left walls
    ball.dx *= -1; // ball.dx = ball.dx * -1 the reason we are doing this is to reverse the ball to go the other wall and bounce back
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) { // top and bottom walls 
    ball.dy *= -1; // the reason we are doing this is to reverse the ball to go the other wall and bounce back and not go outside the canvas
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x && // Always to in consideration the object size of ball and this check the left 
    ball.x + ball.size < paddle.x + paddle.w && // checking the right side
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed; // reverse the ball object and bounce off
  }

  // Brick collision
  bricks.forEach(column => { // loop through bricks array
    column.forEach(brick => {
      if (brick.visible) { // make sure the bricks are visible
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1; // bounce off the brick
          brick.visible = false; // once bounce off the brick make it visible false 

          increaseScore(); // change the status
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) { // if hit bottom wall then lose 
    showAllBricks(); // redraw bricks 
    score = 0; // reset score 
  }
}

// Increase score
function increaseScore() {
  score++; // increment by one

  if (score % (brickRowCount * brickRowCount) === 0) { // check the if there are no bricks if true redraw the brocks wall
    showAllBricks(); // create bricks wall
  }
}

// Make all bricks appear
function showAllBricks() { // loop through the array of bricks 
  bricks.forEach(column => { // for column set visible to true 
    column.forEach(brick => (brick.visible = true));
  });
}


// REVIEW Setup all the drawing 
function draw() {
  // Clear the canvas to make sure ends the event once stop using the keys
  ctx.clearRect(0,0, canvas.width, canvas.height)

  drawBall()
  drawPaddle()
  drawScore()
  drawBricks()
}

// Update canvas drwaing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update() // Calling the update function

// Keydown event
function keyDown(e) {
  // console.log(1) for any key
  //console.log(e.key) To target the arrow key
  if (e.key === 'Right' || e.key === 'ArrowRight') { //  so cases it refers to right 
    paddle.dx = paddle.speed; // take and set dx to speed paddle 
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') { // same for the left 
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  // console.log(2)
  // console.log(e.key) // To target the arrow key
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0; // Stop the key once its up
  }
}


// Keyboard event handlers up+down
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => 
  rules.classList.add('show'))

// Close button
closeBtn.addEventListener('click', () => 
  rules.classList.remove('show'))
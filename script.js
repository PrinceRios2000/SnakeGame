let backgroundColor, playerSnake, currentApple, score, frames, lives;

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  frames = 12;
  frameRate(frames);
  playerSnake = new Snake();
  currentApple = new Apple();
  lives = 3;
  score = 0;
}

function draw() {
  background(backgroundColor);
  // The snake performs the following four methods:
  playerSnake.moveSelf();
  playerSnake.showSelf();
  playerSnake.checkCollisions();
  playerSnake.checkApples();
  // The apple needs fewer methods to show up on screen.
  currentApple.showSelf();
  // We put the score in its own function for readability.
  displayScore();
}

function displayScore() {
  textSize(12);
  textAlign(LEFT);
  fill(0);
  text(`score: ${score}`, 20, 20);
  text(`lives: ${lives}`, 20, 40);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width/2;
    this.y = height - 10;
    this.direction = 'N';
    this.speed = 8;
    this.tails = [new TailSegment(this.x, this.y)];
  }

  moveSelf() {
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }
    this.tails.unshift(new TailSegment(this.x, this.y));
    this.tails.pop();
  }

  showSelf() {
    stroke(240, 100, 100);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    noStroke();
    for(var i = 0; i < this.tails.length; i++) {
      this.tails[i].showSelf();
    }
    noStroke();
  }

  checkApples() {
    if (collideRectCircle(this.x, this.y, this.size, this.size, currentApple.x, currentApple.y, currentApple.radius*2)){
      score += 1;
      currentApple = new Apple();
      this.extendTail();
      frames += 5;
      frameRate(frames);
    }
  }

  checkCollisions() {
    if (this.tails.length > 2) {
      for (var i = 1; i < this.tails.length; i++) {
        if (this.x == this.tails[i].x && this.y == this.tails[i].y) {
          gameOver();
        }
      }
    }
    if (this.x >= width || this.x <= 0 || this.y >= height || this.y <= 0) {
      lives -= 1;
      this.x = width/2;
      this.y = height/2;
    }
    if (lives <= 0) {
      gameOver();
    }
  }

  extendTail() {
    let lastTailSegment = this.tails[this.tails.length-1];
    this.tails.push(new TailSegment(lastTailSegment.x, lastTailSegment.y));
  }
}

class TailSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  showSelf() {
    fill(0);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Apple {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.radius = 5;
    this.color = 0;
  }

  showSelf() {
    fill(this.color, 100, 100);
    ellipse(this.x, this.y, this.radius*2);
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode)
  if (keyCode === UP_ARROW && playerSnake.direction != 'S') {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != 'N') {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != 'W') {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != 'E') {
    playerSnake.direction = "W";
  } else {
    console.log("wrong key");
  }
  if (keyCode === 32) {
    restartGame();
  }
}


function restartGame() {
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
  lives = 3;
  loop();
}

function gameOver() {
  stroke(0);
  textAlign(CENTER);
  text('Game Over', width/2, height/2);
  noLoop();
}
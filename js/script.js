//   Single Player Squash

let player;
let ball;
let points;
let beep = new Audio("./audio/ping_pong_8bit_beeep.ogg");
let plop = new Audio("./audio/ping_pong_8bit_plop.ogg");
let lose = new Audio("./audio/ping_pong_8bit_peeeeeep.ogg");

class Paddle {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
  }

  newPos() {
    this.y += this.speedY;
  }
  
  update() {
    const ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkNotPaddleUpperCanvas() {
    if (this.y > 0) {
      return true
    } else {
      return false
    }
  }

  checkNotPaddleLowerCanvas() {
    if (this.y + this.height < myGameArea.canvas.height) {
      return true
    } else {
      return false
    }
  }

}

class Ball {
  constructor(xball, yball, radiusball, colorball) {
    this.xball = xball;
    this.yball = yball;
    this.radiusball = radiusball;
    this.colorball = colorball;
    this.xdirection = -1;
    this.ydirection = Math.floor(Math.random() * 2);       //ball random up- or downwards
    if (this.ydirection === 0) {                           //no horisontal direction 
      this.ydirection = -1;
    }
    this.xvelocity = 3;
    this.yvelocity = 2;
  }

  draw() {
    const ctx = myGameArea.context;
    ctx.beginPath();
    ctx.arc(this.xball, this.yball, this.radiusball, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.colorball;
    ctx.fill();
  }

  move() {
    this.xball = this.xball + (this.xvelocity * this.xdirection);
    this.yball = this.yball + (this.yvelocity * this.ydirection);
  }

  checkBoundary() {
    if ((this.yball + this.radiusball) >= myGameArea.canvas.height) {    // bottom boundary
      this.ydirection *= -1;
      beep.play();
    }
    if ((this.yball - this.radiusball) <= 0) {                           // left boundary
      this.ydirection *= -1;
      beep.play();
    }

    if ((this.xball - this.radiusball) <= 0) {                           // upper boundary
      this.xdirection *= -1;
      beep.play();
    }
    
    if (((this.xball + this.radiusball) > player.x) && ((this.yball + this.radiusball) >= player.y && ((this.yball - this.radiusball) <= (player.y + player.height)))) {
      this.xdirection *= -1;
      points += 1;
      plop.play();                                                       // the paddle
    }
  }

  checkGameOver() {
    if ((this.xball - this.radiusball) > (myGameArea.canvas.width + 5)) {  //don't leave a piece of the ball on the boundary
      lose.play();
      myGameArea.stop();                                                 // passing right boundary
    }
  }
};

const myGameArea = {
  canvas: document.createElement('canvas'),
  frames: 0,

  draw: function(){
    this.canvas.width = 600;
    this.canvas.height = 300;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },

  start: function(){
    points = 0;
    this.yarbitrary = 20 + Math.floor(Math.random() * (this.canvas.height - 40));  // set arbitrary hight for ball to enter canvas
    this.draw();
    player = new Paddle(5, 30,'white', 580, 10);
    ball = new Ball(this.canvas.width, this.yarbitrary, 15,'white');
    this.interval = setInterval(updateGameArea, 20);
  },

  clear: function(){
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
  },

  stop: function(){
    clearInterval(this.interval);
  },

  score: function () {
    this.context.font = '20px serif';
    this.context.fillStyle = 'white';
    this.context.fillText(`Score: ${points}`, 350, 50);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.keyCode == 38) {
    if (player.checkNotPaddleUpperCanvas()) {
      player.speedY -= 1;
    } else {
      player.speedY = 0;
    }
  }
  if (e.keyCode == 40) {
    if (player.checkNotPaddleLowerCanvas()) {
      player.speedY += 1;
    } else {
      player.speedY = 0;
    }
  }

});

document.addEventListener('keyup', (e) => {
  player.speedY = 0;
});

function updateGameArea(){
  myGameArea.clear();
  player.newPos();
  player.update();
  ball.draw();
  ball.move();
  ball.checkBoundary();
  ball.checkGameOver();
  myGameArea.score();
}

myGameArea.draw();

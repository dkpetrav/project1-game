//                     
let player;
let ball;

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
  //  console.log("inside update of Component");
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkNotPaddleUpperCanvas() {
  //  console.log(this.y, this.height, myGameArea.canvas.height);
    if (this.y > 0) {
      return true
    } else {
      return false
    }
  }

  checkNotPaddleLowerCanvas() {
  //  console.log(this.y, this.height, myGameArea.canvas.height);
    if (this.y + this.height < myGameArea.canvas.height) {
      return true
    } else {
      return false
    }
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

}

class Ball {
  constructor(xball, yball, radiusball, colorball) {
    this.xball = xball;
    this.yball = yball;
    this.radiusball = radiusball;
    this.colorball = colorball;
    this.xdirection = -1;
    this.ydirection = Math.floor(Math.random() * 3) - 1;
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
    }
    if ((this.yball - this.radiusball) <= 0) {                           // left boundary
      this.ydirection *= -1;
    }
    if ((this.xball - this.radiusball) <= 0) {                           // upper boundary
      this.xdirection *= -1;
    }
    if (((this.xball + this.radiusball) > player.x) && ((this.yball + this.radiusball) >= player.y && ((this.yball - this.radiusball) <= (player.y + player.height)))) {
      this.xdirection *= -1;                                             // the paddle
    }
  }

  checkGameOver() {
    if ((this.xball - this.radiusball) > (myGameArea.canvas.width + 5)) {  //don't leave a piece of the ball on the border
      myGameArea.stop();                                                   // passing right
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
    this.draw()
    player = new Paddle(5, 30,'red', 580, 10);
    ball = new Ball(580, 120, 15,'blue');
    this.interval = setInterval(updateGameArea, 20);
    console.log("inside.start");
  },

  clear: function(){
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
  },

  stop: function(){
    clearInterval(this.interval);
  },

  score: function () {
      const points = Math.floor(this.frames / 5);
      this.context.font = '18px serif';
      this.context.fillStyle = 'black';
      this.context.fillText(`Score: ${points}`, 350, 50);
  }
}

function checkGameOver(){
  const crashed = myObstacles.some(function(obstacle){
    return player.crashWith(obstacle);
  });
  

  if (crashed){
    myGameArea.stop();
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
//  console.log("upper", player.checkNotPaddleUpperCanvas());
//  console.log("lower", player.checkNotPaddleLowerCanvas());
//  console.log("speedY", player.speedY);
}

myGameArea.draw();

//console.log("after new Ball");
//console.log(Ball);





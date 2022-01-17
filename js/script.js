// const ball = new Ball(580, 50, 15,'blue');

class Ball {
  constructor(xball, yball, radiusball, colorball) {
    this.xball = xball;
    this.yball = yball;
    this.radiusball = radiusball;
    //this.colorball = #0000ff;
    this.colorball = colorball;
        
    /*
    this.xball = xball;
    this.yball = yball;
    this.radius = radius;
    this.color = color; */
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
    this.xball += 1;
  }
};

const myGameArea = {
    canvas: document.createElement('canvas'),
    frames: 0,
    start: function(){
        this.canvas.width = 600;
        this.canvas.height = 300;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
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
};



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
    //  this.x += this.speedX;
    this.y += this.speedY;
  }
  
  update() {
    const ctx = myGameArea.context;
    console.log("inside update of Component")
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
     
  crashWith(obstacle) {
    return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
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
  switch (e.keyCode) {
    case 38: // up arrow
      player.speedY -= 1;
      break;
    case 40: // down arrow
      player.speedY += 1;
      break;
      //case 37: // left arrow
      //  player.speedX -= 1;
      //  break;
      //case 39: // right arrow
      //  player.speedX += 1;
      //  break;
    }
});

  

document.addEventListener('keyup', (e) => {
   // player.speedX = 0;
  player.speedY = 0;
});

function updateObstacles() {
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
        
         
  myGameArea.frames += 1;
    if (myGameArea.frames % 120 === 0) {
      let x = myGameArea.canvas.width;
      let minHeight = 20;
      let maxHeight = 200;
      let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      let minGap = 50;
      let maxGap = 200;
      let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new Component(10, height, 'green', x, 0));
      myObstacles.push(new Component(10, x - height - gap, 'green', x, height + gap));
    }
}
  
  
  

function updateGameArea(){
  myGameArea.clear();
  player.newPos();
  player.update();
//    updateObstacles();
//    checkGameOver();
  myGameArea.score();
 ball.draw();
 ball.move();
}
  
const player = new Paddle(5, 30,'red', 550, 110);
const ball = new Ball(40, 40, 15,'blue');
console.log("after new Ball");
console.log(ball);
myGameArea.start();
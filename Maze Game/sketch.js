var cellStack = [0];
var cols = 18;
var rows = 10;
var cellWidth = 30;
var cells = []; 
var currentCell = 0;
var wallWidth = 4;

var playerPos = 0;
var posHistory = [0];

var KEY_D = 68;
var KEY_A = 65;
var KEY_W = 87;
var KEY_S = 83;

var BG_COLOR = 200;
var WALL_COLOR = 0;
var TRACK_COLOR = 200;
var TARGET_COLOR = 0;

var mg;
var pg; 


function setup() {
  colorMode(HSB);
  var w = cols * cellWidth;
  var h = rows * cellWidth; 
  
  TARGET_COLOR = color(0,100,100);
  
  createCanvas(w,h);
  pixelDensity(1);
  mg = createGraphics(w,h);
  pg = createGraphics(w,h);
  
  wallWidth = cellWidth / 8;
  
  generateMaze();
  updatePlayerGraphics();
}

function easyLevel() {
  cols = 18;
  rows = 10;

  colorMode(HSB);
  let w = cols * cellWidth;
  let h = rows * cellWidth; 
  
  TARGET_COLOR = color(0,100,100);
  
  createCanvas(w,h);
  pixelDensity(1);
  mg = createGraphics(w,h);
  pg = createGraphics(w,h);
  
  generateMaze();
  updatePlayerGraphics();
}

function mediumLevel() {
  cols = 30;
  rows = 15;

  colorMode(HSB);
  let w = cols * cellWidth;
  let h = rows * cellWidth; 
  
  TARGET_COLOR = color(0,100,100);
  
  createCanvas(w,h);
  pixelDensity(1);
  mg = createGraphics(w,h);
  pg = createGraphics(w,h);
  
  generateMaze();
  updatePlayerGraphics();
}

function hardLevel() {
  cols = 40;
  rows = 25;

  colorMode(HSB);
  let w = cols * cellWidth;
  let h = rows * cellWidth; 

  TARGET_COLOR = color(0,100,100);
  
  createCanvas(w,h);
  pixelDensity(1);
  mg = createGraphics(w,h);
  pg = createGraphics(w,h);
  
  generateMaze();
  updatePlayerGraphics();
}

function draw() {
  image(mg, 0,0);
  image(pg, -8,-8);
  
  if (keyIsPressed) {
    updatePlayerGraphics();
  }
  
}

function keyReleased() {
  triggeredBefore = 0;
}

function keyPressed () {
  updatePlayerGraphics();
}
var triggeredBefore; 
function updatePlayerGraphics() {
  
  if (triggeredBefore > millis() - 150) return;
  
  triggeredBefore = millis();
  
  var px = getX(playerPos); 
  var py = getY(playerPos); 
  if (py > 0 && (keyIsDown(UP_ARROW) || keyIsDown(KEY_W)) && cells[playerPos].walls[0] == false) {
    py -= 1;
  } else if (py < rows -1 && (keyIsDown(DOWN_ARROW) || keyIsDown(KEY_S)) && cells[playerPos].walls[2] == false) {
    py += 1;
  } else if (px < cols -1 && (keyIsDown(RIGHT_ARROW) || keyIsDown(KEY_D)) && cells[playerPos].walls[1] == false) {
    px += 1;
  } else if (px > 0 && (keyIsDown(LEFT_ARROW) || keyIsDown(KEY_A)) && cells[playerPos].walls[3] == false) {
    px -= 1;
  }
  var newPos = getIndex(px,py);
  
  if (newPos !== playerPos) {
    playerPos = newPos;
    posHistory.push(newPos);
    
     if (cells[playerPos].type == "end") {
      setTimeout(function() {
         
        winGame();
      },300);
    }
  }

  var drawX = px * cellWidth + cellWidth / 2;
  var drawY = py * cellWidth + cellWidth / 2;

  pg.clear(); 

  for (var i = 0; i < posHistory.length - 1; i++) {
    pg.strokeWeight(cellWidth /4);
    pg.stroke(TRACK_COLOR);

    var i1 = posHistory[i];
    var x1 = getX(i1)  * cellWidth + cellWidth / 2; 
    var y1 = getY(i1)  * cellWidth + cellWidth / 2;
    var i2 = posHistory[i+1];
    var x2 = getX(i2)  * cellWidth + cellWidth / 2;
    var y2 = getY(i2) * cellWidth + cellWidth / 2;
    pg.line(x1,y1,x2,y2)
  }
  pg.strokeWeight(2);
  pg.fill(0,255,0);
  pg.stroke(0,50,0);
  pg.rect(drawX,drawY,cellWidth/2);
 
}

function winGame() {
  if (cells[playerPos].type == "end") {
    alert("You won!");
  }
}

function getIndex(x,y) {
  return x + y * cols;
}
function getX(i) {
  return i % cols;
}
function getY(i) {
  return Math.floor(i / cols);
}


function generateMaze() {
  playerPos = 0;
  triggeredBefore = null;
  posHistory = [0];
  
  mg.clear();
  cells = []; 
  currentCell = 0;
  for(var y = 0; y < rows; y++) {
    for(var x = 0; x < cols; x++) {
      var type = "default";
      if (x == 0 && y == 0) {
        type="start";
      }
      if (x == cols - 1 && y == rows - 1) {
        type="end";
      }
      cells.push(new Cell(x,y,cellWidth/2,type));
    }
  }
  var countSteps = 0;
  while (typeof currentCell !== "undefined" ) {
    countSteps++;
   currentCell = generateMazeStep();
    
  }
  
  mg.background(BG_COLOR);
  for (var i = 0; i < cells.length; i++) {
    cells[i].draw();
  }
  
  updatePlayerGraphics(); 
}
function generateMazeStep() {
  
  var cc = cells[currentCell]; 
  cc.visited = true;   
  var nextCell = selectUnvisitedNeighbor(currentCell);
  
  if (typeof nextCell !== "undefined") {
    cellStack.push(nextCell);
    var nc = cells[nextCell];
    
    nc.visited = true;
    nc.removeWallBetween(cc);
  } else {
    nextCell = cellStack.shift();
  } 
  return nextCell; 
}

function selectUnvisitedNeighbor(ci) {
  var neighbors = []; 
  var x = getX(ci);
  var y = getY(ci);
  if (x > 0) {
    var i = getIndex(x-1, y);
    if (!cells[i].visited) {
      neighbors.push(i);  
    }
  }
  if (x < cols - 1) {
    var i = getIndex(x+1, y);
    if (!cells[i].visited) {
      neighbors.push(i);
    }
  }
  
  if (y > 0) {
    var i = getIndex(x, y - 1);
    if (!cells[i].visited) {
      neighbors.push(i);
    }
  }
  if (y < rows - 1) {
    var i = getIndex(x, y + 1);
    if (!cells[i].visited) {
      neighbors.push(i);
    }
  }
  
  return random(neighbors);
}


function Cell(x,y, r, type) {
  this.x = x; 
  this.y = y;
  this.r = r;
  this.walls  = [true,true,true,true];
  this.visited = false;
  this.type = type || "default";
  
}
Cell.prototype.draw = function() {
  var x1 = this.x * cellWidth;
  var y1 = this.y * cellWidth;
  var x2 = x1 + this.r*2;
  var y2 = y1 + this.r*2;
  
  mg.noFill();
  mg.stroke(WALL_COLOR);  
  mg.strokeWeight(wallWidth);
  
  if (this.walls[0]) {
    // top
    mg.line(x1,y1,x2,y1);
  }
  if (this.walls[1]) {
    // right    
    mg.line(x2,y1,x2,y2);
  }
  if (this.walls[2]) {
    //bottom
    mg.line(x1,y2,x2,y2);
  }
  if (this.walls[3]) {
    //left
    mg.line(x1,y1,x1,y2);
  }
  
  if (this.type == "end") {
    mg.noStroke();
    mg.fill(TARGET_COLOR);
    mg.ellipse(x1 + cellWidth /2, y1 + cellWidth/2, cellWidth/2);
  }
}
Cell.prototype.removeWallBetween = function(other) {
  var dx = this.x - other.x;
  var dy = this.y - other.y;
  if (dx == 1 && dy == 0) {
    // remove left wall
    this.walls[3] = false;
    other.walls[1] = false;
  } else if (dx == -1 && dy == 0) {
    // remove right wall
    this.walls[1] = false;
    other.walls[3] = false;
  } else if (dy == 1 && dx == 0) {
    // remove bottom wall
    this.walls[0] = false;
    other.walls[2] = false;
  } else if (dy == -1 && dx == 0) {
    // remove top wall    
    this.walls[2] = false;
    other.walls[0] = false;
  }
}


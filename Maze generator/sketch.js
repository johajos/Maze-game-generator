var cols, rows;
var w = 50;
var grid = [];
//current cell
var current;

var stack = [];

//grid setup
function setup() {
  createCanvas(800, 800);
  cols = floor(width/w);
  rows = floor(height/w);

  frameRate(15);

  //Nested loop
  //Create cell objects and put them in array
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);

      grid.push(cell);
    }

  }
  //Maze starting point
  current = grid[0];

}

function draw() {
  background(51);
  //Loop through grid and display it
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  //current or neighbor cells visited
  current.visited = true;
  //highlight current cell
  current.highlight();
  //step 1 randomly choose unvisited neighbor cell and mark it visited
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;

    //step 2
    stack.push(current);
    
    //step 3 remove wall between current and next cell
    removeWalls(current, next);

    //step 4
    current = next;
  } 
  else if (stack.length > 0) {
    current = stack.pop();
  }

}

function index(i, j) {
  //edge case, dont go over grid width/height
  if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
    return -1;
  }
  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;

  this.checkNeighbors = function() {
    var neighbors = [];

    //all neighbor cells
    var top     = grid[index(i, j - 1)];
    var right   = grid[index(i + 1, j)];
    var bottom  = grid[index(i, j + 1)];
    var left    = grid[index(i - 1, j)];

    //if neighbor exists and has not been visited, add it to the array
    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    //go through cells randomly until array is empty
    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
      } 
      else {
        return undefined;
      }
    

  }

  this.highlight = function() {
    var x = this.i*w;
    var y = this.j*w;
    noStroke();
    fill(255, 255, 255, 255);
    rect(x, y, w, w);
  }

  this.show = function() {
    var x = this.i*w;
    var y = this.j*w;
    stroke(255);
    //if wall exists, draw it
    if (this.walls[0]) {
      //top left -> top right
      line(x    , y    , x + w, y);
    }
    if (this.walls[1]) {
      //top right -> bottom right
      line(x + w, y    , x + w, y + w);
    }
    if (this.walls[2]) {
      //bottom right -> bottom left
      line(x + w, y + w, x    , y + w);
    }
    if (this.walls[3]) {
      //bottom left -> top left
      line(x    , y + w, x    , y);
    }
    //show path
    if (this.visited) {
    noStroke();
    fill(0, 0, 0, 0);
    rect(x, y, w, w);
    }
  }
}

//0 = top
//1 = right
//2 = bottom
//3 = left
function removeWalls(a, b) {
  //remove right or left wall
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  }
  else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  //remove top or bottom wall
  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  }
  else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}



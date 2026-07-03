// Ship.js
function Ship(size, row, col, direction, sunk) {
  this.size = size;
  this.row = row;
  this.col = col;
  this.direction = direction;
  this.sunk = sunk === 1;  
}

export default Ship;
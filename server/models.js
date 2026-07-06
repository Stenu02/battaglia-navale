function Game(id, userId, tournamentId, difficulty, gridSize, missiles, status) {
  this.id = id;
  this.userId = userId;
  this.tournamentId = tournamentId;
  this.difficulty = difficulty;
  this.gridSize = gridSize;
  this.missiles = missiles;
  this.status = status;
}

function Ship(gameId, size, row, col, direction, sunk) {
  this.gameId = gameId;
  this.size = size;
  this.row = row;
  this.col = col;
  this.direction = direction;
  this.sunk = sunk;
}

function Shot(gameId, row, col, result) {
  this.gameId = gameId;
  this.row = row;
  this.col = col;
  this.result = result;
}

function Tournament(id, code, difficulty, gridSize) {
  this.id = id;
  this.code = code;
  this.difficulty = difficulty;
  this.gridSize = gridSize;
}

export { Game, Ship, Shot, Tournament };

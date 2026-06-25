import db from './db.js';
import { Ship } from './models.js';

// Crea una nuova nave per un game
export const createShip = (gameId, size, row, col, direction) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ships (game_id, size, row, col, direction, sunk) 
                 VALUES (?, ?, ?, ?, ?, 0)`;
    db.run(sql, [gameId, size, row, col, direction], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
};

// Restituisci la posizione delle navi in base al gameID
export const getShipsByGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ships WHERE game_id = ?';
    db.all(sql, [gameId], (err, rows) => {
      if (err)
        reject(err);
      else
        resolve(rows.map(row => new Ship(row.game_id, row.size, row.row, row.col, row.direction, row.sunk)));
    });
  });
};

// Segnala una nave come affondata
export const markShipAsSunk = (gameId, row, col) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE ships SET sunk = 1 WHERE game_id = ? AND row = ? AND col = ?';
    db.run(sql, [gameId, row, col], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
};

//Restituisce la posizione di tutte le navi di un torneo
export const getTournamentShips = (tournamentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tournament_ships WHERE tournament_id = ?';
    db.all(sql, [tournamentId], (err, rows) => {
      if (err)
        reject(err);
      else
        resolve(rows.map(row => new Ship(null, row.size, row.row, row.col, row.direction, 0)));
    });
  });
};

// Aggiunge una nave al torneo
export const createTournamentShip = (tournamentId, size, row, col, direction) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO tournament_ships (tournament_id, size, row, col, direction) 
                 VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [tournamentId, size, row, col, direction], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
};


//Resituisce una nave date le sue coordinate, utile a verificare se viene colpita una nave
export const getShipByCell = (gameId, row, col) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ships 
                 WHERE game_id = ? 
                 AND (
                   (direction = 'H' AND row = ? AND col <= ? AND col + size > ?) OR
                   (direction = 'V' AND col = ? AND row <= ? AND row + size > ?)
                 )`;
    db.get(sql, [gameId, row, col, col, col, row, row], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve(null);
      else
        resolve(new Ship(row.game_id, row.size, row.row, row.col, row.direction, row.sunk));
    });
  });
};

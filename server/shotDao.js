import db from './db.js';
import { Shot } from './models.js';

// Crea un nuovo tiro per un game
export const createShot = (gameId, row, col, result) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO shots (game_id, row, col, result) 
                 VALUES (?, ?, ?, ?)`;
    db.run(sql, [gameId, row, col, result], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
};

// Restituisce tutti i tiri per una partita
export const getShotsByGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM shots WHERE game_id = ?';
    db.all(sql, [gameId], (err, rows) => {
      if (err)
        reject(err);
      else
        resolve(rows.map(row => new Shot(row.game_id, row.row, row.col, row.result)));
    });
  });
};


//Utile per verificare se una cella è stata già colpita
export const getShotByCell = (gameId, row, col) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM shots WHERE game_id = ? AND row = ? AND col = ?';
    db.get(sql, [gameId, row, col], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve(null);
      else
        resolve(new Shot(row.game_id, row.row, row.col, row.result));
    });
  });
};
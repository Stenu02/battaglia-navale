import db from './db.js';
import { Tournament } from './models.js';

// Crea un nuovo torneo e ritorna il suo ID
export const createTournament = (code, difficulty, gridSize) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO tournaments (code, difficulty, grid_size) 
                 VALUES (?, ?, ?)`;
    db.run(sql, [code, difficulty, gridSize], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.lastID);
    });
  });
};

// Restituisce un torneo dato il suo code
export const getTournamentByCode = (code) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tournaments WHERE code = ?';
    db.get(sql, [code], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve(null);
      else
        resolve(new Tournament(row.id, row.code, row.difficulty, row.grid_size));
    });
  });
};
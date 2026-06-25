import db from './db.js';
import { Game } from './models.js';


//Crea un nuovo game e restituisce il suo ID
export const createGame = (userId, tournamentId, difficulty, gridSize, missiles) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO games (user_id, tournament_id, difficulty, grid_size, missiles, status) 
                 VALUES (?, ?, ?, ?, ?, 'ongoing')`;
    db.run(sql, [userId, tournamentId, difficulty, gridSize, missiles], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.lastID);
    });
  });
};

//Restituisce un game dato il suo ID
export const getGameById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve(null);
      else
        resolve(new Game(row.id, row.user_id, row.tournament_id, row.difficulty, row.grid_size, row.missiles, row.status, row.created_at));
    });
  });
};

//aggiorna lo stato di un game (vinto o perso)
export const updateGameStatus = (gameId, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET status = ? WHERE id = ?';
    db.run(sql, [status, gameId], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
};


//Aggiorna il numero di missili rimanenti in game
export const updateMissiles = (gameId, missiles) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET missiles = ? WHERE id = ?';
    db.run(sql, [missiles, gameId], function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
  });
};

//Restituisci le statistiche di un utente in base al livello di difficoltà
export const getStats = (userId) => {
  return new Promise((resolve, reject) => {
   const sql = `SELECT difficulty, 
                    COUNT(*) as played,
                    SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as won,
                    SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) as lost
             FROM games 
             WHERE user_id = ? AND status != 'ongoing'
             GROUP BY difficulty`;
    db.all(sql, [userId], (err, rows) => {
      if (err)
        reject(err);
      else
        resolve(rows.map(row => ({
          difficulty: row.difficulty,
          played: row.played,
          won: row.won,
          lost: row.lost,
          winPercentage: Math.round((row.won / row.played) * 100)
        })));
    });
  });
};

// Elimina la partita casuale e tutti i dati relativi ad essa dopo la sua fine
export const deleteGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql1 = 'DELETE FROM shots WHERE game_id = ?';
    const sql2 = 'DELETE FROM ships WHERE game_id = ?';
    const sql3 = 'DELETE FROM games WHERE id = ?';
    db.run(sql1, [gameId], (err) => {
      if (err) reject(err);
      else db.run(sql2, [gameId], (err) => {
        if (err) reject(err);
        else db.run(sql3, [gameId], function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        });
      });
    });
  });
};


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
        resolve(new Game(row.id, row.user_id, row.tournament_id, row.difficulty, row.grid_size, row.missiles, row.status));
    });
  });
};

//aggiorna lo stato di un game 
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


export const getGameByUserAndTournament = (userId, tournamentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE user_id = ? AND tournament_id = ?';
    db.get(sql, [userId, tournamentId], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve(null);
      else
        resolve(new Game(row.id, row.user_id, row.tournament_id, row.difficulty, row.grid_size, row.missiles, row.status));
    });
  });
};

//Restituisci le statistiche di tutti gli utenti in base al livello di difficoltà
export const getStats = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT users.id as userId, users.name,
                        games.difficulty,
                        COUNT(*) as played,
                        SUM(CASE WHEN games.status = 'won' THEN 1 ELSE 0 END) as won,
                        SUM(CASE WHEN games.status = 'lost' THEN 1 ELSE 0 END) as lost
                 FROM games JOIN users ON games.user_id = users.id
                 WHERE games.status != 'ongoing'
                 GROUP BY users.id, games.difficulty`;
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else
        resolve(rows.map(row => ({
          userId: row.userId,
          name: row.name,
          difficulty: row.difficulty,
          played: row.played,
          won: row.won,
          lost: row.lost,
          winPercentage: Math.round((row.won / row.played) * 100)
        })));
    });
  });
};



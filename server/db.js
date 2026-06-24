import sqlite from 'sqlite3';

const db = new sqlite.Database('./BattagliaNavale.db', (err) => {
  if (err) throw err;
});

export default db;
// Imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import { getGameConfig, generateCode, generateShips, DIFFICULTY_KEYS } from './gameUtils.js';

// Passport imports
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// Dao imports
import { getUser } from './userDao.js';
import { createGame, getGameById, updateGameStatus, updateMissiles, getStats, getGameByUserAndTournament } from './gameDao.js';
import { createShip, getShipsByGame, markShipAsSunk, getTournamentShips, createTournamentShip, getShipByCell } from './shipDao.js';
import { createShot, getShotsByGame, getShotByCell, getHitsByShip } from './shotDao.js';
import { createTournament, getTournamentByCode } from './tournamentDao.js';

// init express
const app = express();
const port = 3001;

// middlewares
app.use(express.json());
app.use(morgan('dev'));

// CORS 
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  exposedHeaders: ['WWW-Authenticate'],
  credentials: true
};
app.use(cors(corsOptions));



//Passport
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if (!user)
    return cb(null, false, 'Username o password errati');
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

app.use(session({
  secret: "battaglia_navale_secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate("session"));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Non autenticato" });
}

// Tiene solo il messaggio di ciascun errore di validazione
const errorFormatter = ({ msg }) => msg;

// Risponde 422 con un unico messaggio d'errore: { error: "msg1, msg2, ..." }
const onValidationErrors = (result, res) => {
  const errors = result.formatWith(errorFormatter);            // errorFormatter -> stringa msg
  const message = Object.values(errors.mapped()).join(', ');   // unisce i messaggi dei campi
  return res.status(422).json({ error: message });             // stessa forma di tutti gli altri errori
};

/* ROUTES */

// POST /api/sessions 
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  return res.status(200).json(req.user);
});


// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  }
  else
    res.status(401).json({ error: "Non autenticato" });
});

// DELETE /api/sessions/current - Logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).end();
  });
});


// POST /api/tournaments 
app.post('/api/tournaments', isLoggedIn, [
  check('difficulty').isIn(['easy', 'medium', 'hard'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return onValidationErrors(errors, res);

  try {
    // Configurazione in base alla difficoltà
    const config = getGameConfig(req.body.difficulty);

    // Codice generico univoco
    let code = generateCode();
    let tournament = await getTournamentByCode(code);
    while (tournament) {
      code = generateCode();
      tournament = await getTournamentByCode(code);
    }

    // Creazione del torneo
    const tournamentId = await createTournament(code, req.body.difficulty, config.gridSize);

    // Chiamata alla funzione che genera casualmente la posizione delle navi
    const ships = generateShips(config.gridSize, config.ships);

    // Le navi vengono aggiunte al Torneo
    for (const ship of ships) {
      await createTournamentShip(tournamentId, ship.size, ship.row, ship.col, ship.direction);
    }

    //Creazione di una nuova partita per il creatore del torneo
    const gameId = await createGame(req.user.id, tournamentId, req.body.difficulty, config.gridSize, config.missiles);

    for (const ship of ships) {
      await createShip(gameId, ship.size, ship.row, ship.col, ship.direction);
    }

    return res.status(201).json({
      code: code,
      gameId: gameId,
      gridSize: config.gridSize,
      ships: config.ships,
      missiles: config.missiles
    });
  } catch (err) {
    return res.status(500).json({ error: 'Errore interno del server' });
  }
});


// POST /api/tournaments/:code/join 
app.post('/api/tournaments/:code/join', isLoggedIn, async (req, res) => {
  try {
    // Verifichiamo che il codice è associato ad un torneo
    const tournament = await getTournamentByCode(req.params.code);
    if (!tournament)
      return res.status(404).json({ error: 'Torneo non trovato' });

    const existingGame = await getGameByUserAndTournament(req.user.id, tournament.id);
    if (existingGame)
      return res.status(409).json({ error: 'Hai già una partita in questo torneo' })

    const config = getGameConfig(tournament.difficulty);

    // Recuperiamo la posizione delle navi 
    const tournamentShips = await getTournamentShips(tournament.id);

    // Creiamo un nuovo game
    const gameId = await createGame(req.user.id, tournament.id, tournament.difficulty, tournament.gridSize, config.missiles);


    for (const ship of tournamentShips) {
      await createShip(gameId, ship.size, ship.row, ship.col, ship.direction);
    }

    return res.status(201).json({
      gameId: gameId,
      gridSize: tournament.gridSize,
      ships: config.ships,
      missiles: config.missiles
    });
  } catch (err) {
    return res.status(500).json({ error: 'Errore interno del server' });
  }
});

// POST /api/games 
app.post('/api/games', [
  check('difficulty').isIn(['easy', 'medium', 'hard'])
], async (req, res) => {
  // Controllo utenti anonimi
  if (req.isAuthenticated())
    return res.status(403).json({ error: 'Gli utenti autenticati non possono giocare una partita casuale' });

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return onValidationErrors(errors, res);

  try {
    // Configurazione sulla base della difficoltà
    const config = getGameConfig(req.body.difficulty);

    // Posizionamento navi random
    const ships = generateShips(config.gridSize, config.ships);


    const gameId = await createGame(null, null, req.body.difficulty, config.gridSize, config.missiles);


    for (const ship of ships) {
      await createShip(gameId, ship.size, ship.row, ship.col, ship.direction);
    }

    return res.status(201).json({
      gameId: gameId,
      gridSize: config.gridSize,
      ships: config.ships,
      missiles: config.missiles
    });
  } catch (err) {
    return res.status(500).json({ error: 'Errore interno del server' });
  }
});

// POST /api/games/:id/shots -
app.post('/api/games/:id/shots', [
  check('row').isInt({ min: 1 }),
  check('col').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return onValidationErrors(errors, res);

  try {

    const game = await getGameById(req.params.id);
    if (!game)
      return res.status(404).json({ error: 'Partita non trovata' });


    if (game.status !== 'ongoing')
      return res.status(403).json({ error: 'Partita già conclusa' });


    if (game.userId && !req.isAuthenticated())
      return res.status(401).json({ error: 'Non autenticato' });


    if (game.userId && game.userId !== req.user.id)
      return res.status(403).json({ error: 'Non autorizzato' });

    // Controllo validità coordinate
    if (req.body.row > game.gridSize || req.body.col > game.gridSize)
      return res.status(422).json({ error: 'Coordinate non valide' });

    // Controllo cella già colpita
    const existingShot = await getShotByCell(req.params.id, req.body.row, req.body.col);
    if (existingShot)
      return res.status(409).json({ error: 'Cella già colpita' });

    // Controllo se una nave viene colpita
    const hitShip = await getShipByCell(req.params.id, req.body.row, req.body.col);
    let result = 'water';
    let newMissiles = game.missiles;
    let sunkShipCells = null;

    if (hitShip) {
      const hits = await getHitsByShip(req.params.id, hitShip.row, hitShip.col, hitShip.size, hitShip.direction);
      if (hits + 1 === hitShip.size) {
        result = 'sunk';
        await markShipAsSunk(req.params.id, hitShip.row, hitShip.col);
        sunkShipCells = Array.from({ length: hitShip.size }, (_, i) => ({
          row: hitShip.direction === 'H' ? hitShip.row : hitShip.row + i,
          col: hitShip.direction === 'H' ? hitShip.col + i : hitShip.col
        }));
      } else {
        result = 'hit';
      }
    } else {
      newMissiles = game.missiles - 1;
      await updateMissiles(req.params.id, newMissiles);
    }


    await createShot(req.params.id, req.body.row, req.body.col, result);


    let status = 'ongoing';
    if (result === 'sunk') {
      const ships = await getShipsByGame(req.params.id);
      const allSunk = ships.every(ship => ship.sunk === 1);
      if (allSunk) {
        status = 'won';
        await updateGameStatus(req.params.id, 'won');
      }
    }

    //Controllo partita persa
    if (newMissiles === 0 && status === 'ongoing') {
      status = 'lost';
      await updateGameStatus(req.params.id, 'lost');
    }


    return res.status(200).json({
      result: result,
      missiles: newMissiles,
      status: status,
      sunkShipCells: sunkShipCells
    });
  } catch (err) {
    return res.status(500).json({ error: 'Errore interno del server' });
  }
});



// GET /api/games/:id 
app.get('/api/games/:id', async (req, res) => {
  try {

    const game = await getGameById(req.params.id);
    if (!game)
      return res.status(404).json({ error: 'Partita non trovata' });


    if (game.userId && !req.isAuthenticated())
      return res.status(401).json({ error: 'Non autenticato' });


    if (game.userId && game.userId !== req.user.id)
      return res.status(403).json({ error: 'Non autorizzato' });


    const shots = await getShotsByGame(req.params.id);


    const ships = await getShipsByGame(req.params.id);
    const sunkenShips = ships
      .filter(ship => ship.sunk === 1)
      .map(ship => ship.size);

    return res.status(200).json({
      gameId: game.id,
      status: game.status,
      difficulty: game.difficulty,
      missiles: game.missiles,
      gridSize: game.gridSize,
      ships: ships.map(s => s.size),
      shots: shots.map(shot => ({ row: shot.row, col: shot.col, result: shot.result })),
      sunkenShips: sunkenShips
    });
  } catch (err) {
    return res.status(500).json({ error: 'Errore interno del server' });
  }
});

// GET /api/games/:id/ships 
app.get('/api/games/:id/ships', async (req, res) => {
  try {

    const game = await getGameById(req.params.id);
    if (!game)
      return res.status(404).json({ error: 'Partita non trovata' });


    if (game.userId && !req.isAuthenticated())
      return res.status(401).json({ error: 'Non autenticato' });


    if (game.userId && game.userId !== req.user.id)
      return res.status(403).json({ error: 'Non autorizzato' });

    // Controllo sullo stato della partita
    if (game.status === 'ongoing')
      return res.status(403).json({ error: 'Partita ancora in corso' });

    const ships = await getShipsByGame(req.params.id);

    return res.status(200).json({
      ships: ships.map(ship => ({
        size: ship.size,
        row: ship.row,
        col: ship.col,
        direction: ship.direction,
        sunk: ship.sunk
      }))
    });
  } catch (err) {
    return res.status(500).json({ error: 'Errore interno del server' });
  }
});


// GET /api/stats 
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats(); 
    return res.status(200).json({ stats });
  } catch (err) {
    return res.status(500).json({ error: 'Errore interno del server' });
  }
});

// GET /api/config - configurazione di gioco delle difficoltà 
app.get('/api/config', (req, res) => {
  const config = DIFFICULTY_KEYS.map(key => {
    const c = getGameConfig(key);
    return { key, gridSize: c.gridSize, missiles: c.missiles, shipsCount: c.ships.length, shipSizes: c.ships };
  });
  return res.status(200).json(config);
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
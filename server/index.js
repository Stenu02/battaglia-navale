// Imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';

// Passport imports
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// Dao imports
import { getUser, getUserById } from './userDao.js';
import { createGame, getGameById, updateGameStatus, updateMissiles, getStats, deleteGame } from './gameDao.js';
import { createShip, getShipsByGame, markShipAsSunk, getTournamentShips, createTournamentShip, getShipByCell } from './shipDao.js';
import { createShot, getShotsByGame, getShotByCell } from './shotDao.js';
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
    return cb(null, false, 'Incorrect username or password.');
  return cb(null, user);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  return cb(null, user);
});

app.use(session({
  secret: "battaglia_navale_secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate("session"));

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: "Not authenticated"});
}

/* ROUTES */

// POST /api/sessions 
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  return res.status(201).json(req.user);
});


// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: "Not authenticated"});
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
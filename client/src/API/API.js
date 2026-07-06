
const SERVER_URL = 'http://localhost:3001';

// effettua il login
export const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = response.headers.get('WWW-Authenticate');
    throw errDetails;
  }
};

// recupera le info utente dopo il login
export const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = response.headers.get('WWW-Authenticate');
    throw errDetails;
  }
};

// effettua il logout
export const logOut = async() => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: "DELETE",
    credentials: "include"
  });
  if(response.ok)
    return null;
}

// crea torneo
export const createTournament = async (difficulty) => {
  const response = await fetch(SERVER_URL + '/api/tournaments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ difficulty }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errMessage = await response.json();
    throw errMessage.error;
  }
};

//Partecipa al torneo
export const joinTournament = async (code) => {
  const response = await fetch(`${SERVER_URL}/api/tournaments/${code}/join`, {
    method: 'POST',
    credentials: 'include',
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errMessage = await response.json();
    throw errMessage.error;
  }
};

//crea game casuale
export const createCasualGame = async (difficulty) => {
  const response = await fetch(`${SERVER_URL}/api/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ difficulty }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errMessage = await response.json();
    throw errMessage.error;
  }
};

//lancia missile
export const fireShot = async (gameId, row, col) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/shots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ row, col }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
   } else {
    const errMessage = await response.json();
    throw errMessage.error;
  }
};

//restituisci game
export const getGame = async (gameId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}`, {
    credentials: 'include',
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errMessage = await response.json();
    throw errMessage.error;
  }
};



//restituisci posizione navi
export const getShips = async (gameId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/ships`, {
    credentials: 'include',
  });
  if (response.ok) {
    const data = await response.json();
    return data.ships;
  } else {
    const errMessage = await response.json();
    throw errMessage.error;
  }
};

//restituisci statistiche
export const getStats = async () => {
  const response = await fetch(`${SERVER_URL}/api/stats`);
  if (response.ok) {
    const data = await response.json();
    return data.stats;
  } else {
    const errMessage = await response.json();
    throw errMessage.error;
  }
};

// recupera la configurazione di gioco delle difficoltà
export const getConfig = async () => {
  const response = await fetch(`${SERVER_URL}/api/config`);
  if (response.ok) {
    return await response.json();
  } else {
    const errMessage = await response.json();
    throw errMessage.error;
  }
};



const API = {
  logIn,
  getUserInfo,
  logOut,
  createTournament,
  joinTournament,
  createCasualGame,
  fireShot,
  getGame,
  getShips,
  getStats,
  getConfig,
};

export default API;
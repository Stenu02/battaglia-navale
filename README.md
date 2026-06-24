[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/W4bhbCo5)
# Exam #2: "Battaglia Navale"
## Student: s363651 Nuzzo Stefano 

## React Client Application Routes

- Route `/`: main page, visible to all users. Shows a brief description of the game and two options: start a casual game or navigate to the login page to access tournament mode.
- Route `/login`: login page, contains the login form where users can enter their credentials. Redirects to /dashboard after successful login. Redirects to /dashboard if the user is already authenticated.
- Route `/dashboard`: personal area for authenticated users. Shows options to create a new tournament, join an existing one by entering a code, and a link to the statistics page. Redirects to /login if the user is not authenticated.
- Route `/game/:id`: game screen, shows the NxN grid and allows the player to fire missiles by clicking on cells. Displays the number of missiles remaining, the ships sizes, and the result of each shot. At the end of the game, reveals the positions of all ships. Accessible to both anonymous (casual) and authenticated (tournament) users.
- Route `/stats`: statistics page, shows the number of games played, won and lost, and the win percentage for each difficulty level. Redirects to /login if the user is not authenticated.
- Route `*`: Default page loaded in case of non-existing URLs.

## API Server

- POST `/api/sessions`
  - request parameters: none
  - request body: credentials (username, password)
  - response body: user info
  - response status: 200 successful login, 401 wrong credentials, 500 internal server error
  - response body example (in case of success): { id: 1, username: 'stefano@polito.it', name: 'Stefano' }
- GET `/api/sessions/current`
  - request parameters: cookie for passport authentication
  - request body: none
  - response body: user info
  - response status: 200 success, 401 not authenticated, 500 internal server error
  - response body example (in case of success): { id: 1, username: 'stefano@polito.it', name: 'Stefano' }
- DELETE `/api/sessions/current`
  - request parameters: cookie for passport authentication
  - request body: none
  - response body: none
  - response status: 200 successful logout, 500 internal server error
- POST `/api/tournaments`
  - request parameters: cookie for passport authentication
  - request body: difficulty (easy, medium, hard)
  - response body: tournament code, game info
  - response status: 201 Created, 401 Unauthorized, 422 Unprocessable Entity, 500 Internal Server Error
  - response body example (in case of success): { code: 'ALFA42', gameId: 1, gridSize: 10, ships: [2, 2, 3, 4], missiles: 15 }
- POST `/api/tournaments/:code/join`
  - request parameters: cookie for passport authentication, code (tournament code in the URL)
  - request body: none
  - response body: game info
  - response status: 201 Created, 401 Unauthorized, 404 Not Found (tournament code does not exist), 500 Internal Server Error
  - response body example (in case of success): { gameId: 2, gridSize: 10, ships: [2, 2, 3, 4], missiles: 15 }
- POST `/api/games`
  - request parameters: none
  - request body: difficulty (easy, medium, hard)
  - response body: game info
  - response status: 201 Created, 401 Unauthorized (if user is authenticated), 422 Unprocessable Entity, 500 Internal Server Error
  - response body example (in case of success): { gameId: 1, gridSize: 5, ships: [2, 2, 3], missiles: 10 }
- POST `/api/games/:id/shots`
  - request parameters: game id in the URL, cookie for passport authentication (optional, required for tournament games)
  - request body: row, col (coordinates of the shot)
  - response body: shot result, updated game status
  - response status: 200 OK, 401 Unauthorized,403 Forbidden (game already ended), 404 Not Found (game does not exist), 409 Conflict (cell already fired upon), 422 Unprocessable Entity (invalid coordinates), 500 Internal Server Error
  - response body example (in case of success): { result: 'water', missiles: 9, status: 'ongoing' }
- GET `/api/games/:id`
  - request parameters: game id in the URL, cookie for passport authentication (optional, required for tournament games)
  - request body: none
  - response body: game status, missiles remaining, list of shots fired, list of sunken ships sizes
  - response status: 200 OK, 401 Unauthorized, 403 Forbidden (trying to access another user's game), 404 Not Found (game does not exist), 500 Internal Server Error
  - response body example (in case of success): { gameId: 1, status: 'ongoing', missiles: 9, shots: [{ row: 2, col: 3, result: 'water' }, ...], sunkenShips: [2, 3] }
- GET `/api/games/:id/ships`
  - request parameters: game id in the URL, cookie for passport authentication (optional, required for tournament games)
  - request body: none
  - response body: list of all ships with their positions
  - response status: 200 OK, 401 Unauthorized, 403 Forbidden, 404 Not Found (game does not exist), 500 Internal Server Error
  - response body example (in case of success): { ships: [{ size: 4, row: 2, col: 3, direction: 'H', sunk: 1 }, { size: 2, row: 5, col: 1, direction: 'V', sunk: 0 }, ...] }
- GET `/api/stats`
  - request parameters: cookie for passport authentication
  - request body: none
  - response body: statistics per difficulty level
  - response status: 200 OK, 401 Unauthorized, 500 Internal Server Error
  - response body example (in case of success): { stats: [{ difficulty: 'easy', played: 5, won: 3, lost: 2, winPercentage: 60 }, { difficulty: 'medium', played: 3, won: 1, lost: 2, winPercentage: 33 }, ...] }

## Database Tables

- Table `users` -  contains id, username, name, hash (hashed password), salt (salt used for hashing the password)
- Table `tournaments` - contains id, code (used to join the tournament), difficulty (easy,medium,hard), grid_size (N of NxN)
- Table `tournament_ships` - contains tournament_id, size (number of cells occupied by the ship), row (starting row of the ship), col (starting column of the ship), direction ('H' for horizontal, 'V' for vertical). Primary key is (tournament_id, row, col). It is copied into ships table when a new player joins
- Table `games` - contains id, user_id (NULL if casual mode), tournament_id (NULL if casual mode), difficulty (easy, medium, hard), grid_size (N of NxN), missiles (number of missiles remaining), status ('ongoing', 'won', 'lost'), created_at
- Table `ships` - contains game_id, size, row (starting row of the ship), col (starting column of the ship), direction ('H' for horizontal, 'V' for vertical), sunk (0 if still afloat, 1 if sunk). Primary key is (game_id, row, col).  For tournament games, coordinates are copied from tournament_ships at game creation.
- Table `shots` - contains game_id, row, col (coordinates of the shot), result ('water', 'hit', 'sunk'). Primary key is (game_id, row, col).

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username: stefano@polito.it, password: passwordStefano
- username: marina@polito.it, password: passwordMarina
- username: francesco@polito.it, password: passwordFrancesco

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.

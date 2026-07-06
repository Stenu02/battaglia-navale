export const DIFFICULTY_KEYS = ['easy', 'medium', 'hard'];

export const getGameConfig = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return {
        gridSize: 8,
        missiles: 20,
        ships: [2, 2, 3, 4]
      };
    case 'medium':
      return {
        gridSize: 10,
        missiles: 30,
        ships: [2, 2, 3, 3, 4, 5]
      };
    case 'hard':
      return {
        gridSize: 15,
        missiles: 40,
        ships: [2, 2, 2, 3, 3, 3, 4, 4, 5, 5]
      };
    default:
      return null;
  }
};


export const generateCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};



export const generateShips = (gridSize, ships) => {
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  const placedShips = [];

  for (const size of ships) {
    let placed = false;
    while (!placed) {
      const direction = Math.random() < 0.5 ? 'H' : 'V';
      const row = Math.floor(Math.random() * gridSize) + 1;
      const col = Math.floor(Math.random() * gridSize) + 1;

      if (canPlaceShip(grid, row, col, size, direction, gridSize)) {
        placeShip(grid, row, col, size, direction);
        placedShips.push({ size, row, col, direction });
        placed = true;
      }
    }
  }
  return placedShips;
};

// Checks if a ship can be placed at the given position
const canPlaceShip = (grid, row, col, size, direction, gridSize) => {
  for (let i = 0; i < size; i++) {
    const r = direction === 'H' ? row : row + i;
    const c = direction === 'H' ? col + i : col;

    // Check if out of bounds
    if (r > gridSize || c > gridSize) return false;

    // Check if cell or adjacent cells are occupied
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 1 && nr <= gridSize && nc >= 1 && nc <= gridSize) {
          if (grid[nr - 1][nc - 1] === 1) return false;
        }
      }
    }
  }
  return true;
};

// Places a ship on the grid
const placeShip = (grid, row, col, size, direction) => {
  for (let i = 0; i < size; i++) {
    const r = direction === 'H' ? row : row + i;
    const c = direction === 'H' ? col + i : col;
    grid[r - 1][c - 1] = 1;
  }
};
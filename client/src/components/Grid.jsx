import Cell from './Cell.jsx';

const getCellSize = (gridSize) => {
  if (gridSize <= 8) return 90;
  if (gridSize <= 10) return 75;
  return 58;
};

function Grid(props) {
  const cellSize = getCellSize(props.gridSize);

  const sunkCells = new Set(
    props.sunkShips.flatMap(s => s.cells).map(c => `${c.row}-${c.col}`)
  );

  const getCellState = (row, col) => {
    if (sunkCells.has(`${row}-${col}`)) return 'sunk';

    const shot = props.shots.find(s => s.row === row && s.col === col);
    if (shot) return shot.result;

    if (props.status !== 'ongoing') {
      const isShip = props.allShips.some(ship => {
        if (ship.direction === 'H')
          return ship.row === row && col >= ship.col && col < ship.col + ship.size;
        else
          return ship.col === col && row >= ship.row && row < ship.row + ship.size;
      });
      if (isShip) return 'ship';
    }

    return 'empty';
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${props.gridSize}, ${cellSize}px)`,
      gap: '5px',
      width: 'fit-content'
    }}>
      {Array.from({ length: props.gridSize }, (_, r) =>
        Array.from({ length: props.gridSize }, (_, c) => {
          const row = r + 1;
          const col = c + 1;
          const state = getCellState(row, col);
          return (
            <Cell
              key={`${row}-${col}`}
              size={cellSize}
              state={state}
              onClick={() => {
                const alreadyShot = props.shots.some(s => s.row === row && s.col === col);
                if (props.status === 'ongoing' && !alreadyShot) {
                  props.onShot(row, col);
                }
              }}
            />
          );
        })
      )}
    </div>
  );
}

export default Grid;
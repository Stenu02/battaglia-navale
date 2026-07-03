import Cell from './Cell.jsx';

function Grid(props) {
  const getCellState = (row, col) => {
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
      gridTemplateColumns: `repeat(${props.gridSize}, 40px)`,
      gap: '2px',
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
              state={state}
              onClick={() => props.status === 'ongoing' && props.onShot(row, col)}
            />
          );
        })
      )}
    </div>
  );
}

export default Grid;
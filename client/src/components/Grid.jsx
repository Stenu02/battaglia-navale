import Cell from './Cell.jsx';

function Grid(props) {

  //Celle navi affondate
  const sunkCells = new Set(
    props.sunkShips.flatMap(s => s.cells).map(c => `${c.row}-${c.col}`)
  );

  //utile per capire lo stato della cella, e riflettere "graficamente" il risultato
  const getCellState = (row, col) => {
    //Nave già affondata
    if (sunkCells.has(`${row}-${col}`)) return 'sunk';
    //Controllo cella già colpita
    const shot = props.shots.find(s => s.row === row && s.col === col);
    if (shot) return shot.result;

    //Partita finita, navi da rivelare
    if (props.status !== 'ongoing') {
      //Ricaviamo la posizione di tutte le navi, verificando se nella cella ci sia una nave
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
    <div
      className={props.gridSize > 10 ? "game-grid game-grid-hard" : "game-grid"}
      style={{ '--grid-cols': props.gridSize }}
    >
      {Array.from({ length: props.gridSize }, (_, r) =>
        Array.from({ length: props.gridSize }, (_, c) => {
          const row = r + 1;
          const col = c + 1;
          const state = getCellState(row, col);
          return (
            <Cell
              key={`${row}-${col}`}
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
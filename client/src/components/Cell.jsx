const cellStyles = {
  empty: { backgroundColor: '#e0e0e0', cursor: 'pointer' },
  water: { backgroundColor: '#4a90d9', cursor: 'not-allowed' },
  hit:   { backgroundColor: '#f5a623', cursor: 'not-allowed' },
  sunk:  { backgroundColor: '#d0021b', cursor: 'not-allowed' },
  ship:  { backgroundColor: '#333',    cursor: 'default' }
};

const cellContent = {
  empty: '',
  water: '〜',
  hit:   '✕',
  sunk:  '💣',
  ship:  '▪'
};

function Cell(props) {
  return (
    <div
      onClick={props.onClick}
      style={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        border: '1px solid #ccc',
        userSelect: 'none',
        ...cellStyles[props.state]
      }}>
      {cellContent[props.state]}
    </div>
  );
}

export default Cell;
const cellStyles = {
  empty: { backgroundColor: 'var(--bs-secondary-bg)', cursor: 'pointer' },
  water: { backgroundColor: '#0B3D66', cursor: 'not-allowed' },
  hit:   { backgroundColor: 'var(--bs-warning)', cursor: 'not-allowed' },
  sunk:  { backgroundColor: 'var(--bs-danger)', cursor: 'not-allowed' },
  ship:  { backgroundColor: 'var(--bs-dark)', cursor: 'default' }
};

const cellIcons = {
  water: 'bi-droplet-fill',
  hit: 'bi-fire',
  sunk: 'bi-fire',
};

function Cell(props) {
  const icon = cellIcons[props.state];
  return (
    <div
      onClick={props.onClick}
      style={{
        width: `${props.size}px`,
        height: `${props.size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.round(props.size * 0.35)}px`,
        color: 'white',
        border: '1px solid var(--bs-border-color)',
        borderRadius: '6px',
        userSelect: 'none',
        ...cellStyles[props.state]
      }}>
      {icon && <i className={`bi ${icon}`}></i>}
    </div>
  );
}

export default Cell;
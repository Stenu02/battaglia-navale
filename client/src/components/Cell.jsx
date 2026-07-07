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
      className={`cell cell-${props.state}`}>
      {icon && <i className={`bi ${icon}`}></i>}
    </div>
  );
}

export default Cell;
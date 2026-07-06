function ShipIndicator(props) {
  const remaining = props.sunkShips.map(s => s.size);
  const isSunk = props.ships.map(size => {
    const idx = remaining.indexOf(size);
    if (idx !== -1) {
      remaining.splice(idx, 1);
      return true;
    }
    return false;
  });

  return (
    <div className='d-flex flex-wrap gap-2'>
      {props.ships.map((size, index) => (
        <span
          key={index}
          title={`Nave da ${size}${isSunk[index] ? ' - affondata' : ''}`}
          className={`d-inline-flex align-items-center justify-content-center rounded-3 fw-semibold ${isSunk[index] ? 'bg-body-tertiary text-muted text-decoration-line-through' : 'text-white'}`}
          style={{
            width: 55,
            height: 55,
            fontSize: '22px',
            backgroundColor: isSunk[index] ? undefined : '#0B3D66',
            border: isSunk[index] ? '2px solid var(--bs-border-color)' : 'none'
          }}>
          {size}
        </span>
      ))}
    </div>
  );
}

export default ShipIndicator;
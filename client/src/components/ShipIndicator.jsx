function ShipIndicator(props) {
  const remaining = props.sunkShips.map(s => s.size); //Array con dimensioni delle navi affondate
  const isSunk = props.ships.map(size => {
    //Rimuoviamo ogni nave affondata, dall'array delle navi
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
          className={`ship-tag d-inline-flex align-items-center justify-content-center rounded-3 fw-semibold ${isSunk[index] ? 'ship-tag-sunk bg-body-tertiary text-muted text-decoration-line-through' : 'ship-tag-afloat text-white'}`}>
          {size}
        </span>
      ))}
    </div>
  );
}

export default ShipIndicator;
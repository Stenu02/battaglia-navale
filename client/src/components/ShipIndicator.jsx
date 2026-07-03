
function ShipIndicator(props) {
  return (
    <div className='d-flex flex-wrap gap-2 mb-3'>
      {props.ships.map((size, index) => (
        <div
          key={index}
          className='d-flex gap-1'
          title={`Nave da ${size}`}>
          {Array.from({ length: size }, (_, i) => (
            <div
              key={i}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: index < props.sunkenCount ? '#aaa' : '#333',
                border: '1px solid #666'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default ShipIndicator;
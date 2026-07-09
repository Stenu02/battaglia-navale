import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, ProgressBar, Card } from 'react-bootstrap';
import Grid from './Grid.jsx';
import ShipIndicator from './ShipIndicator.jsx';
import API from '../API/API.js';


function GameBoard(props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState({
    status: 'ongoing',
    missiles: 0,
    gridSize: 0,
    difficulty: '',
    ships: [],
    shots: []
  });
  const [allShips, setAllShips] = useState([]);
  const [sunkShips, setSunkShips] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGame = async () => {
      try {
        const data = await API.getGame(id);
        setGame(data);
        if (data.status !== 'ongoing') {
          const shipsData = await API.getShips(id);
          setAllShips(shipsData);
        }
      } catch (err) {
        setError(err);
      }
    };
    loadGame();
  }, [id]);

  const handleShot = async (row, col) => {
    try {
      const shotData = await API.fireShot(id, row, col);
      // Aggiorniamo lo stato di gioco
      setGame(prev => ({
        ...prev,
        missiles: shotData.missiles,
        status: shotData.status,
        shots: [...prev.shots, { row, col, result: shotData.result }]
      }));
      // Se il colpo ha affondato una nave, salviamo le sue celle
      if (shotData.sunkShipCells) {
        setSunkShips(prev => [...prev, { size: shotData.sunkShipCells.length, cells: shotData.sunkShipCells }]);
      }
      // Partita finita
      if (shotData.status !== 'ongoing') {
        const shipsData = await API.getShips(id);
        setAllShips(shipsData);
      }
    } catch (err) {
      setError(err);
    }
  };

  const maxMissiles = props.config[game.difficulty]?.missiles || 1;

  let statusMessage;
  if (game.status === 'won') {
    statusMessage = { icon: 'bi-trophy-fill', color: 'success', text: 'Hai vinto! Tutte le navi sono state affondate.' };
  } else if (game.status === 'lost') {
    statusMessage = { icon: 'bi-x-octagon-fill', color: 'danger', text: 'Hai perso! Hai esaurito tutti i siluri.' };
  } else {
    statusMessage = { icon: 'bi-crosshair', color: 'secondary', text: 'Clicca su una cella della griglia per lanciare un siluro' };
  }

  return (
    <div className='game-screen'>
      {error && <Alert variant='danger' className='mb-4'>{error}</Alert>}

      <div className='d-flex align-items-center justify-content-center flex-wrap gap-4'>

        <Card className='game-side-panel'>
          <Card.Body className='p-4'>
            <p className='text-muted text-uppercase small mb-2'>Missili</p>
            <p className='mb-2 missile-count'>
              {game.missiles}<span className='fs-6 text-muted'> / {maxMissiles}</span>
            </p>
            <ProgressBar variant='danger' now={(game.missiles / maxMissiles) * 100} className='mb-3 progress-thin' />
            <p className='mb-0 fs-6 text-secondary'>
              Navi affondate: <strong className='text-dark'>{sunkShips.length}/{game.ships.length}</strong>
            </p>
          </Card.Body>
        </Card>

        <div className='d-flex flex-column align-items-center gap-3'>
          <span className={`${game.status === 'ongoing' ? 'fs-5' : 'fs-4 fw-semibold'} text-${statusMessage.color}`}>
            <i className={`bi ${statusMessage.icon} me-2`}></i>
            {statusMessage.text}
          </span>

          <Grid
            gridSize={game.gridSize}
            shots={game.shots}
            sunkShips={sunkShips}
            allShips={allShips}
            status={game.status}
            onShot={handleShot}
          />
        </div>

        <Card className='game-side-panel'>
          <Card.Body className='p-4'>
            <p className='text-muted text-uppercase small mb-3'>Flotta</p>
            <ShipIndicator ships={game.ships} sunkShips={sunkShips} />
          </Card.Body>
        </Card>

      </div>

      {game.status !== 'ongoing' && (
        <div className='text-center mt-4'>
          <Button variant='outline-primary' size='lg' onClick={() => navigate('/')}>
            Torna indietro
          </Button>
        </div>
      )}
    </div>
  );
}

export default GameBoard;
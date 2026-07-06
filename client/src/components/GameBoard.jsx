import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Alert, Button, ProgressBar, Card } from 'react-bootstrap';
import Grid from './Grid.jsx';
import ShipIndicator from './ShipIndicator.jsx';
import API from '../API/API.js';
import DIFFICULTIES from '../difficulties.js';

function GameBoard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState({
    status: 'ongoing',
    missiles: 0,
    gridSize: 0,
    difficulty: '',
    ships: [],
    shots: [],
    sunkenShips: []
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
      setGame(prev => ({
        ...prev,
        missiles: shotData.missiles,
        status: shotData.status,
        shots: [...prev.shots, { row, col, result: shotData.result }]
      }));
      if (shotData.sunkShipCells) {
        setSunkShips(prev => [...prev, { size: shotData.sunkShipCells.length, cells: shotData.sunkShipCells }]);
      }
      if (shotData.status !== 'ongoing') {
        const shipsData = await API.getShips(id);
        setAllShips(shipsData);
      }
    } catch (err) {
      setError(err);
    }
  };

  const difficultyInfo = DIFFICULTIES.find(d => d.key === game.difficulty);
  const maxMissiles = difficultyInfo?.missiles || 1;

  let statusMessage;
  if (game.status === 'won') {
    statusMessage = { icon: 'bi-trophy-fill', color: 'success', text: 'Hai vinto! Tutte le navi sono state affondate.' };
  } else if (game.status === 'lost') {
    statusMessage = { icon: 'bi-x-octagon-fill', color: 'danger', text: 'Hai perso! Hai esaurito tutti i siluri.' };
  } else {
    statusMessage = { icon: 'bi-crosshair', color: 'secondary', text: 'Clicca su una cella della griglia per lanciare un siluro' };
  }

  return (
    <Row className='justify-content-center mt-4'>
      <Col lg={10} style={{ maxWidth: 960 }}>

        {error && <Alert variant='danger'>{error}</Alert>}

        <div className='d-flex flex-column align-items-center' style={{ gap: '3rem' }}>

          <div className='d-flex flex-column align-items-center gap-3'>
            <span className={`${game.status === 'ongoing' ? 'fs-4' : 'fs-3 fw-semibold'} text-${statusMessage.color}`}>
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

          <Card style={{ maxWidth: 650, width: '100%' }}>
            <Card.Body className='p-4 d-flex gap-4'>
              <div style={{ flex: 1 }}>
                <p className='text-muted text-uppercase small mb-2'>Missili</p>
                <p className='mb-2' style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
                  {game.missiles}<span className='fs-5 text-muted'> / {maxMissiles}</span>
                </p>
                <ProgressBar variant='danger' now={(game.missiles / maxMissiles) * 100} style={{ height: 14 }} className='mb-3' />
                <p className='mb-0 fs-5 text-secondary'>
                  Navi affondate: <strong className='text-dark'>{sunkShips.length}/{game.ships.length}</strong>
                </p>
              </div>

              <div style={{ width: 1, backgroundColor: 'var(--bs-border-color)' }}></div>

              <div style={{ flex: 1 }}>
                <p className='text-muted text-uppercase small mb-3'>Flotta</p>
                <ShipIndicator ships={game.ships} sunkShips={sunkShips} />
              </div>
            </Card.Body>
          </Card>

          {game.status !== 'ongoing' && (
            <Button variant='outline-primary' size='lg' onClick={() => navigate(-1)}>
              Torna indietro
            </Button>
          )}

        </div>

      </Col>
    </Row>
  );
}

export default GameBoard;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Alert, Button, Badge } from 'react-bootstrap';
import Grid from './Grid.jsx';
import ShipIndicator from './ShipIndicator.jsx';
import API from '../API/API.js';

function GameBoard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState({
    status: 'ongoing',
    missiles: 0,
    gridSize: 0,
    ships: [],
    shots: [],
    sunkenShips: []
  });
  const [allShips, setAllShips] = useState([]);
  const [error, setError] = useState('');

  // Carica la partita all'avvio
  useEffect(() => {
    const loadGame = async () => {
      try {
        const data = await API.getGame(id);
        setGame(data);
        if (data.status !== 'ongoing') {
          const shipsData = await API.getShips(id);
          setAllShips(shipsData);
        }
      } catch(err) {
        setError(err);
      }
    };
    loadGame();
  }, [id]);

  // Gestisce un tiro
  const handleShot = async (row, col) => {
    try {
      const shotData = await API.fireShot(id, row, col);
      setGame(prev => ({
        ...prev,
        missiles: shotData.missiles,
        status: shotData.status,
        shots: [...prev.shots, { row, col, result: shotData.result }]
      }));
      if (shotData.status !== 'ongoing') {
        const shipsData = await API.getShips(id);
        setAllShips(shipsData);
      }
    } catch(err) {
      setError(err);
    }
  };

  // Numero di navi affondate — contando i risultati 'sunk' nei tiri
  const sunkenCount = game.shots.filter(s => s.result === 'sunk').length;

  return (
    <Row className='justify-content-center mt-3'>
      <Col md={10}>

        {error && <Alert variant='danger'>{error}</Alert>}

        {/* Risultato finale */}
        {game.status === 'won' &&
          <Alert variant='success'>Hai vinto! 🎉 Tutte le navi affondate!</Alert>}
        {game.status === 'lost' &&
          <Alert variant='danger'>Hai perso! 💀 Siluri esauriti!</Alert>}

        {/* Info partita */}
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <div>
            <Badge bg='danger' className='me-2 fs-6'>
              🚀 Missili: {game.missiles}
            </Badge>
            <Badge bg='secondary' className='fs-6'>
              Navi affondate: {sunkenCount}/{game.ships.length}
            </Badge>
          </div>
          {game.status !== 'ongoing' && (
            <Button variant='outline-primary' onClick={() => navigate(-1)}>
              Torna indietro
            </Button>
          )}
        </div>

        {/* Indicatori navi */}
        <ShipIndicator ships={game.ships} sunkenCount={sunkenCount} />

        {/* Griglia */}
        <Grid
          gridSize={game.gridSize}
          shots={game.shots}
          allShips={allShips}
          status={game.status}
          onShot={handleShot}
        />

      </Col>
    </Row>
  );
}

export default GameBoard;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Modal, Alert, Card } from 'react-bootstrap';
import API from '../API/API.js';
import DIFFICULTIES from '../difficulties.js';

function CreateTournament(props) {
  const [difficulty, setDifficulty] = useState('easy');
  const [showModal, setShowModal] = useState(false);
  const [tournamentData, setTournamentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const selected = props.config[difficulty];

  const handleCreate = async () => {
    setLoading(true);
    try {
      const data = await API.createTournament(difficulty);
      setTournamentData(data);
      setShowModal(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    setShowModal(false);
    navigate(`/game/${tournamentData.gameId}`);
  };

  return (
    <Card className='h-100'>
      <Card.Body className='d-flex flex-column p-4'>
        <div className='d-flex align-items-center gap-3 mb-4'>
          <span
            className='d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis fs-3 icon-badge-sm'>
            <i className='bi bi-flag-fill'></i>
          </span>
          <span className='fs-3 fw-semibold'>Crea torneo</span>
        </div>

        {error && <Alert variant='danger'>{error}</Alert>}

        <Form.Group className='mb-3'>
          <Form.Label className='fs-5'>Difficoltà</Form.Label>
          <Form.Select
            size='lg'
            value={difficulty}
            onChange={ev => setDifficulty(ev.target.value)}>
            {DIFFICULTIES.map(d => (
              <option key={d.key} value={d.key}>{d.label}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className='d-flex justify-content-between bg-body-tertiary rounded-3 px-3 py-2 mb-4'>
          <span><i className='bi bi-grid-3x3 me-1'></i>{selected?.gridSize}×{selected?.gridSize}</span>
          <span><i className='bi bi-life-preserver me-1'></i>{selected?.shipsCount} navi</span>
          <span><i className='bi bi-rocket me-1'></i>{selected?.missiles} siluri</span>
        </div>

        <Button
          variant='primary'
          size='lg'
          className='mt-auto'
          disabled={loading}
          onClick={handleCreate}>
          Crea torneo
        </Button>
      </Card.Body>

      <Modal show={showModal} backdrop='static'>
        <Modal.Header>
          <Modal.Title>Torneo creato!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='fs-5'>Condividi questo codice con gli altri giocatori:</p>
          <h2 className='text-center display-5'>{tournamentData.code}</h2>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' size='lg' onClick={handleStartGame}>
            Inizia a giocare
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default CreateTournament;
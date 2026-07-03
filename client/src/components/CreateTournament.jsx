import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Modal, Alert, Card } from 'react-bootstrap';
import API from '../API/API.js';

function CreateTournament() {
  const [difficulty, setDifficulty] = useState('easy');
  const [showModal, setShowModal] = useState(false);
  const [tournamentData, setTournamentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    setLoading(true);
    try {
      const data = await API.createTournament(difficulty);
      setTournamentData(data);
      setShowModal(true);
    } catch(err) {
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
    <Card>
      <Card.Header>Crea Torneo</Card.Header>
      <Card.Body>
        {error && <Alert variant='danger'>{error}</Alert>}
        <Form.Group className='mb-3'>
          <Form.Label>Difficoltà</Form.Label>
          <Form.Select
            value={difficulty}
            onChange={ev => setDifficulty(ev.target.value)}>
            <option value='easy'>Facile</option>
            <option value='medium'>Intermedio</option>
            <option value='hard'>Difficile</option>
          </Form.Select>
        </Form.Group>
        <Button
          variant='primary'
          disabled={loading}
          onClick={handleCreate}>
          Crea Torneo
        </Button>
      </Card.Body>

      <Modal show={showModal} backdrop='static'>
        <Modal.Header>
          <Modal.Title>Torneo Creato!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Condividi questo codice con gli altri giocatori:</p>
          <h2 className='text-center'>{tournamentData.code}</h2>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleStartGame}>
            Inizia a giocare
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default CreateTournament;
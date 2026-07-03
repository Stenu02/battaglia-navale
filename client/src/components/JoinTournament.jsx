import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Card } from 'react-bootstrap';
import API from '../API/API.js';

function JoinTournament() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    // Validazione React
    if(code.trim() === '') {
      setError('Inserisci un codice torneo');
      return;
    }
    setLoading(true);
    try {
      const data = await API.joinTournament(code.trim());
      navigate(`/game/${data.gameId}`);
    } catch(err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>Unisciti a un Torneo</Card.Header>
      <Card.Body>
        {error && <Alert variant='danger'>{error}</Alert>}
        <Form.Group className='mb-3'>
          <Form.Label>Codice Torneo</Form.Label>
          <Form.Control
            type='text'
            placeholder='Es. ALFA42'
            value={code}
            onChange={ev => setCode(ev.target.value.toUpperCase())} />
        </Form.Group>
        <Button
          variant='success'
          disabled={loading}
          onClick={handleJoin}>
          Unisciti
        </Button>
      </Card.Body>
    </Card>
  );
}

export default JoinTournament;
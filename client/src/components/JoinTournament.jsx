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
    if (code.trim() === '') {
      setError('Inserisci un codice torneo');
      return;
    }
    setLoading(true);
    try {
      const data = await API.joinTournament(code.trim());
      navigate(`/game/${data.gameId}`);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <Card className='h-100'>
      <Card.Body className='d-flex flex-column p-4'>
        <div className='d-flex align-items-center gap-3 mb-4'>
          <span
            className='d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis fs-3 icon-badge-sm'>
            <i className='bi bi-key-fill'></i>
          </span>
          <span className='fs-3 fw-semibold'>Unisciti a un torneo</span>
        </div>

        {error && <Alert variant='danger'>{error}</Alert>}

        <Form.Group className='mb-4'>
          <Form.Label className='fs-5'>Codice torneo</Form.Label>
          <Form.Control
            size='lg'
            type='text'
            placeholder='Es. ALFA42'
            value={code}
            onChange={ev => setCode(ev.target.value.toUpperCase())} />
        </Form.Group>

        <Button
          variant='primary'
          size='lg'
          className='mt-auto'
          disabled={loading}
          onClick={handleJoin}>
          Unisciti
        </Button>
      </Card.Body>
    </Card>
  );
}

export default JoinTournament;
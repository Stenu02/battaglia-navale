import { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Alert, Row, Col, Card } from 'react-bootstrap';
import DIFFICULTIES from '../difficulties.js';
import API from '../API/API.js';



function Home() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCasualGame = async (difficulty) => {
    setLoading(true);
    try {
      const data = await API.createCasualGame(difficulty);
      navigate(`/game/${data.gameId}`);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };


  return (
    <Row className='justify-content-center mt-5'>
      <Col lg={10} className='text-center'>

        <h1
          className='display-1 mb-3'
          style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: '0.02em' }}>
          Battaglia Navale
        </h1>
        <p className='fs-4 text-secondary mb-5'>
          Affonda tutte le navi nemiche prima di esaurire i siluri.
          <br />
          Scegli una difficoltà per iniziare subito, oppure accedi per competere in un torneo.
        </p>

        {error && <Alert variant='danger'>{error}</Alert>}

        <Row className='g-5 mb-5'>
          {DIFFICULTIES.map(d => (
            <Col lg={4} key={d.key}>
              <Card className={`h-100 border-2 border-${d.variant}`}>
                <Card.Body className='d-flex flex-column p-5'>
                  <div className='d-flex align-items-center gap-3 mb-4'>
                    <span
                      className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-${d.variant}-subtle text-${d.variant}-emphasis fs-2`}
                      style={{ width: 68, height: 68, flexShrink: 0 }}>
                      <i className={`bi ${d.icon}`}></i>
                    </span>
                    <span className='fs-2 fw-semibold'>{d.label}</span>
                  </div>
                  <ul className='list-unstyled mb-4 text-start fs-4'>
                    <li className='d-flex justify-content-between align-items-center border-bottom py-2'>
                      <span className='text-secondary'><i className='bi bi-grid-3x3 me-2'></i>Griglia</span>
                      <strong>{d.gridSize}×{d.gridSize}</strong>
                    </li>
                    <li className='d-flex justify-content-between align-items-center border-bottom py-2'>
                      <span className='text-secondary'><i className='bi bi-life-preserver me-2'></i>Navi</span>
                      <strong>{d.shipsCount}</strong>
                    </li>
                    <li className='d-flex justify-content-between align-items-center py-2'>
                      <span className='text-secondary'><i className='bi bi-rocket me-2'></i>Siluri</span>
                      <strong>{d.missiles}</strong>
                    </li>
                  </ul>
                  <Button
                    variant={`outline-${d.variant}`}
                    className={`w-100 mt-auto bg-${d.variant}-subtle text-${d.variant}-emphasis fw-semibold py-3 fs-4`}
                    size='lg'
                    disabled={loading}
                    onClick={() => handleCasualGame(d.key)}>
                    Gioca
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className='text-center pt-5 border-top' style={{ marginTop: '6rem' }}>
          <div className='d-inline-flex align-items-center gap-4 bg-white border rounded-pill ps-5 pe-3 py-3'>
            <span className='fw-medium fs-4'>Preferisci competere con altri giocatori?</span>
            <Link to='/login' className='btn btn-primary btn-lg rounded-pill fs-4 py-3'>
              Accedi →
            </Link>
            <Link to='/stats' className='btn btn-outline-secondary btn-lg rounded-pill fs-4 py-3'>
              Statistiche Globali
            </Link>
          </div>
        </div>

      </Col>
    </Row>
  );
}

export default Home;
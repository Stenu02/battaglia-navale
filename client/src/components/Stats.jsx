import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Alert, Spinner, Table, Button, Card } from 'react-bootstrap';
import API from '../API/API.js';
import DIFFICULTIES from '../difficulties.js';

function Stats(props) {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await API.getStats();
        setStats(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Spinner animation='border' className='m-5' />;

  return (
    <Row className='justify-content-center mt-4'>
      <Col lg={10}>
        <Button variant='outline-primary' size='lg' className='mb-4' onClick={() => navigate(-1)}>
          Torna indietro
        </Button>
        <h1
          className='display-1 mb-5 text-center'
          style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: '0.02em' }}>
          Statistiche
        </h1>

        {error && <Alert variant='danger'>{error}</Alert>}

        {DIFFICULTIES.map(d => {
          const players = stats
            .filter(s => s.difficulty === d.key)
            .sort((a, b) => {
              if (b.winPercentage !== a.winPercentage) return b.winPercentage - a.winPercentage;
              if (b.played !== a.played) return b.played - a.played;
              return a.name.localeCompare(b.name);
            });

          return (
            <Card key={d.key} className='mb-4'>
              <Card.Body className='p-4'>
                <div className='d-flex align-items-center gap-3 mb-4'>
                  <span
                    className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-${d.variant}-subtle text-${d.variant}-emphasis fs-2`}
                    style={{ width: 68, height: 68, flexShrink: 0 }}>
                    <i className={`bi ${d.icon}`}></i>
                  </span>
                  <span className={`fs-2 fw-semibold text-${d.variant}`}>{d.label}</span>
                </div>

                {players.length === 0 ? (
                  <p className='text-secondary fs-4 mb-0'>Nessuna partita giocata ancora.</p>
                ) : (
                  <Table borderless className='mb-0 fs-5'>
                    <thead>
                      <tr className='text-secondary'>
                        <th style={{ width: 40 }}></th>
                        <th>Giocatore</th>
                        <th className='text-center'>Giocate</th>
                        <th className='text-center'>Vinte</th>
                        <th className='text-center'>Perse</th>
                        <th className='text-end'>% Vittorie</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((p, i) => {
                        const isMe = props.loggedIn && p.userId === props.user.id;
                        return (
                          <tr key={p.userId} className={isMe ? 'table-primary' : 'border-top'}>
                            <td className='py-3'>
                              {i === 0 && <i className='bi bi-trophy-fill text-warning'></i>}
                            </td>
                            <td className='fw-medium py-3'>
                              {p.name}
                              {isMe && <span className='badge bg-primary ms-2'>Tu — {i + 1}° posto</span>}
                            </td>
                            <td className='text-center py-3'>{p.played}</td>
                            <td className='text-center py-3'>{p.won}</td>
                            <td className='text-center py-3'>{p.lost}</td>
                            <td className={`text-end fw-semibold text-${d.variant} py-3`}>{p.winPercentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </Col>
    </Row>
  );
}

export default Stats;
import { useState, useEffect } from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';
import API from '../API/API.js';

function Stats() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await API.getStats();
        setStats(data);
      } catch(err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // Raggruppa le statistiche per utente
  const statsByUser = stats.reduce((acc, stat) => {
    if (!acc[stat.userId]) {
      acc[stat.userId] = { name: stat.name, difficulties: [] };
    }
    acc[stat.userId].difficulties.push(stat);
    return acc;
  }, {});

  if (loading) return <Spinner animation='border' className='m-5' />;

  return (
    <>
      <h2 className='mb-4'>Classifica Globale</h2>

      {error && <Alert variant='danger'>{error}</Alert>}

      {Object.values(statsByUser).map((player, index) => (
        <div key={index} className='mb-4'>
          <h5>{player.name}</h5>
          <Table bordered hover size='sm'>
            <thead>
              <tr>
                <th>Difficoltà</th>
                <th>Giocate</th>
                <th>Vinte</th>
                <th>Perse</th>
                <th>% Vittorie</th>
              </tr>
            </thead>
            <tbody>
              {player.difficulties.map((d, i) => (
                <tr key={i}>
                  <td>{d.difficulty}</td>
                  <td>{d.played}</td>
                  <td>{d.won}</td>
                  <td>{d.lost}</td>
                  <td>{d.winPercentage}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}

      {stats.length === 0 && !error && (
        <Alert variant='info'>Nessuna statistica disponibile.</Alert>
      )}
    </>
  );
}

export default Stats;
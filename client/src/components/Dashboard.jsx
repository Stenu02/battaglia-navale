import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import CreateTournament from './CreateTournament.jsx';
import JoinTournament from './JoinTournament.jsx';

function Dashboard(props) {
  return (
    <Row className='justify-content-center mt-4'>
      <Col md={8}>
        <h2>Benvenuto, {props.user.name}!</h2>
        <Row className='mt-4'>
          <Col md={6}>
            <CreateTournament />
          </Col>
          <Col md={6}>
            <JoinTournament />
          </Col>
        </Row>
        <div className='text-center mt-4'>
          <Link to='/stats' className='btn btn-outline-primary'>
            Statistiche Globali
          </Link>
        </div>
      </Col>
    </Row>
  );
}

export default Dashboard;
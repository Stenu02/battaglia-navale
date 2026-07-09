import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import CreateTournament from './CreateTournament.jsx';
import JoinTournament from './JoinTournament.jsx';

function Dashboard(props) {
  return (
    <Row className='justify-content-center mt-4'>
      <Col lg={10}>
        <h1
          className='display-5 mb-2 page-title'>
          Benvenuto, {props.user.name}!
        </h1>
        <p className='fs-6 text-secondary mb-5'>Crea un nuovo torneo o unisciti a uno esistente con un codice.</p>

        <Row className='g-4 mb-5'>
          <Col md={6}>
            <CreateTournament config={props.config} />
          </Col>
          <Col md={6}>
            <JoinTournament />
          </Col>
        </Row>

        <div className='text-center pt-4 border-top'>
          <Link to='/stats' className='btn btn-outline-primary btn-lg rounded-pill px-4 py-3 fs-5 mt-4'>
            Statistiche globali
          </Link>
        </div>
      </Col>
    </Row>
  );
}

export default Dashboard;
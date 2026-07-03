import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';

function NotFound() {
  return (
    <Row className='justify-content-center mt-5 text-center'>
      <Col md={6}>
        <h1>404</h1>
        <p className='lead'>Pagina non trovata.</p>
        <Link to='/'>
          <Button variant='primary'>Torna alla Home</Button>
        </Link>
      </Col>
    </Row>
  );
}

export default NotFound;
import { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const credentials = { username, password };
    await props.onLogin(credentials);
  };

  return (
    <Row className='justify-content-center mt-5'>
      <Col md={4}>
        <h2>Login</h2>
        {props.message && <Alert variant='danger'>{props.message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username' className='mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='email'
              name='username'
              required
              value={username}
              onChange={ev => setUsername(ev.target.value)} />
          </Form.Group>
          <Form.Group controlId='password' className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              required
              value={password}
              onChange={ev => setPassword(ev.target.value)} />
          </Form.Group>
          <Button type='submit' variant='primary'>Login</Button>
          <Link className='btn btn-danger mx-2' to='/'>Annulla</Link>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
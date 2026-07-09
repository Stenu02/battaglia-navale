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
      <Col md={5}>
        <h1
          className='display-5 mb-4 page-title'>
          Login
        </h1>
        {props.message && <Alert variant='danger' className='fs-6'>{props.message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username' className='mb-4'>
            <Form.Label className='fs-6'>Username</Form.Label>
            <Form.Control
              size='lg'
              type='email'
              name='username'
              required
              value={username}
              onChange={ev => setUsername(ev.target.value)} />
          </Form.Group>
          <Form.Group controlId='password' className='mb-4'>
            <Form.Label className='fs-6'>Password</Form.Label>
            <Form.Control
              size='lg'
              type='password'
              name='password'
              required
              value={password}
              onChange={ev => setPassword(ev.target.value)} />
          </Form.Group>
          <Button type='submit' variant='primary' size='lg'>Login</Button>
          <Link className='btn btn-danger btn-lg mx-2' to='/'>Annulla</Link>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
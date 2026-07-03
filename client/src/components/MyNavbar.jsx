import { Outlet, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function MyNavbar(props) {
  return (
    <>
      <Navbar bg='primary' data-bs-theme='dark'>
        <Container fluid>
          <Link to='/' className='navbar-brand'>Battaglia Navale</Link>
          {props.loggedIn ? (
            <>
              <Navbar.Text className='me-3'>
                {props.user.name}
              </Navbar.Text>
              <Button variant='outline-light' onClick={props.onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to='/login' className='btn btn-outline-light'>
              Login
            </Link>
          )}
        </Container>
      </Navbar>

      <Container fluid className='mt-4'>
        <Outlet />
      </Container>
    </>
  );
}

export default MyNavbar;
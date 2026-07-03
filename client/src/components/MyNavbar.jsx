import { Outlet, Link } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';

function MyNavbar(props) {
  return (
    <>
      <Navbar data-bs-theme='dark' style={{ backgroundColor: '#0B3D66' }} className='py-3'>
        <Container fluid>
          <Link
            to='/'
            className='navbar-brand mb-0'
            style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: '1.6rem', letterSpacing: '0.02em', textTransform: 'uppercase', color: '#fff' }}>
            Battaglia Navale
          </Link>
          {props.loggedIn ? (
            <div className='d-flex align-items-center gap-3'>
              <Navbar.Text className='fs-5 mb-0'>
                {props.user.name}
              </Navbar.Text>
              <Button
                variant='light'
                size='lg'
                className='rounded-pill px-4 fw-semibold'
                style={{ color: '#0B3D66' }}
                onClick={props.onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link
              to='/login'
              className='btn btn-lg btn-light rounded-pill px-4 fw-semibold'
              style={{ color: '#0B3D66' }}>
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
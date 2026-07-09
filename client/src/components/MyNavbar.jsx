import { Outlet, Link } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';

function MyNavbar(props) {
  return (
    <>
      <Navbar data-bs-theme='dark' className='py-3 bg-navy'>
        <Container fluid>
          <Link
            to='/'
            className='navbar-brand mb-0 brand-title text-white'>
            Battaglia Navale
          </Link>
          {props.loggedIn ? (
            <div className='d-flex align-items-center gap-3'>
              <Navbar.Text className='fs-6 mb-0'>
                {props.user.name}
              </Navbar.Text>
              <Button
                variant='light'
                size='lg'
                className='rounded-pill px-4 fw-semibold text-navy'
                onClick={props.onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link
              to='/login'
              className='btn btn-lg btn-light rounded-pill px-4 fw-semibold text-navy'>
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
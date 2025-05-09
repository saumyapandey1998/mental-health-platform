import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import logo from './assets/mental-health.png';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'react-bootstrap';
import './assets/NavBar.css';

function NavBar() {
  const isAuthenticated = localStorage.getItem('authToken');

  return (
    <Navbar className="navBar" fixed="top" expand="lg" style={{ backgroundColor: '#6B7280', color: 'white' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-white">
          <img
            src={logo}
            width={40}
            height={40}
            className="me-2"
            alt="MindHaven Logo"
          />
          MindHaven
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-white">About</Nav.Link>
            <NavDropdown title="Services" id="services-dropdown" className="text-white">
              <NavDropdown.Item as={Link} to="/therapy">Therapy</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/counseling">Counseling</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/self-care">Self-Care Tips</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/contact">Contact Us</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/contact" className="text-white">Contact</Nav.Link>
            <Nav.Link as={Link} to="/ourMission" className="text-white">Our Mission</Nav.Link>
          </Nav>
          <div>
            {isAuthenticated ? (
              <>
                <Button variant="outline-primary" className="ms-3" as={Link} to="/appointments">Book Appointment</Button>
                <Button variant="outline-primary" className="ms-2" onClick={() => {
                  localStorage.removeItem('authToken');
                  window.location.href = '/login'; // Refresh to update state
                }}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline-primary" className="ms-3" as={Link} to="/login">Login</Button>
                <Button variant="primary" className="ms-2" as={Link} to="/signup">Sign Up</Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
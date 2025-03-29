import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Container } from "react-bootstrap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert(`Logging in with Username: ${username}`);
    // Implement actual authentication logic here
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center">Login</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Enter password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </Form.Group>

        <Button variant="primary" className="w-100" onClick={handleLogin}>
          Login
        </Button>

        <div className="text-center mt-3">
          <p>Don't have an account?</p>
          <Link to="/signup">
            <Button variant="outline-secondary" className="w-100">Create Account</Button>
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default Login;

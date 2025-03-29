import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Container } from "react-bootstrap";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    alert(`Creating account for: ${username}`);
    // Implement actual signup logic here
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center">Create Account</h2>
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
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
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

        <Button variant="success" className="w-100" onClick={handleSignup}>
          Sign Up
        </Button>

        <div className="text-center mt-3">
          <p>Already have an account?</p>
          <Link to="/login">
            <Button variant="outline-primary" className="w-100">Login</Button>
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default Signup;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Container, Alert } from "react-bootstrap";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    setMessage(null);
    setError(null);

    const userData = { username, email, password };

    try {
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Account created successfully! You can now log in.");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.error || "❌ Signup failed. Please try again.");
      }
    } catch (err) {
      setError("❌ Server error. Please try again later.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center">Create Account</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Enter password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
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


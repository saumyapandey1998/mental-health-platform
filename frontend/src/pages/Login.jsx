import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Container, Alert } from "react-bootstrap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const userData = { username, password };

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.id); // Store userId
        setMessage("✅ Login successful!");
        navigate("/appointments");
      } else {
        setError(data.msg || "❌ Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("❌ Server error. Please try again later.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px", backgroundColor: "#F9F5F0", padding: "20px", borderRadius: "8px" }}>
      <h2 className="text-center">LOGIN</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
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
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: "#3B82F6", border: "none" }}>
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
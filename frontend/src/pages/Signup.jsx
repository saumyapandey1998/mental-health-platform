import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { Button, Form, Container, Alert } from "react-bootstrap";
// import '../assets/styles/signup.css'

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // Add role to match backend
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Add navigate hook

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage(null);
    setError(null);

    const userData = { username, password, role }; // Remove email to match backend

    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Account created successfully! Redirecting to login...");
        setUsername("");
        setPassword("");
        setRole("patient");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      } else {
        setError(data.msg || "❌ Signup failed. Please try again.");
      }
    } catch (err) {
      setError("❌ Server error. Please try again later.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px", backgroundColor: "#F9F5F0", padding: "20px", borderRadius: "8px" }}>
      <h2 className="text-center">CREATE ACCOUNT</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSignup}>
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

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="patient">Patient</option>
            <option value="therapist">Therapist</option>
          </Form.Select>
        </Form.Group>

        <Button variant="success" type="submit" className="w-100" style={{ backgroundColor: "#10B981", border: "none" }}>
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
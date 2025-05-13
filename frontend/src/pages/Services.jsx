// src/pages/Services.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const services = [
  {
    title: 'Individual Therapy',
    description: 'One-on-one sessions with licensed therapists to explore your thoughts, feelings, and personal goals.'
  },
  {
    title: 'Couples Counseling',
    description: 'Improve communication and rebuild connection through guided relationship support.'
  },
  {
    title: 'Group Sessions',
    description: 'Join small support groups led by professionals to connect with others on similar journeys.'
  },
  {
    title: 'Self-Care Resources',
    description: 'Access meditations, mental wellness tips, and daily practices for emotional resilience.'
  }
];

const Services = () => (
  <Container className="py-5">
    <h2 className="mb-4 text-center">Our Services</h2>
    <Row>
      {services.map((service, idx) => (
        <Col key={idx} md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>{service.title}</Card.Title>
              <Card.Text>{service.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default Services;

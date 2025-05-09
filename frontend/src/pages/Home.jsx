// src/pages/Home.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import nature from '../assets/nature.jpg';

const Home = () => {
  return (
    <Container className="mt-5">
      <h1>Welcome to MindHaven</h1>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={nature}
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Mental Health Support</h3>
            <p>We provide resources and counseling to help you on your journey.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={nature}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Compassionate Care</h3>
            <p>Your well-being is our priority.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="nature"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Empower Yourself</h3>
            <p>Take charge of your mental health journey.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default Home;

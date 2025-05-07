import './App.css';
import NavBar from './Navbar';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import OurMission from './pages/OurMission';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ourmission" element={<OurMission />} />
      </Routes>
    </div>
  );
}

export default App;

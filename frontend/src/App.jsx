import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './Navbar'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Appointments from './pages/Appointments';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} /> {}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </div>
  );
}

export default App;
import './App.css';
import NavBar from './Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import OurMission from './pages/OurMission';
// import Therapy from './pages/Therapy';
// import Counseling from './pages/Counseling';
// import SelfCare from './pages/SelfCare';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ourMission" element={<OurMission />} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/counseling" element={<Counseling />} />
        <Route path="/self-care" element={<SelfCare />} /> */}
      </Routes>
    </div>
  );
}

export default App;

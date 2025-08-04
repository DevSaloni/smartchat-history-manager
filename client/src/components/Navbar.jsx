import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SiChatbot } from 'react-icons/si';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="n
      av-logos">
      <span className="smartchat-logo">
        <span className="rotating-circle">
          <SiChatbot />
        </span>
        SmartChat
      </span>

      </div>

      <div className="nav-buttons">
        <button className="nav-btn login-btn"  onClick={() => navigate('/login')}>Login</button>
        <button className="nav-btn signup-btn" onClick={() => navigate('/signup')}>Signup</button>
      </div>
    </nav>
  );
};

export default Navbar;

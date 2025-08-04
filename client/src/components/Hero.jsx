import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-content">
        <h1>Welcome to SmartChat </h1>
        <p>Manage your chats smarter — search faster, switch easily, and never lose track of important conversations.</p>
        <button onClick={() => navigate('/chatsection')}>Try Now</button>
      </div>
    </div>
  );
};

export default Hero;

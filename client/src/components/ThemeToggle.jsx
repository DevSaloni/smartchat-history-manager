import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ChatArea.css'; 

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="theme-toggle" onClick={handleToggle}>
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </div>
  );
};

export default ThemeToggle;

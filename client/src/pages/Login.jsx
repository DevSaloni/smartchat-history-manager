import React, { useState } from 'react';
import './Login.css';
import { FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://smartchat-history-manager.onrender.com/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back to SmartChat 🎉',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => {
          navigate('/chatsection');
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.message || 'Invalid email or password'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.'
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Welcome Back <FaCommentDots style={{ color: '#bb86fc' }} /></h2>
        <p className="tagline">Log in to manage your chats smarter!</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btns">Login</button>
        </form>

        <p className="login-link">
          Don’t have an account? <a href="/signup">Signup here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

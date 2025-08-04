import React, { useState } from 'react';
import './Signup.css';
import { FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
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
      const res = await fetch("http://localhost:2011/api/auth/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email
        }));
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful!',
          text: 'Please login now.',
          confirmButtonColor: '#7e57c2'
        }).then(() => navigate('/login'));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: data.error || 'Something went wrong!'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error signing up. Please try again!'
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Join Us <FaCommentDots style={{ color: '#bb86fc' }} /></h2>
        <p className="tagline">Create your account to chat smarter!</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          <button type="submit" className="signup-btns">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/MainContent.css';

function MainContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="main-content fade-in d-flex align-items-center justify-content-center text-center">
      <div className="container">
        <h1>AIDE</h1>
        <p>Welcome to AIDE, your AI-enabled Web Development Learning platform.</p>
        <div>
          <Link to="/login" className="btn btn-primary mr-2">Login</Link>
          <Link to="/register" className="btn btn-secondary">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
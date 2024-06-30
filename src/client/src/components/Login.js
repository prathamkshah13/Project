import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../css/Login.css';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!form.email) {
      isValid = false;
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      isValid = false;
      errors.email = 'Email address is invalid';
    }

    if (!form.password) {
      isValid = false;
      errors.password = 'Password is required';
    } else if (form.password.length < 8) {
      isValid = false;
      errors.password = 'Password must be at least 8 characters';
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch(`/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });
  
        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('token', result.token);
          navigate('/dashboard');
        } else {
          setErrors({
            ...errors,
            login: 'Incorrect email or password',
          }); console.error('Failed to login:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Container className="login-form mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="form-title">AIDE</h1>
          <p className="form-subtitle">Sign In</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                className="custom-input opacity-50"
                placeholder="Enter your email"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                className="custom-input opacity-50"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            {errors.login && <p className="alert alert-danger">{errors.login}</p>}
            <Button type="submit" className="form-button">Sign In</Button>
          </Form>
          <div className="mt-3 text-left">
            <span>Don't have an account? </span>
            <Link to="/register">Sign up</Link>
          </div>
          <div className="mt-3 text-left">
            <span>Forgot Your Password? </span>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
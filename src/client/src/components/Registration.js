import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import '../css/Registration.css';

const Registration = () => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!form.firstname) {
      isValid = false;
      errors.firstname = 'First Name is required';
    }
  
    if (!form.lastname) {
      isValid = false;
      errors.lastname = 'Last Name is required';
    }
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
    } else if (!passwordRegex.test(form.password)) {
      isValid = false;
      errors.password = 'Password does not meet strength requirements. It should contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long.';
    }

    if (!form.confirmPassword) {
      isValid = false;
      errors.confirmPassword = 'Confirm Password is required';
    } else if (form.password !== form.confirmPassword) {
      isValid = false;
      errors.confirmPassword = 'Passwords do not match';
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        const result = await response.json();
        if (response.ok) {
          setShowSuccessModal(true);
        } else if (result.error === 'Email already exists') {
          setErrorMessage('An account with this email already exists. Please try again with a different email.');
          setShowErrorModal(true);
        } else {
          console.error('Failed to submit the form:', result);
        }
      } catch (error) {
        console.error('Error submitting the form:', error.message);
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <Container className="registration-form mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="form-title">AIDE</h1>
          <p className="form-subtitle">Create Your Account</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                isInvalid={!!errors.firstname}
                className="custom-input opacity-50"
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstname}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                isInvalid={!!errors.lastname}
                className="custom-input opacity-50"
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastname}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                className="custom-input opacity-50"
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
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                isInvalid={!!errors.confirmPassword}
                className="custom-input opacity-50"
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="form-button">Sign Up</Button>
          </Form>
          <div className="mt-3 text-left">
            <span>Already have an account? </span>
            <Link to="/login">Sign in</Link>
          </div>
          <div className="mt-3 text-left">
            <span>Forgot Your Password? </span>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>
        </Col>
      </Row>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your account has been successfully created. You will be redirected to the login page.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseErrorModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Registration;

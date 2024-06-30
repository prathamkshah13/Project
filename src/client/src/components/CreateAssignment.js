import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CreateAssignment = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    submissionType: '',
    answerKey: null,
    rubric: null,
    aiPrompt: '',
    dueDate: '',
    availableFrom: '',
    availableTo: '',
    maxScore: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.roleid !== 3) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: checked ? value : '',
      }));
    } else if (type === 'file') {
      const file = files[0];
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage('File size exceeds the 5MB limit.');
        setShowErrorModal(true);
      } else {
        setForm({
          ...form,
          [name]: file,
        });
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('courseid', 1); 
    formData.append('assignmentname', form.title);
    formData.append('assignmentdescription', form.description);
    formData.append('submissiontype', form.submissionType);
    formData.append('prompt', form.aiPrompt);
    formData.append('maxscore', form.maxScore);
    formData.append('startdate', form.availableFrom);
    formData.append('enddate', form.dueDate);

    if (form.answerKey) {
      formData.append('answerKey', form.answerKey);
    }

    if (form.rubric) {
      formData.append('rubric', form.rubric);
    }

    try {
      const response = await fetch('/api/assignments/create-assignments', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(result.error || 'Failed to create the assignment');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      setErrorMessage('Error creating assignment');
      setShowErrorModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/assignments');
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1>Create Assignment</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Assignment Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubmissionType">
              <Form.Label>Submission Type</Form.Label>
              <Form.Check
                type="checkbox"
                name="submissionType"
                label="File"
                value="file"
                checked={form.submissionType === 'file'}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                name="submissionType"
                label="Link"
                value="link"
                checked={form.submissionType === 'link'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAnswerKey">
              <Form.Label>Answer Key</Form.Label>
              <Form.Control
                type="file"
                name="answerKey"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRubric">
              <Form.Label>Rubric</Form.Label>
              <Form.Control
                type="file"
                name="rubric"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAiPrompt">
              <Form.Label>AI Prompt</Form.Label>
              <Form.Control
                type="text"
                name="aiPrompt"
                value={form.aiPrompt}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAvailableFrom">
              <Form.Label>Available From</Form.Label>
              <Form.Control
                type="date"
                name="availableFrom"
                value={form.availableFrom}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAvailableTo">
              <Form.Label>Available To</Form.Label>
              <Form.Control
                type="date"
                name="availableTo"
                value={form.availableTo}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMaxScore">
              <Form.Label>Max Score</Form.Label>
              <Form.Control
                type="text"
                name="maxScore"
                value={form.maxScore}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Publish
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assignment Created Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your assignment has been created successfully.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
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

export default CreateAssignment;

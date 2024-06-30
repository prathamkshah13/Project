import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const AssignmentSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [form, setForm] = useState({
    file: null,
    link: '',
    contenttype: '',
  });
  const [userid, setUserid] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken = jwtDecode(token);
    setUserid(decodedToken.userid);

    const fetchAssignment = async () => {
      try {
        const response = await fetch(`/api/assignments/${id}`);
        const data = await response.json();
        setAssignment(data);
        setForm((prevForm) => ({
          ...prevForm,
          contenttype: data.submissiontype,
        }));
      } catch (error) {
        console.error('Error fetching assignment:', error);
        setErrorMessage('Error fetching assignment');
        setShowErrorModal(true);
      }
    };

    fetchAssignment();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!['html', 'css', 'js'].includes(fileExtension)) {
        setErrorMessage('Invalid file type. Only HTML, CSS, and JavaScript files are allowed.');
        setShowErrorModal(true);
        setFileError(true);
        return;
      }
      setFileError(false);
      setForm({
        ...form,
        [name]: file,
        contenttype: fileExtension,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileError) {
      setErrorMessage('Invalid file type. Please upload a valid file.');
      setShowErrorModal(true);
      return;
    }

    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('contenttype', form.contenttype);
    if (assignment.submissiontype === 'file' && form.file) {
      formData.append('file', form.file);
    } else if (assignment.submissiontype === 'link' && form.link) {
      formData.append('link', form.link);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/assignments/${id}/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(result.error || 'Failed to submit data');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setErrorMessage('Error submitting data');
      setShowErrorModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  if (!assignment) {
    return <div>No assignment with that id found.</div>;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1>Submit Assignment: {assignment.assignmentname}</h1>
          <p>{assignment.assignmentdescription}</p>
          <p>Due Date: {new Date(assignment.enddate).toLocaleDateString()}</p>
          <p>Max Score: {assignment.maxscore}</p>
          <Form onSubmit={handleSubmit}>
            {assignment.submissiontype === 'file' && (
              <Form.Group className="mb-3" controlId="formFile">
                <Form.Label>File Submission</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  onChange={handleChange}
                />
                {fileError && (
                  <div className="text-danger mt-2">
                    Invalid file type. Only HTML, CSS, and JavaScript files are allowed.
                  </div>
                )}
              </Form.Group>
            )}
            {assignment.submissiontype === 'link' && (
              <Form.Group className="mb-3" controlId="formLink">
                <Form.Label>Link Submission</Form.Label>
                <Form.Control
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit" disabled={fileError}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Submission Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your assignment has been submitted successfully.
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

export default AssignmentSubmission;

import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Profile.css';

function Profile() {
  const [user, setUser] = useState({});
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    //fetching the token from local storage and sending it to the server to get the user data
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }else{
        const response = await fetch(`/api/protected`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Specify content type
          },
        });

        if (!response.ok) {
          console.log('Failed to fetch data');
        }
        else {
          //get request for the json data containing the user profile information 
          const data = await response.json(); // Parse JSON data
          setData(data);
          const id = data.user.userid;
          const resp = await fetch(`/api/profile/${id}`, {});
                if(!resp.ok){
                  console.log('Failed to fetch data');
                }
                else{
                  const profile = await resp.json();
                  setUser(profile);
                  console.log(user);
                }
        }

      }
    };

    fetchData();
  }, []);

  var role = '';

  //checking what role the user has and setting the role variable to the role
  if(user.roleid === 1) {
    role = 'Student';
  }else if(user.roleid === 2) {
    role = 'Admin';
  }else if(user.roleid === 3) {
    role = 'Instructor';
  }else{
    role = 'TA';
  }

  return (
    <body>
      <Container className="profile-container-container">
      <Container className="profile-container fade-in mt-4">
        <h1 className="profile-title">PROFILE</h1>
        <Card className="profile-card fade-in mt-4">
          <Row className="no-gutters">
            <Col>
              <Card.Body className="profile-details">
                {user && (
                  <>
                    <div className="small-card">
                      <Card.Title className="small-card-title">User ID</Card.Title>
                      <Card.Text className="small-card-content">{user.userid}</Card.Text>
                    </div>
                    <div className="small-card">
                      <Card.Title className="small-card-title">Name</Card.Title>
                      <Card.Text className="small-card-content">{`${user.firstname} ${user.lastname}`}</Card.Text>
                    </div>
                    <div className="small-card">
                      <Card.Title className="small-card-title">Role</Card.Title>
                      <Card.Text className="small-card-content">{role}</Card.Text>
                    </div>
                    <div className="small-card">
                      <Card.Title className="small-card-title">Course</Card.Title>
                      <Card.Text className="small-card-content">COSC 341</Card.Text>
                    </div>
                    <div className="small-card">
                      <Card.Title className="small-card-title">Email</Card.Title>
                      <Card.Text className="small-card-content">{user.email}</Card.Text>
                    </div>
                  </>
                )}
              </Card.Body>
            </Col>
          </Row>
        </Card>
        <Link to="/edit">
          <Button className="edit-button">Edit Profile</Button>
        </Link>
      </Container>
     </Container>
    </body>
  );
};

export default Profile;


    
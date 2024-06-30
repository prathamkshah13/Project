import React, { useState } from 'react';
import '../css/Edit.css';
import { Link } from 'react-router-dom';
import profileImage from '../images/face2.png';

function Edit() {
  const [name, setName] = useState('Test Test2');
  const [email, setEmail] = useState('testuser@gmail.com');

  // const handleConfirmChanges = () => {
  //   console.log('Changes confirmed:', { name, email });
  // };

  return (
    <div className="edit-container">
      <h1 className="edit-title">EDIT PROFILE</h1>
      <div className="edit-card fade-in">
        <img src={profileImage} alt="Profile" className="edit-image" />
        <div className="edit-details">
          <div className="edit-field">
            <label className="edit-field-title">Name</label>
            <input
              type="text"
              className="edit-field-content"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="edit-field">
            <label className="edit-field-title">Role</label>
            <span className="edit-field-content">Student</span>
          </div>
          <div className="edit-field">
            <label className="edit-field-title">Course</label>
            <span className="edit-field-content">COSC 360</span>
          </div>
          <div className="edit-field">
            <label className="edit-field-title">Email</label>
            <input
              type="email"
              className="edit-field-content"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Link to="/profile">
            <button className="edit-confirm-button">Confirm Changes</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Edit;

import React from 'react';

import { Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import Edit from './components/Edit';
import MainContent from './components/MainContent';
import Registration from './components/Registration';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CreateAssignment from './components/CreateAssignment';
import AssignmentSubmission from './components/AssignmentSubmission';
import './App.css';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (

    <div className="App">

      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/edit" element={<Edit />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} /> 
        <Route path='/create-assignment' element={<CreateAssignment />}/>
        <Route path="/assignments/:id" element={<AssignmentSubmission />} /> 
        {/* add other routes here */}
      </Routes>
    </div>

  );
}

export default App;
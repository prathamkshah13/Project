import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideNavbar from './SideNavbar';
import ActiveCourses from './ActiveCourses';
import Announcements from './Announcements';
import Assignments from './Assignments';
import CalendarComponent from './CalendarComponent';
import '../css/Dashboard.css';

function Dashboard() {
  // State variables for sidebar, data fetching, and loading status
  const [data, setData] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [course, setCourse] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Function to toggle sidebar expansion
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
      } else {
        const response = await fetch(`/api/protected`, {
          method: 'GET', // Method is explicitly stated
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Specify content type
          },
        });

        if (!response.ok) {
          console.log('Failed to fetch data');
        }
        else {
          const data = await response.json(); // Parse JSON data
          setData(data);
          console.log(data);
          console.log(data.user.email);
        }
        try {
          const courseRes = await axios.get('/api/dashboard/course');
          const announcementsRes = await axios.get('/api/dashboard/announcements');
          const assignmentsRes = await axios.get('/api/dashboard/assignments');

          setCourse(courseRes.data);
          setAnnouncements(announcementsRes.data);
          setAssignments(assignmentsRes.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);
  //navigate  


  if (loading) {
    return <div>Loading...</div>;
  }

  const signOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Render the dashboard with fetched data
  return (
    <div className="dashboard-container">
      <SideNavbar toggleSidebar={toggleSidebar} isSidebarExpanded={isSidebarExpanded} />
      <div className={`dashboard-content ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="dashboard-header">
          <h2>Dashboard</h2>
        </div>

        <div className="top-section">
          <ActiveCourses course={course} />
          <CalendarComponent />
        </div>

        <div className="full-width-section">
          <Announcements announcements={announcements} />
        </div>

        <div className="full-width-section">
          <Assignments assignments={assignments} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
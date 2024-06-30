import React from 'react';
import '../css/ActiveCourses.css';

function ActiveCourses({ course }) {
  return (
    <div className="active-courses">
      <h3>Active Courses</h3>
      <div className="course-card">{course.name || 'No Active Course'}</div>
    </div>
  );
}

export default ActiveCourses;

import React from 'react';
import '../css/Assignments.css';

function Assignments({ assignments }) {
  return (
    <div className="assignments">
      <h3>Upcoming Assignments</h3>
      {assignments.map(assignment => (
        <div key={assignment.id} className="card">
          <div className="card-header">
            <span>{assignment.courseCode}</span>
            <span>{assignment.name}</span>
          </div>
          <div className="card-body">
            Due {assignment.dueDate} | -/{assignment.maxScore} pts
          </div>
        </div>
      ))}
    </div>
  );
}

export default Assignments;

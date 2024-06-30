import React from 'react';
import '../css/Announcements.css';

function Announcements({ announcements }) {
  return (
    <div className="announcements">
      <h3>Announcements</h3>
      {announcements.map(announcement => (
        <div key={announcement.id} className="card">
          <div className="card-header">
            <span>{announcement.courseCode}</span>
            <span>{announcement.title}</span>
          </div>
          <div className="card-body">
            {announcement.content}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Announcements;


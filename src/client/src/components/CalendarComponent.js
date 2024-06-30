import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../css/Calendar.css';
import 'react-calendar/dist/Calendar.css';

function CalendarComponent() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="calendar-container">
      <h3>Calendar</h3>
      <Calendar 
        value={date}
        onChange={setDate}
      />
    </div>
  );
}

export default CalendarComponent;


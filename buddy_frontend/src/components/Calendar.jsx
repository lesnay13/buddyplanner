import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Task from './Task';

const Calendar = () => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [events, setEvents] = useState([]); // Add this line
  const [selectedDate, setSelectedDate] = useState('');
  const [showTask, setShowTask] = useState(false);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowTask(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ flex: 1, transform: 'scale(1)',  }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={(info) => {
            // Handle date click (opens your event form)
            setShowEventForm(true);
            setStartDate(info.dateStr);
          }}
          eventClick={(info) => {
            // Handle existing event click
            const event = info.event;
            setEventDetails(event.title);
            setStartDate(event.startStr);
            setDescription(event.extendedProps.description);
            setShowEventForm(true);
          }}
          events={events}
          selectable={true}
        />
      </div>
    </div>
  );
}

export default Calendar; // Add default export
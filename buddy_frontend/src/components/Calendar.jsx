import { useState } from 'react';
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
  // Verify your state is properly initialized:
  const [showTask, setShowTask] = useState(false);
  
  // And that the Task component receives required props:
  {showTask && (
    <Task
      selectedDate={selectedDate}
      onClose={() => setShowTask(false)}
    />
  )}

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowTask(true);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        dateClick={handleDateClick}  // Single dateClick handler
        events={events}
      />
    </div>
    );
}

export default Calendar; // Add default export
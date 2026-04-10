import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from '../api/Axios';

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [tasksResponse, journalsResponse] = await Promise.all([
          axiosInstance.get('/api/tasks/'),
          axiosInstance.get('/api/journals/'),
        ]);

        const taskEvents = (tasksResponse.data || []).map((task) => ({
          id: `task-${task.id}`,
          title: task.title,
          start: task.start_time,
          end: task.end_time,
          allDay: Boolean(task.is_all_day),
          extendedProps: { type: 'task', description: task.description || '' },
        }));

        const journalEvents = (journalsResponse.data || []).map((entry) => ({
          id: `journal-${entry.id}`,
          title: entry.nutrition_facts && Object.keys(entry.nutrition_facts).length > 0 ? 'Journal + Nutrition' : 'Journal Entry',
          start: entry.entry_date,
          allDay: true,
          extendedProps: { type: 'journal', notes: entry.notes || '' },
        }));

        setEvents([...taskEvents, ...journalEvents]);
      } catch {
        setEvents([]);
      }
    };

    fetchEvents();
    window.addEventListener('buddyplanner-calendar-events-updated', fetchEvents);
    return () => window.removeEventListener('buddyplanner-calendar-events-updated', fetchEvents);
  }, []);

  return (
    <div className="task-layout calendar-layout">
      <div className="calendar-container task-panel">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          events={events}
        />
      </div>
    </div>
  );
}

export default Calendar;

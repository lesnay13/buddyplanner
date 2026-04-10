import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/Axios';

const QUOTES = [
  'Small progress is still progress.',
  'Discipline is choosing what you want most.',
  'You do not have to be perfect to be consistent.',
  'Focus on the next right step.',
  'A calm plan beats rushed effort.',
  'The only easy day was yesterday.'
];

const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
};

const Home = () => {
  const { currentUser } = useAuth();
  const welcomeName = currentUser?.username || currentUser?.name || currentUser?.email || '';
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [journalMessage, setJournalMessage] = useState('');

  const quoteOfDay = useMemo(() => {
    const index = getDayOfYear(new Date()) % QUOTES.length;
    return QUOTES[index];
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchTasks = async () => {
      setLoadingTasks(true);
      setTasksError('');
      try {
        const response = await axiosInstance.get('/api/tasks/');
        const now = new Date();
        const day = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - day);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const userWeeklyTasks = response.data
          .filter((task) => {
            const taskCreatorId = typeof task.created_by === 'number'
              ? task.created_by
              : task.created_by?.user?.id;
            return taskCreatorId === currentUser.user_id;
          })
          .filter((task) => {
            const taskDate = new Date(task.start_time);
            return taskDate >= startOfWeek && taskDate <= endOfWeek;
          })
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        setTasks(userWeeklyTasks);
      } catch (error) {
        setTasksError(error.response?.data?.detail || error.message || 'Failed to load tasks.');
      } finally {
        setLoadingTasks(false);
      }
    };

    const fetchTodayJournal = async () => {
      try {
        const response = await axiosInstance.get('/api/journals/');
        const today = new Date().toISOString().slice(0, 10);
        const todayJournal = (response.data || []).find((entry) => entry.entry_date === today);
        setJournalEntry(todayJournal?.notes || '');
      } catch {
        setJournalEntry('');
      }
    };

    fetchTasks();
    fetchTodayJournal();
  }, [currentUser]);

  const saveJournal = async () => {
    if (!currentUser) return;
    try {
      const today = new Date().toISOString().slice(0, 10);
      await axiosInstance.post('/api/journals/upsert/', {
        entry_date: today,
        notes: journalEntry,
      });
      setJournalMessage('Journal saved.');
    } catch {
      setJournalMessage('Failed to save journal.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      {!currentUser && (
        <>
          <div className="flex justify-end space-x-4">
            <Link to="/login" className="menu-item menu-sky">Login</Link>
            <Link to="/signup" className="menu-item menu-pink">Sign Up</Link>
          </div>
          <h1 className="text-4xl font-bold text-center my-8 text-text-main">Welcome to Buddy Planner</h1>
          <p className="text-lg text-center mb-8 text-text-muted">
            Your personal assistant to organize your life, track your tasks, and plan your meals.
          </p>
        </>
      )}

      {currentUser && (
        <>
          <h1 className="text-3xl font-bold text-center mb-6">Welcome back{welcomeName ? `, ${welcomeName}` : ''}</h1>
          <div className="task-layout">
            <section className="task-panel" aria-labelledby="home-weekly-tasks-title">
              <h2 id="home-weekly-tasks-title" className="home-panel-title">This Week&apos;s Tasks</h2>
              {loadingTasks && <p>Loading tasks...</p>}
              {tasksError && <p className="task-error">{tasksError}</p>}
              {!loadingTasks && !tasksError && tasks.length === 0 && <p>No tasks for this week.</p>}
              {!loadingTasks && !tasksError && tasks.length > 0 && (
                <ul className="task-list">
                  {tasks.map((task) => (
                    <li key={task.id} className="task-list-item">
                      <strong>{task.title}</strong>
                      <p>{task.description || 'No description'}</p>
                      <small>Starts: {new Date(task.start_time).toLocaleString()}</small>
                      <small>Ends: {new Date(task.end_time).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="task-panel" aria-labelledby="home-journal-title">
              <h2 id="home-journal-title" className="home-panel-title">Journal Entry</h2>
              <div className="task-field">
                <textarea
                  className="task-input task-textarea"
                  value={journalEntry}
                  onChange={(e) => {
                    setJournalEntry(e.target.value);
                    if (journalMessage) setJournalMessage('');
                  }}
                  placeholder="Write how your day is going..."
                />
              </div>
              <button type="button" className="task-submit-button" onClick={saveJournal}>Save Journal</button>
              {journalMessage && <small>{journalMessage}</small>}
            </section>

            <section className="task-panel" aria-labelledby="home-quote-title">
              <h2 id="home-quote-title" className="home-panel-title">Quote of the Day</h2>
              <p>{quoteOfDay}</p>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

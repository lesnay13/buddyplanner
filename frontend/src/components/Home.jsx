import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/Axios';

const Home = () => {
  const { currentUser } = useAuth();
  const welcomeName = currentUser?.username || currentUser?.name || currentUser?.email || '';
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [journalMessage, setJournalMessage] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState('');

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

  useEffect(() => {
    const fetchQuote = async () => {
      setQuoteLoading(true);
      setQuoteError('');
      try {
        const response = await axiosInstance.get('/api/proxy/quote/');
        if (response.data?.quote) {
          setQuoteText(response.data.quote);
        } else {
          setQuoteText('');
          setQuoteError('No internet quote available right now.');
        }
      } catch {
        setQuoteText('');
        setQuoteError('No internet quote available right now.');
      } finally {
        setQuoteLoading(false);
      }
    };

    fetchQuote();
  }, []);

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
          <h1 className="text-4xl font-bold text-center my-8 text-text-main">Welcome to Buddy Planner</h1>
          <p className="text-lg text-center mb-3 text-text-muted">
            Plan tasks, track meals, write guided journals, and manage your calendar in one app.
          </p>
          <p className="text-base text-center mb-6 text-text-muted">
            Sign up to start building daily routines, save your progress, and stay consistent.
          </p>
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            <Link to="/signup" className="menu-item menu-pink">Create Free Account</Link>
            <Link to="/login" className="menu-item menu-sky">I Already Have an Account</Link>
          </div>
          <div className="task-layout">
            <section className="task-panel" aria-labelledby="home-about-title">
              <h2 id="home-about-title" className="home-panel-title">What You Can Do</h2>
              <ul className="task-list">
                <li className="task-list-item">Create and manage daily tasks on your calendar.</li>
                <li className="task-list-item">Track nutrition and save daily facts.</li>
                <li className="task-list-item">Write guided journal entries by day.</li>
                <li className="task-list-item">Keep your progress organized in one dashboard.</li>
              </ul>
            </section>
            <section className="task-panel" aria-labelledby="home-cta-title">
              <h2 id="home-cta-title" className="home-panel-title">Why Sign Up</h2>
              <ul className="task-list">
                <li className="task-list-item">Your tasks and journal are saved by day.</li>
                <li className="task-list-item">Nutrition facts connect directly to journal entries.</li>
                <li className="task-list-item">Calendar combines your tasks and journal activity.</li>
              </ul>
            </section>
          </div>
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
              {quoteLoading ? <p>Loading quote...</p> : quoteText ? <p>{quoteText}</p> : null}
              {quoteError && <small className="task-error">{quoteError}</small>}
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

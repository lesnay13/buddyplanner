import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) return;
      try {
        const response = await api.get('/tasks/');
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

        const userTasks = response.data.filter(task => task.created_by === currentUser.user_id);

        const weeklyTasks = userTasks.filter(task => {
          const taskDate = new Date(task.start_time);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });

        setTasks(weeklyTasks);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ flex: 1, padding: '20px' }}>
      <h2>This Week's Tasks</h2>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <small>Starts: {new Date(task.start_time).toLocaleString()}</small><br />
              <small>Ends: {new Date(task.end_time).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks for this week.</p>
      )}
    </div>
  );
}
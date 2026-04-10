import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/Axios';
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
        const response = await axiosInstance.get('/api/tasks/');
        console.log('All tasks from API:', response.data);
        console.log('Current user ID:', currentUser.user_id);

        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

        const userTasks = response.data.filter(task => {
          const taskCreatorId = typeof task.created_by === 'number'
            ? task.created_by
            : (task.created_by && task.created_by.user ? task.created_by.user.id : null);

          return taskCreatorId === currentUser.user_id;
        });

        const weeklyTasks = userTasks.filter(task => {
          const taskDate = new Date(task.start_time);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });

        console.log('Filtered tasks:', weeklyTasks);
        setTasks(weeklyTasks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser]);

  if (loading) return <div className="task-panel">Loading...</div>;
  if (error) return <div className="task-panel">Error: {error}</div>;

  return (
    <div className="task-panel task-list-panel">
      <h1>This Week's Tasks</h1>
      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className="task-list-item">
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <small>Starts: {new Date(task.start_time).toLocaleString()}</small>
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

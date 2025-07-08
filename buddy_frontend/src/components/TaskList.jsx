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

        // Inside the fetchTasks function
        const userTasks = response.data.filter(task => {
          // Check if created_by is a number (ID) or an object with user_id
          const taskCreatorId = typeof task.created_by === 'number' ? 
            task.created_by : 
            (task.created_by && task.created_by.user ? task.created_by.user.id : null);
          
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ flex: 1, padding: '20px' }}>
      <h1>This Week's Tasks</h1>
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
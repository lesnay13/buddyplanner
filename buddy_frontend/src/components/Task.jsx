import React from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/Axios'; // Make sure this path is correct
import TaskList from './TaskList';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const Task = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { currentUser } = useAuth(); // Get currentUser from AuthContext

  const onSubmit = async (data) => {
    // Convert user input (camelCase) to API expected (snake_case) with ISO format
    const taskData = {
      title: data.title,
      description: data.description,
      start_time: new Date(data.startTime).toISOString(),
      end_time: new Date(data.endTime).toISOString(),
      location: data.location,
      is_all_day: data.is_all_day,
      created_by: currentUser.user_id, // Add created_by
    };

    try {
      const response = await axiosInstance.post('/api/tasks/', taskData);
      console.log('Task created:', response.data);
      reset();
    } catch (error) {
      console.error('Error creating task:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px', maxWidth: '400px'}}>
        <h1>Create Task</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '50px' }}>
            <label>Title: </label>
            <input
              type="text"
              style={{ backgroundColor: 'gray', display: 'block', width: '100%' }}
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <span style={{color: 'red'}}>{errors.title.message}</span>}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description: </label>
            <textarea
              style={{ backgroundColor: 'gray', width: '100%', minHeight: '100px' }}
              {...register('description')}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Start Time: </label>
            <input
              type="datetime-local"
              style={{ backgroundColor: 'gray', display: 'block', width: '100%' }}
              {...register('startTime', { required: 'Start time is required' })}
            />
            {errors.startTime && <span style={{color: 'red'}}>{errors.startTime.message}</span>}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>End Time: </label>
            <input
              type="datetime-local"
              style={{ backgroundColor: 'gray', display: 'block', width: '100%' }}
              {...register('endTime', { required: 'End time is required' })}
            />
            {errors.endTime && <span style={{color: 'red'}}>{errors.endTime.message}</span>}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Location: </label>
            <input
              type="text"
              style={{ backgroundColor: 'gray', display: 'block', width: '100%' }}
              {...register('location')}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>
              <input
                type="checkbox"
                style={{ marginRight: '5px' }}
                {...register('isAllDay')}
              /> All Day Event
            </label>
          </div>
          
          <button type="submit" style={{ marginTop: '10px' }}>Create Task</button>
        </form>
      </div>
      <TaskList />
    </div>
  );
};

export default Task;

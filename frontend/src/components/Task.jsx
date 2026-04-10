import React from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/Axios';
import TaskList from './TaskList';
import { useAuth } from '../contexts/AuthContext';

const Task = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { currentUser } = useAuth();

  const onSubmit = async (data) => {
    const taskData = {
      title: data.title,
      description: data.description,
      start_time: new Date(data.startTime).toISOString(),
      end_time: new Date(data.endTime).toISOString(),
      location: data.location,
      is_all_day: data.is_all_day,
      created_by: currentUser.user_id,
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
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="task-page-title text-3xl font-bold text-center mb-6">Task List</h1>
      <div className="task-layout">
        <div className="task-panel">
        <form onSubmit={handleSubmit(onSubmit)} className="task-form">
          <div className="task-field">
            <label htmlFor="task-title">Title</label>
            <input id="task-title" type="text" className="task-input" {...register('title', { required: 'Title is required' })} />
            {errors.title && <span className="task-error">{errors.title.message}</span>}
          </div>
          <div className="task-field">
            <label htmlFor="task-description">Description</label>
            <textarea id="task-description" className="task-input task-textarea" {...register('description')} />
          </div>
          <div className="task-field">
            <label htmlFor="task-start-time">Start Time</label>
            <input id="task-start-time" type="datetime-local" className="task-input" {...register('startTime', { required: 'Start time is required' })} />
            {errors.startTime && <span className="task-error">{errors.startTime.message}</span>}
          </div>
          <div className="task-field">
            <label htmlFor="task-end-time">End Time</label>
            <input id="task-end-time" type="datetime-local" className="task-input" {...register('endTime', { required: 'End time is required' })} />
            {errors.endTime && <span className="task-error">{errors.endTime.message}</span>}
          </div>
          <div className="task-field">
            <label htmlFor="task-location">Location</label>
            <input id="task-location" type="text" className="task-input" {...register('location')} />
          </div>
          <label className="task-checkbox-row">
            <input type="checkbox" {...register('isAllDay')} />
            <span>All Day Event</span>
          </label>
          <button type="submit" className="task-submit-button">Create Task</button>
        </form>
      </div>
      <TaskList />
      </div>
    </div>
  );
};

export default Task;

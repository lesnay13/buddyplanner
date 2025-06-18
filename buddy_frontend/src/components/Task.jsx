import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function Task() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/tasks/', {
        title: data.title,
        description: data.description,
        start_time: data.startTime,
        end_time: data.endTime,
        location: data.location,
        is_all_day: data.isAllDay,
        is_completed: false
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        }
      });
      
      console.log('Task created:', response.data);
      reset();
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error.message);
    }
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  return (
    <div style={{ flex: 1, padding: '20px', maxWidth: '400px'}}>
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '50px' }}>
          <label>Title: </label>
          <input
            type="text"
            style={{ backgroundColor: 'white', display: 'block', width: '100%' }}
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <span style={{color: 'red'}}>{errors.title.message}</span>}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description: </label>
          <textarea
            style={{ backgroundColor: 'white', width: '100%', minHeight: '100px' }}
            {...register('description')}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Start Time: </label>
          <input
            type="datetime-local"
            style={{ backgroundColor: 'white', display: 'block', width: '100%' }}
            {...register('startTime', { required: 'Start time is required' })}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>End Time: </label>
          <input
            type="datetime-local"
            style={{ backgroundColor: 'white', display: 'block', width: '100%' }}
            {...register('endTime', { required: 'End time is required' })}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Location: </label>
          <input
            type="text"
            style={{ backgroundColor: 'white', display: 'block', width: '100%' }}
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
  );
}
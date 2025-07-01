import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function Profile() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/profile/', {
          withCredentials: true
        });
        
        if (response.headers['content-type'].includes('application/json')) {
          setProfile(response.data);
          reset(response.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Add user-friendly error message here
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put('/api/profile/', data, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        }
      });
      setProfile(response.data);
      // Add success notification here
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      // Add error handling here
    }
  };

  // Helper function to get CSRF token
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            style={{ backgroundColor: 'white', width: '100%' }}
            defaultValue={profile?.user?.username || ''}
            disabled
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Birth Date:</label>
          <input
            type="date"
            style={{ backgroundColor: 'white', width: '100%' }}
            {...register('birth_date')}
            defaultValue={profile?.user?.birth_date || ''}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number:</label>
          <input
            type="text"
            style={{ backgroundColor: 'white', width: '100%' }}
            {...register('phone_number')}
            defaultValue={profile?.user?.phone_number || ''}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Bio:</label>
          <textarea
            style={{ backgroundColor: 'white', width: '100%', minHeight: '100px' }}
            {...register('bio')}
            defaultValue={profile?.bio || ''}
          />
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>Save Profile</button>
      </form>
    </div>
  );
}
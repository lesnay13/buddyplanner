import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/Axios';

export default function Profile() {
  const { register, handleSubmit, reset } = useForm();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileResponse, apiProfileResponse] = await Promise.all([
          axiosInstance.get('/profile/'),
          axiosInstance.get('/api/profile/'),
        ]);

        const mergedProfile = {
          ...profileResponse.data,
          profile_picture: apiProfileResponse.data?.profile_picture || null,
        };

        setProfile(mergedProfile);
        reset(mergedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.put('/api/profile/', data);
      setProfile((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
    }
  };

  const uploadProfilePicture = async () => {
    if (!selectedImage) return;

    try {
      setUploadError('');
      setUploadMessage('');
      const formData = new FormData();
      formData.append('profile_picture', selectedImage);

      const response = await axiosInstance.patch('/api/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile((prev) => ({ ...prev, profile_picture: response.data?.profile_picture || null }));
      setUploadMessage('Profile picture updated.');
      setSelectedImage(null);
    } catch (error) {
      setUploadError(error.response?.data?.profile_picture?.[0] || 'Failed to upload picture.');
    }
  };

  const profileImageUrl = profile?.profile_picture
    ? (profile.profile_picture.startsWith('http')
        ? profile.profile_picture
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${profile.profile_picture}`)
    : '';

  if (isLoading) return <div className="task-panel max-w-2xl">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="task-page-title text-3xl font-bold text-center mb-6">Profile</h1>
      <div className="task-layout">
        <div className="task-panel profile-picture-panel">
          <h2 className="home-panel-title">Profile Picture</h2>
          <div className="profile-picture-preview">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" />
            ) : (
              <div className="profile-picture-placeholder">No profile picture</div>
            )}
          </div>
          <div className="task-field">
            <label htmlFor="profile-picture">Upload Picture</label>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="task-input"
              onChange={(e) => {
                setSelectedImage(e.target.files?.[0] || null);
                setUploadMessage('');
                setUploadError('');
              }}
            />
          </div>
          <button type="button" className="task-submit-button" onClick={uploadProfilePicture} disabled={!selectedImage}>
            Upload Picture
          </button>
          {uploadMessage && <small>{uploadMessage}</small>}
          {uploadError && <p className="task-error">{uploadError}</p>}
        </div>

        <div className="task-panel max-w-2xl w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="task-form">
          <div className="task-field">
            <label htmlFor="profile-username">Username</label>
            <input
              id="profile-username"
              type="text"
              className="task-input"
              defaultValue={profile?.user?.username || ''}
              disabled
            />
          </div>

          <div className="task-field">
            <label htmlFor="profile-birth-date">Birth Date</label>
            <input
              id="profile-birth-date"
              type="date"
              className="task-input"
              {...register('birth_date')}
              defaultValue={profile?.user?.birth_date || ''}
            />
          </div>

          <div className="task-field">
            <label htmlFor="profile-phone-number">Phone Number</label>
            <input
              id="profile-phone-number"
              type="text"
              className="task-input"
              {...register('phone_number')}
              defaultValue={profile?.user?.phone_number || ''}
            />
          </div>

          <div className="task-field">
            <label htmlFor="profile-bio">Bio</label>
            <textarea
              id="profile-bio"
              className="task-input task-textarea"
              {...register('bio')}
              defaultValue={profile?.bio || ''}
            />
          </div>

            <button type="submit" className="task-submit-button">Save Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}

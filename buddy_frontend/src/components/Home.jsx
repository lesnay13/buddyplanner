import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Still render nothing if not logged in
  }

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1>Welcome to BuddyPlanner</h1>
          <span className="font-bold">{currentUser.displayName}</span>
          <br />
          This is your personalized task management and calendar platform.
          <br />
          Happy tasking and planning!
          <br />
          <br />
        </div>
      </main>
    </>
  );
};

export default Home;

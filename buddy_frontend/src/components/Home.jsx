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
          This is gonna be a summary of your day that is on the app.
          Add options for journaling and adjust the models. Create a journaling component. 
          Adjust the recipe traking area. Add a meal traker / mood tracker into the journaling area.
          Task page will have a task list for the day or week/month view? Undecided?  
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

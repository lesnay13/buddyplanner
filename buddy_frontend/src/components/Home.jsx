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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!currentUser) {
    return null; // Still render nothing if not logged in
  }

  return (
    <>
      <nav className="bg-gray shadow-lg flex justify-between items-center p-4">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold text-gray-800">
              BuddyPlanner
            </Link>
            <Link to="/calendar" className="text-gray-700 hover:text-gray-900">
              Calendar 
            </Link>
            <Link to="/tasks" className="text-gray-700 hover:text-gray-900">
              Tasks 
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-gray-900">
              Profile 
            </Link>
          </div>
          <div> 
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
      </nav>
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

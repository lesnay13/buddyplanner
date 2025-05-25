import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-7">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-800">
                  BuddyPlanner
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/calendar" className="py-2 px-3 text-gray-700 hover:text-gray-900">
                  Calendar
                </Link>
                <Link to="/tasks" className="py-2 px-3 text-gray-700 hover:text-gray-900">
                  Tasks
                </Link>
                <Link to="/profile" className="py-2 px-3 text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to BuddyPlanner
          </h1>
          <p className="text-gray-600">
            Your personal planning assistant to help you stay organized and productive.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;

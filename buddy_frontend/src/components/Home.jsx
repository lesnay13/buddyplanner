import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end space-x-4">
        <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </Link>
        <Link to="/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Sign Up
        </Link>
      </div>
      <h1 className="text-4xl font-bold text-center my-8">Welcome to Buddy Planner</h1>
      <p className="text-lg text-center mb-8">
        Your personal assistant to organize your life, track your tasks, and plan your meals.
      </p>
    </div>
  );
};

export default Home;

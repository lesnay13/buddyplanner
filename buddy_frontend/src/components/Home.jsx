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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Task Management</h2>
          <p>Organize your daily tasks, set reminders, and track your progress. Never miss a deadline again.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Meal Planner</h2>
          <p>Plan your meals for the week, discover new recipes, and create shopping lists with ease.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Journaling</h2>
          <p>Keep a personal journal to reflect on your day, track your mood, and practice gratitude.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

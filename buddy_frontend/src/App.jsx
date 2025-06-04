import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Calendar from './components/Calendar';
import Profile from './components/Profile'; 
import Task from './components/Task';
import Recipes from './components/Recipe';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/task" element={<Task />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;

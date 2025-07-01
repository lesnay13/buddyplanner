import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Calendar from './components/Calendar'; // Remove curly braces
import Profile from './components/Profile';
import Task from './components/Task';
import Recipes from './components/Recipe';
import Login from './components/Login';
import Signup from './components/Signup';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/calendar"
          element={
            <ErrorBoundary>
              <Calendar />
            </ErrorBoundary>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/task"
          element={
            <ErrorBoundary>
              <Task />
            </ErrorBoundary>
          }
        />
        <Route path="/recipes" element={<Recipes />} />
      </Routes>
    </Layout>
  );
}

export default App;

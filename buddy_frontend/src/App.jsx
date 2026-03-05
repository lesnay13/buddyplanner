import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Calendar from './components/Calendar';
import Profile from './components/Profile';
import Task from './components/Task';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import Recipe from './components/Recipe';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Calendar />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route
          path="/task"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Task />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
         path="/recipes" 
         element={ 
            <ProtectedRoute>
              <ErrorBoundary>
                <Recipe/>
              </ErrorBoundary>
            </ProtectedRoute>
          }
          /> 
      </Routes>
    </Layout>
  );
}

export default App;

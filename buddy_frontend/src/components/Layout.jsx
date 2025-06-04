import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
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
          <Link to="/recipes" className="text-gray-700 hover:text-gray-900">
            Recipes
          </Link>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
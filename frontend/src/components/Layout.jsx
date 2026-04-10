import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen diary-paper transition-colors duration-300">
      <nav className="header-bar shadow-lg flex flex-wrap justify-between items-center p-4 gap-2 transition-colors duration-300">
        <div className="flex items-center flex-wrap gap-2">
          <Link to="/" className="text-xl font-bold">
            BuddyPlanner
          </Link>
          {currentUser && (
            <>
              <Link to="/calendar" className="menu-item menu-mint">Calendar</Link>
              <Link to="/task" className="menu-item menu-khaki">Task</Link>
              <Link to="/recipes" className="menu-item menu-pink">Recipes</Link>
              <Link to="/journal" className="menu-item menu-lilac">Journal</Link>
              <Link to="/nutrition" className="menu-item menu-sky">Nutrition</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="menu-item menu-pink"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          {currentUser && (
            <Link to="/profile" className="menu-item menu-lilac">Profile</Link>
          )}
          {currentUser && (
            <button
              onClick={logout}
              className="menu-item menu-sky"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

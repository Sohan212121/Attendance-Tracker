import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { useTheme } from '../utils/theme';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  LogOut,
  GraduationCap,
  Moon,
  Sun
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const teacherLinks = [
    { to: '/teacher', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/teacher/classes', icon: <BookOpen size={18} />, label: 'Classes' },
    { to: '/teacher/attendance', icon: <ClipboardCheck size={18} />, label: 'Mark Attendance' },
    { to: '/teacher/reports', icon: <BarChart3 size={18} />, label: 'Reports' },
  ];

  const studentLinks = [
    { to: '/student', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <GraduationCap size={24} className="brand-icon" />
          <span className="brand-text">AttendEase</span>
        </div>

        <div className="navbar-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/teacher' || link.to === '/student'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="navbar-user">
          <button onClick={toggleTheme} className="btn btn-icon btn-ghost theme-toggle" title="Toggle Theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className={`badge badge-${user?.role}`}>
                {user?.role}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm logout-btn" id="logout-button">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

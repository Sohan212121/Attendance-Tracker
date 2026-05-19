import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { GraduationCap, User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 400));

    const user = login(username, password);
    if (user) {
      navigate(user.role === 'teacher' ? '/teacher' : '/student');
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  const fillDemo = (demoRole) => {
    if (demoRole === 'teacher') {
      setUsername('teacher1');
      setPassword('password');
      setRole('teacher');
    } else {
      setUsername('student1');
      setPassword('password');
      setRole('student');
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="grid-pattern"></div>
      </div>

      <div className="login-container animate-scale">
        <div className="login-header">
          <div className="login-logo">
            <GraduationCap size={36} />
          </div>
          <h1 className="login-title">AttendEase</h1>
          <p className="login-subtitle">Student Attendance Management System</p>
        </div>

        {/* Role Selector */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === 'teacher' ? 'role-active' : ''}`}
            onClick={() => setRole('teacher')}
          >
            <User size={16} />
            Teacher
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'student' ? 'role-active' : ''}`}
            onClick={() => setRole('student')}
          >
            <GraduationCap size={16} />
            Student
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input
                id="username-input"
                type="text"
                className="form-input form-input-icon"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input form-input-icon"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error animate-fade">
              {error}
            </div>
          )}

          <button
            id="login-button"
            type="submit"
            className={`btn btn-primary btn-lg login-submit ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-label">Quick Demo Access</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn"
              onClick={() => fillDemo('teacher')}
            >
              <User size={14} />
              Teacher Demo
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => fillDemo('student')}
            >
              <GraduationCap size={14} />
              Student Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

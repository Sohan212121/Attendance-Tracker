import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './utils/auth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ManageClasses from './pages/teacher/ManageClasses';
import MarkAttendance from './pages/teacher/MarkAttendance';
import Reports from './pages/teacher/Reports';
import StudentDashboard from './pages/student/StudentDashboard';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      {children}
    </div>
  );
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomeRedirect />} />

      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute role="teacher"><AppLayout><TeacherDashboard /></AppLayout></ProtectedRoute>
      } />
      <Route path="/teacher/classes" element={
        <ProtectedRoute role="teacher"><AppLayout><ManageClasses /></AppLayout></ProtectedRoute>
      } />
      <Route path="/teacher/attendance" element={
        <ProtectedRoute role="teacher"><AppLayout><MarkAttendance /></AppLayout></ProtectedRoute>
      } />
      <Route path="/teacher/reports" element={
        <ProtectedRoute role="teacher"><AppLayout><Reports /></AppLayout></ProtectedRoute>
      } />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute role="student"><AppLayout><StudentDashboard /></AppLayout></ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

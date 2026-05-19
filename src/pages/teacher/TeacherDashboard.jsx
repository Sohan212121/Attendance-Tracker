import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { getClasses, getClassStats } from '../../utils/storage';
import StatCard from '../../components/StatCard';
import { BookOpen, Users, ClipboardCheck, TrendingUp, ArrowRight, Calendar, BarChart3 } from 'lucide-react';
import './TeacherPages.css';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ classes: 0, students: 0, sessions: 0, avgAttendance: 0 });
  const [recentClasses, setRecentClasses] = useState([]);

  useEffect(() => {
    const classes = getClasses(user.id);
    const allStudents = new Set();
    let totalSessions = 0, totalPct = 0;
    const classData = classes.map((cls) => {
      cls.students.forEach((s) => allStudents.add(s));
      const cs = getClassStats(cls.id);
      totalSessions += cs?.totalSessions || 0;
      const avg = cs?.studentStats?.length ? cs.studentStats.reduce((s, x) => s + x.percentage, 0) / cs.studentStats.length : 0;
      totalPct += avg;
      return { ...cls, totalStudents: cls.students.length, totalSessions: cs?.totalSessions || 0, avgAttendance: Math.round(avg) };
    });
    setRecentClasses(classData);
    setStats({ classes: classes.length, students: allStudents.size, sessions: totalSessions, avgAttendance: classes.length ? Math.round(totalPct / classes.length) : 0 });
  }, [user.id]);

  const pctCls = (p) => p >= 75 ? 'pct-good' : p >= 50 ? 'pct-warning' : 'pct-danger';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="page-subtitle">Here's your attendance management overview</p>
      </div>
      <div className="stats-grid">
        <StatCard icon={<BookOpen size={22} />} label="Total Classes" value={stats.classes} color="var(--gradient-primary)" delay={0} />
        <StatCard icon={<Users size={22} />} label="Total Students" value={stats.students} color="var(--gradient-accent)" delay={0.05} />
        <StatCard icon={<ClipboardCheck size={22} />} label="Total Sessions" value={stats.sessions} color="var(--gradient-success)" delay={0.1} />
        <StatCard icon={<TrendingUp size={22} />} label="Avg Attendance" value={`${stats.avgAttendance}%`} color="var(--gradient-warning)" delay={0.15} />
      </div>
      <div className="section-header"><h2 className="section-title">Quick Actions</h2></div>
      <div className="quick-actions animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <Link to="/teacher/attendance" className="quick-action-card glass-card">
          <div className="qa-icon" style={{ background: 'var(--gradient-success)' }}><ClipboardCheck size={24} /></div>
          <div className="qa-info"><h3>Mark Attendance</h3><p>Record today's attendance</p></div>
          <ArrowRight size={18} className="qa-arrow" />
        </Link>
        <Link to="/teacher/classes" className="quick-action-card glass-card">
          <div className="qa-icon" style={{ background: 'var(--gradient-primary)' }}><BookOpen size={24} /></div>
          <div className="qa-info"><h3>Manage Classes</h3><p>Create or edit classes</p></div>
          <ArrowRight size={18} className="qa-arrow" />
        </Link>
        <Link to="/teacher/reports" className="quick-action-card glass-card">
          <div className="qa-icon" style={{ background: 'var(--gradient-accent)' }}><BarChart3 size={24} /></div>
          <div className="qa-info"><h3>View Reports</h3><p>Analytics & statistics</p></div>
          <ArrowRight size={18} className="qa-arrow" />
        </Link>
      </div>
      <div className="section-header" style={{ marginTop: 32 }}>
        <h2 className="section-title">Your Classes</h2>
        <Link to="/teacher/classes" className="section-link">View All <ArrowRight size={14} /></Link>
      </div>
      <div className="grid-2">
        {recentClasses.map((cls, i) => (
          <div key={cls.id} className="class-overview-card glass-card animate-fade-up" style={{ animationDelay: `${0.25 + i * 0.05}s` }}>
            <div className="class-overview-header">
              <h3>{cls.name}</h3>
              <span className={`class-pct ${pctCls(cls.avgAttendance)}`}>{cls.avgAttendance}%</span>
            </div>
            <div className="class-overview-stats">
              <div className="class-mini-stat"><Users size={14} /><span>{cls.totalStudents} students</span></div>
              <div className="class-mini-stat"><Calendar size={14} /><span>{cls.totalSessions} sessions</span></div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${cls.avgAttendance}%`, background: cls.avgAttendance >= 75 ? 'var(--gradient-success)' : cls.avgAttendance >= 50 ? 'var(--gradient-warning)' : 'var(--gradient-danger)' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/auth';
import { getStudentStats, getStudentClassesForStudent, getAttendanceByStudent } from '../../utils/storage';
import CircularProgress from '../../components/CircularProgress';
import StatCard from '../../components/StatCard';
import { BookOpen, CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react';
import './StudentPages.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const s = getStudentStats(user.id);
    setStats(s);
    const records = getAttendanceByStudent(user.id);
    const classes = getStudentClassesForStudent(user.id);
    const classMap = {};
    classes.forEach(c => { classMap[c.id] = c.name; });
    const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20);
    setHistory(sorted.map(r => ({ ...r, className: classMap[r.classId] || 'Unknown' })));
  }, [user.id]);

  if (!stats) return null;

  const statusLabel = (pct) => {
    if (pct >= 75) return { text: 'Good Standing', cls: 'status-good' };
    if (pct >= 50) return { text: 'Needs Improvement', cls: 'status-warning' };
    return { text: 'Critical', cls: 'status-danger' };
  };

  const overall = statusLabel(stats.overall.percentage);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Hi, {user.name.split(' ')[0]}!</h1>
        <p className="page-subtitle">Your attendance dashboard</p>
      </div>

      {/* Overall Card */}
      <div className="student-overview glass-card animate-fade-up">
        <div className="student-overview-left">
          <CircularProgress percentage={stats.overall.percentage} size={140} strokeWidth={10} label="Overall" />
        </div>
        <div className="student-overview-right">
          <div className={`status-badge ${overall.cls}`}>{overall.text}</div>
          <div className="overview-stats-row">
            <div className="overview-stat">
              <span className="overview-stat-val">{stats.overall.present}</span>
              <span className="overview-stat-lbl">Present</span>
            </div>
            <div className="overview-stat">
              <span className="overview-stat-val">{stats.overall.absent}</span>
              <span className="overview-stat-lbl">Absent</span>
            </div>
            <div className="overview-stat">
              <span className="overview-stat-val">{stats.overall.total}</span>
              <span className="overview-stat-lbl">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard icon={<BookOpen size={22} />} label="Enrolled Classes" value={stats.byClass.length} color="var(--gradient-primary)" delay={0.1} />
        <StatCard icon={<CheckCircle size={22} />} label="Days Present" value={stats.overall.present} color="var(--gradient-success)" delay={0.15} />
        <StatCard icon={<XCircle size={22} />} label="Days Absent" value={stats.overall.absent} color="var(--gradient-danger)" delay={0.2} />
      </div>

      {/* Subject-wise */}
      <div className="section-header" style={{ marginTop: 8 }}>
        <h2 className="section-title">Subject-wise Attendance</h2>
      </div>
      <div className="subject-cards-grid">
        {stats.byClass.map((cls, i) => {
          const st = statusLabel(cls.percentage);
          return (
            <div key={cls.classId} className="subject-card glass-card animate-fade-up" style={{ animationDelay: `${0.25 + i * 0.05}s` }}>
              <div className="subject-card-top">
                <h3>{cls.className}</h3>
                <span className={st.cls} style={{ fontSize: '0.75rem', fontWeight: 600 }}>{st.text}</span>
              </div>
              <div className="subject-card-middle">
                <CircularProgress percentage={cls.percentage} size={80} strokeWidth={6} />
                <div className="subject-details">
                  <div className="subject-detail"><span className="badge badge-present">{cls.present} present</span></div>
                  <div className="subject-detail"><span className="badge badge-absent">{cls.absent} absent</span></div>
                  <div className="subject-detail" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{cls.total} total sessions</div>
                </div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${cls.percentage}%`, background: cls.percentage >= 75 ? 'var(--gradient-success)' : cls.percentage >= 50 ? 'var(--gradient-warning)' : 'var(--gradient-danger)' }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent History */}
      <div className="section-header" style={{ marginTop: 32 }}>
        <h2 className="section-title">Recent History</h2>
      </div>
      <div className="table-wrapper glass-card animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Subject</th><th>Status</th></tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No records yet</td></tr>
            ) : (
              history.map((r, i) => (
                <tr key={r.id}>
                  <td><Calendar size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />{r.date}</td>
                  <td>{r.className}</td>
                  <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

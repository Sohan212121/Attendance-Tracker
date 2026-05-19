import { useState, useEffect } from 'react';
import { useAuth } from '../../utils/auth';
import { getClasses, getClassStats } from '../../utils/storage';
import StatCard from '../../components/StatCard';
import { BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';
import './TeacherPages.css';

export default function Reports() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [report, setReport] = useState(null);

  useEffect(() => {
    const c = getClasses(user.id);
    setClasses(c);
    if (c.length > 0) setSelectedClass(c[0].id);
  }, [user.id]);

  useEffect(() => {
    if (!selectedClass) { setReport(null); return; }
    setReport(getClassStats(selectedClass));
  }, [selectedClass]);

  const pctCls = (p) => p >= 75 ? 'pct-good' : p >= 50 ? 'pct-warning' : 'pct-danger';
  const pctBg = (p) => p >= 75 ? 'var(--gradient-success)' : p >= 50 ? 'var(--gradient-warning)' : 'var(--gradient-danger)';

  const avgPct = report?.studentStats?.length
    ? Math.round(report.studentStats.reduce((s, x) => s + x.percentage, 0) / report.studentStats.length)
    : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Attendance Reports</h1>
        <p className="page-subtitle">Detailed analytics and student-wise breakdowns</p>
      </div>

      <div className="report-class-selector">
        <div className="form-group">
          <label className="form-label">Select Class</label>
          <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} id="report-class-select">
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {report && (
        <>
          <div className="report-summary-grid">
            <div className="report-summary-card glass-card animate-fade-up">
              <span className="report-summary-value" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{report.studentStats.length}</span>
              <span className="report-summary-label">Students</span>
            </div>
            <div className="report-summary-card glass-card animate-fade-up" style={{ animationDelay: '0.05s' }}>
              <span className="report-summary-value" style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{report.totalSessions}</span>
              <span className="report-summary-label">Sessions</span>
            </div>
            <div className="report-summary-card glass-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className={`report-summary-value ${pctCls(avgPct)}`}>{avgPct}%</span>
              <span className="report-summary-label">Avg Attendance</span>
            </div>
          </div>

          <div className="section-header">
            <h2 className="section-title">Student-wise Breakdown</h2>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            {report.studentStats.length === 0 ? (
              <div className="empty-state">
                <Users size={40} />
                <h3>No data yet</h3>
                <p>Start marking attendance to see reports</p>
              </div>
            ) : (
              report.studentStats.map((s, i) => (
                <div key={s.studentId} className="report-student-bar animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <span className="report-bar-name">{s.studentName}</span>
                  <div className="report-bar-track">
                    <div className="report-bar-fill" style={{ width: `${s.percentage}%`, background: pctBg(s.percentage) }}></div>
                  </div>
                  <span className={`report-bar-pct ${pctCls(s.percentage)}`}>{s.percentage}%</span>
                </div>
              ))
            )}
          </div>

          {report.studentStats.length > 0 && (
            <>
              <div className="section-header" style={{ marginTop: 32 }}>
                <h2 className="section-title">Detailed Records</h2>
              </div>
              <div className="table-wrapper glass-card animate-fade-up" style={{ animationDelay: '0.15s' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Total</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.studentStats.map(s => (
                      <tr key={s.studentId}>
                        <td style={{ fontWeight: 500 }}>{s.studentName}</td>
                        <td><span className="badge badge-present">{s.present}</span></td>
                        <td><span className="badge badge-absent">{s.absent}</span></td>
                        <td>{s.total}</td>
                        <td><span className={pctCls(s.percentage)} style={{ fontWeight: 700 }}>{s.percentage}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

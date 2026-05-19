import { useState, useEffect } from 'react';
import { useAuth } from '../../utils/auth';
import { getClasses, getAttendanceByClassAndDate, markAttendance, getUserById } from '../../utils/storage';
import { ClipboardCheck, Save, CheckCircle, XCircle } from 'lucide-react';
import './TeacherPages.css';

export default function MarkAttendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);
  const [toast, setToast] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setClasses(getClasses(user.id)); }, [user.id]);

  useEffect(() => {
    if (!selectedClass) { setStudents([]); return; }
    const cls = classes.find(c => c.id === selectedClass);
    if (!cls) return;
    const studs = cls.students.map(sid => getUserById(sid)).filter(Boolean);
    setStudents(studs);
    const existing = getAttendanceByClassAndDate(selectedClass, date);
    const map = {};
    studs.forEach(s => { map[s.id] = 'present'; });
    existing.forEach(r => { map[r.studentId] = r.status; });
    setAttendance(map);
    setSaved(false);
  }, [selectedClass, date, classes]);

  const toggleStatus = (sid) => {
    setAttendance(prev => ({ ...prev, [sid]: prev[sid] === 'present' ? 'absent' : 'present' }));
    setSaved(false);
  };

  const markAll = (status) => {
    const map = {};
    students.forEach(s => { map[s.id] = status; });
    setAttendance(map);
    setSaved(false);
  };

  const handleSave = () => {
    Object.entries(attendance).forEach(([sid, status]) => {
      markAttendance(selectedClass, sid, date, status, user.id);
    });
    setSaved(true);
    setToast({ msg: 'Attendance saved successfully!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mark Attendance</h1>
        <p className="page-subtitle">Select a class and date to record attendance</p>
      </div>

      <div className="attendance-controls">
        <div className="form-group">
          <label className="form-label">Select Class</label>
          <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} id="class-select">
            <option value="">Choose a class...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} id="date-input" />
        </div>
      </div>

      {selectedClass && students.length > 0 && (
        <>
          <div className="bulk-actions">
            <span>Quick:</span>
            <button className="btn btn-sm btn-success" onClick={() => markAll('present')}><CheckCircle size={14} /> All Present</button>
            <button className="btn btn-sm btn-danger" onClick={() => markAll('absent')}><XCircle size={14} /> All Absent</button>
          </div>

          <div className="attendance-student-list">
            {students.map((s, i) => (
              <div key={s.id} className="attendance-row animate-fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
                <div className="attendance-row-left">
                  <div className="student-avatar-sm">{s.name.charAt(0)}</div>
                  <span className="attendance-row-name">{s.name}</span>
                </div>
                <div className="attendance-toggle">
                  <button className={attendance[s.id] === 'present' ? 'active-present' : ''} onClick={() => { setAttendance(p => ({ ...p, [s.id]: 'present' })); setSaved(false); }}>Present</button>
                  <button className={attendance[s.id] === 'absent' ? 'active-absent' : ''} onClick={() => { setAttendance(p => ({ ...p, [s.id]: 'absent' })); setSaved(false); }}>Absent</button>
                </div>
              </div>
            ))}
          </div>

          <div className="save-bar animate-fade-up">
            <div className="save-bar-info">
              <strong>{presentCount}</strong> present · <strong>{absentCount}</strong> absent
            </div>
            <button className="btn btn-primary" onClick={handleSave} id="save-attendance-btn" disabled={saved}>
              {saved ? <><CheckCircle size={16} /> Saved</> : <><Save size={16} /> Save Attendance</>}
            </button>
          </div>
        </>
      )}

      {selectedClass && students.length === 0 && (
        <div className="empty-state glass-card" style={{ padding: 48 }}>
          <ClipboardCheck size={48} />
          <h3>No students in this class</h3>
          <p>Enroll students from the Manage Classes page first</p>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

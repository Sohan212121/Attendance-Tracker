import { useState, useEffect } from 'react';
import { useAuth } from '../../utils/auth';
import { getClasses, createClass, getAllStudents, enrollStudent, unenrollStudent, getUserById } from '../../utils/storage';
import { Plus, Users, X, UserPlus, BookOpen } from 'lucide-react';
import './TeacherPages.css';

export default function ManageClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [enrollModal, setEnrollModal] = useState(null);
  const [toast, setToast] = useState(null);

  const reload = () => setClasses(getClasses(user.id));
  useEffect(reload, [user.id]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const cls = createClass(newClassName.trim(), user.id);
    if (cls) { reload(); setShowModal(false); setNewClassName(''); showToast('Class created!'); }
    else showToast('Class already exists', 'error');
  };

  const handleEnroll = (classId, studentId) => {
    enrollStudent(classId, studentId);
    reload();
    showToast('Student enrolled!');
  };

  const handleUnenroll = (classId, studentId) => {
    unenrollStudent(classId, studentId);
    reload();
    showToast('Student removed');
  };

  const allStudents = getAllStudents();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manage Classes</h1>
        <p className="page-subtitle">Create classes and manage student enrollment</p>
      </div>

      <div className="classes-toolbar">
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{classes.length} class{classes.length !== 1 ? 'es' : ''}</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} id="create-class-btn">
          <Plus size={16} /> New Class
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: 48 }}>
          <BookOpen size={48} />
          <h3>No classes yet</h3>
          <p>Create your first class to get started</p>
        </div>
      ) : (
        <div className="class-cards-grid">
          {classes.map((cls, i) => (
            <div key={cls.id} className="class-card glass-card animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="class-card-header">
                <div>
                  <div className="class-card-title">{cls.name}</div>
                  <div className="class-student-count"><Users size={14} style={{ verticalAlign: '-2px' }} /> {cls.students.length} students enrolled</div>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => setEnrollModal(cls.id)}>
                  <UserPlus size={14} /> Add
                </button>
              </div>
              <div className="class-students-list">
                {cls.students.map((sid) => {
                  const s = getUserById(sid);
                  return (
                    <div key={sid} className="class-student-row">
                      <div className="student-row-info">
                        <div className="student-avatar-sm">{s?.name?.charAt(0) || '?'}</div>
                        <span className="student-row-name">{s?.name || 'Unknown'}</span>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleUnenroll(cls.id, sid)} title="Remove"><X size={14} /></button>
                    </div>
                  );
                })}
                {cls.students.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: 8 }}>No students enrolled yet</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content animate-scale" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create New Class</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Class / Subject Name</label>
                <input className="form-input" placeholder="e.g. Mathematics" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} autoFocus required id="class-name-input" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" id="save-class-btn">Create Class</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {enrollModal && (
        <div className="modal-overlay" onClick={() => setEnrollModal(null)}>
          <div className="modal-content animate-scale" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Enroll Students</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
              Class: <strong style={{ color: 'var(--text-primary)' }}>{classes.find(c => c.id === enrollModal)?.name}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
              {allStudents.map((s) => {
                const enrolled = classes.find(c => c.id === enrollModal)?.students.includes(s.id);
                return (
                  <div key={s.id} className="class-student-row">
                    <div className="student-row-info">
                      <div className="student-avatar-sm">{s.name.charAt(0)}</div>
                      <span className="student-row-name">{s.name}</span>
                    </div>
                    {enrolled ? (
                      <span className="badge badge-present">Enrolled</span>
                    ) : (
                      <button className="btn btn-sm btn-success" onClick={() => { handleEnroll(enrollModal, s.id); }}>Enroll</button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEnrollModal(null)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

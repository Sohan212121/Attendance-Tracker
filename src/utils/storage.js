// storage.js — LocalStorage mock backend with seeded demo data

const KEYS = {
  USERS: 'ams_users',
  CLASSES: 'ams_classes',
  ATTENDANCE: 'ams_attendance',
  SEEDED: 'ams_seeded',
  CURRENT_USER: 'ams_current_user',
};

// ── Seed Demo Data ──────────────────────────────────────────────
export function seedData() {
  if (localStorage.getItem(KEYS.SEEDED)) return;

  const users = [
    { id: 'T1', username: 'teacher1', password: 'password', role: 'teacher', name: 'Dr. Sarah Mitchell' },
    { id: 'S1', username: 'student1', password: 'password', role: 'student', name: 'Aarav Sharma' },
    { id: 'S2', username: 'student2', password: 'password', role: 'student', name: 'Priya Patel' },
    { id: 'S3', username: 'student3', password: 'password', role: 'student', name: 'Rahul Verma' },
    { id: 'S4', username: 'student4', password: 'password', role: 'student', name: 'Ananya Singh' },
    { id: 'S5', username: 'student5', password: 'password', role: 'student', name: 'Kiran Desai' },
  ];

  const classes = [
    { id: 'C1', name: 'Mathematics', teacherId: 'T1', students: ['S1', 'S2', 'S3', 'S4', 'S5'] },
    { id: 'C2', name: 'Physics', teacherId: 'T1', students: ['S1', 'S2', 'S3', 'S4'] },
    { id: 'C3', name: 'Computer Science', teacherId: 'T1', students: ['S1', 'S3', 'S5'] },
  ];

  // Generate sample attendance for the past 15 days
  const attendance = [];
  const today = new Date();
  for (let d = 1; d <= 15; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split('T')[0];

    classes.forEach((cls) => {
      cls.students.forEach((sid) => {
        const isPresent = Math.random() > 0.2; // 80% attendance rate
        attendance.push({
          id: `A-${cls.id}-${sid}-${dateStr}`,
          classId: cls.id,
          studentId: sid,
          date: dateStr,
          status: isPresent ? 'present' : 'absent',
          markedBy: 'T1',
        });
      });
    });
  }

  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes));
  localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(attendance));
  localStorage.setItem(KEYS.SEEDED, 'true');
}

// ── Helpers ─────────────────────────────────────────────────────
function getAll(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function saveAll(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Auth ────────────────────────────────────────────────────────
export function loginUser(username, password) {
  const users = getAll(KEYS.USERS);
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(safeUser));
    return safeUser;
  }
  return null;
}

export function logoutUser() {
  localStorage.removeItem(KEYS.CURRENT_USER);
}

export function getCurrentUser() {
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

// ── Users ───────────────────────────────────────────────────────
export function getAllStudents() {
  return getAll(KEYS.USERS).filter((u) => u.role === 'student');
}

export function getUserById(id) {
  return getAll(KEYS.USERS).find((u) => u.id === id);
}

export function registerStudent(name, username, password) {
  const users = getAll(KEYS.USERS);
  if (users.find((u) => u.username === username)) return null;
  const id = 'S' + Date.now();
  const newUser = { id, username, password, role: 'student', name };
  users.push(newUser);
  saveAll(KEYS.USERS, users);
  return newUser;
}

// ── Classes ─────────────────────────────────────────────────────
export function getClasses(teacherId) {
  return getAll(KEYS.CLASSES).filter((c) => c.teacherId === teacherId);
}

export function getAllClasses() {
  return getAll(KEYS.CLASSES);
}

export function getClassById(classId) {
  return getAll(KEYS.CLASSES).find((c) => c.id === classId);
}

export function createClass(name, teacherId) {
  const classes = getAll(KEYS.CLASSES);
  if (classes.find((c) => c.name === name && c.teacherId === teacherId)) return null;
  const id = 'C' + Date.now();
  const newClass = { id, name, teacherId, students: [] };
  classes.push(newClass);
  saveAll(KEYS.CLASSES, classes);
  return newClass;
}

export function enrollStudent(classId, studentId) {
  const classes = getAll(KEYS.CLASSES);
  const cls = classes.find((c) => c.id === classId);
  if (!cls || cls.students.includes(studentId)) return false;
  cls.students.push(studentId);
  saveAll(KEYS.CLASSES, classes);
  return true;
}

export function unenrollStudent(classId, studentId) {
  const classes = getAll(KEYS.CLASSES);
  const cls = classes.find((c) => c.id === classId);
  if (!cls) return false;
  cls.students = cls.students.filter((s) => s !== studentId);
  saveAll(KEYS.CLASSES, classes);
  return true;
}

// ── Attendance ──────────────────────────────────────────────────
export function markAttendance(classId, studentId, date, status, markedBy) {
  const records = getAll(KEYS.ATTENDANCE);
  const existingIdx = records.findIndex(
    (r) => r.classId === classId && r.studentId === studentId && r.date === date
  );
  const record = {
    id: `A-${classId}-${studentId}-${date}`,
    classId,
    studentId,
    date,
    status,
    markedBy,
  };
  if (existingIdx >= 0) {
    records[existingIdx] = record;
  } else {
    records.push(record);
  }
  saveAll(KEYS.ATTENDANCE, records);
  return record;
}

export function getAttendanceByClass(classId) {
  return getAll(KEYS.ATTENDANCE).filter((r) => r.classId === classId);
}

export function getAttendanceByStudent(studentId) {
  return getAll(KEYS.ATTENDANCE).filter((r) => r.studentId === studentId);
}

export function getAttendanceByClassAndDate(classId, date) {
  return getAll(KEYS.ATTENDANCE).filter(
    (r) => r.classId === classId && r.date === date
  );
}

// ── Stats ───────────────────────────────────────────────────────
export function getStudentStats(studentId) {
  const records = getAttendanceByStudent(studentId);
  const classes = getAllClasses().filter((c) => c.students.includes(studentId));

  const overall = {
    total: records.length,
    present: records.filter((r) => r.status === 'present').length,
    absent: records.filter((r) => r.status === 'absent').length,
  };
  overall.percentage = overall.total > 0 ? Math.round((overall.present / overall.total) * 100) : 0;

  const byClass = classes.map((cls) => {
    const classRecords = records.filter((r) => r.classId === cls.id);
    const present = classRecords.filter((r) => r.status === 'present').length;
    const total = classRecords.length;
    return {
      classId: cls.id,
      className: cls.name,
      total,
      present,
      absent: total - present,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  });

  return { overall, byClass };
}

export function getClassStats(classId) {
  const cls = getClassById(classId);
  if (!cls) return null;
  const records = getAttendanceByClass(classId);
  const dates = [...new Set(records.map((r) => r.date))].sort().reverse();

  const studentStats = cls.students.map((sid) => {
    const user = getUserById(sid);
    const studentRecords = records.filter((r) => r.studentId === sid);
    const present = studentRecords.filter((r) => r.status === 'present').length;
    const total = studentRecords.length;
    return {
      studentId: sid,
      studentName: user?.name || 'Unknown',
      total,
      present,
      absent: total - present,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  });

  return { className: cls.name, dates, studentStats, totalSessions: dates.length };
}

export function getStudentClassesForStudent(studentId) {
  return getAllClasses().filter((c) => c.students.includes(studentId));
}

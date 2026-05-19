# AttendEase - Student Attendance Management System

A modern, responsive, and beautifully designed web application built with React and Vite for managing student attendance. AttendEase provides separate, tailored experiences for teachers and students.

## Features

### Teacher Portal
- **Dashboard**: High-level overview of total classes, enrolled students, and attendance statistics.
- **Manage Classes**: Easily create new subjects and enroll students.
- **Mark Attendance**: Fast, intuitive interface to record daily attendance with single toggles or bulk actions.
- **Reports**: Detailed class-wise and student-wise attendance analytics with visual progress bars.

### Student Portal
- **Dashboard**: Track overall attendance percentage with an interactive circular progress indicator.
- **Subject Breakdown**: View attendance status for every enrolled subject.
- **History**: Keep track of daily attendance records.

## Technology Stack
- **Frontend Framework**: React.js (via Vite)
- **Routing**: React Router DOM
- **Styling**: Vanilla CSS (Premium Dark Theme with Glassmorphism)
- **Icons**: Lucide React
- **Data Persistence**: Browser LocalStorage (Mock Backend)

## Getting Started

Since the application uses a mock local storage backend, no database or server setup is required. 

1. Clone the repository:
   ```bash
   git clone https://github.com/Sohan212121/Attendance-Tracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd "Student Attendance Management System"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Credentials
The application automatically seeds itself with demo data on the first load. Use these credentials to test the portals:

**Teacher Demo:**
- Username: `teacher1`
- Password: `password`

**Student Demo:**
- Username: `student1` (or `student2`, `student3`)
- Password: `password`

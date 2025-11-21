export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  grade: string;
  section: string;
  rollNumber: string;
  attendance: number; // percentage
  status: 'Active' | 'Inactive';
  email: string;
  dob?: string;
  gender?: string;
  parentContact?: string;
  address?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  address?: string;
  hireDate?: string;
}

export interface Class {
  id: string;
  grade: string;
  section: string;
  classTeacher: string; // Teacher Name
  studentCount: number;
  roomNumber: string;
  capacity?: number;
  subjects?: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  grade: string;
  sessionsPerWeek: number;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  startTime: string;
  duration: string; // e.g., "2 Hours"
  grade: string;
  totalMarks: number;
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  type: 'Tuition' | 'Transport' | 'Library' | 'Exam' | string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  datePaid?: string;
  description?: string;
}

export interface TimetableItem {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  subject: string;
  teacher: string;
  grade: string;
  room: string;
}

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  status: 'Pending' | 'Active' | 'Completed';
  submissions: number;
  total: number;
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'alert';
}
import { Assignment, Class, Exam, Fee, Student, Subject, Teacher, TimetableItem, User, Notification } from "./types";

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@gmail.com', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 'u2', name: 'Sarah Teacher', email: 'teacher@gmail.com', role: 'teacher', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 'u3', name: 'John Student', email: 'student@gmail.com', role: 'student', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Alice Johnson', firstName: 'Alice', lastName: 'Johnson', grade: '10', section: 'A', rollNumber: '1001', attendance: 92, status: 'Active', email: 'alice@school.com', dob: '2008-05-15', gender: 'Female', parentContact: '(555) 123-4567', address: '123 Maple Drive, Springfield' },
  { id: 's2', name: 'Bob Smith', firstName: 'Bob', lastName: 'Smith', grade: '10', section: 'A', rollNumber: '1002', attendance: 85, status: 'Active', email: 'bob@school.com', dob: '2008-08-22', gender: 'Male', parentContact: '(555) 987-6543', address: '456 Oak Lane, Springfield' },
  { id: 's3', name: 'Charlie Brown', firstName: 'Charlie', lastName: 'Brown', grade: '10', section: 'B', rollNumber: '1003', attendance: 78, status: 'Inactive', email: 'charlie@school.com', dob: '2008-02-10', gender: 'Male', parentContact: '(555) 456-7890', address: '789 Pine Street, Springfield' },
  { id: 's4', name: 'Daisy Miller', firstName: 'Daisy', lastName: 'Miller', grade: '11', section: 'A', rollNumber: '1101', attendance: 95, status: 'Active', email: 'daisy@school.com', dob: '2007-11-30', gender: 'Female', parentContact: '(555) 222-3333', address: '321 Elm Road, Springfield' },
  { id: 's5', name: 'Ethan Hunt', firstName: 'Ethan', lastName: 'Hunt', grade: '11', section: 'C', rollNumber: '1102', attendance: 88, status: 'Active', email: 'ethan@school.com', dob: '2007-07-04', gender: 'Male', parentContact: '(555) 444-5555', address: '654 Birch Blvd, Springfield' },
  { id: 's6', name: 'Fiona Gallagher', firstName: 'Fiona', lastName: 'Gallagher', grade: '12', section: 'A', rollNumber: '1201', attendance: 91, status: 'Active', email: 'fiona@school.com', dob: '2006-09-12', gender: 'Female', parentContact: '(555) 666-7777', address: '987 Cedar Way, Springfield' },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Mr. Robert Anderson', subject: 'Mathematics', email: 'anderson@school.com', phone: '555-0101', address: '123 Maple St', hireDate: '2020-08-15' },
  { id: 't2', name: 'Ms. Sarah Davis', subject: 'Physics', email: 'davis@school.com', phone: '555-0102', address: '456 Oak Ave', hireDate: '2019-09-01' },
  { id: 't3', name: 'Mrs. Emily Wilson', subject: 'Literature', email: 'wilson@school.com', phone: '555-0103', address: '789 Pine Ln', hireDate: '2021-01-10' },
  { id: 't4', name: 'Mr. James Moore', subject: 'History', email: 'moore@school.com', phone: '555-0104', address: '321 Elm St', hireDate: '2018-11-22' },
  { id: 't5', name: 'Ms. Jessica Taylor', subject: 'Chemistry', email: 'taylor@school.com', phone: '555-0105', address: '654 Birch Rd', hireDate: '2022-03-05' },
];

export const MOCK_CLASSES: Class[] = [
  { id: 'c1', grade: '10', section: 'A', classTeacher: 'Mr. Robert Anderson', studentCount: 32, roomNumber: '101', capacity: 40, subjects: ['Mathematics', 'Physics', 'Literature', 'History'] },
  { id: 'c2', grade: '10', section: 'B', classTeacher: 'Mr. James Moore', studentCount: 30, roomNumber: '102', capacity: 40, subjects: ['Mathematics', 'Literature', 'History'] },
  { id: 'c3', grade: '11', section: 'A', classTeacher: 'Ms. Sarah Davis', studentCount: 28, roomNumber: '201', capacity: 35, subjects: ['Physics', 'Chemistry', 'Mathematics'] },
  { id: 'c4', grade: '12', section: 'A', classTeacher: 'Mrs. Emily Wilson', studentCount: 25, roomNumber: '301', capacity: 30, subjects: ['Literature', 'History', 'Physics'] },
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: 'sub1', name: 'Mathematics', code: 'MTH101', teacherId: 't1', grade: '10', sessionsPerWeek: 5 },
  { id: 'sub2', name: 'Physics', code: 'PHY101', teacherId: 't2', grade: '10', sessionsPerWeek: 4 },
  { id: 'sub3', name: 'Literature', code: 'ENG101', teacherId: 't3', grade: 'All', sessionsPerWeek: 4 },
  { id: 'sub4', name: 'History', code: 'HIS101', teacherId: 't4', grade: '10', sessionsPerWeek: 3 },
  { id: 'sub5', name: 'Chemistry', code: 'CHE101', teacherId: 't5', grade: '11', sessionsPerWeek: 4 },
];

export const MOCK_EXAMS: Exam[] = [
  { id: 'e1', name: 'Mid-Term Mathematics', subject: 'Mathematics', date: '2024-03-15', startTime: '09:00 AM', duration: '2 Hours', grade: '10', totalMarks: 100 },
  { id: 'e2', name: 'Physics Pop Quiz', subject: 'Physics', date: '2024-03-18', startTime: '11:00 AM', duration: '45 Mins', grade: '10', totalMarks: 20 },
  { id: 'e3', name: 'Final History Exam', subject: 'History', date: '2024-04-10', startTime: '10:00 AM', duration: '3 Hours', grade: '10', totalMarks: 100 },
  { id: 'e4', name: 'Chemistry Lab Practical', subject: 'Chemistry', date: '2024-03-20', startTime: '01:00 PM', duration: '1.5 Hours', grade: '11', totalMarks: 50 },
];

export const MOCK_FEES: Fee[] = [
  { id: 'f1', studentId: 's1', studentName: 'Alice Johnson', type: 'Tuition', amount: 500, dueDate: '2024-03-01', status: 'Paid', datePaid: '2024-02-28' },
  { id: 'f2', studentId: 's2', studentName: 'Bob Smith', type: 'Tuition', amount: 500, dueDate: '2024-03-01', status: 'Overdue' },
  { id: 'f3', studentId: 's3', studentName: 'Charlie Brown', type: 'Transport', amount: 150, dueDate: '2024-03-01', status: 'Pending' },
  { id: 'f4', studentId: 's4', studentName: 'Daisy Miller', type: 'Library', amount: 50, dueDate: '2024-03-10', status: 'Pending' },
];

export const MOCK_TIMETABLE: TimetableItem[] = [
  { id: 'tt1', day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Anderson', grade: '10-A', room: '101' },
  { id: 'tt2', day: 'Monday', time: '10:00 - 11:00', subject: 'Physics', teacher: 'Ms. Davis', grade: '10-A', room: '101' },
  { id: 'tt3', day: 'Monday', time: '11:15 - 12:15', subject: 'Literature', teacher: 'Mrs. Wilson', grade: '10-A', room: '101' },
  { id: 'tt4', day: 'Tuesday', time: '09:00 - 10:00', subject: 'History', teacher: 'Mr. Moore', grade: '10-A', room: '101' },
  { id: 'tt5', day: 'Wednesday', time: '09:00 - 10:00', subject: 'Chemistry', teacher: 'Ms. Taylor', grade: '11-A', room: '201' },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 1, title: 'Physics Lab Report', subject: 'Physics', grade: '10-A', dueDate: '2024-03-25', status: 'Pending', submissions: 12, total: 32 },
  { id: 2, title: 'History Essay: WW2', subject: 'History', grade: '10-A', dueDate: '2024-03-28', status: 'Active', submissions: 5, total: 32 },
  { id: 3, title: 'Math Problem Set 5', subject: 'Mathematics', grade: '10-B', dueDate: '2024-03-22', status: 'Completed', submissions: 30, total: 30 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Assignment Posted', message: 'Mr. Anderson added a new Math assignment due March 25th.', time: '10 mins ago', read: false, type: 'info' },
  { id: 'n2', title: 'Exam Schedule Released', message: 'The final exam schedule for Grade 10 has been published.', time: '2 hours ago', read: false, type: 'alert' },
  { id: 'n3', title: 'Fee Payment Reminder', message: 'Tuition fees for Term 2 are due next week.', time: '1 day ago', read: true, type: 'warning' },
  { id: 'n4', title: 'Attendance Update', message: 'You were marked present for all classes yesterday.', time: '1 day ago', read: true, type: 'success' },
  { id: 'n5', title: 'School Holiday', message: 'School will be closed this Friday for maintenance.', time: '2 days ago', read: true, type: 'info' },
];

export const ATTENDANCE_DATA = [
  { name: 'Mon', rate: 92 },
  { name: 'Tue', rate: 95 },
  { name: 'Wed', rate: 88 },
  { name: 'Thu', rate: 94 },
  { name: 'Fri', rate: 90 },
];

export const GRADE_DISTRIBUTION = [
  { name: '90-100', value: 3, fill: '#008C7E' },
  { name: '80-89', value: 3, fill: '#2563EB' },
  { name: '70-79', value: 2, fill: '#F59E0B' },
  { name: '<70', value: 1, fill: '#EF4444' },
];
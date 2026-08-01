import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import LoginSelect from "../pages/LoginSelect";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProtectedRoute from "../routes/AdminProtectedRoute";
import TeacherManagement from "../pages/TeacherManagement";
import StudentManagement from "../pages/StudentManagement";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import AttendanceSelect from "../pages/AttendanceSelect";
import AttendancePage from "../pages/AttendancePage";
import PaymentSelect from "../pages/PaymentSelect";
import PaymentPage from "../pages/PaymentPage";
import StudentProtectedRoute from "../routes/StudentProtectedRoute";
import BatchManagement from "../pages/class/BatchManagement";
import BatchDetails from "../pages/class/BatchDetails";
import CourseDetails from "../pages/class/CourseDetails";
import TestDetails from "../pages/class/TestDetails";
import TeacherAttendance from "../pages/teacher/TeacherAttendance";
import TeacherPayments from "../pages/teacher/TeacherPayments";
import TeacherCourses from "../pages/teacher/TeacherCourses";
import TeacherCourseDetails from "../pages/teacher/TeacherCourseDetails";
import TeacherTestDetails from "../pages/teacher/TeacherTestDetails";
import TeacherClassHistory from "../pages/teacher/TeacherClassHistory";
import TeacherProtectedRoute from "../routes/TeacherProtectedRoute";
import StudentAttendance from "../pages/student/StudentAttendance";
import StudentPayments from "../pages/student/StudentPayments";
import StudentResults from "../pages/student/StudentResults";
import StudentNotices from "../pages/student/StudentNotices";
import TeacherClassManagement from "../pages/TeacherClassManagement";

export const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
  { path: "/login", element: <LoginSelect /> },
  { path: "/login/admin", element: <AdminLogin /> },

  // Base Redirects (Security/UX)
  { path: "/student", element: <Navigate to="/student/dashboard" replace /> },
  { path: "/teacher", element: <Navigate to="/teacher/dashboard" replace /> },
  { path: "/admin", element: <Navigate to="/admin/dashboard" replace /> },

  {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/teachers",
    element: (
      <AdminProtectedRoute>
        <TeacherManagement />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/attendance",
    element: (
      <AdminProtectedRoute>
        <AttendanceSelect />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/attendance/:type", // :type will be 'students' or 'teachers'
    element: (
      <AdminProtectedRoute>
        <AttendancePage />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/payments",
    element: (
      <AdminProtectedRoute>
        <PaymentSelect />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/payments/:type",
    element: (
      <AdminProtectedRoute>
        <PaymentPage />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/teacher-class",
    element: (
      <AdminProtectedRoute>
        <TeacherClassManagement />
      </AdminProtectedRoute>
    ),
  },
  // Class Management Routes
  {
    path: "/admin/class/batches",
    element: <AdminProtectedRoute><BatchManagement /></AdminProtectedRoute>
  },
  {
    path: "/admin/class/batches/:batchId",
    element: <AdminProtectedRoute><BatchDetails /></AdminProtectedRoute>
  },
  {
    path: "/admin/class/courses/:courseId",
    element: <AdminProtectedRoute><CourseDetails /></AdminProtectedRoute>
  },
  {
    path: "/admin/class/tests/:testId",
    element: <AdminProtectedRoute><TestDetails /></AdminProtectedRoute>
  },
  {
    path: "/admin/students",
    element: (
      <AdminProtectedRoute>
        <StudentManagement />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/student/dashboard",
    element: (
      <StudentProtectedRoute>
        <StudentDashboard />
      </StudentProtectedRoute>
    ),
  },
  {
    path: "/student/attendance",
    element: <StudentProtectedRoute><StudentAttendance /></StudentProtectedRoute>
  },
  {
    path: "/student/payments",
    element: <StudentProtectedRoute><StudentPayments /></StudentProtectedRoute>
  },
  {
    path: "/student/results",
    element: <StudentProtectedRoute><StudentResults /></StudentProtectedRoute>
  },
  {
    path: "/student/notices",
    element: <StudentProtectedRoute><StudentNotices /></StudentProtectedRoute>
  },
  {
    path: "/teacher/dashboard",
    element: (
      <TeacherProtectedRoute>
        <TeacherDashboard />
      </TeacherProtectedRoute>
    ),
  },
  {
    path: "/teacher/attendance",
    element: <TeacherProtectedRoute><TeacherAttendance /></TeacherProtectedRoute>
  },
  {
    path: "/teacher/payments",
    element: <TeacherProtectedRoute><TeacherPayments /></TeacherProtectedRoute>
  },
  {
    path: "/teacher/class-history",
    element: <TeacherProtectedRoute><TeacherClassHistory /></TeacherProtectedRoute>
  },
  {
    path: "/teacher/courses",
    element: <TeacherProtectedRoute><TeacherCourses /></TeacherProtectedRoute>
  },
  {
    path: "/teacher/courses/:courseId",
    element: <TeacherProtectedRoute><TeacherCourseDetails /></TeacherProtectedRoute>
  },
  {
    path: "/teacher/tests/:testId",
    element: <TeacherProtectedRoute><TeacherTestDetails /></TeacherProtectedRoute>
  },
  ],
  { basename: "/MentorsHub-main" }
);

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import RegisterStep1 from '../components/RegisterStep1';
import RegisterStep2 from '../components/RegisterStep2';
import Login from '../components/Login';
import Recover from '../components/Recover';
import ResetPassword from '../components/ResetPassword';
import AdminDashboard from '../components/views/admin/AdminDashboard';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { useState } from 'react';
import AdminProfile from '../components/views/admin/AdminProfile';
import AdminFinance from '../components/views/admin/AdminFinance';
import InstructorDashboard from '../components/views/instructor/InstructorDashboard';
import InstructorProfile from '../components/views/instructor/InstructorProfile';
import NewCourse from '../components/views/instructor/NewCourse';
import MyStudents from '../components/views/instructor/MyStudents';
import MyCourse from '../components/views/instructor/MyCourse';
import AdminEnrollments from '../components/views/admin/AdminEnrollments';
import InstructorRatings from '../components/views/instructor/InstructorRatings';
import AdminCourseSessions from '../components/views/admin/AdminCourseSession';
import AdminInstructors from '../components/views/admin/AdminInstructors';
import InstructorNotifications from '../components/views/instructor/InstructorNotifications';
import CourseRatings from '../components/views/instructor/CourseRatings';
import AdminInstructorRatings from '../components/views/admin/AdminInstructorRatings';
import AdminNotifications from '../components/views/admin/AdminNotifications';
import StudentDownload from '../components/views/student/StudentDownload';
import NotFound from '../components/utilities/404';

const AppRouter = () => {
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    password: '',
    role: '',
    isActive: false,
  });

  return (
    <Router>
      <Routes>
        {/* Rutas públicas: login, registro, recover y reset-password */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthLayout>
                {view === 'login' ? (
                  <Login setView={setView} />
                ) : view === 'registerStep1' ? (
                  <RegisterStep1 setView={setView} formData={formData} setFormData={setFormData} />
                ) : view === 'registerStep2' ? (
                  <RegisterStep2 setView={setView} formData={formData} setFormData={setFormData} />
                ) : view === 'recover' ? (
                  <Recover setView={setView} />
                ) : null}
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Rutas para ROLE_ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/course"
          element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminCourseSessions />
            </PrivateRoute>
          }
        />
        <Route
          path="/profileAdmin"
          element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminFinance />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminNotifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/students"
          element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminEnrollments />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructors"
          element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminInstructors />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructors/ratings"
          element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminInstructorRatings />
            </PrivateRoute>
          }
        />

        {/* Rutas para ROLE_INSTRUCTOR */}
        <Route
          path="/instructor"
          element={
            <PrivateRoute allowedRoles={['ROLE_INSTRUCTOR']}>
              <InstructorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['ROLE_INSTRUCTOR']}>
              <InstructorProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute allowedRoles={['ROLE_INSTRUCTOR']}>
              <InstructorNotifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/new-course"
          element={
            <PrivateRoute allowedRoles={['ROLE_INSTRUCTOR']}>
              <NewCourse />
            </PrivateRoute>
          }
        />
        <Route
          path="/students"
          element={
            <PrivateRoute allowedRoles={['ROLE_INSTRUCTOR']}>
              <MyStudents />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/course"
          element={
            <PrivateRoute allowedRoles={['ROLE_INSTRUCTOR']}>
              <MyCourse />
            </PrivateRoute>
          }
        />
        <Route
          path="/ratings"
          element={
            <PrivateRoute allowedRoles={['ROLE_INSTRUCTOR']}>
              <InstructorRatings />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor/ratings/course-ratings"
          element={
            <PrivateRoute allowedRoles={['ROLE_INSTRUCTOR']}>
              <CourseRatings />
            </PrivateRoute>
          }
        />

        {/* Ruta para ROLE_STUDENT */}
        <Route
          path="/student/download"
          element={
            <PrivateRoute allowedRoles={['ROLE_STUDENT']}>
              <StudentDownload />
            </PrivateRoute>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

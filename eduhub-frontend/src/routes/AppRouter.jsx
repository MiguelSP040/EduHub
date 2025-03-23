import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "../components/AuthLayout"
import RegisterStep1 from "../components/RegisterStep1";
import RegisterStep2 from "../components/RegisterStep2";
import Login from "../components/Login";
import Recover from "../components/Recover";
import ResetPassword from "../components/ResetPassword";
import AdminDashboard from "../components/views/admin/AdminDashboard";
import PrivateRoute from "./PrivateRouter";
import { useState } from "react";
import AdminProfile from "../components/views/admin/AdminProfile";
import AdminFinance from "../components/views/admin/AdminFinance";
import InstructorDashboard from "../components/views/instructor/InstructorDashboard";
import InstructorProfile from "../components/views/instructor/InstructorProfile";
import NewCourse from "../components/views/instructor/newCourse";
import MyStudents from "../components/views/instructor/MyStudents";
import MyCourse from "../components/views/instructor/MyCourse";
import AdminEnrollments from "../components/views/admin/AdminEnrollments";
import InstructorRatings from "../components/views/instructor/InstructorRatings";
import AdminCourseSessions from "../components/views/admin/AdminCourseSession";
import AdminInstructors from "../components/views/admin/AdminInstructors";

const AppRouter = () => {
    const [view, setView] = useState("login");
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        username: "",
        password: "",
        role: "",
        isActive: false
    });

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <AuthLayout>
                        {view === "login" ? 
                        <Login setView={setView} /> : 
                        view === "registerStep1" ? 
                        <RegisterStep1 setView={setView} formData={formData} setFormData={setFormData} /> : 
                        view === "registerStep2" ?
                        <RegisterStep2 setView={setView} formData={formData} setFormData={setFormData} /> :
                        view === "recover" ?
                        <Recover setView={setView}/> :
                        null}
                    </AuthLayout>
                } />
                
                <Route path="/reset-password" element={
                    <AuthLayout>
                        <ResetPassword />
                    </AuthLayout>
                    } />

                <Route path="/admin" element={
                    <PrivateRoute>
                        <AdminDashboard />
                    </PrivateRoute>
                } />
                <Route path="/admin/course" element={
                    <PrivateRoute>
                        <AdminCourseSessions />
                    </PrivateRoute>
                } />
                <Route path="/profileAdmin" element={
                    <PrivateRoute>
                        <AdminProfile />
                    </PrivateRoute>
                } />
                <Route path="/finance" element={
                    <PrivateRoute>
                        <AdminFinance/>
                    </PrivateRoute>
                } />
                <Route path="/students" element={
                    <PrivateRoute>
                        <AdminEnrollments/>
                    </PrivateRoute>
                } />
                <Route path="/instructors" element={
                    <PrivateRoute>
                        <AdminInstructors/>
                    </PrivateRoute>
                } />
                <Route path="/instructor" element={
                    <PrivateRoute>
                        <InstructorDashboard/>
                    </PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute>
                        <InstructorProfile/>
                    </PrivateRoute>
                } />
                <Route path="/instructor/new-course" element={
                    <PrivateRoute> 
                        <NewCourse />
                    </PrivateRoute>
                } />
                <Route path="/students" element={
                    <PrivateRoute> 
                        <MyStudents />
                    </PrivateRoute>
                } />
                <Route path="/instructor/course" element={
                    <PrivateRoute>
                        <MyCourse />
                    </PrivateRoute>
                } />

                <Route path="/ratings" element={
                    <PrivateRoute>
                        <InstructorRatings />
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
};

export default AppRouter;

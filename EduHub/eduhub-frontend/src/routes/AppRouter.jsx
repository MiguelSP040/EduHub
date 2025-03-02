import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Login from "../components/Login";
import RegisterStep1 from "../components/RegisterStep1";
import RegisterStep2 from "../components/RegisterStep2";
import Recover from "../components/Recover";
import AdminDashboard from "../components/views/admin/AdminDashboard";
import PrivateRoute from "./PrivateRouter";
import { useState } from "react";
import AdminProfile from "../components/views/admin/AdminProfile";
import AdminFinance from "../components/views/admin/AdminFinance";

const AppRouter = () => {
    const [view, setView] = useState("login");
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        username: "",
        password: "",
        role: ""
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
                <Route path="/admin" element={
                    <PrivateRoute>
                        <AdminDashboard />
                    </PrivateRoute>
                    } />
                <Route path="/profile" element={
                <PrivateRoute>
                    <AdminProfile />
                </PrivateRoute>
                } />
                <Route path="/finance" element={
                    <PrivateRoute>
                        <AdminFinance/>
                    </PrivateRoute>
                    } />
            </Routes>
        </Router>
    );
};

export default AppRouter;

import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsCheckingAuth(false);
    }, [user]);

    if (isCheckingAuth) return null;

    return user ? children : <Navigate to="/" state={{ from: location }} replace />;
};

export default PrivateRoute;

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        // Aquí redirigimos según el rol del usuario
        if (user && user.role) {
          if (user.role === "ROLE_ADMIN") return <Navigate to="/admin" replace />;
          if (user.role === "ROLE_INSTRUCTOR") return <Navigate to="/instructor" replace />;
          if (user.role === "ROLE_STUDENT") return <Navigate to="/student/download" replace />;
        }
        return <Navigate to="/" replace />;
      }
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/" replace />;
    }
  }
  return children;
};

export default PublicRoute;

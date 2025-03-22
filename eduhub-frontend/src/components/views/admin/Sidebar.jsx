import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Home, User, DollarSign, FileText, Users, LogOut } from "react-feather";

const Sidebar = ({ isExpanded, setIsExpanded, navbarRef }) => {
    const { logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

    // Cerrar el sidebar al hacer clic fuera (si está expandido)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                navbarRef.current && 
                !navbarRef.current.contains(event.target)
            ) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isExpanded, setIsExpanded, navbarRef]);

    return (
        <div 
            ref={sidebarRef}
            className={` sidebar bg-light shadow p-2 flex-column ${isExpanded ? "sidebar-expanded" : "sidebar-collapsed d-none d-md-flex"} `} onClick={!isExpanded ? () => setIsExpanded(true) : null}
            style={{
                position: "fixed",
                top: "54px",
                left: 0,
                bottom: 0,
                width: isExpanded ? "15.5rem" : "4.3rem",
                transition: "width 0.3s ease",
                overflow: "hidden",
                zIndex: 1029
            }}
        >
            <div className="d-flex flex-column h-100 w-100 pt-1">
                {/* Botones del Sidebar */}
                <button className="btn btn-outline-secondary my-1 d-flex align-items-center col-12" onClick={ isExpanded ? (e) => { e.stopPropagation(); navigate("/admin"); } : null } >
                    <Home size={24} className="flex-shrink-0" />
                    <div className="ms-2">{isExpanded && "Inicio"}</div>
                </button>

                <button
                    className="btn btn-outline-secondary my-1 d-flex align-items-center col-12" onClick={ isExpanded ? (e) => { e.stopPropagation(); navigate("/profileAdmin"); } : null }>
                    <User size={24} className="flex-shrink-0" />
                    <div className="ms-2">{isExpanded && "Perfil"}</div>
                </button>

                <button className="btn btn-outline-secondary my-1 d-flex align-items-center col-12" onClick={ isExpanded ? (e) => { e.stopPropagation(); navigate("/students"); } : null }>
                    <Users size={24} className="flex-shrink-0" />
                    <div className="ms-2">{isExpanded && "Estudiantes"}</div>
                </button>

                <button className="btn btn-outline-secondary my-1 d-flex align-items-center col-12" onClick={ isExpanded ? (e) => { e.stopPropagation(); navigate("/finance"); } : null }>
                    <DollarSign size={24} className="flex-shrink-0" />
                    <div className="ms-2">{isExpanded && "Finanzas"}</div>
                </button>

                <div className="mt-auto">
                    <button className="btn btn-danger d-flex align-items-center col-12" onClick={ isExpanded ? (e) => { e.stopPropagation(); handleLogout(); } : null }>
                        <LogOut size={24} className="flex-shrink-0" />
                        <div className="ms-2 text-truncate">
                            {isExpanded && "Cerrar sesión"}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

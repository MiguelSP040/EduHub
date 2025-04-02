import { useContext, useRef, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home, User, DollarSign, Bell, Users, LogOut } from 'react-feather';
import { SlGraduation } from 'react-icons/sl';

const Sidebar = ({ isExpanded, setIsExpanded, navbarRef }) => {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // Cerrar el sidebar al hacer clic fuera (si está expandido)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, setIsExpanded, navbarRef]);

  // Función auxiliar para obtener el estilo en hover (solo si está expandido)
  const getHoverStyle = (btnName) => (isExpanded && hoveredButton === btnName ? { backgroundColor: '#e9ecef', borderRight: '4px solid #AA39AD' } : {});

  return (
    <div
      ref={sidebarRef}
      className={`sidebar bg-light shadow p-2 flex-column ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed d-none d-md-flex'}`}
      onClick={!isExpanded ? () => setIsExpanded(true) : null}
      style={{
        position: 'fixed',
        top: '54px',
        left: 0,
        bottom: 0,
        width: isExpanded ? '15.5rem' : '4.3rem',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        zIndex: 1029,
      }}
    >
      <div className="d-flex flex-column h-100 w-100 pt-1">
        {/* Botones del Sidebar */}
        <button
          className="btn my-1 d-flex align-items-center col-12 mt-3"
          onMouseEnter={() => setHoveredButton('Inicio')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/admin');
                }
              : null
          }
          style={getHoverStyle('Inicio')}
        >
          <Home size={24} className="flex-shrink-0" />
          <div className="ms-2">{isExpanded && 'Inicio'}</div>
        </button>

        <button
          className="btn my-1 d-flex align-items-center col-12"
          onMouseEnter={() => setHoveredButton('Perfil')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/profileAdmin');
                }
              : null
          }
          style={getHoverStyle('Perfil')}
        >
          <User size={24} className="flex-shrink-0" />
          <div className="ms-2">{isExpanded && 'Perfil'}</div>
        </button>

        <button
          className="btn my-1 d-flex align-items-center col-12"
          onMouseEnter={() => setHoveredButton('Estudiantes')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/students');
                }
              : null
          }
          style={getHoverStyle('Estudiantes')}
        >
          <SlGraduation size={24} className="flex-shrink-0" />
          <div className="ms-2">{isExpanded && 'Estudiantes'}</div>
        </button>

        <button
          className="btn my-1 d-flex align-items-center col-12"
          onMouseEnter={() => setHoveredButton('Instructores')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/instructors');
                }
              : null
          }
          style={getHoverStyle('Instructores')}
        >
          <Users size={24} className="flex-shrink-0" />
          <div className="ms-2">{isExpanded && 'Instructores'}</div>
        </button>

        <button
          className="btn my-1 d-flex align-items-center col-12"
          onMouseEnter={() => setHoveredButton('Finanzas')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/finance');
                }
              : null
          }
          style={getHoverStyle('Finanzas')}
        >
          <DollarSign size={24} className="flex-shrink-0" />
          <div className="ms-2">{isExpanded && 'Finanzas'}</div>
        </button>

        <button
          className="btn my-1 d-flex align-items-center col-12"
          onMouseEnter={() => setHoveredButton('Notificaciones')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/admin/notifications');
                }
              : null
          }
          style={getHoverStyle('Notificaciones')}
        >
          <Bell size={24} className="flex-shrink-0" />
          <div className="ms-2">{isExpanded && 'Notificaciones'}</div>
        </button>

        <div className="mt-auto">
          <hr />
          <button
            className="btn my-1 d-flex align-items-center col-12"
            onMouseEnter={() => setHoveredButton('Cerrar sesión')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={
              isExpanded
                ? (e) => {
                    e.stopPropagation();
                    handleLogout();
                  }
                : null
            }
            style={getHoverStyle('Cerrar sesión')}
          >
            <LogOut size={24} className="flex-shrink-0" />
            <div className="ms-2 text-truncate">{isExpanded && 'Cerrar sesión'}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

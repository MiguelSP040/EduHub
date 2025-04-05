import { useContext, useRef, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home, User, Star, Bell, LogOut } from 'react-feather';
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

  const getHoverStyle = (btnName) => (isExpanded && hoveredButton === btnName ? { backgroundColor: '#e9ecef', color: '#800080' , borderRight: '4px solid #AA39AD' } : { color: '#444444' });

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
          className="btn border-top-0 border-start-0 border-bottom-0 border-top-0 my-1 d-flex align-items-center col-12 mt-3"
          onMouseEnter={() => setHoveredButton('Inicio')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/instructor');
                }
              : null
          }
          style={getHoverStyle('Inicio')}
        >
          <Home size={24} className="flex-shrink-0" />
          <div className="ms-2">{isExpanded && 'Inicio'}</div>
        </button>

        <button
          className="btn border-top-0 border-start-0 border-bottom-0 border-top-0 my-1 d-flex align-items-center col-12"
          onMouseEnter={() => setHoveredButton('Perfil')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/profile');
                }
              : null
          }
          style={getHoverStyle('Perfil')}
        >
          <User size={24} className="flex-shrink-0" />
          <div className="ms-2">{isExpanded && 'Perfil'}</div>
        </button>

        <button
          className="btn border-top-0 border-start-0 border-bottom-0 border-top-0 my-1 d-flex align-items-center col-12"
          onMouseEnter={() => setHoveredButton('Mis calificaciones')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/ratings');
                }
              : null
          }
          style={getHoverStyle('Mis calificaciones')}
        >
          <Star size={24} className="flex-shrink-0" />
          <div className="ms-2 text-truncate">{isExpanded && 'Mis calificaciones'}</div>
        </button>

        <button
          className="btn border-top-0 border-start-0 border-bottom-0 border-top-0 my-1 d-flex align-items-center col-12"
          onMouseEnter={() => setHoveredButton('Notificaciones')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={
            isExpanded
              ? (e) => {
                  e.stopPropagation();
                  navigate('/notifications');
                }
              : null
          }
          style={getHoverStyle('Notificaciones')}
        >
          <Bell size={24} className="flex-shrink-0" />
          <div className="ms-2 text-truncate">{isExpanded && 'Notificaciones'}</div>
        </button>

        <div className="mt-auto">
          <hr />
          <button
            className="btn border-top-0 border-start-0 border-bottom-0 border-top-0 d-flex align-items-center col-12"
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
            <div className={'ms-2 text-truncate'}>{isExpanded && 'Cerrar sesión'}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

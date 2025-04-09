import { useContext, useRef, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home, User, Star, Bell, LogOut } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications } from '../../../services/notificationService';
import { useConfirmDialog } from '../../utilities/ConfirmDialogsProvider';

const Sidebar = ({ isExpanded, setIsExpanded, navbarRef }) => {
  const { logoutUser } = useContext(AuthContext);
  const { confirmAction } = useConfirmDialog();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [initialRender, setInitialRender] = useState(true);
  const [textKey, setTextKey] = useState(0);
  const prevCountRef = useRef(notificationCount);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 426);

  useEffect(() => {
    setInitialRender(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 426);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadNotificationCount = useCallback(async () => {
    try {
      const data = await getNotifications();
      const unread = data.filter((n) => !n.read).length;
      if (unread !== prevCountRef.current) {
        setNotificationCount(unread);
        prevCountRef.current = unread;
      }
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  }, []);

  useEffect(() => {
    loadNotificationCount();
    const intervalId = setInterval(loadNotificationCount, 30000);
    return () => clearInterval(intervalId);
  }, [loadNotificationCount]);

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

  const handleLogout = () => {
    confirmAction({
      message: '¿Estás seguro de que deseas cerrar sesión?',
      header: 'Confirmación de cierre de sesión',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cerrar sesión',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-confirm-dialog-accept',
      rejectClassName: 'p-confirm-dialog-reject',
      onAccept: () => {
        logoutUser(); 
        navigate('/'); 
      },
    });
  };

  const handleToggleSidebar = () => {
    setIsExpanded((prev) => {
      if (!prev) {
        setTextKey((k) => k + 1);
      }
      return !prev;
    });
  };

  const sidebarVariants = {
    expanded: {
      width: isMobile ? '100vw' : '15.5rem',
      transition: {
        type: 'tween',
        duration: initialRender ? 0 : 0.25,
        ease: 'easeInOut',
      },
    },
    collapsed: {
      width: isMobile ? '0px' : '4.3rem',
      left: isMobile ? '-15px' : 0,
      transition: {
        type: 'tween',
        duration: initialRender ? 0 : 0.25,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      ref={sidebarRef}
      className="bg-light shadow p-2 d-flex flex-column"
      style={{
        position: 'fixed',
        top: '54px',
        left: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 1029,
      }}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      variants={sidebarVariants}
      onClick={!isExpanded ? handleToggleSidebar : null}
    >
      <div className="d-flex flex-column h-100 w-100 pt-1">
        <SidebarButton icon={<Home size={24} />} text="Inicio" hoveredButton={hoveredButton} setHoveredButton={setHoveredButton} isExpanded={isExpanded} textKey={textKey} onClick={() => navigate('/instructor')} />

        <SidebarButton icon={<User size={24} />} text="Perfil" hoveredButton={hoveredButton} setHoveredButton={setHoveredButton} isExpanded={isExpanded} textKey={textKey} onClick={() => navigate('/profile')} />

        <SidebarButton icon={<Star size={24} />} text="Mis calificaciones" hoveredButton={hoveredButton} setHoveredButton={setHoveredButton} isExpanded={isExpanded} textKey={textKey} onClick={() => navigate('/ratings')} />

        <SidebarButton icon={<Bell size={24} />} text="Notificaciones" hoveredButton={hoveredButton} setHoveredButton={setHoveredButton} isExpanded={isExpanded} textKey={textKey} notificationCount={notificationCount} onClick={() => navigate('/notifications')} />

        <div className="mt-auto">
          <hr className="mb-2" />
          <SidebarButton icon={<LogOut size={24} />} text="Cerrar sesión" hoveredButton={hoveredButton} setHoveredButton={setHoveredButton} isExpanded={isExpanded} textKey={textKey} onClick={handleLogout} />
        </div>
      </div>
    </motion.div>
  );
};

function SidebarButton({ icon, text, onClick, hoveredButton, setHoveredButton, isExpanded, textKey, notificationCount }) {
  const isHovered = isExpanded && hoveredButton === text;

  const baseClass = 'btn my-1 d-flex align-items-center col-12';
  const stateClass = isHovered ? 'sidebar-btn-hover' : 'sidebar-btn-default';

  return (
    <motion.button
      layout
      className={`${baseClass} ${stateClass}`}
      onMouseEnter={() => setHoveredButton(text)}
      onMouseLeave={() => setHoveredButton(null)}
      onClick={
        isExpanded
          ? (e) => {
              e.stopPropagation();
              onClick?.();
            }
          : null
      }
    >
      <div style={{ position: 'relative' }}>
        {icon}
        {text === 'Notificaciones' && notificationCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
            {notificationCount}
          </span>
        )}
      </div>

      {/* Texto animado */}
      <AnimatePresence mode="sync">
        {isExpanded && (
          <motion.div key={`${textKey}-${text}`} className="ms-2" style={{ whiteSpace: 'nowrap' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'tween', duration: 0.2 }}>
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default Sidebar;

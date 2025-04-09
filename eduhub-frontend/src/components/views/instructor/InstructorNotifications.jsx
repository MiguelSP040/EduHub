import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../utilities/ToastProvider';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';
import { BookOpen } from 'react-feather';
import { getNotifications, markAsRead } from '../../../services/notificationService';
import { getCourseById } from '../../../services/courseService';
import Loading from '../../utilities/Loading';
import { deleteReadNotifications } from '../../../services/notificationService';

const ToggleTabs = ({ activeTab, setActiveTab, unreadCount }) => {
  const tabs = useMemo(
    () => [
      { value: 'allNotifications', label: 'Todas', iconClass: 'bi bi-envelope-open' },
      { value: 'pending', label: 'Pendientes', iconClass: 'bi bi-envelope' },
    ],
    []
  );

  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  const containerRef = useRef(null);
  const tabRefs = useRef([]);

  useLayoutEffect(() => {
    const index = tabs.findIndex((t) => t.value === activeTab);
    if (index < 0) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    const buttonRect = tabRefs.current[index]?.getBoundingClientRect();
    if (containerRect && buttonRect) {
      setSliderStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeTab, tabs]);

  const containerStyle = {
    display: 'inline-flex',
    position: 'relative',
    marginBottom: '7px',
  };

  const buttonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    position: 'relative',
    zIndex: 1,
    color: '#444',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {tabs.map((tab, i) => {
        const isActive = activeTab === tab.value;
        return (
          <div key={tab.value} style={{ position: 'relative' }}>
            <button
              ref={(el) => (tabRefs.current[i] = el)}
              onClick={() => setActiveTab(tab.value)}
              style={{
                ...buttonStyle,
                color: isActive ? '#000' : '#666',
              }}
            >
              {window.innerWidth < 576 ? <i className={tab.iconClass + ' me-2'} /> : tab.label}
            </button>

            {tab.value === 'pending' && unreadCount > 0 && (
              <span className="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                {unreadCount}
              </span>
            )}
          </div>
        );
      })}

      <motion.div
        animate={{ left: sliderStyle.left, width: sliderStyle.width }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{
          position: 'absolute',
          bottom: 0,
          height: '4px',
          borderRadius: '9999px',
          background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default function InstructorNotifications() {
  const { showSuccess, showError, showWarn } = useToast();

  const navbarRef = useRef(null);
  const navigate = useNavigate();

  const [fadingNotifications, setFadingNotifications] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('allNotifications');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error al obtener las notificaciones', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, newReadState) => {
    setFadingNotifications((prev) => [...prev, id]);
    setTimeout(async () => {
      await markAsRead(id, newReadState);
      await loadNotifications();
      setFadingNotifications((prev) => prev.filter((fadingId) => fadingId !== id));
    }, 500);
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'Success':
        return <i className="bi bi-check-circle-fill text-success"></i>;
      case 'Alert':
        return <i className="bi bi-exclamation-triangle-fill text-warning"></i>;
      case 'Error':
        return <i className="bi bi-x-octagon-fill text-danger"></i>;
      default:
        return <BookOpen className="me-2" />;
    }
  };

  const handleDeleteReadNotifications = async () => {
    const readNotificationIds = notifications.filter((n) => n.read).map((n) => n.id);
    setFadingNotifications((prev) => [...prev, ...readNotificationIds]);
    setTimeout(async () => {
      try {
        await deleteReadNotifications();
        await loadNotifications();
        showSuccess('Notificaciones eliminadas', 'Todas las notificaciones leídas han sido eliminadas');
      } catch (error) {
        console.error('Error al eliminar las notificaciones leídas', error);
        showError('Error', 'Error al eliminar las notificaciones');
      } finally {
        setFadingNotifications((prev) => prev.filter((id) => !readNotificationIds.includes(id)));
      }
    }, 500);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id, true);
    }

    const { relatedModule, relatedId } = notification;
    if (!relatedModule || !relatedId) return;

    switch (relatedModule) {
      case 'Course':
        try {
          const course = await getCourseById(relatedId);
          if (course) {
            navigate('/admin/course', { state: { course } });
          } else {
            showError('Error', 'No se pudo cargar el curso.');
          }
        } catch (err) {
          showError('Error', 'Error al cargar el curso.');
        }
        break;

      case 'StudentEnrollment':
        navigate(`/students?highlight=${relatedId}`);
        break;

      case 'Instructor':
        navigate(`/instructors?highlight=${relatedId}`);
        break;

      case 'Ratings':
        navigate(`/instructor/ratings/course-ratings?courseId=${relatedId}`);
        break;

      default:
        console.warn('Módulo no soportado:', relatedModule);
        break;
    }
  };

  const filtered = activeTab === 'pending' ? notifications.filter((n) => !n.read) : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-main">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />
      <div className="flex-grow-1">
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            {/* BARRA DE NAVEGACIÓN SECUNDARIA */}
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row gx-3 align-items-center">
                  <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                    {/* ToggleTabs + badge en 'pending' si unreadCount > 0 */}
                    <ToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} onDeleteReadNotifications={handleDeleteReadNotifications} />

                    {activeTab === 'allNotifications' && (
                      <button className="btn btn-outline-danger ms-auto" onClick={handleDeleteReadNotifications} title="Eliminar notificaciones leídas">
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <Loading />
            ) : filtered.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {filtered.map((n) => {
                  const date = new Date(n.createdAt);
                  const formattedDate = date.toLocaleString('es-MX', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={n.id}
                      className={`card rounded-4 shadow-sm p-3 notification-card ` + (n.read ? 'bg-notifications ' : 'bg-notifications-read ') + (fadingNotifications.includes(n.id) ? 'fade-out ' : '')}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-top">
                          <h4>{renderIcon(n.type)}</h4>
                          <div className="text-start ms-3">
                            <div className="d-flex flex-column flex-sm-row gap-2 mb-1">
                              <h6 className="mb-0 fw-bold">{n.title}</h6>
                              <small className="text-muted">- {formattedDate}</small>
                            </div>
                            <p className="mb-0">{n.message}</p>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(n.id, !n.read);
                          }}
                          title={`Marcar como ${n.read ? 'no ' : ''}leída`}
                        >
                          <span className="fs-5">
                            <i className={n.read ? 'bi bi-envelope-paper' : 'bi bi-envelope-check'}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted">No hay notificaciones para mostrar.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

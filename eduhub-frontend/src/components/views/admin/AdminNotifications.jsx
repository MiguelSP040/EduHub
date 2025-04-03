import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { BookOpen } from 'react-feather';
import { getNotifications, markAsRead } from '../../../services/notificationService';
import { getCourseById } from '../../../services/courseService';
import Loading from '../../utilities/Loading';

export default function AdminNotifications() {
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
            alert('No se pudo cargar el curso.');
          }
        } catch (err) {
          alert('Error al cargar el curso.');
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

  return (
    <div className="bg-main">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />
      <div className="flex-grow-1">
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row gx-3 align-items-center">
                  <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                    <div className="d-flex gap-3">
                      {[
                        { tab: 'allNotifications', icon: <i className="bi bi-envelope-open d-md-none"></i>, label: 'Todas' },
                        { tab: 'pending', icon: <i className="bi bi-envelope d-md-none"></i>, label: 'Pendientes' },
                      ].map(({ tab, icon, label }) => (
                        <div key={tab} className="position-relative">
                          <button className={`btn border-0 ${activeTab === tab ? 'fw-semibold border-bottom border-3 border-purple' : ''}`} onClick={() => setActiveTab(tab)}>
                            {icon}
                            <span className="d-none d-sm-inline">{label}</span>
                          </button>
                          {tab === 'pending' && filtered.some((n) => !n.read) && (
                            <span className="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                              {filtered.filter((n) => !n.read).length}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
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
                    <div key={n.id} className={`card rounded-4 shadow-sm p-3 notification-card ${n.read ? 'bg-light' : 'bg-white'} ${fadingNotifications.includes(n.id) ? 'fade-out' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleNotificationClick(n)}>
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

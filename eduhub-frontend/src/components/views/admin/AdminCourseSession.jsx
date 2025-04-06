import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Settings, ArrowLeft } from 'react-feather';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getSessionsByCourse } from '../../../services/sessionService';
import { getCourseById, approveCourse } from '../../../services/courseService';
import AdminSessionCard from './AdminSessionCard';
import AdminSessionView from './AdminSessionView';
import AdminCourseDetails from './AdminCourseDetails';
import { findUserById } from '../../../services/userService';
import CourseStepProgress from './CourseStepProgress';
import SessionIndexAccordion from './SessionIndexAccordion';
import CourseBanner from '../../../assets/img/CourseBanner.jpg';
import Loading from '../../utilities/Loading';

const ToggleTabs = ({ activeTab, setActiveTab }) => {
  const tabs = useMemo(
    () => [
      { value: 'material', label: 'Material', icon: <BookOpen size={20} /> },
      { value: 'config', label: 'Detalles', icon: <Settings size={20} /> },
    ],
    []
  );

  const containerRef = useRef(null);
  const tabRefs = useRef([]);

  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

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
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          ref={(el) => (tabRefs.current[i] = el)}
          onClick={() => setActiveTab(tab.value)}
          style={{
            ...buttonStyle,
            color: activeTab === tab.value ? '#000' : '#666',
          }}
        >
          {window.innerWidth < 576 ? tab.icon : tab.label}
        </button>
      ))}
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

const AdminCourseSessions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [instructor, setInstructor] = useState(null);
  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('material');
  const [selectedSession, setSelectedSession] = useState(null);

  const [isCourseLoading, setCourseLoading] = useState(true);
  const [isSessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = location.state?.course;
      if (!data) {
        console.error('No se encontró la información del curso.');
        navigate('/admin');
        return;
      }
      try {
        const instructorData = await findUserById(data.docenteId);
        setInstructor(instructorData);
        setCourse(data);
      } catch (error) {
        console.error('Error al obtener el instructor:', error);
      } finally {
        setCourseLoading(false);
      }
    };
    fetchData();
  }, [location, navigate]);

  useEffect(() => {
    if (course?.id) {
      fetchSessions();
    }
  }, [course]);

  const fetchSessions = async () => {
    try {
      const sessionsData = await getSessionsByCourse(course.id);
      setSessions(sessionsData.reverse());
    } catch (error) {
      console.error('Error al obtener sesiones:', error);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleApproveCourse = async (approve) => {
    const response = await approveCourse(course.id, approve);
    alert(response.message);
    if (response.status === 200) {
      const updatedCourse = await getCourseById(course.id);
      setCourse(updatedCourse);
    }
  };

  return (
    <div className="bg-main">
      {/* SIDEBAR */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow-1">
        {/* NAVBAR */}
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            {/* BARRA DE NAVEGACIÓN SECUNDARIA */}
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row gx-3 align-items-center">
                  <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                    <ToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                  </div>

                  {selectedSession ? (
                    <div className="col-12 col-sm-auto mt-2 px-0 mt-sm-0 text-center text-sm-end">
                      <button className="btn btn-purple-400" onClick={() => setSelectedSession(null)}>
                        <ArrowLeft size={20} className="me-2" />
                        Volver
                      </button>
                    </div>
                  ) : (
                    <>
                      {course?.status === 'Pendiente' && (
                        <div className="col-12 col-sm-auto mt-2 mt-sm-0 text-center text-sm-end">
                          <button className="btn btn-purple-900 me-2" onClick={() => handleApproveCourse(true)}>
                            <i className="bi bi-journal-check"></i> Aprobar Curso
                          </button>
                          <button className="btn btn-purple-400" onClick={() => handleApproveCourse(false)}>
                            <i className="bi bi-journal-x"></i> Rechazar Curso
                          </button>
                        </div>
                      )}

                      {course?.status === 'Rechazado' && (
                        <div className="col-12 col-sm-auto mt-2 mt-sm-0 text-center text-sm-end">
                          <span className="fw-semibold text-danger">Este curso ha sido rechazado.</span>
                        </div>
                      )}

                      <div className="col-12 col-md-auto text-md-end mt-2 mt-md-0">
                        <button className="btn btn-outline-secondary" onClick={() => navigate('/admin')}>
                          <i className="bi bi-arrow-left"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mx-md-5">
              {/* MATERIAL */}
              {activeTab === 'material' && !selectedSession && (
                <div className="position-relative w-100 mb-3">
                  {isCourseLoading ? (
                    <div className="placeholder-glow" style={{ height: '250px', width: '100%' }}>
                      <span className="placeholder col-12 rounded-4" style={{ height: '250px' }}></span>
                    </div>
                  ) : (
                    <img src={course?.coverImage ? `data:image/jpeg;base64,${course.coverImage}` : CourseBanner} className="w-100 rounded-4 object-fit-cover" style={{ height: '250px' }} alt={course?.title} />
                  )}
                  <div className="position-absolute image-overlay top-0 start-0 w-100 h-100 rounded-4" />
                  <div className="position-absolute top-50 start-0 text-start text-white p-4 w-100">
                    <h3 className="fw-bold">{course?.title}</h3>
                    <h6>
                      {instructor?.name} {instructor?.surname} {instructor?.lastname}
                    </h6>
                    <p>{course?.description}</p>
                  </div>
                </div>
              )}

              {(isCourseLoading || isSessionLoading) && (
                <div className="text-center py-5">
                  <Loading />
                </div>
              )}

              {/* CONTENIDO SEGÚN EL TAB SELECCIONADO */}
              {!isCourseLoading && !isSessionLoading && (
                <>
                  {activeTab === 'material' && (
                    <>
                      {selectedSession ? (
                        <AdminSessionView session={selectedSession} setSelectedSession={setSelectedSession} />
                      ) : (
                        <>
                          {course && <CourseStepProgress status={course?.status} />}
                          {sessions.length > 0 && <SessionIndexAccordion sessions={sessions} />}

                          {sessions.length > 0 ? (
                            sessions.map((session) => (
                              <div id={`session-${session.id}`} key={session.id}>
                                <AdminSessionCard session={session} instructor={instructor} onSelect={() => setSelectedSession(session)} />
                              </div>
                            ))
                          ) : (
                            <p className="text-muted text-center mt-5">No hay sesiones registradas aún.</p>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {activeTab === 'config' && <AdminCourseDetails course={course} />}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseSessions;

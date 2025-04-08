import { useState, useEffect, useContext, useRef, useMemo, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Users, Settings, ArrowLeft, Search } from 'react-feather';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { AuthContext } from '../../../context/AuthContext';
import { getSessionsByCourse } from '../../../services/sessionService';
import { publishCourse, requestModification, getCourseById, startCourse, finishCourse, resetCourseToApproved, duplicateCourse, archiveCourse } from '../../../services/courseService';
import SessionCard from './SessionCard';
import SessionView from './SessionView';
import MyStudents from './MyStudents';
import CourseConfig from './CourseConfig';
import AddSessionModal from './AddSessionModal';
import { findUserById } from '../../../services/userService';
import CourseStepProgress from './CourseStepProgress';
import SessionIndexAccordion from './SessionIndexAccordion';
import CourseBanner from '../../../assets/img/CourseBanner.jpg';
import Loading from '../../utilities/Loading';

const ToggleTabs = ({ activeTab, setActiveTab }) => {
  const tabs = useMemo(
    () => [
      { value: 'material', label: 'Material', icon: <BookOpen size={20} /> },
      { value: 'students', label: 'Estudiantes', icon: <Users size={20} /> },
      { value: 'config', label: 'Configuración', icon: <Settings size={20} /> },
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

const MyCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const navbarRef = useRef(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [instructor, setInstructor] = useState(null);
  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('material');
  const [selectedSession, setSelectedSession] = useState(null);
  const [deliverCertificatesTrigger, setDeliverCertificatesTrigger] = useState(false);
  const [canDeliverCertificates, setCanDeliverCertificates] = useState(false);

  const [isCourseLoading, setCourseLoading] = useState(true);
  const [isSessionLoading, setSessionLoading] = useState(true);
  const [isLoading, setLoading] = useState(false);

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
      const sessionData = await getSessionsByCourse(course.id);
      setSessions(sessionData.reverse());
    } catch (error) {
      console.error('Error al obtener sesiones:', error);
    } finally {
      setSessionLoading(false);
    }
  };

  const handlePublishCourse = async () => {
    const response = await publishCourse(course.id);
    alert(response.message);
    if (response.status === 200) {
      const updatedCourse = await getCourseById(course.id);
      setCourse(updatedCourse);
    }
  };

  const handleRequestModification = async () => {
    const response = await requestModification(course.id);
    alert(response.message);
    if (response.status === 200) {
      const updatedCourse = await getCourseById(course.id);
      setCourse(updatedCourse);
    }
  };

  const today = new Date();
  const courseStartDate = new Date(course?.dateStart);
  const canModify = course?.status === 'Creado' || (course?.status === 'Aprobado' && today < courseStartDate);

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

        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            {/* BARRA DE NAVEGACIÓN SECUNDARIA */}
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row gx-3 align-items-center">
                  <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                    <ToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                  </div>

                  {activeTab === 'material' && (
                    <div className="col-12 col-sm-auto mt-2 px-0 mt-sm-0 text-center text-sm-end">
                      {course?.status === 'Aprobado' && (
                        <button
                          className="btn btn-warning me-2"
                          onClick={async () => {
                            const response = await startCourse(course.id);
                            alert(response.message);
                            const updated = await getCourseById(course.id);
                            setCourse(updated);
                          }}
                        >
                          <i className="bi bi-caret-right"></i> Empezar (Prueba)
                        </button>
                      )}

                      {course?.status === 'Empezado' && (
                        <button
                          className="btn btn-danger me-2"
                          onClick={async () => {
                            const response = await finishCourse(course.id);
                            alert(response.message);
                            const updated = await getCourseById(course.id);
                            setCourse(updated);
                          }}
                        >
                          <i className="bi bi-stop-circle"></i> Finalizar (Prueba)
                        </button>
                      )}

                      {course?.status === 'Finalizado' && (
                        <button
                          className="btn btn-success me-2"
                          onClick={async () => {
                            const response = await resetCourseToApproved(course.id);
                            alert(response.message);
                            const updated = await getCourseById(course.id);
                            setCourse(updated);
                          }}
                        >
                          <i className="bi bi-arrow-clockwise"></i> Reiniciar (Prueba)
                        </button>
                      )}

                      {selectedSession ? (
                        <button className="btn btn-purple-400" onClick={() => setSelectedSession(null)}>
                          <ArrowLeft size={20} className="me-2" />
                          Volver
                        </button>
                      ) : (
                        <>
                          {course?.status === 'Creado' && !course?.published && (
                            <button className="btn btn-purple-400 me-2" onClick={handlePublishCourse}>
                              <i className="bi bi-send"></i> Publicar Curso
                            </button>
                          )}

                          {((course?.status === 'Pendiente' && course?.published) || (course?.status === 'Rechazado' && !course?.published)) && (
                            <div>
                              <span className={`text-${course.status === 'Pendiente' ? 'warning' : 'danger'} fw-semibold me-3`}>Curso {course.status}</span>
                              <button className="btn btn-purple-400 me-2" onClick={handleRequestModification}>
                                <i className="bi bi-pencil-square"></i> Modificar Curso
                              </button>
                            </div>
                          )}

                          {course?.status === 'Finalizado' && !course?.archived && (
                            <button
                              className="btn btn-outline-secondary me-2"
                              onClick={async () => {
                                setLoading(true);
                                const confirmed = window.confirm('¿Estás seguro de archivar este curso?');
                                if (!confirmed) return;
                                try {
                                  const response = await archiveCourse(course.id);
                                  alert(response.message);
                                  if (response.status === 200) {
                                    const updated = await getCourseById(course.id);
                                    setCourse(updated);
                                  }
                                } catch (error) {
                                  console.error(error);
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="spinner-border spinner-border-sm text-secondary" role="status">
                                  <span className="visually-hidden">Cargando...</span>
                                </div>
                              ) : (
                                <>
                                  <i className="bi bi-archive"></i> Archivar
                                </>
                              )}
                            </button>
                          )}

                          {course?.status === 'Finalizado' && course?.archived && (
                            <button
                              className="btn btn-outline-dark me-2"
                              onClick={async () => {
                                const confirmed = window.confirm('¿Deseas crear una copia de este curso?');
                                if (!confirmed) return;
                                const response = await duplicateCourse(course.id);
                                if (response.status === 200) {
                                  alert('Curso duplicado correctamente.');
                                  navigate('/instructor');
                                } else {
                                  alert(response.message || 'Error al duplicar el curso.');
                                }
                              }}
                            >
                              <i className="bi bi-copy"></i> Crear copia de este curso
                            </button>
                          )}

                          {/* Si está en modo Creado y la fecha de inicio es mayor que hoy, permitir AddSession */}
                          {course?.status === 'Creado' && today < courseStartDate && <AddSessionModal courseId={course.id} fetchSessions={fetchSessions} />}
                        </>
                      )}
                    </div>
                  )}

                  {/* Botones si activeTab === 'students' */}
                  {activeTab === 'students' && course?.status === 'Finalizado' && course?.hasCertificate && canDeliverCertificates !== null && (
                    <div className="col-12 col-sm-auto mt-2 px-0 mt-sm-0 text-center text-sm-end">
                      {canDeliverCertificates ? (
                        <button className="btn btn-outline-primary me-2" onClick={() => setDeliverCertificatesTrigger(true)}>
                          Entregar Certificados
                        </button>
                      ) : (
                        <span className="text-muted">Sin estudiantes para certificar</span>
                      )}
                    </div>
                  )}
                  {/* Botón flecha hacia /instructor si no estás en SessionView */}
                  {!selectedSession && (
                    <div className="col-12 col-md-auto text-md-end mt-2 mt-md-0">
                      <button className="btn btn-outline-secondary" onClick={() => navigate('/instructor')}>
                        <i className="bi bi-arrow-left"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mx-md-5">
              {/* Imagen de portada y placeholders */}
              {activeTab === 'material' && !selectedSession && (
                <div className="position-relative w-100 mb-3">
                  {isCourseLoading ? (
                    <div className="placeholder-glow" style={{ height: '250px', width: '100%' }}>
                      <span className="placeholder col-12 rounded-4" style={{ height: '250px' }}></span>
                    </div>
                  ) : (
                    <img src={course?.coverImage ? `data:image/jpeg;base64,${course.coverImage}` : CourseBanner} className="w-100 rounded-4 object-fit-cover image-gradient" style={{ height: '250px' }} alt={course?.title} />
                  )}

                  <div className="position-absolute image-overlay top-0 start-0 w-100 h-100 rounded-4" />
                  <div className="position-absolute top-50 start-0 text-start text-white p-4 w-100">
                    <h3 className="fw-bold">{course?.title}</h3>
                    <h6>
                      {instructor?.name} {instructor?.surname} {instructor?.lastname}
                    </h6>
                    <p className="text-truncate">{course?.description}</p>
                  </div>
                </div>
              )}

              {/* Loading debajo de la portada mientras se carga el curso */}
              {(isCourseLoading || isSessionLoading) && (
                <div className="text-center py-5">
                  <Loading />
                </div>
              )}

              {/* Contenido según el tab */}
              {!isCourseLoading && !isSessionLoading && (
                <>
                  {activeTab === 'material' && (
                    <>
                      {selectedSession ? (
                        <SessionView session={selectedSession} setSelectedSession={setSelectedSession} fetchSessions={fetchSessions} courseStatus={course?.status} />
                      ) : (
                        <>
                          {course && <CourseStepProgress status={course?.status} />}
                          {sessions.length > 0 && <SessionIndexAccordion sessions={sessions} />}

                          {sessions.length > 0 ? (
                            sessions.map((session) => (
                              <div id={`session-${session.id}`} key={session.id}>
                                <SessionCard session={session} instructor={instructor} onSelect={() => setSelectedSession(session)} />
                              </div>
                            ))
                          ) : (
                            <p className="text-muted text-center mt-5">No hay sesiones registradas aún.</p>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {activeTab === 'students' && <MyStudents courseId={course.id} courseLenght={course.studentsCount} deliverCertificatesTrigger={deliverCertificatesTrigger} course={course} instructor={instructor} setCanDeliverCertificates={setCanDeliverCertificates} />}

                  {activeTab === 'config' && <CourseConfig course={course} setCourse={setCourse} canModify={canModify} />}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;

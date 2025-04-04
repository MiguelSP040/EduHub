import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { getSessionsByCourse } from '../../../services/sessionService';
import { publishCourse, requestModification, getCourseById, startCourse, finishCourse, resetCourseToApproved, duplicateCourse, archiveCourse } from '../../../services/courseService';
import SessionCard from './SessionCard';
import SessionView from './SessionView';
import MyStudents from './MyStudents';
import CourseConfig from './CourseConfig';
import AddSessionModal from './AddSessionModal';
import { AuthContext } from '../../../context/AuthContext';
import { BookOpen, Users, Settings, ArrowLeft } from 'react-feather';
import { findUserById } from '../../../services/userService';
import CourseStepProgress from './CourseStepProgress';
import SessionIndexAccordion from './SessionIndexAccordion';
import Loading from '../../utilities/Loading';

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
                    <div className="d-flex flex-row flex-sm-row w-100 justify-content-around justify-content-sm-start">
                      <button type="button" className={`btn border-0 ${activeTab === 'material' ? 'border-bottom border-purple border-3' : ''}`} onClick={() => setActiveTab('material')}>
                        <BookOpen size={20} className="d-sm-none" />
                        <span className="d-none d-sm-inline">Material</span>
                      </button>
                      <button type="button" className={`btn border-0 ${activeTab === 'students' ? 'border-bottom border-purple border-3' : ''}`} onClick={() => setActiveTab('students')}>
                        <Users size={20} className="d-sm-none" />
                        <span className="d-none d-sm-inline">Estudiantes</span>
                      </button>
                      <button type="button" className={`btn border-0 ${activeTab === 'config' ? 'border-bottom border-purple border-3' : ''}`} onClick={() => setActiveTab('config')}>
                        <Settings size={20} className="d-sm-none" />
                        <span className="d-none d-sm-inline">Configuración</span>
                      </button>
                    </div>
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

                          {(course?.status === 'Pendiente' || course?.status === 'Rechazado') && course?.published && (
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

                          {course?.status === 'Creado' && today < courseStartDate && <AddSessionModal courseId={course.id} fetchSessions={fetchSessions} />}
                        </>
                      )}
                    </div>
                  )}
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
              {activeTab === 'material' && !selectedSession && (
                <div className="position-relative w-100 mb-3">
                  {isCourseLoading ? (
                    <div className="placeholder-glow" style={{ height: '250px', width: '100%' }}>
                      <span className="placeholder col-12 rounded-4" style={{ height: '250px' }}></span>
                    </div>
                  ) : (
                    <img
                      src={course?.coverImage ? `data:image/jpeg;base64,${course.coverImage}` : 'https://t3.ftcdn.net/jpg/04/67/96/14/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg'}
                      className="w-100 rounded-4 object-fit-cover image-gradient"
                      style={{ height: '250px' }}
                      alt={course?.title}
                    />
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
              {isCourseLoading ||
                (isSessionLoading && (
                  <div className="text-center py-5">
                    <Loading />
                  </div>
                ))}

              {/* RENDERIZADO DINÁMICO SEGÚN EL TAB SELECCIONADO */}
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

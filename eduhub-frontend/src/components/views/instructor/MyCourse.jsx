import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { getSessionsByCourse } from '../../../services/sessionService';
import { publishCourse, requestModification, getCourseById, startCourse, finishCourse, resetCourseToApproved } from '../../../services/courseService';
import SessionCard from './SessionCard';
import SessionView from './SessionView';
import MyStudents from './MyStudents';
import CourseConfig from './CourseConfig';
import AddSessionModal from './AddSessionModal';
import { AuthContext } from '../../../context/AuthContext';
import { BookOpen, Users, Settings } from 'react-feather';
import { findUserById } from '../../../services/userService';
import CourseStepProgress from './CourseStepProgress';
import SessionIndexAccordion from './SessionIndexAccordion';

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

  useEffect(() => {
    const fetchData = async () => {
      const data = location.state?.course;

      if (!data) {
        console.error('No se encontró la información del curso.');
        navigate('/admin');
        return;
      }
      try {
        const response = await findUserById(data.docenteId);
        const instructorData = await response.json();
        setInstructor(instructorData);
        setCourse(data);
      } catch (error) {
        console.error('Error al obtener el instructor:', error);
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
    }
  };

  const getProgressStep = (status) => {
    switch (status) {
      case 'Creado':
        return 0;
      case 'Pendiente':
      case 'Rechazado':
        return 1;
      case 'Aprobado':
        return 2;
      case 'Empezado':
        return 3;
      case 'Finalizado':
        return 4;
      default:
        return 0;
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
    <div>
      {/* SIDEBAR */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow-1">
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        <div className="overflow-auto vh-100">
          <main className={'px-3 px-md-5 pt-5 mt-5 ms-md-5'}>
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
                          Empezar Curso (Prueba)
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
                          Finalizar Curso (Prueba)
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
                          Reiniciar Curso (Prueba)
                        </button>
                      )}

                      {selectedSession ? (
                        <button className="btn btn-purple-400" onClick={() => setSelectedSession(null)}>
                          Volver al curso
                        </button>
                      ) : (
                        <>
                          {course?.status === 'Creado' && !course?.published && (
                            <button className="btn btn-purple-400 me-2" onClick={handlePublishCourse}>
                              Publicar Curso
                            </button>
                          )}

                          {(course?.status === 'Pendiente' || course?.status === 'Rechazado') && course?.published && (
                            <div>
                              <span className={`text-${course.status === 'Pendiente' ? 'warning' : 'danger'} fw-semibold me-3`}>Curso {course.status}</span>
                              <button className="btn btn-purple-400 me-2" onClick={handleRequestModification}>
                                Modificar Curso
                              </button>
                            </div>
                          )}

                          {course?.status === 'Aprobado' && <span className="text-success fw-semibold">Curso Aprobado - No editable</span>}

                          {course?.status === 'Empezado' && <span className="text-primary fw-semibold">Curso Empezado - No editable</span>}

                          {course?.status === 'Finalizado' && <span className="text-danger fw-semibold">Curso Finalizado - No editable</span>}

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
                </div>
              </div>
            </div>

            <div className="mx-md-5">
              {/* RENDERIZADO DINÁMICO SEGÚN EL TAB SELECCIONADO */}
              {activeTab === 'material' && (
                <>
                  {selectedSession ? (
                    <SessionView session={selectedSession} setSelectedSession={setSelectedSession} fetchSessions={fetchSessions} courseStatus={course?.status} />
                  ) : (
                    <>
                      <div className="position-relative w-100 mb-3">
                        {/* Imagen de portada */}
                        <img
                          src={course?.coverImage ? `data:image/jpeg;base64,${course.coverImage}` : 'https://t3.ftcdn.net/jpg/04/67/96/14/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg'}
                          className="w-100 rounded-4 object-fit-cover image-gradient"
                          style={{ height: '250px' }}
                          alt={course?.title}
                        />

                        <div className="position-absolute image-overlay top-0 start-0 w-100 h-100 rounded-4" />

                        <div className="position-absolute top-50 start-0 text-start text-white p-4 w-100">
                          <h3 className="fw-bold">{course?.title}</h3>
                          <h6>
                            {instructor?.name} {instructor?.surname} {instructor?.lastname}
                          </h6>
                          <p className="text-truncate">{course?.description}</p>
                        </div>
                      </div>

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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;

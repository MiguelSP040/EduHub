import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getSessionsByCourse } from '../../../services/sessionService';
import { getCourseById, approveCourse } from '../../../services/courseService';
import AdminSessionCard from './AdminSessionCard';
import AdminSessionView from './AdminSessionView'; // <-- Importamos la vista detallada
import AdminCourseDetails from './AdminCourseDetails';
import { BookOpen, Settings } from 'react-feather';
import { findUserById } from '../../../services/userService';
import CourseStepProgress from './CourseStepProgress';
import SessionIndexAccordion from './SessionIndexAccordion';

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
    <div className='bg-main'>
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
                    <div className="d-flex flex-row flex-sm-row w-100 justify-content-around justify-content-sm-start">
                      <button type="button" className={`btn border-0 ${activeTab === 'material' ? 'border-bottom border-purple border-3' : ''}`} onClick={() => setActiveTab('material')}>
                        <BookOpen size={20} className="d-sm-none" />
                        <span className="d-none d-sm-inline">Material</span>
                      </button>
                      <button type="button" className={`btn border-0 ${activeTab === 'config' ? 'border-bottom border-purple border-3' : ''}`} onClick={() => setActiveTab('config')}>
                        <Settings size={20} className="d-sm-none" />
                        <span className="d-none d-sm-inline">Detalles</span>
                      </button>
                    </div>
                  </div>

                  {/* Botones Aprobar/Rechazar si el curso está Pendiente */}
                  {course?.status === 'Pendiente' && (
                    <div className="col-12 col-sm-auto mt-2 mt-sm-0 text-center text-sm-end">
                      <button className="btn btn-purple-900 me-2" onClick={() => handleApproveCourse(true)}>
                        Aprobar Curso
                      </button>
                      <button className="btn btn-danger" onClick={() => handleApproveCourse(false)}>
                        Rechazar Curso
                      </button>
                    </div>
                  )}

                  {course?.status === 'Rechazado' && (
                    <div className="col-12 col-sm-auto mt-2 mt-sm-0 text-center text-sm-end">
                      <span className="fw-semibold text-danger">Este curso ha sido rechazado.</span>
                    </div>
                  )}

                  {course?.status === 'Aprobado' && (
                    <div className="col-12 col-sm-auto mt-2 mt-sm-0 text-center text-sm-end">
                      <span className="fw-semibold text-success">Este curso ha sido aprobado.</span>
                    </div>
                  )}

                  {course?.status === 'Empezado' && (
                    <div className="col-12 col-sm-auto mt-2 mt-sm-0 text-center text-sm-end">
                      <span className="fw-semibold text-success">Este curso ha empezado.</span>
                    </div>
                  )}

                  <div className="col-12 col-md-auto text-md-end mt-2 mt-md-0">
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/admin')}>
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-md-5">
              {/* RENDERIZADO SEGÚN EL TAB */}
              {activeTab === 'material' && (
                <>
                  {/* Si hay sesion seleccionada, mostramos AdminSessionView */}
                  {selectedSession ? (
                    <AdminSessionView session={selectedSession} setSelectedSession={setSelectedSession} />
                  ) : (
                    <>
                      <div className="position-relative w-100 mb-3">
                        {/* Imagen de portada */}
                        <img
                          src={course?.coverImage ? `data:image/jpeg;base64,${course.coverImage}` : 'https://t3.ftcdn.net/jpg/04/67/96/14/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg'}
                          className="w-100 rounded-4 object-fit-cover"
                          style={{ height: '250px' }}
                          alt={course?.title}
                        />

                        <div className="position-absolute image-overlay top-0 start-0 w-100 h-100 rounded-4" />

                        <div className="position-absolute top-50 start-0 text-start text-white p-4 w-100">
                          <h3 className="fw-bold">{course?.title}</h3>
                          <h6>
                            {instructor?.name} {instructor?.surname} {instructor?.lastname}
                          </h6>
                          <p>{course?.description}</p>
                        </div>
                      </div>

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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseSessions;

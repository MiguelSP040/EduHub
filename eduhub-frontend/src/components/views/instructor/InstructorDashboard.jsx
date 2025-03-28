import { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { AuthContext } from '../../../context/AuthContext';
import { getCourses, getCoursesByInstructor } from '../../../services/courseService';
import { BookOpen, User, Archive } from 'react-feather';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const navbarRef = useRef(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('myCourses');
  const [myCourses, setMyCourses] = useState([]);
  const [archivedCourses, setArchivedCourses] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        const instructorCourses = await getCoursesByInstructor(user.id);
        let allCourses = await getCourses();
        allCourses = allCourses.filter((course) => course.published && course.status !== 'Pendiente');

        const archived = instructorCourses.filter((c) => c.archived);
        const notArchived = instructorCourses.filter((c) => !c.archived);

        setCourses([...allCourses]);
        setMyCourses([...notArchived]);
        setArchivedCourses([...archived]);
      } catch (error) {
        console.error('Error al obtener cursos:', error);
        setCourses([]);
      }
    };
    fetchData();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Mexico_City',
    }).format(date);
  };

  const coursesByTab = useMemo(() => {
    if (activeTab === 'myCourses') return myCourses;
    if (activeTab === 'archived') return archivedCourses;
    return courses;
  }, [activeTab, courses, myCourses, archivedCourses]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Creado':
        return 'secondary';
      case 'Pendiente':
        return 'warning';
      case 'Aprobado':
        return 'success';
      case 'Rechazado':
      case 'Finalizado':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const renderCourses = () =>
    coursesByTab.length > 0 ? (
      coursesByTab.map((course) => (
        <div key={course.id} className="col-12 col-md-5 col-lg-4 course-width mb-4">
          <div className="card p-0 text-start">
            <img src={course?.coverImage ? `data:image/jpeg;base64,${course.coverImage}` : 'https://t3.ftcdn.net/jpg/04/67/96/14/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg'} height={120} className="card-img-top" alt={course.title} />
            <div className="card-body course-body-height">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title text-truncate">{course.title}</h5>
                <span className="badge text-bg-primary">{course.price === 0 ? 'GRATIS' : `$${course.price}`}</span>
              </div>
              <p className="card-text text-truncate">{course.description}</p>
              <span className={`badge text-bg-${getStatusBadgeClass(course.status)} mb-3`}>{course.status}</span>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Inicio: {formatDate(course.dateStart)}</span>
                <span className="text-muted">Fin: {formatDate(course.dateEnd)}</span>
              </div>
            </div>
            <div className="card-footer bg-white border-0">
              <button className="btn rounded-5 btn-purple-900" onClick={() => navigate('/instructor/course', { state: { course } })}>
                Ver curso
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-muted">No hay cursos disponibles.</p>
    );

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
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            {/* BARRA DE NAVEGACIÓN SECUNDARIA */}
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row gx-3 align-items-center">
                  <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                    <div className="d-flex flex-row flex-sm-row w-100 justify-content-around justify-content-sm-start">
                      {[
                        { tab: 'myCourses', icon: <User size={20} className="d-sm-none" />, label: 'Mis Cursos' },
                        { tab: 'allCourses', icon: <BookOpen size={20} className="d-sm-none" />, label: 'Todos' },
                        { tab: 'archived', icon: <Archive size={20} className="d-sm-none" />, label: 'Archivo' },
                      ].map(({ tab, icon, label }) => (
                        <button key={tab} type="button" className={`btn border-0 ${activeTab === tab ? 'border-bottom border-purple border-3 fw-semibold' : ''}`} onClick={() => setActiveTab(tab)}>
                          {icon}
                          <span className="d-none d-sm-inline">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 col-sm text-md-end mt-3 mt-sm-0">
                    <button className="btn-purple-900" onClick={() => navigate('/instructor/new-course')}>
                      Registrar curso
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* LISTADO DE CURSOS */}
            <section>
              <div className="row">{renderCourses()}</div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

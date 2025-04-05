import { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../utilities/Loading';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { AuthContext } from '../../../context/AuthContext';
import { getCourses, getCoursesByInstructor } from '../../../services/courseService';
import { BookOpen, Archive, Search } from 'react-feather';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const navbarRef = useRef(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('myCourses');
  const [myCourses, setMyCourses] = useState([]);
  const [archivedCourses, setArchivedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [hoverSearch, setHoverSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Polling: actualizar cada 30 segundos para reflejar cambios en tiempo real
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  const coursesByTab = useMemo(() => {
    if (activeTab === 'myCourses') return myCourses;
    if (activeTab === 'archived') return archivedCourses;
    return courses;
  }, [activeTab, courses, myCourses, archivedCourses]);

  const filteredCourses = useMemo(() => {
    let filtered = coursesByTab;
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((course) => (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())) || (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    return filtered;
  }, [coursesByTab, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Mexico_City',
    }).format(date);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'badge-blue-color';
      case 'Aprobado':
        return 'badge-green-color';
      case 'Empezado':
        return 'badge-pink-color';
      case 'Finalizado':
        return 'badge-red-color';
      default:
        return 'badge-gray-color';
    }
  };

  const renderCourses = () =>
    filteredCourses.length > 0 ? (
      filteredCourses.map((course) => (
        <div key={course.id} className="col-12 col-md-5 col-lg-4 course-width mb-4">
          <div className="card p-0 text-start">
            <img src={course?.coverImage ? `data:image/jpeg;base64,${course.coverImage}` : 'https://t3.ftcdn.net/jpg/04/67/96/14/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg'} height={120} className="card-img-top" alt={course.title} />
            <div className="card-body course-body-height">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title text-truncate">{course.title}</h5>
                <span className="badge badge-purple-color">{course.price === 0 ? 'GRATIS' : `$${course.price}`}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className={`badge ${getStatusBadgeClass(course.status)} mb-3`}>{course.status}</span>
                <div>
                  {course.hasCertificate ? (
                    <div className="text-success">
                      <i className="bi bi-patch-check-fill"></i> Con certificado
                    </div>
                  ) : (
                    <div>
                      <i className="bi bi-patch-check"></i> Sin certificado
                    </div>
                  )}
                </div>
              </div>
              <p className="card-text text-truncate">{course.description}</p>
              <div className="text-muted small mb-2">
                <i className="bi bi-calendar-event me-1" />
                {formatDate(course.dateStart)} → {formatDate(course.dateEnd)}
              </div>
            </div>
            <div className="card-footer bg-white border-0">
              <button className="btn rounded-5 btn-blue-600" onClick={() => navigate('/instructor/course', { state: { course } })}>
                <i className="bi bi-arrow-return-right"></i> Ver curso
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-muted">No hay cursos disponibles.</p>
    );

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
              <div className="container-fluid px-md-4 py-2">
                <div className="row flex-nowrap align-items-center justify-content-between w-100 gx-3">
                  <div className="col-auto d-flex">
                    {[
                      { tab: 'myCourses', icon: <BookOpen size={20} className="d-sm-none" />, label: 'Mis Cursos' },
                      { tab: 'archived', icon: <Archive size={20} className="d-sm-none" />, label: 'Archivo' },
                    ].map(({ tab, icon, label }) => (
                      <button key={tab} type="button" className={`btn border-0 ${activeTab === tab ? 'border-bottom border-purple border-3 fw-semibold' : ''}`} onClick={() => setActiveTab(tab)}>
                        {icon}
                        <span className="d-none d-sm-inline">{label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="col-8 col-md-6 px-0">
                    <div className="d-flex justify-content-end align-items-center gap-2 flex-nowrap ">
                      <div className="search-container">
                        <div className="search-icon">
                          <Search size={16} className="text-muted" />
                        </div>
                        <input type="search" className="search-input" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      </div>
                      <button className="btn-purple-900 me-1" onClick={() => navigate('/instructor/new-course')}>
                        <i className="bi bi-journal-plus"></i> <span className="d-none d-lg-inline">Nuevo curso</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LISTADO DE CURSOS */}
            <section>{isLoading ? <Loading /> : <div className="row">{renderCourses()}</div>}</section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

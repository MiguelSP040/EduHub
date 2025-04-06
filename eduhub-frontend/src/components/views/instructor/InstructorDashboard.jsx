import { useState, useRef, useEffect, useContext, useMemo, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { AuthContext } from '../../../context/AuthContext';
import { getCourses, getCoursesByInstructor } from '../../../services/courseService';
import { BookOpen, Archive, Search } from 'react-feather';
import CourseBanner from '../../../assets/img/CourseBanner.jpg';
import Loading from '../../utilities/Loading';

const ToggleTabs = ({ activeTab, setActiveTab }) => {
  const tabs = useMemo(
    () => [
      { value: 'myCourses', label: 'Mis Cursos', icon: <BookOpen size={20} /> },
      { value: 'archived', label: 'Archivo', icon: <Archive size={20} /> },
    ],
    []
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 576);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerRef = useRef(null);
  const tabRefs = useRef([]);

  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const index = tabs.findIndex((t) => t.value === activeTab);
    if (index < 0) return;

    const activeButton = tabRefs.current[index];
    const containerRect = containerRef.current?.getBoundingClientRect();
    const buttonRect = activeButton?.getBoundingClientRect();
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
          {isMobile ? tab.icon : tab.label}
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

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const navbarRef = useRef(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('myCourses');
  const [myCourses, setMyCourses] = useState([]);
  const [archivedCourses, setArchivedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
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
      case 'Rechazado':
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
            <img src={course?.coverImage ? `data:image/jpeg;base64,${course.coverImage}` : CourseBanner} height={120} className="card-img-top" alt={course.title} />
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
              <div className="container-fluid px-4 py-2">
                <div className="row flex-nowrap align-items-center justify-content-between w-100 gx-3">
                  {/* Columna Izquierda: ToggleTabs */}
                  <div className="col-auto d-flex">
                    <ToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} />
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

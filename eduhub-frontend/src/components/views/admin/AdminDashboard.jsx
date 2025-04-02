import { useState, useRef, useEffect, useContext, useMemo } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { BookOpen, Clock, CheckCircle, XCircle } from 'react-feather';
import { AuthContext } from '../../../context/AuthContext';
import { getCourses } from '../../../services/courseService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { user } = useContext(AuthContext);
  const navbarRef = useRef(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('allCourses');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allCourses = await getCourses();
        allCourses = allCourses.filter((course) => course.published);
        setAvailableCourses(allCourses || []);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
        setAvailableCourses([]);
      }
    };
    fetchData();
  }, []);

  const coursesByStatus = useMemo(() => {
    if (activeTab === 'allCourses') return availableCourses;
    return availableCourses.filter((course) => course.status === activeTab);
  }, [activeTab, availableCourses]);

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
    coursesByStatus.length > 0 ? (
      coursesByStatus.map((course) => (
        <div key={course.id} className="col-12 col-md-5 col-lg-4 course-width mb-4">
          <div className="card p-0 text-start">
            <img src={course?.coverImage ? `data:image/jpeg;base64,${course.coverImage}` : 'https://t3.ftcdn.net/jpg/04/67/96/14/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg'} height={120} className="card-img-top" alt={course.title} />
            <div className="card-body course-body-height">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title text-truncate">{course.title}</h5>
                <span className="badge badge-purple-color px-3 m-2">{course.price === 0 ? 'GRATIS' : `$${course.price}`}</span>
              </div>
              
              <div className="d-flex justify-content-between">
                <span className={`badge ${getStatusBadgeClass(course.status)} mb-3`}>{course.status}</span>
                <div>
                  {course.hasCertificate ?
                    (<div className='text-success'><i className="bi bi-patch-check-fill"></i> Con certificado </div>)
                    :
                    (<div><i className="bi bi-patch-check"></i> Sin certificado </div>)
                  }
                </div>
              </div>
              <p className="card-text text-truncate">{course.description}</p>
              <div className="text-muted small mb-2">
                <i className="bi bi-calendar-event me-1" />
                {formatDate(course.dateStart)} → {formatDate(course.dateEnd)}
              </div>
            </div>
            <div className="card-footer bg-white border-0 text-start">
              <button className="btn rounded-5 btn-light" onClick={() => navigate('/admin/course', { state: { course } })}>
                <i className="bi bi-gear-fill"></i> Configuración 
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-muted">No hay cursos disponibles.</p>
    );

  return (
    <div className='bg-main'>
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
                      {['allCourses', 'Pendiente', 'Aprobado', 'Empezado'].map((tab) => (
                        <button key={tab} type="button" className={`btn border-0 ${activeTab === tab ? 'border-bottom border-purple border-3 fw-semibold' : ''}`} onClick={() => setActiveTab(tab)}>
                          {tab === 'allCourses' ? <BookOpen size={20} className="d-sm-none" /> : null}
                          {tab === 'Pendiente' ? <Clock size={20} className="d-sm-none" /> : null}
                          {tab === 'Aprobado' ? <CheckCircle size={20} className="d-sm-none" /> : null}
                          {tab === 'Empezado' ? <XCircle size={20} className="d-sm-none" /> : null}
                          <span className="d-none d-sm-inline">{tab === 'allCourses' ? 'Todos' : tab === 'Pendiente' ? 'Pendientes' : tab === 'Aprobado' ? 'Aprobados' : 'Empezados'}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LISTADO DE CURSOS FILTRADOS */}
            <section>
              <div className="row">{renderCourses()}</div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

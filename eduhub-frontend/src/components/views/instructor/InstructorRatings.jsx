import { useEffect, useState, useRef } from 'react';
import { getCoursesByInstructor } from '../../../services/courseService';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { Eye } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Loading from '../../utilities/Loading';

const InstructorRatings = () => {
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const instructor = JSON.parse(localStorage.getItem('user'));
        const { id } = instructor;
        const data = await getCoursesByInstructor(id);
        setCourses(data);
      } catch (error) {
        console.error('Error al obtener cursos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

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

  return (
    <div className="bg-main">
      {/* SIDEBAR */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow-1">
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            <h2 className="mb-3">Mis calificaciones</h2>
            <div className="table-responsive rounded-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Curso</th>
                    <th>Estado</th>
                    <th>Calificación Promedio</th>
                    <th>Reseñas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-3">
                        <Loading/>
                      </td>
                    </tr>
                  ) : courses.length > 0 ? (
                    courses.map((course) => {
                      const averageRating = course.ratings.length > 0 ? course.ratings.reduce((sum, r) => sum + r.rating, 0) / course.ratings.length : 0;
                      return (
                        <tr key={course.id}>
                          <td>{course.title}</td>
                          <td><span className={`badge ${getStatusBadgeClass(course.status)} mb-3`}>{course.status}</span></td>
                          <td>
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={i < Math.round(averageRating) ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'}></i>
                            ))}
                          </td>
                          <td>{course.ratings.length === 0 ? 'Sin reseñas' : `${course.ratings.length} ${course.ratings.length === 1 ? 'reseña' : 'reseñas'}`}</td>
                          <td>
                            {course.status === 'Finalizado' ? 
                            <button className="btn btn-blue-600" onClick={() => navigate('/instructor/ratings/course-ratings', { state: { course } })} title='Ver calificaciones'>
                              <Eye />
                            </button> :
                              <span className='text-muted'>Sin acciones disponibles</span>
                            }
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-3">
                        No tienes cursos finalizados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InstructorRatings;

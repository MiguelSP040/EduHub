import { useEffect, useState, useRef } from 'react';
import { getCoursesByInstructor } from '../../../services/courseService';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { Eye } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const InstructorRatings = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const instructor = JSON.parse(localStorage.getItem('user'));
        const { id } = instructor;
        const data = await getCoursesByInstructor(id);
        setCourses(data);
      } catch (error) {
        console.error('Error al obtener cursos:', error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className='bg-main'>
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
                    <th>Calificación Promedio</th>
                    <th>Reseñas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {courses.length > 0 ? (
                    courses.map((course) => {
                      const averageRating = course.ratings.length > 0 ? course.ratings.reduce((sum, r) => sum + r.rating, 0) / course.ratings.length : 0;
                      return (
                        <tr key={course.id}>
                          <td>{course.title}</td>
                          <td>
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={i < Math.round(averageRating) ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'}></i>
                            ))}
                          </td>
                          <td>{course.ratings.length === 0 ? 'Sin reseñas' : `${course.ratings.length} ${course.ratings.length === 1 ? 'reseña' : 'reseñas'}`}</td>
                          <td>
                            <button className="btn btn-primary" disabled={course.ratings.length === -1} onClick={() => navigate('/instructor/ratings/course-ratings', { state: { course } })}>
                              <Eye />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-3">
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

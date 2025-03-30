import { useLocation, useNavigate} from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { findUserById } from '../../../services/userService';
import { Star } from 'react-feather';

const CourseRatings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const course = location.state?.course;
  const [detailedRatings, setDetailedRatings] = useState([]);

  useEffect(() => {
    const fetchRatingsWithNames = async () => {
      const ratingsWithNames = await Promise.all(
        course.ratings.map(async (rating) => {
          const student = await findUserById(rating.studentId);
          return { ...rating, studentName: `${student.name} ${student.surname}` };
        })
      );
      setDetailedRatings(ratingsWithNames);
    };

    if (course?.ratings?.length > 0) {
      fetchRatingsWithNames();
    }
  }, [course]);

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

            <div className="container mt-5">
              <h2 className="mb-4">{course?.title} - Calificaciones</h2>
              <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
                Volver
              </button>
              {detailedRatings.length > 0 ? (
                <div className="list-group">
                  {detailedRatings.map((r, i) => (
                    <div key={i} className="list-group-item">
                      <h5 className="mb-1">{r.studentName}</h5>
                      <div className="mb-2">
                        {[...Array(5)].map((_, index) => (
                          <Star key={index} size={16} className={index < r.rating ? 'text-warning' : 'text-muted'} fill={index < r.rating ? '#ffc107' : 'none'} />
                        ))}
                      </div>
                      <p>{r.comment || <i className="text-muted">Sin comentario</i>}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Este curso aún no tiene calificaciones.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseRatings;

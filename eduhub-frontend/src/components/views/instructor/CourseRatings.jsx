import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
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
  const [expandedComments, setExpandedComments] = useState({});

  const stars = [5, 4, 3, 2, 1];
  const totalRatings = course?.ratings?.length || 0;
  const ratingCounts = stars.reduce((acc, star) => {
    acc[star] = course?.ratings?.filter((r) => r.rating === star).length || 0;
    return acc;
  }, {});
  const percentages = stars.reduce((acc, star) => {
    acc[star] = totalRatings ? ((ratingCounts[star] / totalRatings) * 100).toFixed(1) : 0;
    return acc;
  }, {});
  const averageRating = totalRatings > 0 ? course.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings : 0;

  useEffect(() => {
    const fetchRatingsWithNames = async () => {
      try {
        const ratingsWithNames = await Promise.all(
          course.ratings.map(async (rating) => {
            const student = await findUserById(rating.studentId);
            return {
              ...rating,
              studentName: `${student.name} ${student.surname}`,
              studentPhoto: student.profileImage || null,
            };
          })
        );
        setDetailedRatings(ratingsWithNames);
      } catch (error) {
        console.error('Error al obtener nombres de estudiantes:', error);
      }
    };

    if (course?.ratings?.length > 0) {
      fetchRatingsWithNames();
    }
  }, [course]);

  const toggleComment = (index) => {
    setExpandedComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
            <div>
              {/* BARRA DE NAVEGACIÓN SECUNDARIA */}
              <div className="bg-white shadow-sm mb-4">
                <div className="container-fluid px-4 py-2">
                  <div className="row gx-3 align-items-center">
                    <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                      <div className="d-flex flex-row flex-sm-row w-100 justify-content-around justify-content-sm-start text-start text-nowrap text-truncate overflow-auto">
                        <h5>{course?.title} - Calificaciones</h5>
                      </div>
                    </div>
                    <div className="col-12 col-sm text-md-end mt-3 mt-sm-0">
                      <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                        Volver
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN DE ESTADÍSTICAS + LISTA */}
              <div className="row">
                {/* Cards de estadísticas */}
                <div className="col-lg-4 col-xl-3 mb-4">
                  <div className="card rounded-4 border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="fw-semibold mb-2">Calificación promedio</h5>
                      <h4 className="text-primary">{averageRating.toFixed(1)} / 5</h4>
                      <small className="text-muted">
                        {totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'}
                      </small>
                    </div>
                  </div>

                  <div className="card rounded-4 border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h6 className="fw-semibold mb-3">Porcentaje por estrellas</h6>
                      {stars.map((star, index) => (
                        <div key={index} className="mb-2">
                          <div className="d-flex justify-content-between">
                            <span>
                              {star} {index === 4 ? 'estrella' : 'estrellas'}
                            </span>
                            <span>{percentages[star]}%</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar bg-warning" style={{ width: `${percentages[star]}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card rounded-4 border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="fw-semibold mb-3">Cantidad por estrellas</h6>
                      {stars.map((star) => (
                        <div key={star} className="d-flex align-items-center justify-content-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < star ? 'text-warning' : 'text-muted'} fill={i < star ? '#ffc107' : 'none'} />
                          ))}
                          <span className="ms-2">({ratingCounts[star] || 0})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lista de calificaciones */}
                <div className="col mb-3">
                  {detailedRatings.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {detailedRatings.map((r, i) => (
                        <div key={i} className="border-0 rounded-4 p-3 bg-white shadow-sm">
                          <div className="d-flex align-items-center">
                            <img
                              src={r.studentPhoto ? `data:image/jpeg;base64,${r.studentPhoto}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                              alt="Foto de perfil"
                              className="rounded-circle me-3 border"
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="mb-1 fw-bold text-start">{r.studentName}</h6>
                              <div className="d-flex justify-content-start">
                                {[...Array(5)].map((_, index) => (
                                  <Star key={index} size={16} className={index < r.rating ? 'text-warning' : 'text-muted'} fill={index < r.rating ? '#ffc107' : 'none'} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 ps-1">
                            {r.comment ? (
                              <div className="text-end">
                                <p className="mb-1 text-start">{r.comment.length > 350 && !expandedComments[i] ? `${r.comment.slice(0, 350)}...` : r.comment}</p>
                                {r.comment.length > 150 && (
                                  <button className="btn btn-link p-0 ms-1" style={{ fontSize: '0.875rem' }} onClick={() => toggleComment(i)}>
                                    {expandedComments[i] ? 'Mostrar menos' : 'Mostrar más'}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <i className="text-muted">Sin comentario</i>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">Este curso aún no tiene calificaciones.</p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseRatings;

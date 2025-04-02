import { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getCoursesByInstructor } from '../../../services/courseService';
import { Star } from 'react-feather';
import { findUserById } from '../../../services/userService';

const AdminInstructorRatings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const instructor = location.state?.instructor;
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [ratingsByCourse, setRatingsByCourse] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursesByInstructor(instructor.id);
        const finalizedCourses = data.filter((c) => c.status === 'Finalizado');
        setCourses(finalizedCourses);
        setAllCourses(data);
        setSelectedCourse(finalizedCourses[0] || null);
      } catch (error) {
        console.error('Error al obtener cursos del instructor:', error);
      }
    };
    fetchCourses();
  }, [instructor]);

  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsMap = {};
      for (const course of courses) {
        if (course.ratings?.length > 0) {
          const detailedRatings = await Promise.all(
            course.ratings.map(async (rating) => {
              const student = await findUserById(rating.studentId);
              return {
                ...rating,
                studentName: `${student.name} ${student.surname}`,
                studentPhoto: student.profileImage || null,
              };
            })
          );
          ratingsMap[course.id] = detailedRatings;
        }
      }
      setRatingsByCourse(ratingsMap);
    };
    if (courses.length > 0) fetchRatings();
  }, [courses]);

  const courseStats = useMemo(() => {
    if (!selectedCourse || !ratingsByCourse[selectedCourse.id]) return null;

    const ratings = ratingsByCourse[selectedCourse.id];
    const total = ratings.length;
    const stars = [5, 4, 3, 2, 1];

    const counts = stars.reduce((acc, s) => {
      acc[s] = ratings.filter((r) => r.rating === s).length;
      return acc;
    }, {});

    const percentages = stars.reduce((acc, s) => {
      acc[s] = total ? ((counts[s] / total) * 100).toFixed(1) : 0;
      return acc;
    }, {});

    const avg = total > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / total : 0;

    return { ratings, stars, counts, percentages, avg, total };
  }, [selectedCourse, ratingsByCourse]);

  const overallAverage = useMemo(() => {
    let totalRatings = 0;
    let totalSum = 0;

    for (const ratings of Object.values(ratingsByCourse)) {
      totalRatings += ratings.length;
      totalSum += ratings.reduce((sum, r) => sum + r.rating, 0);
    }

    return totalRatings > 0 ? (totalSum / totalRatings).toFixed(1) : '0.0';
  }, [ratingsByCourse]);

  const toggleComment = (index) => {
    setExpandedComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className='bg-main'>
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />
      <div className="flex-grow-1">
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            {/* NAVBAR SECUNDARIA */}
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row gx-3 align-items-center">
                  <div className="col-12 col-md d-flex flex-wrap align-items-center gap-2">
                    <h5 className="fw-semibold mb-0 me-3">
                      {instructor.name} {instructor.surname} - Calificaciones
                    </h5>
                    <select className="form-select form-select-sm w-auto" value={selectedCourse?.id || ''} onChange={(e) => setSelectedCourse(courses.find((c) => c.id === e.target.value))}>
                      <option value="" disabled>
                        {courses.length > 0 ? 'Selecciona un curso' : 'No hay cursos finalizados'}
                      </option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-auto text-md-end mt-2 mt-md-0">
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/instructors')}>
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PROMEDIO GENERAL */}
            <div className="row mb-4">
              {/* CARD IZQUIERDO: DATOS DEL INSTRUCTOR */}
              <div className="col-12 col-md-7 col-lg-7 mb-4 mb-md-0">
                <div className="card rounded-4 border-0 shadow-sm h-100 p-0">
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <div className="text-center">
                          <img
                            src={instructor.profileImage ? `data:image/jpeg;base64,${instructor.profileImage}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            alt="Instructor"
                            className="rounded-circle mb-2 border"
                            style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                          />
                          <p className="text-muted fw-semibold">Instructor</p>
                        </div>
                      </div>

                      <div className="col-12 col-lg-8">
                        <div className="text-center text-lg-start">
                          <h5 className="fw-bold mb-1">
                            {instructor.name} {instructor.surname} {instructor.lastname}
                          </h5>
                          <p className="mb-1 text-muted">{instructor.email}</p>
                          <p className="mb-1">
                            <strong>Apodo:</strong> {instructor.username}
                          </p>
                          <p className="mb-1">
                            <strong>Cursos aprobados:</strong> {allCourses.filter((c) => c.status !== 'Pendiente' && c.status !== 'Creado').length}
                          </p>
                          <p className="mb-0">
                            <strong>Estado:</strong> <span className={`badge ${instructor.active ? 'bg-success' : 'bg-secondary'}`}>{instructor.active ? 'Activo' : 'Inactivo'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD DERECHO: PROMEDIO GENERAL */}
              <div className="col-12 col-md-5 col-lg-5">
                <div className="card rounded-4 border-0 shadow-sm h-100 px-0">
                  <div className="card-body align-center">
                    <h5 className="fw-semibold mb-2">Promedio general del instructor</h5>
                    <h3 className="text-primary mb-0">{overallAverage} / 5</h3>
                    <small className="text-muted">Basado en todas las calificaciones de sus cursos</small>
                  </div>
                </div>
              </div>
            </div>

            {/* CALIFICACIONES POR CURSO */}
            {courseStats ? (
              <div className="row">
                <div className="col-lg-4 col-xl-3 mb-4">
                  <div className="card rounded-4 border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="fw-semibold mb-2">Promedio general del curso</h5>
                      <h4 className="text-primary">{courseStats.avg.toFixed(1)} / 5</h4>
                      <small className="text-muted">
                        {courseStats.total} {courseStats.total === 1 ? 'calificación' : 'calificaciones'}
                      </small>
                    </div>
                  </div>
                  <div className="card rounded-4 border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h6 className="fw-semibold mb-3">Porcentaje por estrellas</h6>
                      {courseStats.stars.map((star, index) => (
                        <div key={star} className="mb-2">
                          <div className="d-flex justify-content-between">
                            <span>
                              {star} {index === 4 ? 'estrella' : 'estrellas'}
                            </span>
                            <span>{courseStats.percentages[star]}%</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div className="progress-bar bg-warning" style={{ width: `${courseStats.percentages[star]}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card rounded-4 border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="fw-semibold mb-3">Cantidad por estrellas</h6>
                      {courseStats.stars.map((star) => (
                        <div key={star} className="d-flex align-items-center justify-content-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < star ? 'text-warning' : 'text-muted'} fill={i < star ? '#ffc107' : 'none'} />
                          ))}
                          <span className="ms-2">({courseStats.counts[star]})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col mb-3">
                  {courseStats.ratings.length > 0 ? (
                    courseStats.ratings.map((r, i) => (
                      <div key={i} className="border-0 rounded-4 p-3 bg-white shadow-sm mb-3">
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
                    ))
                  ) : (
                    <p className="text-muted">Este curso aún no tiene reseñas.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted">Este curso aún no tiene calificaciones.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminInstructorRatings;

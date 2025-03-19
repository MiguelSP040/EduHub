import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";
import { AuthContext } from "../../../context/AuthContext";
import { getCourses, getCoursesByInstructor } from "../../../services/courseService";

const InstructorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Usuario autenticado

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [myCourses, setMyCourses] = useState([]); // Cursos del instructor
    const [availableCourses, setAvailableCourses] = useState([]); // Todos los cursos
    const navbarRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            if (user?.id) {
              let instructorCourses;
              try {
                instructorCourses = await getCoursesByInstructor(user.id);
              } catch (err) {
                instructorCourses = [];
              }
              setMyCourses(instructorCourses || []);
      
              let allCourses;
              try {
                allCourses = await getCourses();
              } catch (err) {
                allCourses = [];
              }
              setAvailableCourses(allCourses || []);
            }
          } catch (error) {
            console.error("Error al obtener los cursos:", error);
          }
        };
      
        fetchData();
      }, [user]);

    return (
        <div className="">
            {/* SIDEBAR */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
                navbarRef={navbarRef}
            />

            {/* CONTENEDOR PRINCIPAL (NAVBAR + MAIN) */}
            <div className="flex-grow-1">
                {/* NAVBAR */}
                <div ref={navbarRef}>
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="overflow-auto vh-100">
                    <main className={"px-3 px-md-5 pt-5 mt-5 ms-md-5"}>
                        <section className="mb-4">
                            <div className="col-12 text-end">
                                <button className="btn-purple-900" onClick={() => navigate('/instructor/new-course')}>
                                    Registrar curso
                                </button>
                            </div>

                            <h3>Mis cursos</h3>
                            <div className="row">
                                {myCourses.length > 0 ? (
                                    myCourses.map((course) => (
                                        <div key={course.id} className="col-12 col-md-5 col-lg-3 mb-4">
                                            <div className="card p-0 text-start">
                                                <img src="https://placehold.co/300x200.png" className="card-img-top" alt={course.title} />
                                                <div className="card-body course-body-height">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h5 className="card-title text-truncate">{course.title}</h5>
                                                        <span className="badge text-bg-primary">
                                                            {course.price === 0 ? "GRATIS" : `$${course.price}`}
                                                        </span>
                                                    </div>
                                                    <p className="card-text text-truncate">{course.description}</p>
                                                    <span className={`badge text-bg-${course.status === 'Pendiente' ? "warning": "primary"} mb-3`}>
                                                        {course.status}
                                                    </span>
                                                    <div className="d-flex justify-content-between">
                                                        <span className="text-muted">Inicio: {new Date(course.dateStart).toLocaleDateString()}</span>
                                                        <span className="text-muted">Fin: {new Date(course.dateEnd).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="card-footer bg-white border-0">
                                                <button className="btn rounded-5 btn-purple-900" onClick={() => navigate("/instructor/course", { state: { course } })}>Ver curso</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No tienes cursos registrados.</p>
                                )}
                            </div>
                        </section>

                        <section className="mb-4">
                            <h3>Cursos disponibles</h3>
                            <div className="row">
                                {availableCourses.length > 0 ? (
                                    availableCourses.map((course) => (
                                        course.status === 'Aceptado' ? (
                                        <div key={course.id} className="col-12 col-md-5 col-lg-3 mb-4">
                                            <div className="card p-0 text-start">
                                                <img src="https://placehold.co/300x200.png" className="card-img-top" alt={course.title} />
                                                <div className="card-body course-body-height">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h5 className="card-title text-truncate">{course.title}</h5>
                                                        <span className="badge text-bg-primary">
                                                            {course.price === 0 ? "GRATIS" : `$${course.price}`}
                                                        </span>
                                                    </div>
                                                    <p className="card-text text-truncate">{course.description}</p>
                                                    <span className={`badge text-bg-${course.status === 'Pendiente' ? "warning": "primary"} mb-3`}>
                                                        {course.status}
                                                    </span>
                                                    <div className="d-flex justify-content-between">
                                                        <span className="text-muted">Inicio: {new Date(course.dateStart).toLocaleDateString()}</span>
                                                        <span className="text-muted">Fin: {new Date(course.dateEnd).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="card-footer bg-white border-0">
                                                <button className="btn rounded-5 btn-purple-900" onClick={() => navigate("/instructor/course", { state: { course } })}>Ver curso</button>
                                                </div>
                                            </div>
                                        </div>
                                    ): null))
                                ) : (
                                    <p className="text-muted">No hay cursos disponibles.</p>
                                )}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;

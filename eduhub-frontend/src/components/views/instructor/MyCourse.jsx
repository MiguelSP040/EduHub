import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";
import { AuthContext } from "../../../context/AuthContext";
import MyStudents from "./MyStudents";
import CourseConfig from "./CourseConfig";

const MyCourse = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const navbarRef = useRef(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [course, setCourse] = useState(null);
    const [activeTab, setActiveTab] = useState("material");

    useEffect(() => {
        if (location.state?.course) {
            setCourse(location.state.course);
        } else {
            console.error("No se encontró la información del curso.");
            navigate("/instructor");
        }
    }, [location, navigate]);

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div className="d-flex">
            <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />
            <div className="flex-grow-1">
                <div ref={navbarRef}>
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>

                <div className="overflow-auto vh-100">
                    <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
                        {course ? (
                            <>
                                {/* Barra de navegación de pestañas */}
                                <nav className="d-flex justify-content-center mb-4">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item">
                                            <button className={`btn ${activeTab === "material" ? "btn-purple-900" : "btn-outline-secondary"}`} onClick={() => setActiveTab("material")}>
                                                Material
                                            </button>
                                        </li>
                                        <li className="nav-item px-2">
                                            <button className={`btn ${activeTab === "students" ? "btn-purple-900" : "btn-outline-secondary"}`} onClick={() => setActiveTab("students")}>
                                                Estudiantes
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button className={`btn ${activeTab === "config" ? "btn-purple-900" : "btn-outline-secondary"}`} onClick={() => setActiveTab("config")}>
                                                Configuración
                                            </button>
                                        </li>
                                    </ul>
                                </nav>

                                {/* Contenido dinámico según la pestaña seleccionada */}
                                {activeTab === "material" && (
                                    <div>
                                        <h2>Material del curso</h2>
                                        <button className="btn btn-purple-900 mb-3" data-bs-toggle="modal" data-bs-target="#addChapterModal">
                                            Añadir Capítulo
                                        </button>

                                        {/* Manejo seguro de `chapters` */}
                                        {course.chapters?.length > 0 ? (
                                            course.chapters.map((chapter, index) => (
                                                <div key={index} className="card mb-3">
                                                    <div className="card-body">
                                                        <h5 className="card-title">{chapter.name}</h5>
                                                        <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#addSectionModal">
                                                            Añadir Sección
                                                        </button>
                                                        <ul className="mt-2">
                                                            {chapter.sessions?.length > 0 ? (
                                                                chapter.sessions.map((session, idx) => <li key={idx}>{session.name}</li>)
                                                            ) : (
                                                                <p className="text-muted">No hay secciones.</p>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted">No hay capítulos aún.</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === "students" && <MyStudents courseId={course.id} />}

                                {activeTab === "config" && <CourseConfig course={course} />}
                            </>
                        ) : (
                            <p className="text-muted">Cargando curso...</p>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyCourse;

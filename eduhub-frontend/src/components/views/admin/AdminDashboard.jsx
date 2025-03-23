import { useState, useRef, useEffect, useContext, useMemo } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { BookOpen, Clock, CheckCircle, XCircle} from "react-feather";
import { AuthContext } from "../../../context/AuthContext";
import { getCourses } from "../../../services/courseService";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const { user } = useContext(AuthContext);
    const navbarRef = useRef(null);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [activeTab, setActiveTab] = useState("allCourses");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let allCourses = await getCourses();
                allCourses = allCourses.filter(course => course.published);
                setAvailableCourses(allCourses || []);
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
                setAvailableCourses([]);
            }
        };
        fetchData();
    }, []);

    const coursesByStatus = useMemo(() => {
        if (activeTab === "allCourses") return availableCourses;
        return availableCourses.filter((course) => course.status === activeTab);
    }, [activeTab, availableCourses]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Creado": return "secondary";
            case "Pendiente": return "warning";
            case "Aprobado": return "success";
            case "Empezado": return "primary";
            default: return "secondary";
        }
    };

    const renderCourses = () => (
        coursesByStatus.length > 0 ? (
            coursesByStatus.map((course) => (
                <div key={course.id} className="col-12 col-md-5 col-lg-4 course-width mb-4">
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
                            <span className={`badge text-bg-${getStatusBadgeClass(course.status)} mb-3`}>
                                {course.status}
                            </span>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Inicio: {new Date(course.dateStart).toLocaleDateString()}</span>
                                <span className="text-muted">Fin: {new Date(course.dateEnd).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="card-footer bg-white border-0">
                            <button className="btn rounded-5 btn-purple-900"
                                onClick={() => navigate("/admin/course", { state: { course } })}>
                                Gestionar
                            </button>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-muted">No hay cursos disponibles.</p>
        )
    );

    return (
        <div className="">
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
                                            {["allCourses", "Pendiente", "Aprobado", "Empezado"].map((tab) => (
                                                <button key={tab} type="button" className={`btn border-0 ${activeTab === tab ? "border-bottom border-purple border-3 fw-semibold" : ""}`}
                                                    onClick={() => setActiveTab(tab)} >
                                                    {tab === "allCourses" ? <BookOpen size={20} className="d-sm-none" /> : null}
                                                    {tab === "Pendiente" ? <Clock size={20} className="d-sm-none" /> : null}
                                                    {tab === "Aprobado" ? <CheckCircle size={20} className="d-sm-none" /> : null}
                                                    {tab === "Empezado" ? <XCircle size={20} className="d-sm-none" /> : null}
                                                    <span className="d-none d-sm-inline">
                                                        {tab === "allCourses" ? "Todos" : tab === "Pendiente" ? "Pendientes" : tab === "Aprobado" ? "Aprobados" : "Empezados"}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LISTADO DE CURSOS FILTRADOS */}
                        <section>
                            <div className="row">
                                {renderCourses()}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

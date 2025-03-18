import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";
import { getSessionsByCourse, createSession } from "../../../services/sessionService";
import SessionCard from "./SessionCard";
import MyStudents from "./MyStudents";
import CourseConfig from "./CourseConfig";
import { AuthContext } from "../../../context/AuthContext";
import { Modal } from "bootstrap";
import { BookOpen, Users, Settings } from "react-feather";

const MyCourse = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const navbarRef = useRef(null);
    const addSessionModalRef = useRef(null);

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [course, setCourse] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [newSession, setNewSession] = useState({ nameSession: "", multimedia: "", content: "" });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("material");

    useEffect(() => {
        const data = location.state?.course;
        if (!data) {
            console.error("No se encontró la información del curso.");
            navigate("/instructor");
            return;
        }
        setCourse(data);
    }, [location, navigate]);

    useEffect(() => {
        if (course?.id) {
            fetchSessions();
        }
    }, [course]);

    const fetchSessions = async () => {
        try {
            const sessions = await getSessionsByCourse(course.id);
            //console.log("Sesiones recibidas:", sessions);
            setSessions(sessions.reverse());
        } catch (error) {
            console.error("Error al obtener sesiones:", error);
        }
    };

    const handleCreateSession = async () => {
        if (!newSession.nameSession.trim()) return;
        setLoading(true);
        const response = await createSession({ ...newSession, courseId: course.id });
        setLoading(false);

        if (response.status === 200) {
            closeModal(addSessionModalRef);
            setNewSession({ nameSession: "", multimedia: "", content: "" });
            fetchSessions();
        } else {
            alert(response.message);
        }
    };

    const openModal = (modalRef) => {
        if (modalRef.current) {
            const modal = new Modal(modalRef.current);
            modal.show();
        }
    };

    const closeModal = (modalRef) => {
        if (modalRef.current) {
            const modal = Modal.getInstance(modalRef.current);
            if (modal) modal.hide();
        }
    };

    return (
        <div>
            {/* SIDEBAR */}
            <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex-grow-1">
                {/* NAVBAR */}
                <div ref={navbarRef}>
                    <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="overflow-auto vh-100">
                    <main className={"px-3 px-md-5 pt-5 mt-5 ms-md-5"}>

                        {/* BARRA DE NAVEGACIÓN SECUNDARIA */}
                        <div className="bg-white shadow-sm mb-4">
                            <div className="container-fluid px-4 py-2">
                                <div className="row gx-3 align-items-center">
                                    
                                    {/* Contenedor de los botones centrados en móviles */}
                                    <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                                        <div className="d-flex flex-row flex-sm-row w-100 justify-content-around justify-content-sm-start">
                                            <button type="button" className={`btn border-0 ${activeTab === "material" ? "border-bottom border-purple border-3" : ""}`} onClick={() => setActiveTab("material")}>
                                                <BookOpen size={20} className="d-sm-none" />
                                                <span className="d-none d-sm-inline">Material</span>
                                            </button>
                                            <button type="button" className={`btn border-0 ${activeTab === "students" ? "border-bottom border-purple border-3" : ""}`} onClick={() => setActiveTab("students")}>
                                                <Users size={20} className="d-sm-none" />
                                                <span className="d-none d-sm-inline">Estudiantes</span>
                                            </button>
                                            <button type="button" className={`btn border-0 ${activeTab === "config" ? "border-bottom border-purple border-3" : ""}`} onClick={() => setActiveTab("config")}>
                                                <Settings size={20} className="d-sm-none" />
                                                <span className="d-none d-sm-inline">Configuración</span>
                                            </button>
                                        </div>
                                    </div>

                                    {activeTab === "material" && (
                                        <div className="col-12 col-sm-auto mt-2 mt-sm-0 text-center text-sm-end">
                                            <button className="btn btn-purple-900" onClick={() => openModal(addSessionModalRef)}>
                                                Añadir Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* RENDERIZADO DINÁMICO SEGÚN EL TAB SELECCIONADO */}
                        {activeTab === "material" && (
                            sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <SessionCard key={session.id} session={session} refreshSessions={fetchSessions} />
                                ))
                            ) : (
                                <p className="text-muted text-center mt-5">No hay sesiones registradas aún.</p>
                            )
                        )}

                        {activeTab === "students" && <MyStudents courseId={course.id} />}
                        {activeTab === "config" && <CourseConfig course={course} setCourse={setCourse} />}
                    </main>
                </div>
            </div>

            {/* MODAL: AÑADIR SESIÓN */}
            <div className="modal fade" ref={addSessionModalRef} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <h5 className="modal-title mb-3">Crear nueva Sesión</h5>
                            <input type="text" className="form-control mb-2" placeholder="Título de la sesión" value={newSession.nameSession} onChange={(e) => setNewSession({ ...newSession, nameSession: e.target.value })} />
                            <textarea className="form-control mb-2" placeholder="Contenido de la sesión" rows={3} value={newSession.content} onChange={(e) => setNewSession({ ...newSession, content: e.target.value })} />
                            <input type="text" className="form-control mb-2" placeholder="URL de multimedia" value={newSession.multimedia} onChange={(e) => setNewSession({ ...newSession, multimedia: e.target.value })} />
                            <div className="text-end">
                                <button className="btn btn-purple-900 me-2" onClick={handleCreateSession}>{loading ? "Guardando..." : "Guardar"}</button>
                                <button className="btn btn-outline-secondary" onClick={() => closeModal(addSessionModalRef)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MyCourse;

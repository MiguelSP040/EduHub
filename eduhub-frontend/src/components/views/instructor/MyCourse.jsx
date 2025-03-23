import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";
import { getSessionsByCourse, createSession } from "../../../services/sessionService";
import { publishCourse, requestModification, getCourseById } from "../../../services/courseService";
import SessionCard from "./SessionCard";
import MyStudents from "./MyStudents";
import CourseConfig from "./CourseConfig";
import { AuthContext } from "../../../context/AuthContext";
import { Modal } from "bootstrap";
import { BookOpen, Users, Settings } from "react-feather";
import { findUserById } from "../../../services/userService";

const MyCourse = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const navbarRef = useRef(null);
    const addSessionModalRef = useRef(null);

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [instructor, setInstructor] = useState(null);
    const [course, setCourse] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [newSession, setNewSession] = useState({ nameSession: "", content: "" });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("material");


    useEffect(() => {
        const fetchData = async () => {
            const data = location.state?.course;

            if (!data) {
                console.error("No se encontró la información del curso.");
                navigate("/admin");
                return;
            }
            try {
                const response = await findUserById(data.docenteId);
                const instructorData = await response.json();
                setInstructor(instructorData);
                setCourse(data);
            } catch (error) {
                console.error("Error al obtener el instructor:", error);
            }
        }
        fetchData();
    }, [location, navigate]);

    useEffect(() => {
        if (course?.id) {
            fetchSessions();
        }
    }, [course]);


    const fetchSessions = async () => {
        try {
            const sessions = await getSessionsByCourse(course.id);
            setSessions(sessions.reverse());
        } catch (error) {
            console.error("Error al obtener sesiones:", error);
        }
    };


    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleCreateSession = async () => {
        if (!newSession.nameSession.trim()) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("session", new Blob([JSON.stringify({
            ...newSession,
            courseId: course.id
        })], { type: "application/json" }));

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }
        }

        const response = await createSession(formData); 
        setLoading(false);

        if (response.status === 200) {
            closeModal(addSessionModalRef);
            setNewSession({ nameSession: "", content: "" });
            setFiles([]);
            fetchSessions();
        } else {
            alert(response.message);
        }
    };

    const handlePublishCourse = async () => {
        const response = await publishCourse(course.id);
        alert(response.message);

        if (response.status === 200) {
            const updatedCourse = await getCourseById(course.id);
            setCourse(updatedCourse);
        }
    };


    const handleRequestModification = async () => {
        const response = await requestModification(course.id);
        alert(response.message);

        if (response.status === 200) {
            const updatedCourse = await getCourseById(course.id);
            setCourse(updatedCourse);
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


    const today = new Date();
    const courseStartDate = new Date(course?.dateStart);
    const canModify = course?.status === "Creado" || (course?.status === "Aprobado" && today < courseStartDate);


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

                                            {course?.status === "Creado" && !course?.published && (
                                                <button className="btn btn-success me-2" onClick={handlePublishCourse}>
                                                    Publicar Curso
                                                </button>
                                            )}

                                            {course?.status === "Pendiente" && course?.published && (
                                                <div>
                                                    <span className="text-warning fw-semibold me-3">Curso Pendiente de Aprobación</span>
                                                    <button className="btn btn-warning me-2" onClick={handleRequestModification}>
                                                        Modificar Curso
                                                    </button>
                                                </div>
                                            )}

                                            {course?.status === "Rechazado" && course?.published && (
                                                <div>
                                                    <span className="text-danger fw-semibold me-3">Curso Rechazado</span>
                                                    <button className="btn btn-warning me-2" onClick={handleRequestModification}>
                                                        Modificar Curso
                                                    </button>
                                                </div>
                                            )}

                                            {course?.status === "Aprobado" && (
                                                <span className="text-success fw-semibold">Curso Aprobado - No editable</span>
                                            )}

                                            {course?.status === "Empezado" && (
                                                <span className="text-primary fw-semibold">Curso Empezado - No editable</span>
                                            )}

                                            {(course?.status === "Creado" && new Date() < new Date(course?.dateStart)) && (
                                                <button className="btn btn-purple-900" onClick={() => openModal(addSessionModalRef)}>
                                                    Añadir Sesión
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mx-md-5">

                            {/* RENDERIZADO DINÁMICO SEGÚN EL TAB SELECCIONADO */}
                            {activeTab === "material" && (
                                <>
                                    <div className="position-relative w-100">
                                        {/* Imagen de portada */}
                                        <img
                                            src="https://t3.ftcdn.net/jpg/04/67/96/14/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg"
                                            className="w-100 rounded-4 object-fit-cover"
                                            style={{ height: "250px" }}
                                            alt={course?.title}
                                        />

                                        {/* Contenido sobre la imagen */}
                                        <div className="position-absolute top-50 start-0 text-start text-white p-4 w-100">
                                            <div className="text-white">
                                                <h3 className="fw-bold">{course?.title}</h3>
                                                <h6>{instructor?.name} {instructor?.surname} {instructor?.lastname}</h6>
                                                <p>{course?.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Renderizado de sesiones */}
                                    {sessions.length > 0 ? (
                                        sessions.map((session) => (
                                            <SessionCard
                                                key={session.id}
                                                session={session}
                                                refreshSessions={fetchSessions}
                                                isPublished={course.published}
                                                courseStatus={course.status}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-5">No hay sesiones registradas aún.</p>
                                    )}
                                </>
                            )}


                            {activeTab === "students" && <MyStudents courseId={course.id} courseLenght={course.studentsCount} courseStartDate={course.dateStart} />}
                            {activeTab === "config" && <CourseConfig course={course} setCourse={setCourse} canModify={canModify} />}
                        </div>
                    </main>
                </div>
            </div>

            {/* MODAL: AÑADIR SESIÓN */}
            <div className="modal fade" ref={addSessionModalRef} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <h5 className="modal-title mb-3">Crear nueva Sesión</h5>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Título de la sesión"
                                value={newSession.nameSession}
                                onChange={(e) => setNewSession({ ...newSession, nameSession: e.target.value })}
                            />
                            <textarea
                                className="form-control mb-2"
                                placeholder="Contenido de la sesión"
                                rows={3}
                                value={newSession.content}
                                onChange={(e) => setNewSession({ ...newSession, content: e.target.value })}
                            />
                            {/* Input para múltiples archivos */}
                            <input
                                type="file"
                                className="form-control mb-2"
                                multiple
                                onChange={handleFileChange}
                            />
                            <div className="text-end">
                                <button className="btn btn-purple-900 me-2" onClick={handleCreateSession}>
                                    {loading ? "Guardando..." : "Guardar"}
                                </button>
                                <button className="btn btn-outline-secondary" onClick={() => closeModal(addSessionModalRef)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MyCourse;

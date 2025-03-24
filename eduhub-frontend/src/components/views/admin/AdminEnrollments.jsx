import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { getCourses, getStudentsByCourse, manageEnrollment } from "../../../services/courseService";
import { CheckCircle, AlertCircle, FileText } from "react-feather";

const AdminEnrollments = () => {
    const navbarRef = useRef(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                const paidCourses = data.filter(course => course.price > 0 && course.status === "Aprobado");
                setCourses(paidCourses);
            } catch (error) {
                console.error("Error al obtener cursos:", error);
            }
        };

        fetchCourses();
    }, []);

    const fetchStudents = async (courseId) => {
        try {
            const data = await getStudentsByCourse(courseId);
            setStudents(data);
        } catch (error) {
            console.error("Error al obtener estudiantes:", error);
        }
    };

    const handleCourseChange = (event) => {
        const courseId = event.target.value;
        setSelectedCourse(courseId);
        fetchStudents(courseId);
    };

    const handleManageEnrollment = async (studentId, accept) => {
        if (!selectedCourse) return;
    
        const response = await manageEnrollment(selectedCourse, studentId, accept);
        if (response.status === 200) {
            alert(response.message);
    
            setStudents(prevStudents =>
                accept
                    ? prevStudents.map(student =>
                        student.id === studentId ? { ...student, status: "Aceptado" } : student
                    )
                    : prevStudents.map(student =>
                        student.id === studentId ? { ...student, status: "Rechazado", tempRejected: true } : student
                    )
            );
        } else {
            alert(`Error: ${response.message}`);
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
                    <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">

                        <div className="bg-white shadow-sm mb-4">
                            <div className="container-fluid px-4 py-2">
                                <div className="row gx-3 align-items-center">
                                    <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                                        <div className="d-flex flex-row flex-sm-row w-100 justify-content-around justify-content-sm-start">
                                            <span className="fw-semibold fs-5">Gestión de Inscripciones</span>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm text-md-end mt-3 mt-sm-0">
                                        <select className="form-select" value={selectedCourse || ""} onChange={handleCourseChange}>
                                            <option value="" disabled>Seleccione un curso</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.title} - ${course.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de estudiantes */}
                        {selectedCourse && (
                            <div className="table-responsive rounded-3" style={{ maxHeight: "35rem" }}>
                                <table className="table table-striped text-nowrap">
                                    <thead className="position-sticky top-0">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Fecha de Inscripción</th>
                                            <th>Estado</th>
                                            <th>Archivo</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length > 0 ? (
                                            students.map(student => (
                                                <tr key={student.id}>
                                                    <td>{student.name} {student.surname}</td>
                                                    <td>{student.enrolledDate || "No disponible"}</td>
                                                    <td>
                                                        {student.status === "Aceptado" || student.status === "Completado" ? (
                                                            <span className="text-success">{student.status} <CheckCircle color="green" /></span>
                                                        ) : (
                                                            <span className="text-warning">{student.status} <AlertCircle color="orange" /></span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <FileText/>
                                                    </td>
                                                    <td>
                                                        {student.status === "Pendiente" && (
                                                            <>
                                                                <button className="btn btn-success btn-sm me-2"
                                                                    onClick={() => handleManageEnrollment(student.id, true)}>
                                                                    Aceptar
                                                                </button>
                                                                <button className="btn btn-danger btn-sm"
                                                                    onClick={() => handleManageEnrollment(student.id, false)}>
                                                                    Rechazar
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted">No hay estudiantes inscritos en este curso.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminEnrollments;

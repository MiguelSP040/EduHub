import { useEffect, useState } from "react";
import { getStudentsByCourse, manageEnrollment } from "../../../services/courseService";
import { CheckCircle, AlertCircle } from "react-feather";

const MyStudents = ({ courseId, courseLenght, courseStartDate }) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getStudentsByCourse(courseId);
                setStudents(data);
            } catch (error) {
                console.error("Error al obtener estudiantes:", error);
            }
        };

        fetchStudents();
    }, [courseId]);

    const today = new Date();
    const isEnrollmentAllowed = today < new Date(courseStartDate);

    const handleManageEnrollment = async (studentId, accept) => {
        if (!isEnrollmentAllowed) {
            alert("No se pueden aceptar nuevos estudiantes, el curso ya comenzó.");
            return;
        }

        const response = await manageEnrollment(courseId, studentId, accept);

        if (response.status === 200) {
            alert(response.message);
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student.id === studentId ? { ...student, status: accept ? "Aceptado" : "Rechazado" } : student
                )
            );
        } else {
            alert(`Error: ${response.message}`);
        }
    };

    return (
        <div className="table-responsive rounded-3" style={{ maxHeight: "35rem" }}>
            <table className="table table-striped text-nowrap" >
                <thead className="position-sticky top-0">
                    <tr>
                        <th colSpan="5" className="text-center">
                            <h4 className="mb-0">Estudiantes Inscritos - {students.length}/{courseLenght}</h4>
                        </th>
                    </tr>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha de Inscripción</th>
                        <th>Asistencias</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.name} {student.surname} </td>
                                <td>{student.enrolledDate || "Fecha no disponible"}</td>
                                <td>{student.status === "Aceptado" || student.status === "En progreso" || student.status === "Completado" ? `${student.progress || 0}%` : "N/A"}</td>
                                <td>
                                    {student.status === "Aceptado" || student.status === "Completado" ? (
                                        <span className="fw-semibold text-success">{student.status} <CheckCircle color="green" /></span>
                                    ) : (
                                        <span className="text-warning">{student.status} <AlertCircle color="orange"/></span>
                                    )}
                                </td>
                                <td>
                                    {student.status === "Pendiente" ? (
                                        <>
                                            <button className="btn btn-purple-900 btn-sm me-2" 
                                                onClick={() => handleManageEnrollment(student.id, true)}>
                                                Aceptar
                                            </button>
                                            <button className="btn btn-purple-400 btn-sm" 
                                                onClick={() => handleManageEnrollment(student.id, false)}>
                                                Rechazar
                                            </button>
                                        </>
                                    ) : (
                                        <span>Inscrito </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-5 text-muted">
                                <strong>No hay estudiantes inscritos</strong>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyStudents;

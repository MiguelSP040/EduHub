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

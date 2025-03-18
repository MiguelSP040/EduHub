import { useEffect, useState } from "react";
import { getStudentsByCourse, manageEnrollment } from "../../../services/courseService";
import { CheckCircle, XCircle } from "react-feather";

const MyStudents = ({ courseId }) => {
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

    const handleManageEnrollment = async (studentId, accept) => {
        const response = await manageEnrollment(courseId, studentId, accept);
        alert(response.message);
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped text-nowrap">
                <thead>
                    <tr>
                        <th colSpan="5" className="text-center">
                            <h4 className="mb-0">Estudiantes Inscritos</h4>
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
                            <td>{student.name} {student.surname}</td>
                            <td>{student.enrolledDate || "Fecha no disponible"}</td>
                            <td>{student.attendance || "N/A"}</td>
                            <td>
                            {student.status === "Activo" ? <CheckCircle /> : <span>Pendiente</span>}
                            </td>
                            <td>
                            <button 
                                className="btn btn-purple-900 btn-sm me-2"
                                onClick={() => handleManageEnrollment(student.id, true)}
                            >
                                Aceptar
                            </button>
                            <button 
                                className="btn btn-purple-400 btn-sm"
                                onClick={() => handleManageEnrollment(student.id, false)}
                            >
                                Rechazar
                            </button>
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
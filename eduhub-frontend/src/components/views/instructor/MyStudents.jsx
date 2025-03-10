import { useEffect, useState } from "react";
import { getStudentsByCourse } from "../../../services/courseService";

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

    return (
        <div>
            <h2>Estudiantes inscritos</h2>
            <table className="table">
                <thead>
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
                                <td>{student.name}</td>
                                <td>{student.enrolledDate}</td>
                                <td>{student.attendance}</td>
                                <td>
                                    {student.status === "Activo" ? "✅" : "⚠️"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-5 text-muted">
                                <strong>Nadie se ha inscrito aún</strong>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyStudents;

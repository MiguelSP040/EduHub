import { useEffect } from "react";

const AdminCourseDetails = ({ course }) => {
    useEffect(() => {
        if (!course) {
            console.error("No se encontró la información del curso.");
        }
    }, [course]);

    if (!course) return <p className="text-muted">Cargando datos del curso...</p>;

    return (
        <div className="card shadow-sm p-4">
            <div className="text-start">
                <div className="text-center bg-light py-1">
                    <h4 className="mb-3">Detalles del Curso</h4>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6"><p><strong>Título:</strong> {course.title}</p></div>
                    <div className="col-6"><p><strong>Descripción:</strong> {course.description}</p></div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6"><p><strong>Categoría:</strong> {course.category}</p></div>
                    <div className="col-6"><p><strong>Precio:</strong> {course.price === 0 ? "GRATIS" : `$${course.price}`}</p></div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6"><p><strong>Fecha de Inicio:</strong> {new Date(course.dateStart).toLocaleDateString()}</p></div>
                    <div className="col-6"><p><strong>Fecha de Fin:</strong> {new Date(course.dateEnd).toLocaleDateString()}</p></div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-6"><p><strong>Estado:</strong> <span className={`badge text-bg-${course.status === "Pendiente" ? "warning" : course.status === "Aprobado" ? "success" : "danger"}`}>{course.status}</span></p></div>
                    <div className="col-6"><p><strong>Estudiantes inscritos:</strong> {course.enrollments.length || 0}/{course.studentsCount} </p></div>
                </div>
            </div>
        </div>
    );
};

export default AdminCourseDetails;

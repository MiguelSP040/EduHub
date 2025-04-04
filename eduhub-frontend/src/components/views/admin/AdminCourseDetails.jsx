import { useEffect } from "react";

const AdminCourseDetails = ({ course }) => {
    useEffect(() => {
        if (!course) {
            console.error("No se encontró la información del curso.");
        }
    }, [course]);

    if (!course) return <p className="text-muted">Cargando datos del curso...</p>;

    return (
        <div className="row">

            <div className="card shadow-sm p-4">
                <div className="text-start">
                    
                    <div className="text-start py-2 border-bottom ">
                        <h3 className="mb-0"> Detalles del Curso</h3>
                    </div>

                    
                    <div className="row py-3 border-bottom">
                        <div className="col-12 col-md-6 mb-2 mb-md-0">
                            <strong>Título:</strong>
                            <p className="mb-0">{course.title}</p>
                        </div>
                        <div className="col-12 col-md-6">
                            <strong>Descripción:</strong>
                            <p className="mb-0">{course.description}</p>
                        </div>
                    </div>

                    
                    <div className="row py-3 border-bottom">
                        <div className="col-12 col-md-6 mb-2 mb-md-0">
                            <strong>Categoría:</strong>
                            <p className="mb-0">{course.category}</p>
                        </div>
                        <div className="col-12 col-md-6">
                            <strong>Precio:</strong>
                            <p className="mb-0">
                                {course.price === 0 ? (
                                    <span className="badge badge-green-color">GRATIS</span>
                                ) : (
                                    <span className="badge badge-green-color">${course.price}</span>
                                )}
                            </p>
                        </div>
                    </div>

                    
                    <div className="row py-3 border-bottom">
                        <div className="col-12 col-md-6 mb-2 mb-md-0">
                            <strong>Fecha de Inicio:</strong>
                            <p className="mb-0">{new Date(course.dateStart).toLocaleDateString()}</p>
                        </div>
                        <div className="col-12 col-md-6">
                            <strong>Fecha de Fin:</strong>
                            <p className="mb-0">{new Date(course.dateEnd).toLocaleDateString()}</p>
                        </div>
                    </div>

                    
                    <div className="row py-3">
                        <div className="col-12 col-md-6 mb-2 mb-md-0">
                            <strong>Estado:</strong>
                            <p className="mb-0">
                                <span className={`badge ${course.status === "Pendiente"
                                        ? "badge-blue-color"
                                        : course.status === "Aprobado"
                                            ? "badge-green-color"
                                            : course.status === "Finalizado"
                                                ? "badge-red-color"
                                                :course.status === "Empezado"
                                                    ? "badge-blue-color"
                                                        : "badge-gray-color"
                                    }`}>
                                    {course.status}
                                </span>
                            </p>
                        </div>
                        <div className="col-12 col-md-6">
                            <strong>Estudiantes inscritos:</strong>
                            <p className="mb-0">{course.enrollments?.length || 0}/{course.studentsCount}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default AdminCourseDetails;

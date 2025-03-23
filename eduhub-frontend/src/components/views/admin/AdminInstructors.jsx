import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { findAllUsers, activateInstructor } from "../../../services/userService";
import { CheckCircle, AlertCircle } from "react-feather";

const AdminInstructors = () => {
    const navbarRef = useRef(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const data = await findAllUsers();
                const filteredInstructors = data.filter(user => user.role === "ROLE_INSTRUCTOR");
                console.log(filteredInstructors);
                
                setInstructors(filteredInstructors);
            } catch (error) {
                console.error("Error al obtener instructores:", error);
            }
        };

        fetchInstructors();
    }, []);

    const handleActivateInstructor = async (instructorId) => {
        const response = await activateInstructor(instructorId);
        
        if (response.status === 200) {
            alert(response.message);
            
            setInstructors(prevInstructors => 
                prevInstructors.map(instructor => 
                    instructor.id === instructorId ? { ...instructor, active: true } : instructor
                )
            );
        } else {
            alert("Error al activar el instructor.");
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
                                        <span className="fw-semibold fs-5">Gestión de Instructores</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de instructores */}
                        <div className="table-responsive rounded-3" style={{ maxHeight: "35rem" }}>
                            <table className="table table-striped text-nowrap">
                                <thead className="position-sticky top-0">
                                    <tr>
                                        <th>Nombre Completo</th>
                                        <th>Correo Electrónico</th>
                                        <th>Username</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instructors.length > 0 ? (
                                        instructors.map((instructor, index) => (
                                            <tr key={instructor._id || index}>
                                                <td>{instructor.name} {instructor.surname} {instructor.lastname}</td>
                                                <td>{instructor.email}</td>
                                                <td>{instructor.username}</td>
                                                <td>
                                                    {instructor.active ? (
                                                        <span className="text-success">Activo <CheckCircle color="green" /></span>
                                                    ) : (
                                                        <span className="text-warning">Inactivo <AlertCircle color="orange" /></span>
                                                    )}
                                                </td>
                                                <td>
                                                    {!instructor.active && (
                                                        <button className="btn btn-success btn-sm"
                                                            onClick={() => handleActivateInstructor(instructor.id)}>
                                                            Activar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">No hay instructores registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminInstructors;

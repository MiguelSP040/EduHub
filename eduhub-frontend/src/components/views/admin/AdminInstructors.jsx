import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { findAllUsers, activateInstructor } from "../../../services/userService";
import { Modal } from 'bootstrap'
import { Eye } from "react-feather";

const AdminInstructors = () => {
    const navbarRef = useRef(null);
    const [instructorIndex, setInstructorIndex] = useState(0);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [instructors, setInstructors] = useState([]);
    const viewInstructorModalRef = useRef(null);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const data = await findAllUsers();
                const filteredInstructors = data.filter(user => user.role === "ROLE_INSTRUCTOR");
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

    const openModal = (modalRef, index) => {
        setInstructorIndex(index);
        console.log(instructors[instructorIndex]);
        
        if (modalRef.current) {
            const modal = new Modal(modalRef.current);
            modal.show();
        }
    }

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
                                        <th>Apodo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="align-middle">
                                    {instructors.length > 0 ? (
                                        instructors.map((instructor, index) => (
                                            <tr key={instructor._id || index}>
                                                <td>{instructor.name} {instructor.surname} {instructor.lastname}</td>
                                                <td>{instructor.email}</td>
                                                <td>{instructor.username}</td>
                                                <td>
                                                    {instructor.active ? (
                                                        <span className="badge bg-success">Activo</span>
                                                    ) : (
                                                        <span className="badge bg-warning">Inactivo</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {!instructor.active && (
                                                        <button className="btn btn-success btn-sm"
                                                            onClick={() => handleActivateInstructor(instructor.id)}>
                                                            Activar
                                                        </button>
                                                    )}
                                                    <button className="btn btn-primary btn-sm" onClick={() => openModal(viewInstructorModalRef, index)}>
                                                            <Eye size={16} />
                                                    </button>
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

            {/* MODAL VER DATOS DEL INSTRUCTOR */}
            <div className="modal fade" ref={viewInstructorModalRef} tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title me-auto">Datos del Instructor</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center text-sm-start">
                            <div className="row mb-3">
                                <div className="col-12 col-sm-6">
                                    <h5>Nombre (s)</h5>
                                    <span>{instructors[instructorIndex]?.name} </span>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <h5>Apellido (s)</h5>
                                    <span> {instructors[instructorIndex]?.surname} {instructors[instructorIndex]?.lastname} </span>
                                </div>
                            </div>
                            <div className="row my-3">
                                <div className="col-12 col-sm-6">
                                    <h5>Apodo</h5>
                                    <span> {instructors[instructorIndex]?.username} </span>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <h5>Correo electrónico</h5>
                                    <span> {instructors[instructorIndex]?.email} </span>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12">
                                    <h5>Descripción</h5>
                                    <span> {instructors[instructorIndex]?.description ? instructors[instructorIndex]?.description : 'Sin descripción' } </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInstructors;

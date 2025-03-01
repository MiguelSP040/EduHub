import { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Modal } from "bootstrap";

const AdminProfile = () => {
    const { user } = useContext(AuthContext);
    const { name, surname, lastname, email, username , role} = user || {};

    const getRoleName = (role) => {
        const roleMap = {
            "ROLE_ADMIN": "Administrador",
            "ROLE_INSTRUCTOR": "Instructor"
        };
        return roleMap[role] || null;

    }

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const navbarRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const updateUserModalRef = useRef(null);
    const updatePasswordModalRef = useRef(null);

    const openModal = (modalRef) => {
        if (modalRef.current) {
            const modal = new Modal(modalRef.current);
            modal.show();
        }
    };

    return (
        <div className="d-flex">
            {/* SIDEBAR */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
                navbarRef={navbarRef}
            />

            {/* CONTENEDOR PRINCIPAL (NAVBAR + MAIN) */}
            <div className="flex-grow-1">
                {/* NAVBAR */}
                <div ref={navbarRef}>
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="overflow-auto vh-100">
                    <main className={"px-3 px-md-5 pt-5 mt-5 ms-md-5"} >
                        <div className="row">
                            {/* Sección de Perfil */}
                            <section className="col-lg-4">
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body light-gray-bg text-center">
                                        <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="avatar" className="rounded-circle img-fluid border border-4 border-info p-1" width={150}/>
                                        <h5 className="my-3" id="username">{ user? username : <p className="text-muted placeholder-glow mb-0" id="username"><span className="placeholder rounded-3 col-4"></span></p> }</h5>
                                        <p className="text-muted mb-3" id="role">{ user? getRoleName(role) : <p className="text-muted placeholder-glow mb-0" id="username"><span className="placeholder rounded-3 col-4"></span></p> }</p>
                                        <div className="d-flex justify-content-center mb-2">
                                            <button type="button" className="btn btn-purple-900" onClick={() => openModal(updateUserModalRef)}>
                                                Editar Perfil
                                            </button>
                                            <button type="button" className="btn btn-purple-400 ms-1" onClick={() => openModal(updatePasswordModalRef)}>
                                                Cambiar contraseña
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Sección de Información */}
                            <section className="col-lg-8">
                                <div className="card shadow-sm mb-4">
                                    <div className="card-header light-blue-bg">
                                        <p className="mb-0 fs-4">Gestionar perfil de usuario</p>
                                    </div>      
                                    <div className="card-body light-gray-bg">
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Nombre completo</p></div>
                                            <div className="col-sm-9">{ user? ([name, surname, lastname].filter(Boolean).join(" ")) : <p className="text-muted placeholder-glow mb-0" id="fullName"><span className="placeholder rounded-3 col-4"></span></p> }</div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Correo</p></div>
                                            <div className="col-sm-9">{ user? email : <p className="text-muted placeholder-glow mb-0" id="fullName"><span className="placeholder rounded-3 col-4"></span></p> }</div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Contraseña</p></div>
                                            <div className="col-sm-9"><p className="text-muted mb-0">*********</p></div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Estado</p></div>
                                            <div className="col-sm-9"><p className="text-muted mb-0">Activo</p></div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Descripción</p></div>
                                            <div className="col-sm-9"><p className="text-muted placeholder-glow mb-0" id="description"><span className="placeholder rounded-3 col-4"></span></p></div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>

            {/* MODAL EDITAR PERFIL */}
            <div className="modal fade" ref={updateUserModalRef} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <h4>Modificar usuario</h4>
                            <hr />
                            <form>
                                <div className="row">
                                    <div className="col-12 col-sm-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" defaultValue={name} />
                                            <label>Nombre(s)</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" defaultValue={surname} />
                                            <label>Apellido paterno</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" defaultValue={null} />
                                            <label>Descripción</label>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="col-12 text-end">
                                    <button type="button" className="btn btn-purple-900">Actualizar</button>
                                    <button type="button" className="btn ms-2 btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CAMBIAR CONTRASEÑA */}
            <div className="modal fade" ref={updatePasswordModalRef} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <h4 className="modal-title">Cambiar contraseña</h4>
                            <hr />
                            <form>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-floating mb-3">
                                            <input type="password" className="form-control" />
                                            <label>Contraseña actual</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-sm-6">
                                        <div className="form-floating mb-3">
                                            <input type="password" className="form-control" />
                                            <label>Nueva contraseña</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-floating mb-3">
                                            <input type="password" className="form-control" />
                                            <label>Confirmar contraseña</label>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="col-12 text-end">
                                    <button type="button" className="btn btn-success">Actualizar</button>
                                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;

import { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { updateProfile, findUserById } from "../../../services/userService";
import { verifyPassword } from "../../../services/authService";
import PasswordInput from "../../PasswordInputRegister";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";
import { Modal } from "bootstrap";

const InstructorProfile = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [userLogged, setUserLogger] = useState(null);
    const navbarRef = useRef(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const updateUserModalRef = useRef(null);
    const updatePasswordModalRef = useRef(null);
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState({})

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.id) {
                const response = await findUserById(user.id, token);
                if (response.ok) {
                    const data = await response.json();
                    setUserLogger(data);
                } else {
                    console.error("Error al obtener usuario:", response);
                }
            }
        };
    
        fetchUserData();
    }, [user, token]);

    useEffect(() => {
        if (userLogged) {
            setFormData({
                id: userLogged.id || "",
                name: userLogged.name || "",
                surname: userLogged.surname || "",
                lastname: userLogged.lastname || "",
                username: userLogged.username || "",
                active: userLogged.active || "",
                description: userLogged.description || ""
            });
        }
        console.log(userLogged);
        
    }, [userLogged]);
    

    const getRoleName = (role) => {
        const roleMap = {
            "ROLE_ADMIN": "Administrador",
            "ROLE_INSTRUCTOR": "Instructor"
        };
        return roleMap[role] || null;

    }

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const openModal = (modalRef) => {
        if (modalRef.current) {
            const modal = new Modal(modalRef.current);
            modal.show();
        }
    };

    const handleUpdate = async () => {
        setLoading(true);

        try {
            const response = await updateProfile(formData, token);

            if (!response.ok) {
                alert("Error de conexión con el servidor");
                return;
            }

            alert("Actualización completada con éxito");
            
            setUserLogger(prevState => ({
                ...prevState,
                ...formData
            }));

            const modal = Modal.getInstance(updateUserModalRef.current);
             if (modal) modal.hide();

        } catch (error) {
            console.error(`Error al actualizar el perfil ${error}`);
            alert("No se pudo actualizar el perfil de usuario");
        }
        setLoading(false);
    }

    const handlePasswordUpdate = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Todos los campos son obligatorios");
            return;
        }
    
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
    
        setLoading(true);
        try {
            const verifyResponse = await verifyPassword({ user: user.username, password: currentPassword });
    
            if (!verifyResponse.ok) {
                alert("Contraseña actual incorrecta");
                return;
            }
    
            const updateResponse = await updateProfile({ id: user.id, password: newPassword }, token);
    
            if (!updateResponse.ok) {
                alert("No se pudo actualizar la contraseña");
                return;
            }
    
            alert("Contraseña actualizada con éxito");
    
            const modal = Modal.getInstance(updatePasswordModalRef.current);
            if (modal) modal.hide();
    
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            alert("Error al actualizar la contraseña");
        } finally {
            setLoading(false);
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
                                        <h5 className="my-3" id="username">{ userLogged? userLogged.username : <p className="text-muted placeholder-glow mb-0" id="username"><span className="placeholder rounded-3 col-4"></span></p> }</h5>
                                        <div className="text-muted mb-3" id="role">{ userLogged? getRoleName(userLogged.role) : <p className="text-muted placeholder-glow mb-0" id="username"><span className="placeholder rounded-3 col-4"></span></p> }</div>
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

                            <section className="col-lg-8">
                                <div className="card shadow-sm mb-4">
                                    <div className="card-header light-blue-bg">
                                        <p className="mb-0 fs-4">Gestionar perfil de usuario</p>
                                    </div>      
                                    <div className="card-body light-gray-bg">
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Nombre completo</p></div>
                                            <div className="col-sm-9">{ userLogged? ([userLogged.name, userLogged.surname, userLogged.lastname].filter(Boolean).join(" ")) : <p className="text-muted placeholder-glow mb-0" id="fullName"><span className="placeholder rounded-3 col-4"></span></p> }</div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Correo</p></div>
                                            <div className="col-sm-9">{ userLogged? userLogged.email : <p className="text-muted placeholder-glow mb-0" id="email"><span className="placeholder rounded-3 col-4"></span></p> }</div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Contraseña</p></div>
                                            <div className="col-sm-9">{ userLogged? "**********" : <p className="text-muted placeholder-glow mb-0" id="password"><span className="placeholder rounded-3 col-4"></span></p> }</div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Estado</p></div>
                                            <div className="col-sm-9">{ userLogged? (<span className="badge text-bg-success">{userLogged.active === true ? "Activo" : "Inactivo"}</span>) : <p className="text-muted placeholder-glow mb-0" id="status"><span className="placeholder rounded-3 col-4"></span></p> }</div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3"><p className="mb-0">Descripción</p></div>
                                            <div className="col-sm-9">
                                                {userLogged ? (
                                                    userLogged.description && userLogged.description.trim() !== "" 
                                                        ? userLogged.description 
                                                        : "Sin descripción"
                                                ) : (
                                                    <p className="text-muted placeholder-glow mb-0" id="fullName">
                                                        <span className="placeholder rounded-3 col-4"></span>
                                                    </p>
                                                )}
                                            </div>
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
                                            <input type="text" className="form-control" value={formData.name ?? ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                            <label>Nombre(s)</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" value={formData.surname ?? ""} onChange={(e) => setFormData({ ...formData, surname: e.target.value })} />
                                            <label>Apellido paterno</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" value={formData.lastname ?? ""} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
                                            <label>Apellido materno</label>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" value={formData.username ?? ""} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                                            <label>Usuario</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" value={formData.description ?? ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                            <label>Descripción</label>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="col-12 text-end">
                                    <button type="button" className="btn btn-purple-900 w-25" onClick={handleUpdate}>{loading ? (<div className="spinner-border text-light" role="status"><span className="visually-hidden"></span></div>) : (<span>Actualizar</span>)}</button>
                                    <button type="button" className="btn ms-2 btn-outline-secondary w-25" data-bs-dismiss="modal">Cancelar</button>
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
                                                <PasswordInput 
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Contraseña actual"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-sm-6">
                                            <div className="form-floating mb-3">
                                                <PasswordInput 
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Nueva contraseña"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <div className="form-floating mb-3">
                                                <PasswordInput 
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirmar contraseña"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="col-12 text-end">
                                        <button type="button" className="btn btn-purple-900 w-25" onClick={handlePasswordUpdate}>
                                            {loading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : "Actualizar"}
                                        </button>
                                        <button type="button" className="btn ms-2 btn-outline-secondary w-25" data-bs-dismiss="modal">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default InstructorProfile;
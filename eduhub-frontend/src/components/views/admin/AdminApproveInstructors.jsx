import { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Edit, Check } from "react-feather";


const AdminApproveInstructors = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const navbarRef = useRef(null);
    
    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
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
                        <section>
                            <div className="row">
                                <h3 className="text-start">Usuarios</h3>
                            </div>
                            <div className="col-12">
                                <table className="table table-striped table-bordered" >
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Correo electrónico</th>
                                            <th>Rol</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Danna Paola Sanchez Martinez</td>
                                            <td>20213tn039@utez.edu.mx</td>
                                            <td>Administrador</td>
                                            <td>Activo</td>
                                            <td>
                                                <button className="bg-purple-800 text-white text-sm px-2 py-1"><Edit/></button>
                                                <button className="bg-purpleLight text-white text-sm px-2 py-1 ms-1"><Check/></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Astrid Valeria Ventura Gil</td>
                                            <td>20213tn039@utez.edu.mx</td>
                                            <td>Instructor</td>
                                            <td>Activo</td>
                                            <td>
                                                <button className="bg-purple-800 text-white text-sm px-2 py-1"><Edit/></button>
                                                <button className="bg-purpleLight text-white text-sm px-2 py-1 ms-1"><Check/></button>
                                            </td>
                                        </tr>

                                        {/*
                                            <td> {`${user.name} ${user.surname} ${user.lastname}`}</td>
                                            <td> {user.email}</td>
                                            <td> {user.role}</td>
                                            <td> {user.status}</td>
                                            <td>
                                                <button className="bg-purple-800"><Edit/></button>
                                                <button className="bg-purpleLight"></button>
                                            </td>
                                        */}

                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};



export default AdminApproveInstructors;

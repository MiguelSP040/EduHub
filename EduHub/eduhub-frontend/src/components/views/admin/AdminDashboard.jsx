import { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminDashboard = () => {
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
                        <section className="mb-4">
                            <div className="row">
                                <div className="col-12">
                                    <button className="btn col-12 col-sm-2 btn-light">Pendientes</button>
                                    <button className="btn col-12 col-sm-2 my-2 btn-light mx-0 mx-sm-3">En curso</button>
                                    <button className="btn col-12 col-sm-2 btn-light">Finalizados</button>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="row">
                                {[...Array(10)].map((_, index) => (
                                    <div key={index} className="col-12 col-md-4 col-xl-3 mb-4">
                                        <div className="card p-0 text-start">
                                            <img src="https://placehold.co/300x200.png" className="card-img-top" alt="..." />
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h5 className="card-title">Card title</h5>
                                                    <span className="badge text-bg-primary">FREE</span>
                                                </div>
                                                <p className="card-text placeholder-glow mb-0">
                                                    <span className="placeholder col-12"></span>
                                                </p>
                                                <p className="card-text placeholder-glow">
                                                    <span className="placeholder col-6"></span>
                                                </p>
                                                <a href="#" className="btn rounded-5 w-50 btn-purple-900">Acción</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

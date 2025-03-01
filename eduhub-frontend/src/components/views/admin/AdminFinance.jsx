import { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminFinance = () => {
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
                        
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminFinance;
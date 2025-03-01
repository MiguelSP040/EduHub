import { List, Search } from "react-feather";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm fixed-top">
            <div className="container-fluid d-flex align-items-center justify-content-between">

                {/* Izquierda: Botón hamburguesa + Logo */}
                <div className="d-flex align-items-center">
                    <button className="btn btn-light border-0 me-2" onClick={toggleSidebar}>
                        <List size={24} />
                    </button>
                    <a className="navbar-brand ms-2" href="" onClick={ (e) => { e.stopPropagation(); navigate("/admin");} }>
                        <img src="../../../src/assets/img/eduhub-icon.png" alt="brand" height={40} />
                    </a>
                    <a className="text-black" href="" onClick={ (e) => { e.stopPropagation(); navigate("/admin");} }>
                        <h5 className="user-select-none">EduHub Admin</h5>
                    </a>
                </div>

                {/* Derecha: Búsqueda + Imagen usuario */}
                <div className="d-flex align-items-center">
                    <form className="me-3 d-none d-md-block">
                        <div className="input-group">
                            <button className="btn border" type="button">
                                <Search size={16} />
                            </button>
                            <input className="form-control bg-body-tertiary" type="search" placeholder="Buscar..." />
                        </div>
                    </form>
                    <a href="" onClick={ (e) => { e.stopPropagation(); navigate("/profile");} }>
                    <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Usuario" className="rounded-circle d-none d-md-block user-select-none" width="40" height="40"  />
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

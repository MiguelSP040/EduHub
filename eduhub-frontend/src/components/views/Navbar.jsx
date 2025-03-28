import {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';
import { findUserById } from '../../services/userService';
import { List, Search } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import profilePlaceholder from '../../assets/img/profileImage.png';

const Navbar = ({ toggleSidebar }) => {
    const token = localStorage.getItem('token');
    
        const navigate = useNavigate();
        const { user } = useContext(AuthContext);
        const [userLogged, setUserLogger] = useState(null);
    
      useEffect(() => {
        const fetchUserData = async () => {
          if (user?.id) {
            const response = await findUserById(user.id);
            if (response.ok) {
              const data = await response.json();
              setUserLogger(data);
            } else {
              console.error('Error al obtener usuario:', response);
            }
          }
        };
      
        fetchUserData();
      }, [user, token]);
    
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm fixed-top">
            <div className="container-fluid d-flex align-items-center justify-content-between">

                {/* Izquierda: Botón hamburguesa + Logo */}
                <div className="d-flex align-items-center">
                    <button className="btn btn-light border-0 me-2" onClick={toggleSidebar}>
                        <List size={24} />
                    </button>
                    <a className="navbar-brand ms-2" href="" onClick={ (e) => { e.stopPropagation(); navigate("/instructor");} }>
                        <img src="../../../src/assets/img/eduhub-icon.png" alt="brand" height={40} />
                    </a>
                    <a className="text-black" href="" onClick={ (e) => { e.stopPropagation(); navigate("/instructor");} }>
                        <h5 className="user-select-none">EduHub</h5>
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
                    <img src={userLogged?.profileImage ? `data:image/jpeg;base64,${userLogged.profileImage}` : profilePlaceholder} alt="avatar" className="rounded-circle d-none d-md-block user-select-none"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

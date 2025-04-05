import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import profilePlaceholder from '../../assets/img/profileImage.png';
import eduhubIcon from '../../assets/img/eduhub-icon.png';
import { List, Search } from 'react-feather';
import { findUserById } from '../../services/userService';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  useEffect(() => {
    if (user && !user.profileImage) {
      const storedImage = localStorage.getItem('profileImage');
      if (storedImage) {
        updateUser({ profileImage: storedImage });
      } else {
        const fetchProfileImage = async () => {
          try {
            const data = await findUserById(user.id);
            if (data.profileImage) {
              updateUser({ profileImage: data.profileImage });
              localStorage.setItem('profileImage', data.profileImage);
            }
          } catch (error) {
            console.error('Error fetching profile image:', error);
          }
        };
        fetchProfileImage();
      }
    }
  }, [user, updateUser]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm fixed-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Izquierda: Botón hamburguesa + Logo */}
        <div className="d-flex align-items-center">
          <button className="btn btn-light border-0 me-2" onClick={toggleSidebar}>
            <List size={24} />
          </button>
          <a
            className="navbar-brand ms-2"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/instructor');
            }}
          >
            <img src={eduhubIcon} alt="brand" height={40} />
          </a>
          <a
            className="text-black"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/instructor');
            }}
          >
            <h5 className="user-select-none text-gray">EduHub</h5>
          </a>
        </div>

        {/* Derecha: Búsqueda + Imagen usuario */}
        <div className="d-flex align-items-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/profile');
            }}
          >
            <img src={user && user.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : profilePlaceholder} alt="avatar" className="rounded-circle d-none d-md-block user-select-none" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

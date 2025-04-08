import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import profilePlaceholder from '../../../assets/img/profileImage.png';
import eduhubIcon from '../../../assets/img/eduhub-icon.png';
import { List } from 'react-feather';
import { findUserById } from '../../../services/userService';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);
  const [isHovered, setHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const cardRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleName = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_INSTRUCTOR':
        return 'Instructor';
      case 'ROLE_STUDENT':
        return 'Estudiante';
      default:
        return role;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm fixed-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* IZQUIERDA: Botón hamburguesa + Logo */}
        <div className="d-flex align-items-center">
          <button className="btn btn-light border-0 me-2" onClick={toggleSidebar}>
            <List size={24} />
          </button>
          <a
            className="navbar-brand ms-2"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
          >
            <img src={eduhubIcon} className='user-select-none' alt="brand" height={40} />
          </a>
          <a
            className="text-black"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
          >
            <h5 className="user-select-none text-gray">EduHub Admin</h5>
          </a>
        </div>

        {/* DERECHA */}
        <div className="d-flex align-items-center">
          <div className="d-flex d-sm-none align-items-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/profileAdmin');
              }}
            >
              <img src={user && user.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : profilePlaceholder} alt="avatar" className="rounded-circle user-select-none" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
            </a>
          </div>

          <div className="d-none d-sm-flex align-items-center position-relative" ref={cardRef}>
            <div
              className="d-none d-sm-flex align-items-center rounded border px-2 py-1"
              style={{
                cursor: 'pointer',
                background: '#f8f9fa',
                transition: 'width 0.3s ease',
                width: isHovered || showDropdown ? '300px' : '94px',
                justifyContent: 'space-between',
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {/* Contenedor izquierdo: caret + texto animado */}
              <div className="d-flex align-items-center">
                {/* Ícono de caret */}
                <div className="me-2" style={{ fontSize: '1.25rem' }}>
                  {showDropdown ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}
                </div>
                <div
                  className="me-2 text-start"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    transition: 'max-width 0.3s ease, opacity 0.3s ease',
                    maxWidth: isHovered || showDropdown ? '200px' : '0px',
                    opacity: isHovered || showDropdown ? 1 : 0,
                  }}
                >
                  <div className="fw-semibold small text-dark user-select-none">
                    {user?.name} {user?.surname} {user?.lastname}
                  </div>
                  <div className="text-muted small user-select-none">{getRoleName(user?.role)}</div>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <img src={user?.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : profilePlaceholder} alt="avatar" className="rounded-circle user-select-none" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
              </div>
            </div>

            {showDropdown && (
              <div className="position-absolute end-0 p-3 bg-white border rounded shadow" style={{ zIndex: 10, top: 'calc(100% + 10px)' }}>
                <img src={eduhubIcon} alt="brand" height={50} />
                <p className="mb-1 fw-semibold">
                  {user?.name} {user?.surname} {user?.lastname}
                </p>
                <p className="mb-1 small text-muted">{getRoleName(user?.role)}</p>
                <p className="mb-2 small text-muted">{user?.email}</p>
                <button className="btn btn-sm btn-purple-900 w-100" onClick={() => navigate('/profileAdmin')}>
                  Gestionar tu perfil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

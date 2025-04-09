import React, { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import ImageQR from '../../../assets/img/qr_eduhub.svg'
import eduhubIcon from '../../../assets/img/eduhub-icon.png';

export default function StudentDownload() {
  const { logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="bg-main">

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow-1">

        <div className="overflow-auto vh-100">
          <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm fixed-top">
            <div className="container-fluid d-flex align-items-center justify-content-between">
              {/* IZQUIERDA: Botón hamburguesa y Logo */}
              <div className="d-flex align-items-center">

                <a
                  className="navbar-brand ms-2"
                  href=""
                >
                  <img src={eduhubIcon} className='user-select-none' alt="brand" height={40} />
                </a>
                <a
                  className="text-black"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/instructor');
                  }}
                >
                  <h5 className="user-select-none">EduHub</h5>
                </a>
              </div>

              <div className="d-flex align-items-center">
                
                <button className='btn btn-purple-900' onClick={handleLogout}>
                <span className='me-2'>Cerrar Sesión</span>
                  <i className="bi bi-power"></i>
                </button>
              </div>
            </div>
          </nav>

          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            <div className='row'>
              <div className="col-12 d-flex justify-content-center">
                <div className="card" style={{ width: '25rem' }}>
                  <img src={ImageQR} height={240} className="card-img-top" alt={'Hola'} />
                  <div className="card-body">
                    <h5 className="card-title">Descarga la aplicación</h5>
                    <p className="card-text">Escanea este código QR para descargar la aplicación en tu dispositivo móvil y poder unirte a los cursos.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

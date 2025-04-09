import { useState, useRef, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { updateProfile, findUserById } from '../../../services/userService';
import { verifyPassword } from '../../../services/authService';
import { useToast } from '../../utilities/ToastProvider';
import { useConfirmDialog } from '../../utilities/ConfirmDialogsProvider';
import PasswordInput from '../../PasswordInputRegister';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import profilePlaceholder from '../../../assets/img/profileImage.png';
import { Modal } from 'bootstrap';

const InstructorProfile = () => {
  const { showSuccess, showError, showWarn } = useToast();
  const { confirmAction } = useConfirmDialog();

  const { user, updateUser } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const [userLogged, setUserLogger] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    surname: '',
    lastname: '',
    username: '',
    description: '',
  });
  const [errors, setErrors] = useState({ name: false, surname: false, lastname: false, username: false, description: false });
  const [touched, setTouched] = useState({ name: false, surname: false, lastname: false, username: false, description: false });
  const cameraModalRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newProfileFile, setNewProfileFile] = useState(null);

  const updatePasswordModalRef = useRef(null);
  const updateUserModalRef = useRef(null);
  const fileInputRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const data = await findUserById(user.id);
          setUserLogger(data);
        } catch (error) {
          console.error('Error al obtener usuario:', error);
        }
      }
    };

    fetchUserData();
  }, [user, token]);

  useEffect(() => {
    if (userLogged) {
      setFormData({
        id: userLogged.id || '',
        name: userLogged.name || '',
        surname: userLogged.surname || '',
        lastname: userLogged.lastname || '',
        username: userLogged.username || '',
        description: userLogged.description || '',
      });
    }
  }, [userLogged]);

  const getRoleName = (role) => {
    const roleMap = {
      ROLE_ADMIN: 'Administrador',
      ROLE_INSTRUCTOR: 'Instructor',
    };
    return roleMap[role] || null;
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const openModal = (modalRef) => {
    if (modalRef.current) {
      const modal = new Modal(modalRef.current);
      modal.show();
    }
  };

  const validateInput = (field, value) => {
    let isValid = true;

    switch (field) {
      case 'name':
      case 'surname':
      case 'lastname':
        isValid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(value); // Solo letras
        break;
      case 'username':
        isValid = /^[a-zA-Z0-9]+$/.test(value); // Letras y números
        break;
      case 'description':
        isValid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value); // Letras y espacios
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: !isValid }));
  };

  const handleBlur = (field) => {
    setTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  const handleUpdate = async () => {
    if (Object.values(errors).some((error) => error)) {
      showWarn('Campos inválidos', 'Por favor, corrige los errores antes de continuar');
      return;
    }

    const usernameChanged = userLogged?.username && formData.username !== userLogged.username;

    if (usernameChanged) {
      confirmAction({
        message: 'Has cambiado tu nombre de usuario. Si continúas, se cerrará la sesión actual. ¿Deseas continuar?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, continuar',
        rejectLabel: 'Cancelar',
        acceptClassName: 'p-confirm-dialog-accept',
        rejectClassName: 'p-confirm-dialog-reject',
        onAccept: async () => {
          setLoading(true);

          try {
            const response = await updateProfile(formData);

            if (!response.ok) {
              showError('Error', 'Error de conexión con el servidor');
              return;
            }

            showSuccess('Actualización exitosa', 'Actualización completada con éxito');

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          } catch (error) {
            console.error(`Error al actualizar el perfil ${error}`);
            showError('Error', 'No se pudo actualizar el perfil de usuario');
          } finally {
            setLoading(false);
          }
        },
      });
      return; 
    }

    setLoading(true);

    try {
      const response = await updateProfile(formData);

      if (!response.ok) {
        showError('Error', 'Error de conexión con el servidor');
        return;
      }

      showSuccess('Actualización exitosa', 'Actualización completada con éxito');

      setUserLogger((prevState) => ({
        ...prevState,
        ...formData,
      }));

      const modal = Modal.getInstance(updateUserModalRef.current);
      if (modal) modal.hide();
    } catch (error) {
      console.error(`Error al actualizar el perfil ${error}`);
      showError('Error', 'No se pudo actualizar el perfil de usuario');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = () => {
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      showWarn('Campos obligatorios', 'Todos los campos son obligatorios');
      return;
    }
    if (newPassword !== confirmPassword) {
      showWarn('Contraseñas no coinciden', 'Las contraseñas no son iguales');
      return;
    }
  
    
    confirmAction({
      message: '¿Estás seguro que deseas actualizar tu contraseña?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, actualizar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-confirm-dialog-accept', 
      rejectClassName: 'p-confirm-dialog-reject', 
      onAccept: async () => {
        setLoading(true);
        try {
          const verifyResponse = await verifyPassword({
            user: user.username,
            password: currentPassword
          });
          if (!verifyResponse.ok) {
            showError('Error', 'Contraseña actual incorrecta');
            return;
          }
  
          
          const updateResponse = await updateProfile(
            { id: user.id, password: newPassword }
          );
          if (!updateResponse.ok) {
            showError('Error', 'No se pudo actualizar la contraseña');
            return;
          }
          showSuccess('Contraseña actualizada', 'Tu contraseña ha sido cambiada exitosamente');
          
        
          const modal = Modal.getInstance(updatePasswordModalRef.current);
          if (modal) modal.hide();
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } catch (error) {
          console.error('Error al actualizar la contraseña:', error);
          showError('Error', 'Error al actualizar la contraseña');
        } finally {
          setLoading(false);
        }
      }
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileFile(file);
    }
  };

  const handleSaveProfileImage = async () => {
    if (!newProfileFile) {
      showWarn('No hay archivo', 'Primero selecciona un archivo');
      return;
    }
    setLoading(true);
    try {
      const base64Image = await readFileAsBase64(newProfileFile);
      const updatedUser = {
        id: userLogged.id,
        profileImage: base64Image,
      };
      const response = await updateProfile(updatedUser);
      if (!response.ok) {
        showError('Error', 'No se pudo actualizar la foto de perfil');
        return;
      }
      showSuccess('Foto actualizada', 'Se ha cambiado tu foto de perfil exitosamente');
      updateUser({ profileImage: base64Image });
      localStorage.setItem('profileImage', base64Image);
      setUserLogger((prev) => ({
        ...prev,
        profileImage: base64Image,
      }));
      const modal = Modal.getInstance(cameraModalRef.current);
      if (modal) modal.hide();
    } catch (error) {
      console.error('Error al actualizar foto de perfil:', error);
      showError('Error', 'Error al actualizar la foto de perfil');
    } finally {
      setLoading(false);
      setNewProfileFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  return (
    <div className="bg-main">
      {/* SIDEBAR */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />

      {/* CONTENEDOR PRINCIPAL (NAVBAR + MAIN) */}
      <div className="flex-grow-1">
        {/* NAVBAR */}
        <div ref={navbarRef}>
          <Navbar toggleSidebar={toggleSidebar} />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            <div className="row">
              {/* Sección de Perfil */}
              <section className="col-lg-4">
                <div className="card shadow-sm mb-4">
                  <div className="card-body light-gray-bg text-center">
                    <div className="position-relative">
                      <img
                        src={userLogged?.profileImage ? `data:image/jpeg;base64,${userLogged.profileImage}` : profilePlaceholder}
                        alt="avatar"
                        className="rounded-circle img-fluid border border-4 border-blue p-1"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                      {/* Botón de cámara en posición absoluta */}
                      <button type="button" className="btn btn-blue-600 text-white rounded-circle position-absolute" style={{ bottom: '0px', right: 'calc(50% - 70px)' }} onClick={() => openModal(cameraModalRef)}>
                        <i className="bi bi-pencil-square" />
                      </button>
                    </div>
                    <h5 className="my-3" id="username">
                      {userLogged ? (
                        userLogged.username
                      ) : (
                        <p className="text-muted placeholder-glow mb-0" id="username">
                          <span className="placeholder rounded-3 col-4"></span>
                        </p>
                      )}
                    </h5>
                    <div className="text-muted mb-3" id="role">
                      {userLogged ? (
                        getRoleName(userLogged.role)
                      ) : (
                        <p className="text-muted placeholder-glow mb-0" id="username">
                          <span className="placeholder rounded-3 col-4"></span>
                        </p>
                      )}
                    </div>
                    <div className="mb-2">
                      <button type="button" className="btn btn-purple-900 mb-2" onClick={() => openModal(updateUserModalRef)}>
                        <i className="bi bi-pencil-square"></i> Editar
                      </button>
                      <button type="button" className="btn btn-purple-400 ms-1 mb-2" onClick={() => openModal(updatePasswordModalRef)}>
                        <i className="bi bi-shield-lock"></i> Cambiar contraseña
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
                      <div className="col-sm-3">
                        <p className="mb-0 text">Nombre completo</p>
                      </div>
                      <div className="col-sm-9">
                        {userLogged ? (
                          [userLogged.name, userLogged.surname, userLogged.lastname].filter(Boolean).join(' ')
                        ) : (
                          <p className="text-muted placeholder-glow mb-0" id="fullName">
                            <span className="placeholder rounded-3 col-4"></span>
                          </p>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Correo</p>
                      </div>
                      <div className="col-sm-9">
                        {userLogged ? (
                          userLogged.email
                        ) : (
                          <p className="text-muted placeholder-glow mb-0" id="email">
                            <span className="placeholder rounded-3 col-4"></span>
                          </p>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Contraseña</p>
                      </div>
                      <div className="col-sm-9">
                        {userLogged ? (
                          '**********'
                        ) : (
                          <p className="text-muted placeholder-glow mb-0" id="password">
                            <span className="placeholder rounded-3 col-4"></span>
                          </p>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Estado</p>
                      </div>
                      <div className="col-sm-9">
                        {userLogged ? (
                          <span className="badge text-bg-success">{userLogged.active === true ? 'Activo' : 'Inactivo'}</span>
                        ) : (
                          <p className="text-muted placeholder-glow mb-0" id="status">
                            <span className="placeholder rounded-3 col-4"></span>
                          </p>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Descripción</p>
                      </div>
                      <div className="col-sm-9">
                        {userLogged ? (
                          userLogged.description && userLogged.description.trim() !== '' ? (
                            userLogged.description
                          ) : (
                            'Sin descripción'
                          )
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
                      <input
                        type="text"
                        className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, name: value });
                          validateInput('name', value);
                        }}
                        onBlur={() => handleBlur('name')}
                      />
                      <label>Nombre(s)</label>
                      {touched.name && errors.name && <div className="invalid-feedback">Solo se permiten letras.</div>}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className={`form-control ${touched.surname && errors.surname ? 'is-invalid' : ''}`}
                        value={formData.surname}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, surname: value });
                          validateInput('surname', value);
                        }}
                        onBlur={() => handleBlur('surname')}
                      />
                      <label>Apellido paterno</label>
                      {touched.surname && errors.surname && <div className="invalid-feedback">Solo se permiten letras.</div>}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className={`form-control ${touched.lastname && errors.lastname ? 'is-invalid' : ''}`}
                        value={formData.lastname}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, lastname: value });
                          validateInput('lastname', value);
                        }}
                        onBlur={() => handleBlur('lastname')}
                      />
                      <label>Apellido materno</label>
                      {touched.lastname && errors.lastname && <div className="invalid-feedback">Solo se permiten letras.</div>}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                        value={formData.username}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, username: value });
                          validateInput('username', value);
                        }}
                        onBlur={() => handleBlur('username')}
                      />
                      <label>Usuario</label>
                      {touched.username && errors.username && <div className="invalid-feedback">Solo se permiten letras y números.</div>}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                        value={formData.description}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, description: value });
                          validateInput('description', value);
                        }}
                        onBlur={() => handleBlur('description')}
                      />
                      <label>Descripción</label>
                      {touched.description && errors.description && <div className="invalid-feedback">Solo se permiten letras y espacios.</div>}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="col-12 text-end">
                  <button type="button" className="btn btn-purple-900 w-25" onClick={handleUpdate} disabled={loading}>
                    {loading ? (
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden"></span>
                      </div>
                    ) : (
                      'Actualizar'
                    )}
                  </button>
                  <button type="button" className="btn ms-2 btn-outline-secondary w-25" data-bs-dismiss="modal">
                    Cancelar
                  </button>
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
                      <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Contraseña actual" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <div className="form-floating mb-3">
                      <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nueva contraseña" />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-floating mb-3">
                      <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar contraseña" />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="col-12 text-end">
                  <button type="button" className="btn btn-purple-900 w-25" onClick={handlePasswordUpdate}>
                    {loading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : 'Actualizar'}
                  </button>
                  <button type="button" className="btn ms-2 btn-outline-secondary w-25" data-bs-dismiss="modal">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CAMBIAR FOTO DE PERFIL */}
      <div className="modal fade" ref={cameraModalRef} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title">Cambiar foto de perfil</h5>
              <hr />
              <div className="mb-3">
                <label htmlFor="newProfileImage" className="form-label fw-bold">
                  Seleccionar imagen
                </label>
                <input type="file" id="newProfileImage" className="form-control" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
              </div>
              <div className="text-end">
                <button type="button" className="btn btn-purple-900" onClick={handleSaveProfileImage} disabled={loading}>
                  {loading ? <div className="spinner-border spinner-border-sm text-light"></div> : 'Guardar'}
                </button>
                <button type="button" className="btn ms-2 btn-outline-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;

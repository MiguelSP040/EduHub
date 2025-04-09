import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './utilities/ToastProvider';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/authService';
import PasswordInput from './PasswordInput';

const Login = ({ setView }) => {
  const { showSuccess, showError, showWarn } = useToast();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));

    if (token && userData?.role) {
      navigate(userData.role === 'ROLE_ADMIN' ? '/admin' : '/instructor');
    }
  }, [navigate]);

  const isDisabled = !user.trim() || !password.trim();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await login(user, password);

      if (!response || !response.statusCode) {
        showError('Error', 'Error en la autenticación. Intenta de nuevo');
        return;
      }

      if (response.statusCode === 'NOT_FOUND' || response.statusCode === 'UNAUTHORIZED') {
        showError('Error', 'Usuario o contraseña incorrectos');
        return;
      }

      if (response.statusCode === 'FORBIDDEN') {
        showWarn('Usuario no verificado', 'Tu cuenta no ha sido verificada por un administrador');
        return;
      }

      if (response.statusCode !== 'OK') {
        showError('Error', 'Error inesperado. Intenta de nuevo');
        return;
      }

      const { token, user: userData } = response.body;

      if (!token || !userData) {
        showError('Error', 'Error en la autenticación. Intenta de nuevo');
        return;
      }

      // Guardar usuario y token en el contexto y localStorage
      loginUser({ ...userData, token });

      // Redirigir según el rol
      switch (userData.role) {
        case 'ROLE_ADMIN':
          showSuccess('Bienvenido Administrador', `¡Qué gusto verte, ${userData.name}!`)
          navigate('/admin');
          break;
        case 'ROLE_INSTRUCTOR':
          showSuccess('Bienvenido', `¡Qué gusto verte, ${userData.name}!`)
          navigate('/instructor');
          break;
        case 'ROLE_STUDENT':
          showSuccess('Bienvenido', `¡Qué gusto verte, ${userData.name}!`)
          navigate('/student/download');
          break;
        default:
          showWarn('Rol desconocido', 'Contacta con el administrador.');
          navigate('/');
      }
    } catch (error) {
      showError('Error', 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center">
      <h5 className="fw-bold text-gray-600">¡Hola de nuevo!</h5>
      <form onSubmit={(e) => { e.preventDefault();
          if (!isDisabled && !loading) {
            handleLogin();
          }
        }}
      >
        <div className="row">
          <div className="col-12">
            <input type="text" className="form-control border-0 my-4 input-with-icon user-icon" placeholder="Usuario o Correo" value={user} onChange={(e) => setUser(e.target.value)} required />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="w-100 text-end text-blue mt-1">
              <a onClick={() => setView('recover')} className="text-decoration-underline" style={{ cursor: 'pointer' }} title='Haz click aquí para recuperar tu cuenta'>
                <small>¿Olvidaste tu contraseña?</small>
              </a>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-purple-900 w-100 text-white mt-5 fw-bold" onClick={handleLogin} disabled={isDisabled || loading}>
          {loading ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden"></span>
            </div>
          ) : (
            'Iniciar sesión'
          )}
        </button>
      </form>
      <p className="text-danger mt-4">
        <small>O registrate</small>
      </p>
      <button className="btn btn-purple-400 mt-2 w-100  fw-bold" onClick={() => setView('registerStep1')}>
        ¿No tienes cuenta?
      </button>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { useToast } from './utilities/ToastProvider';
import { registerUser } from '../services/authService';
import RoleSelector from './RoleSelector';
import PasswordInput from './PasswordInputRegister';

const RegisterStep2 = ({ setView, formData, setFormData }) => {
  const { showSuccess, showError, showWarn } = useToast();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false, confirmPassword: false });
  const [touched, setTouched] = useState({ username: false, password: false, confirmPassword: false });

  const isDisabled =
    !formData.username.trim() ||
    !formData.password.trim() ||
    !confirmPassword.trim() ||
    !formData.role ||
    Object.values(errors).some((error) => error);

  const validateInput = (field, value) => {
    let isValid = true;

    switch (field) {
      case 'username':
        isValid = /^[a-zA-Z0-9]+$/.test(value); // Solo letras y números
        break;
      case 'password':
        isValid = /^[^\s]+$/.test(value); // No permite espacios
        break;
      case 'confirmPassword':
        isValid = value === formData.password; // Debe coincidir con la contraseña
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: !isValid }));
  };

  const handleBlur = (field) => {
    setTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  const handleRegister = async () => {
    if (isDisabled) return;
    setLoading(true);

    try {
      let userData = { ...formData };
      userData.isActive = formData.role !== 'ROLE_INSTRUCTOR';

      if (!formData.username || !formData.password || !confirmPassword || !formData.role) {
        showWarn('Campos obligatorios', 'Todos los campos son obligatorios');
        return;
      }

      if (formData.password !== confirmPassword) {
        showWarn('Error', 'Las contraseñas no coinciden');
        return;
      }

      if (formData.password.length < 8) {
        showWarn('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres');
        return;
      }

      const result = await registerUser(userData);

      if (result.status === 409) {
        showError('Error', 'Hubo un conflicto con el servidor. Vuelve a intentarlo');
        return;
      }

      if (result.status !== 200) {
        showError('Error', result.message);
        return;
      }

      showSuccess('Registro exitoso', 'Registro completado con éxito');
      setFormData({
        name: '',
        surname: '',
        email: '',
        username: '',
        password: '',
        role: '',
        isActive: false,
      });
      setView('login');
    } catch (error) {
      showError('Error', 'No se pudo conectar con el servidor. Intenta más tarde');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setFormData({
      ...formData,
      username: '',
      password: '',
      role: '',
    });
    setView('registerStep1');
  };

  return (
    <div className="">
      <div className="text-start">
        <button className="btn btn-outline-secondary mb-3 mt-2 rounded-3 position-absolute top-0" onClick={handleBack}>
          <i className="bi bi-arrow-left"></i>
        </button>
      </div>

      <h5 className="fw-bold text-gray-600">¿Cómo te gustaría que te llamemos?</h5>
      <input
        type="text"
        className={`form-control my-3 ${
          touched.username
            ? errors.username
              ? 'is-invalid'
              : formData.username.trim() !== ''
              ? 'is-valid'
              : ''
            : ''
        }`}
        placeholder="Apodo"
        value={formData.username}
        onChange={(e) => {
          const value = e.target.value;
          setFormData({ ...formData, username: value });
          validateInput('username', value);
        }}
        onBlur={() => handleBlur('username')}
        required
      />
      {touched.username && errors.username && <div className="invalid-feedback">El apodo solo puede contener letras y números.</div>}

      <div className="mb-2">
        <small className="text-blue-600">Piensa en una contraseña segura</small>
      </div>

      <PasswordInput
        value={formData.password}
        onChange={(e) => {
          const value = e.target.value;
          setFormData({ ...formData, password: value });
          validateInput('password', value);
        }}
        placeholder="Contraseña"
        className={`form-control mb-3 ${
          touched.password
            ? errors.password
              ? 'is-invalid'
              : formData.password.trim() !== ''
              ? 'is-valid'
              : ''
            : ''
        }`}
        onBlur={() => handleBlur('password')}
      />
      {touched.password && errors.password && <div className="invalid-feedback">La contraseña no debe contener espacios.</div>}

      <PasswordInput
        value={confirmPassword}
        onChange={(e) => {
          const value = e.target.value;
          setConfirmPassword(value);
          validateInput('confirmPassword', value);
        }}
        placeholder="Confirmar Contraseña"
        className={`form-control mb-3 ${
          touched.confirmPassword
            ? errors.confirmPassword
              ? 'is-invalid'
              : confirmPassword.trim() !== ''
              ? 'is-valid'
              : ''
            : ''
        }`}
        onBlur={() => handleBlur('confirmPassword')}
      />
      {touched.confirmPassword && errors.confirmPassword && <div className="invalid-feedback">Las contraseñas no coinciden.</div>}

      <div className="border-bottom border-white border-2 my-3"></div>
      <RoleSelector setFormData={setFormData} />

      <button className="btn btn-purple-900 w-100 text-white mt-4 fw-bold" onClick={handleRegister} disabled={isDisabled || loading}>
        {loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only"></span>
          </div>
        ) : (
          'Crear mi cuenta'
        )}
      </button>
    </div>
  );
};

export default RegisterStep2;
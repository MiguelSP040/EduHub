import { useState } from 'react';
import { useToast } from './utilities/ToastProvider';
import { registerUser } from '../services/authService';
import RoleSelector from './RoleSelector';
import PasswordInput from './PasswordInputRegister';

const RegisterStep2 = ({ setView, formData, setFormData }) => {
  const { showSuccess, showError, showWarn } = useToast();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isDisabled = !formData.username.trim() || !formData.password.trim() || !confirmPassword.trim() || !formData.role;

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
      console.log(userData);
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
      <input type="text" className="form-control my-3" placeholder="Apodo" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
      <div className="mb-2">
        <small className="text-blue-600">Piensa en una contraseña segura</small>
      </div>

      <PasswordInput value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Contraseña" />

      <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar Contraseña" />

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

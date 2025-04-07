import { useState } from 'react';
import { requestPasswordReset } from '../services/authService';
import { useToast } from './utilities/ToastProvider';

const Recover = ({ setView }) => {
  const { showSuccess, showWarn } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecover = async () => {
    if (!email.trim()) {
      showWarn('Campo requerido', 'Por favor ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);

    try {
      await requestPasswordReset(email);
    } catch (error) {
      showError('Error', 'Error de conexión con el servidor');
    } finally {
      showSuccess('Recuperación', 'Se envió un enlace a tu correo.');
      setView('login')
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView('login');
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="text-start">
          <button className="btn btn-outline-secondary mb-3 mt-2 rounded-3 position-absolute top-0" onClick={handleBack}>
            <i className="bi bi-arrow-left"></i>
          </button>
        </div>
        <h4 className="fw-bold text-gray-600 text-center">Recuperar contraseña</h4>
        <p className="mt-5">Ingrese el correo electrónico asociado a su cuenta de <span className='fw-semibold'>EduHub</span></p>

        <input type="email" className="form-control mt-3" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />

        <p className="mt-3 fw-semibold text-danger">No compartas el enlace de recuperación con nadie.</p>

        <button className="btn btn-purple-900 w-100 text-white mt-3 fw-bold" onClick={handleRecover} disabled={loading}>
          {loading ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          ) : (
            'Enviar'
          )}
        </button>
      </div>
    </div>
  );
};

export default Recover;

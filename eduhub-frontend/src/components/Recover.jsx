import { useState } from 'react';
import { requestPasswordReset } from '../services/authService';

const Recover = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRecover = async () => {
    if (!email.trim()) {
      alert('Por favor ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);

    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message || 'Revisa tu correo para recuperar tu contraseña.');
      setSuccess(true);
    } catch (error) {
      setMessage('Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
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
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
        <h5 className="fw-bold text-gray-600 text-center">Recuperar contraseña</h5>

        {success ? (
          <>
            <p className="mt-4 text-center text-success">El correo de recuperación ha sido enviado exitosamente. Revisa tu bandeja de entrada y sigue las instrucciones.</p>
            <button className="btn btn-purple-900 w-100 text-white mt-3 fw-bold" onClick={() => setView('login')}>
              Volver al login
            </button>
          </>
        ) : (
          <>
            <input type="email" className="form-control mt-3" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            <button className="btn btn-purple-900 w-100 text-white mt-3 fw-bold" onClick={handleRecover} disabled={loading}>
              {loading ? (
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              ) : (
                'Enviar'
              )}
            </button>
            {message && <p className="mt-3 text-info text-center">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Recover;

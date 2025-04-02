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
    setView("login");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="text-start">
          <button className="btn btn-outline-secondary mb-3 mt-2 rounded-3 position-absolute top-0" onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
            </svg>
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

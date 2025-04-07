import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { useToast } from "./utilities/ToastProvider";
import PasswordInput from "./PasswordInput";

const ResetPassword = () => {
  const { showSuccess, showWarn, showError } = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");

  const isDisabled = !newPassword.trim() || !confirmPassword.trim();

  const handleReset = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      showWarn("Campos requeridos", "Ingresa y confirma tu nueva contraseña.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showWarn("Campos inválidos", "Las contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 8) {
      showWarn('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      showSuccess("Contraseña restablecida", "Serás redirigido en 3 seg...");
      setRedirecting(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      showError("Error", "Error al actualizar la contraseña.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isDisabled && !loading && !redirecting) {
      handleReset();
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h5 className="fw-bold text-gray-600 text-center mb-5">Restablecer contraseña</h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 mb-3">
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-purple-900 w-100 text-white mt-5 fw-bold"
            disabled={loading || redirecting || isDisabled}
          >
            {loading || redirecting ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden"></span>
              </div>
            ) : (
              "Restablecer contraseña"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

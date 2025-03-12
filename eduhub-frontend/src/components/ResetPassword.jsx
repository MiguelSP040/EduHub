import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import PasswordInput from "./PasswordInput";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    console.log("Token recibido:", token);
  }, [token]);

  const handleReset = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      alert("Ingresa y confirma tu nueva contraseña.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message || "Contraseña actualizada correctamente.");
      setRedirecting(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setMessage("Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h5 className="fw-bold text-gray-600 text-center">Restablecer contraseña</h5>
        <form>
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
            type="button"
            className="btn btn-purple-900 w-100 text-white mt-4 fw-bold"
            onClick={handleReset}
            disabled={loading || redirecting}
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

        {message && <p className="mt-3 text-info text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;

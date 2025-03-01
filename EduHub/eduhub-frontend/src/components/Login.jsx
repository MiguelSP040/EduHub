import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login } from "../services/authService";
import PasswordInput from "./PasswordInput";

const Login = ({ setView }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const isDisabled = !user.trim() || !password.trim();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await login(user, password);

      if (!response || response.statusCode !== "OK") {
        alert("Usuario o contraseña incorrectos");
        return;
      }

      const { token, user: userData } = response.body;

      if (!token || !userData) {
        alert("Error en la autenticación. Intenta de nuevo.");
        return;
      }

      // Guardar usuario y token en el contexto y localStorage
      loginUser({ ...userData, token });

      // Redirigir según el rol
      switch (userData.role) {
        case "ROLE_ADMIN":
          navigate("/admin");
          break;
        case "ROLE_STUDENT":
          navigate("/student");
          break;
        case "ROLE_INSTRUCTOR":
          navigate("/instructor");
          break;
        default:
          alert("Rol desconocido. Contacta con el administrador.");
          navigate("/");
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center">
      <h5 className="fw-bold text-gray-600">¡Hola de nuevo!</h5>
      <form>
        <div className="row">
          <div className="col-12">
            <input
              type="text"
              className="form-control border-0 my-4 input-with-icon user-icon"
              placeholder="Usuario o Correo"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="w-100 text-end mt-3">
              <a onClick={() => setView("recover")} className="text-decoration-none">
                <small>Olvidé mi contraseña</small>
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-purple-900 w-100 text-white mt-4 fw-bold"
          onClick={handleLogin}
          disabled={isDisabled || loading}
        >
          {loading ? (
            <div className="spinner-border text-light" role="status">
              <span className="sr-only"></span>
            </div>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </form>
      <p className="text-danger mt-4"><small>O registrate</small></p>
      <button
        className="btn btn-purple-400 w-100 mt-2 fw-bold"
        onClick={() => setView("registerStep1")}
      >
        ¿No tienes cuenta?
      </button>
    </div>
  );
};

export default Login;

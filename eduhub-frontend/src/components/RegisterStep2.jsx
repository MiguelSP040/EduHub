import { useState } from "react";
import { registerUser } from "../services/authService";
import RoleSelector from "./RoleSelector";
import PasswordInput from "./PasswordInputRegister";

const RegisterStep2 = ({ setView, formData, setFormData }) => {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const isDisabled = !formData.username.trim() || !formData.password.trim() || !confirmPassword.trim() || !formData.role;

    const handleRegister = async () => {
        if (isDisabled) return;

        setLoading(true);
        const response = await registerUser(formData);

        try {
            if (!formData.username || !formData.password || !confirmPassword || !formData.role) {
                alert("Todos los campos son obligatorios");
                return;
            }

            if (formData.password !== confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }

            if (!response) {
                alert("Error de conexión con el servidor.");
                return;
            }

            alert("Registro completado con éxito");
            console.log(formData);
            setView("login");
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("No se pudo conectar con el servidor. Intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setFormData({ 
            ...formData,
            username: "",
            password: "",
            role: "",
        });
        setView("registerStep1");
    }

    return (
        <div className="">
            <div className="text-start">
                <button className="btn btn-outline-secondary mb-3 mt-2 rounded-3 position-absolute top-0" onClick={handleBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"/>
                </svg>
                </button>
            </div>

            <h5 className="fw-bold text-gray-600">¿Cómo te gustaría que te llamemos?</h5>
            <input
                type="text"
                className="form-control my-3"
                placeholder="Apodo"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
            />
            <div className="mb-2"><small className="text-blue-600">Piensa en una contraseña segura</small></div>
                        
            <PasswordInput
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Contraseña"
            />

            <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Contraseña"
            />

            <div className="border-bottom border-white border-2 my-3"></div>
            <RoleSelector setFormData={setFormData} />
            
            <button 
                className="btn btn-purple-900 w-100 text-white mt-4 fw-bold" 
                onClick={handleRegister}
                disabled={isDisabled || loading}
            >
                {loading ? (
                    <div className="spinner-border text-light" role="status">
                        <span className="sr-only"></span>
                    </div>
                ) : (
                    "Crear mi cuenta"
                )}
            </button>
        </div>
    );
};

export default RegisterStep2;

import { useState } from "react";

const RegisterStep1 = ({ setView, formData, setFormData }) => {
    const [loading, setLoading] = useState(false);
    const isDisabled = !formData.name.trim() || !formData.surname.trim() || !formData.email.trim();

    const handleNext = async () => {
        if (isDisabled) return;

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve));

        try {
            if (!formData.name || !formData.surname || !formData.email) {
                alert("Todos los campos son obligatorios");
                return;
            }

            // Separar apellidos
            const surnameParts = formData.surname.trim().split(" ");
            const surname = surnameParts.shift() || "";
            const lastname = surnameParts.join(" ") || "";

            setFormData({ 
                ...formData, 
                surname, 
                lastname 
            });

            setView("registerStep2");
        } catch (error) {
            console.error("Error al procesar los datos:", error);
            alert("Hubo un problema. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <h5 className="fw-bold text-gray-600">¡Crea tu cuenta y aprende sin límites!</h5>
            <input
                type="text"
                className="form-control my-3"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Apellidos"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                required
            />
            <input
                type="email"
                className="form-control mb-3"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
            <button 
                className="btn btn-purple-900 w-100 text-white mt-2 fw-bold" 
                onClick={handleNext}
                disabled={isDisabled || loading}
            >
                {loading ? (
                    <div className="spinner-border text-light" role="status">
                        <span className="sr-only"></span>
                    </div>
                ) : (
                    "Continuar"
                )}
            </button>
            <p className="text-danger mt-4"><small>O inicia sesión</small></p>
            <button className="btn btn-purple-400 w-100 mt-2 fw-bold" onClick={() => setView("login")}>
                ¿Ya tienes cuenta?
            </button>
        </div>
    );
};

export default RegisterStep1;

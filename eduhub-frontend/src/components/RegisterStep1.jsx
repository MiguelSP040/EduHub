import { useState } from "react";

const RegisterStep1 = ({ setView, formData, setFormData }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ name: false, surname: false, email: false });
    const [touched, setTouched] = useState({ name: false, surname: false, email: false }); // Nuevo estado para rastrear interacción

    const isDisabled = !formData.name.trim() || !formData.surname.trim() || !formData.email.trim() || Object.values(errors).some((error) => error);

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

    const validateInput = (field, value) => {
        let isValid = true;

        switch (field) {
            case "name":
                isValid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(value); // Solo letras
                break;
            case "surname":
                isValid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value); // Letras y espacios
                break;
            case "email":
                isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value); // Email válido
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [field]: !isValid }));
    };

    const handleBlur = (field) => {
        setTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
    };

    return (
        <div className="">
            <h5 className="fw-bold text-gray-600">¡Crea tu cuenta y aprende sin límites!</h5>
            <input
                type="text"
                className={`form-control my-3 ${
                    touched.name
                        ? errors.name
                            ? "is-invalid"
                            : formData.name.trim() !== ""
                            ? "is-valid"
                            : ""
                        : ""
                }`}
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, name: value });
                    validateInput("name", value);
                }}
                onBlur={() => handleBlur("name")}
                required
            />
            {touched.name && errors.name && <div className="invalid-feedback">El nombre solo puede contener letras.</div>}

            <input
                type="text"
                className={`form-control mb-3 ${
                    touched.surname
                        ? errors.surname
                            ? "is-invalid"
                            : formData.surname.trim() !== ""
                            ? "is-valid"
                            : ""
                        : ""
                }`}
                placeholder="Apellidos"
                value={formData.surname}
                onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, surname: value });
                    validateInput("surname", value);
                }}
                onBlur={() => handleBlur("surname")}
                required
            />
            {touched.surname && errors.surname && <div className="invalid-feedback">Los apellidos solo pueden contener letras y espacios.</div>}

            <input
                type="email"
                className={`form-control mb-3 ${
                    touched.email
                        ? errors.email
                            ? "is-invalid"
                            : formData.email.trim() !== ""
                            ? "is-valid"
                            : ""
                        : ""
                }`}
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, email: value });
                    validateInput("email", value);
                }}
                onBlur={() => handleBlur("email")}
                required
            />
            {touched.email && errors.email && <div className="invalid-feedback">Por favor, ingresa un correo electrónico válido.</div>}

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
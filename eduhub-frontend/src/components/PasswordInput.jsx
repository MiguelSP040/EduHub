import { useState } from "react";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="input-group">
            <input
                type={showPassword ? "text" : "password"}
                className="form-control border-0 input-with-icon password-icon flex-grow-1"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <button
                type="button"
                className="btn bg-white text-blue-600 border-start border-0"
                onClick={() => setShowPassword(!showPassword)}
                title='Mostrar contraseña'
            >
                {showPassword ? <EyeSlash /> : <Eye />}
            </button>
        </div>
    );
};

export default PasswordInput;

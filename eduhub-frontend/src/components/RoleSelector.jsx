import { useState } from "react";

const RoleSelector = ({ setFormData }) => {
    const [selectedRole, setSelectedRole] = useState("");

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setFormData(prev => ({ ...prev, role }));
    };

    return (
        <div className="d-flex justify-content-between mt-3">
            <button className={`btn w-100 me-1 ${selectedRole === "ROLE_STUDENT" ? "btn-purple-400" : "btn-gray-800"}`} onClick={() => handleRoleChange("ROLE_STUDENT")}>Estudiante</button>
            <button className={`btn w-100 ms-1 ${selectedRole === "ROLE_ADMIN" ? "btn-purple-400" : "btn-gray-800"}`} onClick={() => handleRoleChange("ROLE_ADMIN")}>Docente</button>
        </div>
    );
};

export default RoleSelector;

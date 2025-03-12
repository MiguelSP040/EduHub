import { useState } from "react";

const CourseConfig = ({ course }) => {
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            console.log("Cambios guardados:", { title, description });
            setIsSaving(false);
            alert("Configuración guardada correctamente.");
        }, 1500);
    };

    return (
        <div>
            <h2>Configuración del Curso</h2>
            <label>Título del Curso</label>
            <input 
                type="text" 
                className="form-control" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
            />

            <label>Descripción</label>
            <textarea 
                className="form-control" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows="3"
            ></textarea>

            <button className="btn btn-success mt-3" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                ) : (
                    "Guardar Cambios"
                )}
            </button>
        </div>
    );
};

export default CourseConfig;

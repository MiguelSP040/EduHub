import { useState } from "react";
import { updateCourse } from "../../../services/courseService";

const CourseConfig = ({ course, setCourse }) => {
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description);
    const [studentsCount, setStudentsCount] = useState(course.studentsCount ? String(course.studentsCount) : "");
    const [classTime, setClassTime] = useState(course.classTime || "");
    const [price, setPrice] = useState(course.price === 0 ? "Gratis" : course.price.toString());
    const [category, setCategory] = useState(course.category || "");
    const [dateStart, setDateStart] = useState(new Date(course.dateStart).toISOString().split("T")[0]);
    const [dateEnd, setDateEnd] = useState(new Date(course.dateEnd).toISOString().split("T")[0]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (
            !title.trim() ||
            !description.trim() ||
            !dateStart ||
            !dateEnd ||
            (studentsCount === "" || isNaN(studentsCount)) ||
            !classTime.trim() ||
            !price.trim() ||
            !category.trim()
        ) {
            setErrorMsg("Todos los campos son obligatorios.");
            return;
        }
    
        const start = new Date(dateStart);
        const end = new Date(dateEnd);
    
        if (end.getTime() < start.getTime()) {
            setErrorMsg("La fecha de fin no puede ser menor a la de inicio.");
            return;
        }
    
        setIsSaving(true);
    
        const updatedCourse = {
            ...course,
            title,
            description,
            price: price === "0" ? 0 : Number(price) || 0,
            dateStart: start,
            dateEnd: end,
            category,
            studentsCount: Number(studentsCount),
            classTime,
        };
    
        try {
            const response = await updateCourse(updatedCourse);
            if (response.status === 200) {
                setCourse(updatedCourse);
                alert("Curso actualizado correctamente.");
            } else {
                alert(response.message || "Error al actualizar el curso.");
            }
        } catch (error) {
            console.error("Error al actualizar el curso:", error);
            alert("No se pudo conectar con el servidor.");
        } finally {
            setIsSaving(false);
        }
    };    

    return (
        <div className="px-3 px-md-5 pt-3 text-start">
            <h2 className="mb-4 text-center">Configuración del Curso</h2>
    
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
    
            <div className="mb-3 fw-bold">
                <label>Título del curso</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    disabled={course && course.status !== "Creado"} 
                />
            </div>
    
            <div className="mb-3 fw-bold">
                <label>Descripción</label>
                <textarea 
                    className="form-control" 
                    rows={3} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    disabled={course && course.status !== "Creado"} 
                />
            </div>
    
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="mb-3 fw-bold">
                        <label>Cantidad de estudiantes</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={studentsCount} 
                            onChange={(e) => setStudentsCount(e.target.value)} 
                            disabled={course && course.status !== "Creado"} 
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="mb-3 fw-bold">
                        <label>Horario de clases</label>
                        <input 
                            type="time" 
                            className="form-control" 
                            value={classTime} 
                            onChange={(e) => setClassTime(e.target.value)} 
                            disabled={course && course.status !== "Creado"} 
                        />
                    </div>
                </div>
            </div>
    
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="mb-3 fw-bold">
                        <label>Precio del curso</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            disabled={course && course.status !== "Creado"} 
                        />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="mb-3 fw-bold">
                        <label>Categoría del curso</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            disabled={course && course.status !== "Creado"} 
                        />
                    </div>
                </div>
            </div>
    
            <button className="btn btn-purple-900 mt-3" onClick={handleSave} disabled={isSaving || course.status !== "Creado"}>
                {isSaving ? <div className="spinner-border text-light"></div> : "Guardar Cambios"}
            </button>
        </div>
    );
};

export default CourseConfig;

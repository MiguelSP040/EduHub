import { useState } from 'react';
import { updateCourse } from '../../../services/courseService';

const CourseConfig = ({ course, setCourse }) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [studentsCount, setStudentsCount] = useState(course.studentsCount ? String(course.studentsCount) : '');
  const [price, setPrice] = useState(course.price === 0 ? 'Gratis' : course.price.toString());
  const [category, setCategory] = useState(course.category || '');
  const [coverImage, setCoverImage] = useState('');
  const [hasCertificate, setHasCertificate] = useState(course.hasCertificate || false);
  const [dateStart, setDateStart] = useState(new Date(course.dateStart).toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState(new Date(course.dateEnd).toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !dateStart || !dateEnd || studentsCount === '' || isNaN(studentsCount) || !price.trim() || !category.trim()) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    if (end.getTime() < start.getTime()) {
      setErrorMsg('La fecha de fin no puede ser menor a la de inicio.');
      return;
    }

    setIsSaving(true);

    const updatedCourse = {
      ...course,
      title,
      description,
      price: price === '0' ? 0 : Number(price) || 0,
      dateStart: start,
      dateEnd: end,
      hasCertificate,
      category,
      studentsCount: Number(studentsCount),
    };

    const formData = new FormData();
    formData.append('course', new Blob([JSON.stringify(updatedCourse)], { type: 'application/json' }));

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const response = await updateCourse(formData);
      if (response.status === 200) {
        setCourse(updatedCourse);
        alert('Curso actualizado correctamente.');
      } else {
        alert(response.message || 'Error al actualizar el curso.');
      }
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
      alert('No se pudo conectar con el servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  (() => {
    console.log(course);
  })();

  return (
    <div className="px-3 px-md-5 pt-3 text-start">
      <h2 className="mb-4 text-center">Configuración del Curso</h2>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="mb-3 fw-bold">
        <label>Título del curso</label>
        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} disabled={course && course.status !== 'Creado'} />
      </div>

      <div className="mb-3 fw-bold">
        <label>Descripción</label>
        <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={course && course.status !== 'Creado'} />
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Cantidad de estudiantes</label>
            <input type="number" className="form-control" value={studentsCount} onChange={(e) => setStudentsCount(e.target.value)} disabled={course && course.status !== 'Creado'} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Imagen de portada</label>
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} disabled={course && course.status !== 'Creado'} />
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
              value={price === '0' ? 'Gratis' : price}
              onChange={(e) => {
                const value = e.target.value;
                if (value.toLowerCase() === 'gratis') {
                  setPrice('0');
                } else if (/^\d*\.?\d*$/.test(value)) {
                  setPrice(value);
                }
              }}
              disabled={course && course.status !== 'Creado'}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Categoría del curso</label>
            <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} disabled={course && course.status !== 'Creado'} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Fecha de inicio</label>
            <input type="date" className="form-control" value={dateStart} onChange={(e) => setDateStart(e.target.value)} disabled={course && course.status !== 'Creado'} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Fecha de fin</label>
            <input type="date" className="form-control" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} disabled={course && course.status !== 'Creado'} />
          </div>
        </div>
      </div>

      <div className="form-check mb-3 fw-bold">
        <input type="checkbox" className="form-check-input" id="editHasCertificate" checked={hasCertificate} onChange={(e) => setHasCertificate(e.target.checked)} disabled={course && course.status !== 'Creado'} />
        <label className="form-check-label" htmlFor="editHasCertificate">
          ¿Este curso incluye certificado?
        </label>
      </div>

      {course.status === 'Creado' && (
        <button className="btn btn-purple-900 mt-3" onClick={handleSave} disabled={isSaving || course.status !== 'Creado'}>
          {isSaving ? <div className="spinner-border text-light"></div> : 'Guardar Cambios'}
        </button>
      )}
    </div>
  );
};

export default CourseConfig;

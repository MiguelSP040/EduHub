import { useState } from 'react';
import { updateCourse } from '../../../services/courseService';
import { useToast } from '../../utilities/ToastProvider';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import 'primeicons/primeicons.css';

const CourseConfig = ({ course, setCourse }) => {
  const { showSuccess, showError, showWarn } = useToast();

  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [studentsCount, setStudentsCount] = useState(course.studentsCount ? String(course.studentsCount) : '');
  const [price, setPrice] = useState(course.price === 0 ? '0' : course.price.toString());
  const [category, setCategory] = useState(course.category || '');
  const [coverImage, setCoverImage] = useState('');
  const [hasCertificate, setHasCertificate] = useState(course.hasCertificate || false);
  const [dateStart, setDateStart] = useState(new Date(course.dateStart).toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState(new Date(course.dateEnd).toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !dateStart || !dateEnd || studentsCount === '' || isNaN(studentsCount) || !price.toString().trim() || !category.trim()) {
      showWarn('Campos obligatorios', 'Todos los campos son obligatorios');
      return;
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    if (start <= today) {
      showWarn('Fecha inválida', 'La fecha de inicio debe ser al menos un día después de la fecha actual');
      return;
    }

    if (end.getTime() <= start.getTime()) {
      showWarn('Fecha inválida', 'La fecha de fin debe ser al menos un día después que la fecha de inicio');
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
        showSuccess('Actualización exitosa', 'Curso actualizado correctamente.');
      } else {
        showError('Error', response.message || 'Error al actualizar el curso.');
      }
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
      showError('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-3 px-md-5 pt-3 text-start">
      <h2 className="mb-4 text-center">Configuración del Curso</h2>

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
            <InputNumber
              value={price === '0' ? 'Gratis' : price}
              onValueChange={(e) => {
                const value = e.value;
                if (value === 0) {
                  setPrice('0');
                } else {
                  setPrice(value);
                }
              }}
              mode="currency"
              currency="USD"
              locale="en-US"
              minFractionDigits={2}
              placeholder="$USD"
              className="w-100"
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
            <input
              type="date"
              className="form-control"
              value={dateStart}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setDateStart(e.target.value);
                if (dateEnd && new Date(e.target.value) >= new Date(dateEnd)) {
                  setDateEnd('');
                }
              }}
              disabled={course && course.status !== 'Creado'}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Fecha de fin</label>
            <input
              type="date"
              className={`form-control ${dateStart && dateEnd && new Date(dateEnd) <= new Date(dateStart) ? 'is-invalid' : ''}`}
              value={dateEnd}
              min={dateStart ? new Date(new Date(dateStart).getTime() + 1000 * 60 * 60 * 24).toISOString().split('T')[0] : ''}
              onChange={(e) => setDateEnd(e.target.value)}
              disabled={!dateStart || course.status !== 'Creado'}
            />
            {dateStart && dateEnd && new Date(dateEnd) <= new Date(dateStart) && <div className="invalid-feedback">La fecha de fin debe ser al menos un día después que la fecha de inicio.</div>}
          </div>
        </div>
      </div>

      <div className="mb-3 fw-bold d-flex align-items-center">
        <label className="form-check-label me-2" htmlFor="editHasCertificate">
          ¿Este curso incluye certificado?
        </label>
        <InputSwitch checked={hasCertificate} onChange={(e) => setHasCertificate(e.value)} disabled={course && course.status !== 'Creado'} />
        <span className="ms-2 fw-semibold">{hasCertificate ? 'Sí' : 'No'}</span>
      </div>

      {course.status === 'Creado' && (
        <button className="btn btn-purple-900 mt-3" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <div className="spinner-border text-light"></div>
          ) : (
            <div>
              <i className="bi bi-floppy"></i> Guardar Cambios
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default CourseConfig;

import { useState } from 'react';
import { updateCourse } from '../../../services/courseService';
import { useToast } from '../../utilities/ToastProvider';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';

const CourseConfig = ({ course, setCourse }) => {
  const { showSuccess, showError, showWarn } = useToast();

  const [title, setTitle] = useState(course.title);
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState(course.description);
  const [descriptionError, setDescriptionError] = useState('');
  const [studentsCount, setStudentsCount] = useState(course.studentsCount ? String(course.studentsCount) : '');
  const [studentsError, setStudentsError] = useState('');
  const [price, setPrice] = useState(course.price === 0 ? '0' : course.price.toString());
  const [priceError, setPriceError] = useState('');
  const [category, setCategory] = useState(course.category || '');
  const [categoryError, setCategoryError] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [hasCertificate, setHasCertificate] = useState(course.hasCertificate || false);
  const [dateStart, setDateStart] = useState(new Date(course.dateStart).toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState(new Date(course.dateEnd).toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSave = async () => {
    // Validaciones globales: si falta algún campo o si el formato es incorrecto, se muestra un Toast warning
    if (!title.trim() || !description.trim() || !dateStart || !dateEnd || studentsCount === '' || !price.toString().trim() || !category.trim()) {
      showWarn('Campos obligatorios', 'Todos los campos son obligatorios.');
      return;
    }
    if (titleError || descriptionError || studentsError || priceError || categoryError) {
      showWarn('Errores en el formulario', 'Corrija los errores en el formulario.');
      return;
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    if (start <= today) {
      showWarn('Fecha inválida', 'La fecha de inicio debe ser al menos un día después de la fecha actual.');
      return;
    }
    if (end.getTime() <= start.getTime()) {
      showWarn('Fecha inválida', 'La fecha de fin debe ser al menos un día después que la fecha de inicio.');
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

      {/* Título */}
      <div className="mb-3 fw-bold">
        <label>Título del curso</label>
        <input
          type="text"
          className={`form-control ${titleError ? 'is-invalid' : ''}`}
          value={title}
          onChange={(e) => {
            const val = e.target.value;
            setTitle(val);
            if (!/^[\w\s,.!?'"-]{3,}$/.test(val)) {
              setTitleError('El título debe tener al menos 3 caracteres y no contener símbolos no permitidos.');
            } else {
              setTitleError('');
            }
          }}
          disabled={course && course.status !== 'Creado'}
        />
        {titleError && <div className="invalid-feedback">{titleError}</div>}
      </div>

      {/* Descripción */}
      <div className="mb-3 fw-bold">
        <label>Descripción</label>
        <textarea
          className={`form-control ${descriptionError ? 'is-invalid' : ''}`}
          rows={3}
          value={description}
          onChange={(e) => {
            const val = e.target.value;
            setDescription(val);
            if (!/^[\w\s,.!?'"-]{10,}$/.test(val)) {
              setDescriptionError('La descripción debe tener al menos 10 caracteres y no contener símbolos no permitidos.');
            } else {
              setDescriptionError('');
            }
          }}
          disabled={course && course.status !== 'Creado'}
        />
        {descriptionError && <div className="invalid-feedback">{descriptionError}</div>}
      </div>

      {/* Cantidad de estudiantes e Imagen de portada */}
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Cantidad de estudiantes</label>
            <input
              type="number"
              className={`form-control ${studentsError ? 'is-invalid' : ''}`}
              value={studentsCount < 1 ? 1 : studentsCount > 30 ? 30 : studentsCount}
              onChange={(e) => {
                const val = e.target.value;
                setStudentsCount(val);
                if (!/^\d*$/.test(val)) {
                  setStudentsError('Solo se permiten números enteros positivos.');
                } else if (Number(val) < 0) {
                  setStudentsError('La cantidad de estudiantes no puede ser negativa.');
                } else {
                  setStudentsError('');
                }
              }}
              disabled={course && course.status !== 'Creado'}
            />
            {studentsError && <div className="invalid-feedback">{studentsError}</div>}
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Imagen de portada</label>
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} disabled={course && course.status !== 'Creado'} />
          </div>
        </div>
      </div>

      {/* Precio y Categoría */}
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
            {priceError && <div className="invalid-feedback">{priceError}</div>}
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Categoría del curso</label>
            <input
              type="text"
              className={`form-control ${categoryError ? 'is-invalid' : ''}`}
              value={category}
              onChange={(e) => {
                const val = e.target.value;
                setCategory(val);
                if (!/^[\w\s,.!?'"-]{3,}$/.test(val)) {
                  setCategoryError('La categoría debe tener al menos 3 caracteres y no contener símbolos no permitidos.');
                } else {
                  setCategoryError('');
                }
              }}
              disabled={course && course.status !== 'Creado'}
            />
            {categoryError && <div className="invalid-feedback">{categoryError}</div>}
          </div>
        </div>
      </div>

      {/* Fechas */}
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

      <div className="row mt-5 align-items-center">
        {/* SWITCH al inicio */}
        <div className="col-md-6 d-flex align-items-center fw-bold">
          <label className="me-2" htmlFor="editHasCertificate">¿Incluir certificado?</label>
          <InputSwitch checked={hasCertificate} onChange={(e) => setHasCertificate(e.value)} disabled={course && course.status !== 'Creado'} />
          <span className="ms-2 fw-semibold">{hasCertificate ? 'Sí' : 'No'}</span>
        </div>

        {/* BOTÓN solo si el curso está en estado 'Creado' */}
        {course.status === 'Creado' && (
          <div className="col-md-6 text-end">
            <button className="btn btn-purple-900" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <div className="spinner-border text-light"></div> : 'Guardar Cambios'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseConfig;

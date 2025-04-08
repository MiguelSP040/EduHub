import { useState, useEffect } from 'react';
import { updateCourse } from '../../../services/courseService';

const CourseConfig = ({ course, setCourse }) => {
  const [title, setTitle] = useState(course.title);
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState(course.description);
  const [descriptionError, setDescriptionError] = useState('');
  const [studentsCount, setStudentsCount] = useState(course.studentsCount ? String(course.studentsCount) : '');
  const [studentsError, setStudentsError] = useState('');
  const [price, setPrice] = useState(course.price === 0 ? 'Gratis' : course.price.toString());
  const [priceError, setPriceError] = useState('');
  const [category, setCategory] = useState(course.category || '');
  const [categoryError, setCategoryError] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [hasCertificate, setHasCertificate] = useState(course.hasCertificate || false);
  const [dateStart, setDateStart] = useState(new Date(course.dateStart).toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState(new Date(course.dateEnd).toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // useEffect para quitar el mensaje global si los errores individuales se han corregido
  useEffect(() => {
    if (
      title.trim() &&
      description.trim() &&
      studentsCount !== '' &&
      price.trim() &&
      category.trim() &&
      !titleError &&
      !descriptionError &&
      !studentsError &&
      !priceError &&
      !categoryError
    ) {
      setErrorMsg('');
    }
  }, [
    title, titleError,
    description, descriptionError,
    studentsCount, studentsError,
    price, priceError,
    category, categoryError,
  ]);

  const handleSave = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !dateStart ||
      !dateEnd ||
      studentsCount === '' ||
      !price.trim() ||
      !category.trim()
    ) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }

    // Si existen errores de validación en tiempo real, no se permite enviar
    if (titleError || descriptionError || studentsError || priceError || categoryError) {
      setErrorMsg('Corrija los errores en el formulario.');
      return;
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    if (start <= today) {
      setErrorMsg('La fecha de inicio debe ser al menos un día después de la fecha actual.');
      return;
    }

    if (end.getTime() <= start.getTime()) {
      setErrorMsg('La fecha de fin debe ser al menos un día después que la fecha de inicio.');
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

  return (
    <div className="px-3 px-md-5 pt-3 text-start">
      <h2 className="mb-4 text-center">Configuración del Curso</h2>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

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
              value={studentsCount}
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
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              disabled={course && course.status !== 'Creado'}
            />
          </div>
        </div>
      </div>

      {/* Precio y Categoría */}
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="mb-3 fw-bold">
            <label>Precio del curso</label>
            <input
              type="text"
              className={`form-control ${priceError ? 'is-invalid' : ''}`}
              value={price === '0' ? 'Gratis' : price}
              onChange={(e) => {
                const value = e.target.value;
                if (value.toLowerCase() === 'gratis') {
                  setPrice('0');
                  setPriceError('');
                } else if (value === '' || /^\d+(\.\d*)?$/.test(value)) {
                  setPrice(value);
                  setPriceError('');
                } else {
                  setPriceError('Solo se permiten números con decimales válidos (ej.: 12 o 12.34).');
                }
              }}
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
              min={
                dateStart
                  ? new Date(new Date(dateStart).getTime() + 1000 * 60 * 60 * 24)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={(e) => setDateEnd(e.target.value)}
              disabled={!dateStart || course.status !== 'Creado'}
            />
            {dateStart && dateEnd && new Date(dateEnd) <= new Date(dateStart) && (
              <div className="invalid-feedback">
                La fecha de fin debe ser al menos un día después que la fecha de inicio.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-check mb-3 fw-bold">
        <input
          type="checkbox"
          className="form-check-input"
          id="editHasCertificate"
          checked={hasCertificate}
          onChange={(e) => setHasCertificate(e.target.checked)}
          disabled={course && course.status !== 'Creado'}
        />
        <label className="form-check-label" htmlFor="editHasCertificate">
          ¿Este curso incluye certificado?
        </label>
      </div>

      {course.status === 'Creado' && (
        <button className="btn btn-purple-900 mt-3" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <div className="spinner-border text-light"></div> : 'Guardar Cambios'}
        </button>
      )}
    </div>
  );
};

export default CourseConfig;

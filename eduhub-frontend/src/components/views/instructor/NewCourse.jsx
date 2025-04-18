import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { createCourse } from '../../../services/courseService';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import { useToast } from '../../utilities/ToastProvider';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const NewCourse = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showSuccess, showError, showWarn } = useToast();

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [studentsCount, setStudentsCount] = useState('');
  const [studentsError, setStudentsError] = useState('');
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [hasCertificate, setHasCertificate] = useState(false);
  const [loading, setLoading] = useState(false);

  const start = new Date(dateStart + 'T00:00:00');
  const end = new Date(dateEnd + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 1000 * 60 * 60 * 24);

  const handleCreateCourse = async () => {
    if (!title.trim() || !description.trim() || !dateStart || !dateEnd || !studentsCount.trim() || !price.toString().trim() || !category.trim()) {
      showWarn('Campos obligatorios', 'Todos los campos son obligatorios.');
      return;
    }
    if (titleError || descriptionError || categoryError || studentsError || priceError) {
      showWarn('Errores en el formulario', 'Corrija los errores en el formulario.');
      return;
    }
    if (Number(studentsCount) < 1) {
      showWarn('Cantidad inválida', 'El curso debe permitir al menos 1 estudiante.');
      return;
    }
    if (start <= today) {
      showWarn('Fecha de inicio inválida', 'La fecha de inicio debe ser al menos un día después de la fecha actual.');
      return;
    }
    if (end < start) {
      showWarn('Fecha de fin inválida', 'La fecha de fin no puede ser menor a la de inicio.');
      return;
    }

    setLoading(true);

    const newCourse = {
      title,
      description,
      price: price === '0' ? 0 : Number(price) || 0,
      dateStart: start.toISOString(),
      dateEnd: end.toISOString(),
      category,
      studentsCount: Number(studentsCount),
      isArchived: false,
      isPublished: false,
      hasCertificate,
      status: 'pendiente',
      docenteId: user.id,
      studentsEnrolled: [],
      sessions: [],
      ratings: [],
    };

    try {
      const resp = await createCourse(newCourse, coverImage);
      if (resp.status !== 200) {
        showError('Error', resp.message || 'Error al crear el curso');
        setLoading(false);
        return;
      }
      showSuccess('Curso registrado', 'Pendiente de aprobación');
      navigate('/instructor');
    } catch (error) {
      console.error(error);
      showError('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

  return (
    <div className="bg-main">
      {/* SIDEBAR */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow-1">
        {/* NAVBAR */}
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        {/* CONTENIDO */}
        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5 text-start">
            <div className="card border-0 shadow mx-md-5 px-md-5">
              <div className="bg-light text-center">
                <h3 className="text-gray">Registrar un Curso</h3>
              </div>
              <hr />

              {/* Título y Descripción */}
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
                />
                {titleError && <div className="invalid-feedback">{titleError}</div>}
              </div>

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
                />
                {descriptionError && <div className="invalid-feedback">{descriptionError}</div>}
              </div>

              {/* Cantidad de estudiantes e Imagen de Portada */}
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Cantidad de estudiantes</label>
                    <input
                      type="number"
                      className={`form-control ${studentsError ? 'is-invalid' : ''}`}
                      min={1}
                      max={30}
                      value={studentsCount < 1 ? 1 : studentsCount > 30 ? 30 : studentsCount}
                      placeholder="1 - 30"
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
                    />
                    {studentsError && <div className="invalid-feedback">{studentsError}</div>}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Imagen de portada</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>
              </div>

              {/* Categoría y Precio del curso */}
              <div className="row">
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
                    />
                    {categoryError && <div className="invalid-feedback">{categoryError}</div>}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Precio del curso</label>
                    <InputNumber
                      value={price === '0' ? 'Gratis' : price}
                      onValueChange={(e) => {
                        setPrice(e.value);
                        // Se omite validación adicional aquí, ya que InputNumber se encarga de números.
                        setPriceError('');
                      }}
                      mode="currency"
                      currency="USD"
                      locale="en-US"
                      minFractionDigits={2}
                      placeholder="$USD"
                      className="w-100"
                    />
                    {priceError && <div className="invalid-feedback">{priceError}</div>}
                  </div>
                </div>
              </div>

              {/* Fechas de inicio y fin */}
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Fecha de Inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      min={tomorrow.toISOString().split('T')[0]}
                      value={dateStart}
                      onChange={(e) => {
                        setDateStart(e.target.value);
                        if (dateEnd && new Date(e.target.value) >= new Date(dateEnd)) {
                          setDateEnd('');
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3 fw-bold">
                    <label>Fecha de Fin</label>
                    <input
                      type="date"
                      className={`form-control ${dateStart && dateEnd && new Date(dateEnd) <= new Date(dateStart) ? 'is-invalid' : ''}`}
                      min={dateStart ? new Date(new Date(dateStart).getTime() + 1000 * 60 * 60 * 24).toISOString().split('T')[0] : ''}
                      value={dateEnd}
                      disabled={!dateStart}
                      onChange={(e) => setDateEnd(e.target.value)}
                    />
                    {dateStart && dateEnd && new Date(dateEnd) <= new Date(dateStart) && <div className="invalid-feedback">La fecha de fin debe ser al menos un día después que la fecha de inicio.</div>}
                  </div>
                </div>
              </div>

              <div className="row mt-5 align-items-center">
                {/* SWITCH al inicio */}
                <div className="col-md-6 d-flex align-items-center fw-bold">
                  <label className="me-2">¿Incluir certificado?</label>
                  <InputSwitch checked={hasCertificate} onChange={(e) => setHasCertificate(e.value)} />
                  <span className="ms-2 fw-semibold">{hasCertificate ? 'Sí' : 'No'}</span>
                </div>

                {/* BOTONES al final de la fila alineados a la derecha */}
                <div className="col-md-6 text-end">
                  <button
                    className="btn btn-outline-secondary me-2"
                    disabled={loading}
                    onClick={() => navigate('/instructor')}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-purple-900"
                    disabled={loading}
                    onClick={handleCreateCourse}
                    title="Crear curso"
                  >
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-light"></div>
                    ) : (
                      <div>
                        <i className="bi bi-journal-plus"></i> Confirmar
                      </div>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NewCourse;

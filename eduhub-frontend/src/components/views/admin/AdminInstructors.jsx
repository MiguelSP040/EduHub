import { useEffect, useState, useRef, useMemo } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { findAllUsers, activateInstructor } from '../../../services/userService';
import { Modal } from 'bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCoursesByInstructor } from '../../../services/courseService';
import { payInstructorForCourse } from '../../../services/financeService';
import { useToast } from '../../utilities/ToastProvider';
import Loading from '../../utilities/Loading';
import { Search } from 'react-feather';

const AdminInstructors = () => {
  const { showSuccess, showError, showWarn } = useToast();

  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const viewInstructorModalRef = useRef(null);

  const [instructorIndex, setInstructorIndex] = useState(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null); // "nombre" | "correo" | "apodo" | "estado"
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const data = await findAllUsers();
      const filteredInstructors = data.filter((user) => user.role === 'ROLE_INSTRUCTOR');
      setInstructors(filteredInstructors);
    } catch (error) {
      console.error('Error al obtener instructores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchCourses = async (id) => {
    try {
      const response = await getCoursesByInstructor(id);
      return response;
    } catch (error) {
      console.error('Fallo al obtener cursos', error);
    }
  };

  const handlePayToInstructor = async (instructorId) => {
    const confirmAction = window.confirm('¿Estás seguro de que deseas pagar al instructor? Esta acción no se puede deshacer');
    if (!confirmAction) return;

    try {
      const courses = await fetchCourses(instructorId);
      const unpaidCourses = courses.filter((course) => course.payment === false);

      if (unpaidCourses.length === 0) {
        showWarn('Sin cursos pendientes de pago', 'Este instructor no tiene cursos pendientes de pago');
        return;
      }

      let allSuccessful = true;
      let messages = [];

      for (const course of unpaidCourses) {
        const res = await payInstructorForCourse(course.id);
        messages.push(`Curso: ${course.title} → ${res.message}`);
        if (res.status !== 200) allSuccessful = false;
      }

      if (allSuccessful) {
        showSuccess('Pagado', messages.join('\n'));
        console.log('Todos los pagos procesados exitosamente');
      }
    } catch (error) {
      console.error('Error al pagar al instructor:', error);
      showError('Error', 'Error inesperado al procesar el pago');
    }
  };

  const handleActivateInstructor = async (instructorId) => {
    const response = await activateInstructor(instructorId);

    if (response.status === 200) {
      showSuccess('Instructor aceptado', response.message);
      setInstructors((prevInstructors) => prevInstructors.map((instructor) => (instructor.id === instructorId ? { ...instructor, active: true } : instructor)));
    } else {
      showError('Error', 'Error al activar el instructor');
    }
  };

  const openModal = (modalRef, index) => {
    setInstructorIndex(index);
    if (modalRef.current) {
      const modal = new Modal(modalRef.current);
      modal.show();
    }
  };

  const filteredInstructors = useMemo(() => {
    if (!searchTerm.trim()) return instructors;
    return instructors.filter((inst) => {
      const fullName = (inst.name + ' ' + inst.surname + ' ' + (inst.lastname || '')).toLowerCase();
      const email = inst.email.toLowerCase();
      const username = inst.username.toLowerCase();
      const term = searchTerm.toLowerCase();
      return fullName.includes(term) || email.includes(term) || username.includes(term);
    });
  }, [instructors, searchTerm]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getCaretIcon = (column) => {
    if (sortColumn !== column) {
      return <i className="bi bi-caret-down-fill text-muted ms-1"></i>;
    }
    if (sortDirection === 'asc') {
      return <i className="bi bi-caret-up-fill ms-1"></i>;
    }
    return <i className="bi bi-caret-down-fill ms-1"></i>;
  };

  const sortedInstructors = useMemo(() => {
    if (!sortColumn) return filteredInstructors;
    const sorted = [...filteredInstructors];
    sorted.sort((a, b) => {
      let valA, valB;
      switch (sortColumn) {
        case 'nombre':
          valA = (a.name + ' ' + a.surname + ' ' + (a.lastname || '')).toLowerCase();
          valB = (b.name + ' ' + b.surname + ' ' + (b.lastname || '')).toLowerCase();
          break;
        case 'correo':
          valA = a.email.toLowerCase();
          valB = b.email.toLowerCase();
          break;
        case 'apodo':
          valA = a.username.toLowerCase();
          valB = b.username.toLowerCase();
          break;
        case 'estado':
          valA = a.active ? '1' : '0'; // Activo=1, Inactivo=0
          valB = b.active ? '1' : '0';
          break;
        default:
          valA = '';
          valB = '';
          break;
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredInstructors, sortColumn, sortDirection]);

  return (
    <div className="bg-main">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />

      <div className="flex-grow-1">
        <div ref={navbarRef}>
          <Navbar toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>

        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            {/* Barra de navegación secundaria */}
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row flex-nowrap align-items-center justify-content-between w-100 gx-3">
                  <div className="col-auto d-flex align-items-center">
                    <span className="fw-semibold fs-5 me-3">Gestión de Instructores</span>
                  </div>

                  <div className="col-auto d-flex align-items-center">
                    <div className="search-container">
                      <div className="search-icon">
                        <i className="bi bi-search text-muted"></i>
                      </div>
                      <input type="search" className="search-input" placeholder="Buscar instructor" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive rounded-3" style={{ maxHeight: '35rem' }}>
              <table className="table table-striped text-nowrap">
                <thead className="position-sticky top-0">
                  <tr>
                    <th colSpan="5" className="text-center">
                      <h4 className="mb-0">
                        Instructores
                      </h4>
                    </th>
                  </tr>
                  <tr>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('nombre')}>
                      Nombre Completo
                      {getCaretIcon('nombre')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('correo')}>
                      Correo Electrónico
                      {getCaretIcon('correo')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('apodo')}>
                      Apodo
                      {getCaretIcon('apodo')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('estado')}>
                      Estado
                      {getCaretIcon('estado')}
                    </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <Loading />
                      </td>
                    </tr>
                  ) : sortedInstructors.length > 0 ? (
                    sortedInstructors.map((instructor, index) => (
                      <tr key={instructor._id || instructor.id || index}>
                        <td>
                          {instructor.name} {instructor.surname} {instructor.lastname}
                        </td>
                        <td>{instructor.email}</td>
                        <td>{instructor.username}</td>
                        <td>{instructor.active ? <span className="badge bg-success px-3">Activo</span> : <span className="badge bg-warning">Inactivo</span>}</td>
                        <td>
                          {!instructor.active && (
                            <button className="btn btn-success btn-sm me-2" onClick={() => handleActivateInstructor(instructor.id)} title="Activar al instructor">
                              <i className="bi bi-check-circle"></i>
                            </button>
                          )}
                          <button className="btn badge-blue-color  btn-sm me-2" onClick={() => openModal(viewInstructorModalRef, index)} title="Ver datos del instructor">
                            <i className="bi bi-eye"></i>
                          </button>
                          {instructor.active && (
                            <button className="btn badge-green-color btn-sm me-2" onClick={() => navigate('/instructors/ratings', { state: { instructor } })} title="Ver calificaciones">
                              <i className="bi bi-clipboard-data"></i>
                            </button>
                          )}
                          {instructor.active && (
                            <button className="btn badge-pink-color btn-sm me-2" onClick={() => handlePayToInstructor(instructor.id)} title="Pagar cursos">
                              <i className="bi bi-currency-dollar"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        No hay instructores registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL VER DATOS DEL INSTRUCTOR */}
      <div className="modal fade" ref={viewInstructorModalRef} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title me-auto">Datos del Instructor</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center text-sm-start">
              <div className="row mb-3">
                <div className="col-12 col-sm-6">
                  <h5>Nombre (s)</h5>
                  <span>{instructors[instructorIndex]?.name}</span>
                </div>
                <div className="col-12 col-sm-6">
                  <h5>Apellido (s)</h5>
                  <span>
                    {instructors[instructorIndex]?.surname} {instructors[instructorIndex]?.lastname}
                  </span>
                </div>
              </div>
              <div className="row my-3">
                <div className="col-12 col-sm-6">
                  <h5>Apodo</h5>
                  <span>{instructors[instructorIndex]?.username}</span>
                </div>
                <div className="col-12 col-sm-6">
                  <h5>Correo electrónico</h5>
                  <span>{instructors[instructorIndex]?.email}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <h5>Descripción</h5>
                  <span>{instructors[instructorIndex]?.description ? instructors[instructorIndex].description : 'Sin descripción'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInstructors;

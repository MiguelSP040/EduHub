import { useEffect, useState, useRef, useMemo } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getCourses, getStudentsByCourse, manageEnrollment, viewVoucherFile } from '../../../services/courseService';
import Loading from '../../utilities/Loading';

const AdminEnrollments = () => {
  const navbarRef = useRef(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingFileId, setLoadingFileId] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isStudentsLoading, setStudentsLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState(null); // 'nombre' | 'fecha' | 'estado'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  const fetchData = async () => {
    try {
      const data = await getCourses();
      const paidCourses = data.filter((course) => course.price > 0 && (course.status === 'Aprobado' || course.status === 'Empezado' || course.status === 'Finalizado') && course.archived !== true);
      setCourses(paidCourses);
    } catch (error) {
      console.error('Error al obtener cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchStudents = async (courseId) => {
    try {
      const data = await getStudentsByCourse(courseId);
      setStudents(data);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleCourseChange = async (event) => {
    setStudentsLoading(true);
    const courseId = event.target.value;
     setSelectedCourse(courseId);
    await  fetchStudents(courseId);
    setStudentsLoading(false);
  };

  const handleManageEnrollment = async (studentId, accept) => {
    if (!selectedCourse) return;

    const response = await manageEnrollment(selectedCourse, studentId, accept);
    if (response.status === 200) {
      alert(response.message);
      setStudents((prevStudents) => prevStudents.map((student) => (student.id === studentId ? { ...student, status: accept ? 'Aceptado' : 'Rechazado', tempRejected: !accept } : student)));
    } else {
      alert(`Error: ${response.message}`);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedStudents = useMemo(() => {
    if (!sortColumn) return students;

    const sorted = [...students];
    sorted.sort((a, b) => {
      let valA, valB;
      switch (sortColumn) {
        case 'nombre':
          valA = (a.name + '' + a.surname + ' ' + (a.lastname || '')).toLowerCase();
          valB = (b.name + '' + b.surname + ' ' + (b.lastname || '')).toLowerCase();
          break;
        case 'fecha':
          valA = a.enrolledDate ? new Date(a.enrolledDate).getTime() : 0;
          valB = b.enrolledDate ? new Date(b.enrolledDate).getTime() : 0;
          break;
        case 'estado':
          valA = a.status?.toLowerCase() || '';
          valB = b.status?.toLowerCase() || '';
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
  }, [students, sortColumn, sortDirection]);

  const getCaretIcon = (column) => {
    if (sortColumn !== column) {
      return <i className="bi bi-caret-down-fill text-muted ms-1"></i>;
    }
    return sortDirection === 'asc' ? <i className="bi bi-caret-up-fill ms-1"></i> : <i className="bi bi-caret-down-fill ms-1"></i>;
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

        {/* CONTENIDO PRINCIPAL */}
        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row gx-3 align-items-center">
                  <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-start">
                    <div className="d-flex flex-row flex-sm-row w-100 justify-content-around justify-content-sm-start">
                      <span className="fw-semibold fs-4">Gestión de Inscripciones</span>
                    </div>
                  </div>
                  <div className="col-12 col-sm text-md-end mt-3 mt-sm-0">
                    <select className="form-select" value={selectedCourse || ''} onChange={handleCourseChange} disabled={isLoading || courses.length === 0}>
                      {isLoading ? (
                        <option value="">Cargando cursos...</option>
                      ) : (
                        <>
                          <option value="" disabled>
                            {courses.length === 0 ? 'No hay cursos aprobados' : 'Seleccione un curso'}
                          </option>
                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.title} - ${course.price}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de estudiantes */}
            {selectedCourse && (
              <div className="table-responsive rounded-3" style={{ maxHeight: '35rem' }}>
                <table className="table table-striped text-nowrap">
                  <thead className="position-sticky top-0">
                    <tr>
                      <th colSpan="5" className="text-center">
                        <h4 className="mb-0">
                          Estudiantes Inscritos - {isStudentsLoading ? '--' : students.length}/{courses.find((course) => course.id === selectedCourse)?.studentsCount}
                        </h4>
                      </th>
                    </tr>
                    <tr>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('nombre')}>
                        Nombre
                        {getCaretIcon('nombre')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fecha')}>
                        Fecha de Inscripción
                        {getCaretIcon('fecha')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('estado')}>
                        Estado
                        {getCaretIcon('estado')}
                      </th>
                      <th>Comprobante</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="align-middle">
                    {isStudentsLoading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-3">
                          <Loading />
                        </td>
                      </tr>
                    ) : sortedStudents.length > 0 ? (
                      sortedStudents.map((student) => (
                        <tr key={student.id}>
                          <td>
                            {student.name} {student.surname} {student.lastname && student.lastname}
                          </td>
                          <td>{student.enrolledDate ? new Date(student.enrolledDate).toLocaleDateString() : 'No disponible'}</td>
                          <td>
  <span
    className={`badge d-inline-flex align-items-center ${
      student.status === 'Aceptado' || student.status === 'Completado'
        ? 'bg-success'
        : student.status === 'Rechazado'
        ? 'bg-danger'
        : 'bg-warning'
    }`}
  >
    <span className="fs-6 fw-normal">
      {student.status}
    </span>
    {student.status === 'Aceptado' || student.status === 'Completado' ? (
      // Ícono de check
      <span className="fs-6">
        <i className="bi bi-check-circle ms-2"></i>
      </span>
    ) : student.status === 'Rechazado' ? (
      // Ícono de "x"
      <span className="fs-6">
        <i className="bi bi-x-circle ms-2"></i>
      </span>
    ) : (
      // Ícono de reloj de arena
      <span className="fs-6">
        <i className="bi bi-hourglass-split ms-2"></i>
      </span>
    )}
  </span>
</td>

                          <td>
                            {student.voucherFile ? (
                              (() => {
                                const rawType = student.voucherFile.fileType || '';
                                const ext = rawType.split('/')[1]?.toLowerCase() || '';
                                const iconExt = ['pdf', 'png', 'jpg', 'jpeg', 'zip', 'svg', 'doc', 'docx'].includes(ext) ? (ext === 'jpeg' ? 'jpg' : ext) : null;
                                const iconClass = iconExt ? `bi bi-filetype-${iconExt}` : 'bi bi-file-earmark-text';

                                return (
                                  <button className="btn btn-sm btn-outline-primary" onClick={() => viewVoucherFile(student.voucherFile.gridFsId, setLoadingFileId)} disabled={loadingFileId === student.voucherFile.gridFsId}>
                                    {loadingFileId === student.voucherFile.gridFsId ? (
                                      <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                    ) : (
                                      <>
                                        <span className="fs-5">
                                          <i className={`${iconClass} me-2`}></i>
                                        </span>
                                        Ver
                                      </>
                                    )}
                                  </button>
                                );
                              })()
                            ) : (
                              <span className="text-muted">
                                <span className="fs-5">
                                  <i className="bi bi-file-earmark-x me-1"></i>
                                </span>{' '}
                                No disponible
                              </span>
                            )}
                          </td>
                          <td>
                            {student.status === 'Pendiente' ? (
                              <>
                                <button className="btn btn-success me-2" onClick={() => handleManageEnrollment(student.id, true)}>
                                  Aceptar
                                </button>
                                <button className="btn btn-danger" onClick={() => handleManageEnrollment(student.id, false)}>
                                  Rechazar
                                </button>
                              </>
                            ) : (
                              <span className="text-muted">Estudiante {student.status.toLowerCase()}</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          No hay estudiantes inscritos en este curso.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminEnrollments;

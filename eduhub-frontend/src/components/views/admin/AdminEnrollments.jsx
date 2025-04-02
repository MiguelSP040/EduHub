import { useEffect, useState, useRef } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getCourses, getStudentsByCourse, manageEnrollment, viewVoucherFile } from '../../../services/courseService';
import { CheckCircle, AlertCircle, FileText } from 'react-feather';

const AdminEnrollments = () => {
  const navbarRef = useRef(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingFileId, setLoadingFileId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        const paidCourses = data.filter((course) => course.price > 0 && (course.status === 'Aprobado' || course.status === 'Empezado' || course.status === 'Finalizado') && course.archived !== true);
        setCourses(paidCourses);
      } catch (error) {
        console.error('Error al obtener cursos:', error);
      }
    };
    fetchCourses();
  }, []);

  const fetchStudents = async (courseId) => {
    try {
      const data = await getStudentsByCourse(courseId);
      setStudents(data);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    }
  };

  const handleCourseChange = async (event) => {
    const courseId = event.target.value;
    await setSelectedCourse(courseId);
    await fetchStudents(courseId);
  };

  const handleManageEnrollment = async (studentId, accept) => {
    if (!selectedCourse) return;

    const response = await manageEnrollment(selectedCourse, studentId, accept);
    if (response.status === 200) {
      alert(response.message);

      setStudents((prevStudents) =>
        accept ? prevStudents.map((student) => (student.id === studentId ? { ...student, status: 'Aceptado' } : student)) : prevStudents.map((student) => (student.id === studentId ? { ...student, status: 'Rechazado', tempRejected: true } : student))
      );
    } else {
      alert(`Error: ${response.message}`);
    }
  };

  return (
    <div className='bg-main'>
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
                      <span className="fw-semibold fs-5">Gestión de Inscripciones</span>
                    </div>
                  </div>
                  <div className="col-12 col-sm text-md-end mt-3 mt-sm-0">
                    <select className="form-select" value={selectedCourse || ''} onChange={handleCourseChange} disabled={courses.length === 0}>
                      <option value="" disabled>
                        {courses.length === 0 ? 'No hay cursos aprobados' : 'Seleccione un curso'}
                      </option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title} - ${course.price}
                        </option>
                      ))}
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
                      <th>Nombre</th>
                      <th>Fecha de Inscripción</th>
                      <th>Estado</th>
                      <th>Comprobante</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="align-middle">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <tr key={student.id}>
                          <td>
                            {student.name} {student.surname} {student.lastname && student.lastname}
                          </td>
                          <td>{student.enrolledDate ? new Date(student.enrolledDate).toLocaleDateString() : 'No disponible'}</td>
                          <td>
                            <span className={`badge d-inline-flex align-items-center text-${student.status === 'Aceptado' || student.status === 'Completado' ? 'bg-success' : 'bg-warning'}`}>
                              <span className="fs-6 fw-normal">{student.status}</span>
                              {student.status === 'Aceptado' || student.status === 'Completado' ? (
                                <span className="fs-6">
                                  <i className="bi bi-check-circle ms-2"></i>
                                </span>
                              ) : (
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
                                        <span className='fs-5'><i className={`${iconClass} me-2`}></i></span>
                                        Ver
                                      </>
                                    )}
                                  </button>
                                );
                              })()
                            ) : (
                              <span className="text-muted">
                                <span className='fs-5'><i className="bi bi-file-earmark-x me-1"></i></span> No disponible
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
                            ) :
                            ( <span className='text-muted'>Estudiante {student.status.toLowerCase()}</span> )
                            }
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

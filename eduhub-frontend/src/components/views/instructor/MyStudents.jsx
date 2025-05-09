import { useEffect, useState, useMemo } from 'react';
import { CheckCircle, AlertCircle, FileText } from 'react-feather';
import { useToast } from '../../utilities/ToastProvider';
import { getStudentsByCourse, deliverCertificates } from '../../../services/courseService';
import jsPDF from 'jspdf';
import Loading from '../../utilities/Loading';

const MyStudents = ({ courseId, courseLenght, deliverCertificatesTrigger, course, instructor, setCanDeliverCertificates }) => {
  const { showSuccess, showError, showWarn } = useToast();

  const [students, setStudents] = useState([]);
  const [certificateStatus, setCertificateStatus] = useState({});
  const [isStudentsLoading, setIsStudentsLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudentsByCourse(courseId);
        setStudents(data);

        const newStatus = {};

        data.forEach((s) => {
          newStatus[s.id] = s.certificateDelivered ? 'Entregado' : s.progress >= 80 && course.hasCertificate ? 'Con derecho' : 'Sin derecho';
        });

        setCertificateStatus(newStatus);

        const eligibleCount = data.filter((s) => s.progress >= 80 && course.hasCertificate && !s.certificateDelivered).length;
        setCanDeliverCertificates?.(eligibleCount > 0);
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
      } finally {
        setIsStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, course.hasCertificate, setCanDeliverCertificates]);

  useEffect(() => {
    if (deliverCertificatesTrigger) {
      handleDeliverCertificates();
    }
  }, [deliverCertificatesTrigger]);

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

    return [...students].sort((a, b) => {
      let valA, valB;

      switch (sortColumn) {
        case 'Nombre':
          valA = `${a.name} ${a.surname}`.toLowerCase();
          valB = `${b.name} ${b.surname}`.toLowerCase();
          break;
        case 'Fecha':
          valA = new Date(a.enrolledDate || 0);
          valB = new Date(b.enrolledDate || 0);
          break;
        case 'Asistencias':
          valA = a.progress;
          valB = b.progress;
          break;
        case 'Estado':
          valA = a.status.toLowerCase();
          valB = b.status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortColumn, sortDirection]);

  const caretIcon = (column) => <span className="ms-1">{sortColumn === column ? sortDirection === 'asc' ? <i className="bi bi-caret-up-fill" /> : <i className="bi bi-caret-down-fill" /> : <i className="bi bi-caret-down-fill text-muted" />}</span>;

  const handleDeliverCertificates = async () => {
    const eligibleStudents = students.filter((s) => certificateStatus[s.id] === 'Con derecho');

    if (eligibleStudents.length === 0) {
      showWarn('Certificados no disponibles', 'No hay estudiantes disponibles para el certificado.');
      return;
    }

    const certificatesPayload = eligibleStudents.map((student) => ({
      studentId: student.id,
      base64: generateCertificatePDF(student),
    }));

    const response = await deliverCertificates(courseId, certificatesPayload);

    if (response.status === 200) {
      const updatedStatus = { ...certificateStatus };
      eligibleStudents.forEach((s) => {
        updatedStatus[s.id] = 'Entregado';
      });
      setCertificateStatus(updatedStatus);

      showSuccess('Certificados entregados', 'Certificados generados y entregados a los estudiantes');

      const updated = await getStudentsByCourse(courseId);
      setStudents(updated);
    } else {
      showError('Error', 'Error al entregar certificados');
    }
  };

  const generateCertificatePDF = (student) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });

    const purple = '#5E60CE';
    const gray = '#666666';
    const black = '#000000';
    const fullName = `${student.name} ${student.surname}${student.lastname ? ' ' + student.lastname : ''}`;
    const instructorFullName = `${instructor.name} ${instructor.surname}${instructor.lastname ? ' ' + instructor.lastname : ''}`;

    doc.setDrawColor(purple);
    doc.setLineWidth(4);
    doc.rect(30, 30, 550, 730);

    doc.setFontSize(28);
    doc.setTextColor(purple);
    doc.setFont('helvetica', 'bold');
    doc.text('EduHubPro', 300, 80, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(black);
    doc.setFont('times', 'bold');
    doc.text('CERTIFICADO DE FINALIZACIÓN', 300, 140, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(gray);
    doc.text('Otorgado a:', 300, 190, { align: 'center' });

    doc.setFontSize(18);
    doc.setFont('times', 'bolditalic');
    doc.setTextColor(black);
    doc.text(fullName, 300, 220, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('times', 'normal');
    doc.setTextColor(gray);
    doc.text(`Por haber completado el curso:`, 300, 260, { align: 'center' });

    doc.setFont('times', 'bold');
    doc.text(`"${course.title}"`, 300, 290, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.text(`con un progreso del ${student.progress}%`, 300, 320, { align: 'center' });

    const startDate = new Date(course.dateStart).toLocaleDateString();
    const endDate = new Date(course.dateEnd).toLocaleDateString();

    doc.setTextColor(black);
    doc.setFontSize(12);
    doc.text(`Fecha de inicio: ${startDate}`, 300, 370, { align: 'center' });
    doc.text(`Fecha de finalización: ${endDate}`, 300, 390, { align: 'center' });

    doc.setFontSize(12);
    doc.text(instructorFullName, 110, 515);
    doc.text('Instructor del curso', 110, 530);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor('#999999');
    doc.setFontSize(10);
    doc.text('EduHubPro · Aprendizaje sin límites', 300, 700, { align: 'center' });

    return doc.output('datauristring').split(',')[1];
  };

  return (
    <div className="table-responsive rounded-3" style={{ maxHeight: '35rem' }}>
      <table className="table table-striped text-nowrap">
        <thead className="position-sticky top-0">
          <tr>
            <th colSpan="5" className="text-center">
              <h4 className="mb-0">
                Estudiantes Inscritos - {isStudentsLoading ? '--' : students.length}/{courseLenght}
              </h4>
            </th>
          </tr>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Nombre')}>
              Nombre {caretIcon('Nombre')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Fecha')}>
              Fecha de Inscripción {caretIcon('Fecha')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Asistencias')}>
              Asistencias {caretIcon('Asistencias')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Estado')}>
              Estado {caretIcon('Estado')}
            </th>
            <th>Certificado</th>
          </tr>
        </thead>
        <tbody>
          {isStudentsLoading ? (
            <tr>
              <td colSpan="5" className="text-center py-5">
                <Loading />
              </td>
            </tr>
          ) : sortedStudents.length > 0 ? (
            sortedStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.name} {student.surname}
                </td>
                <td>{student.enrolledDate ? new Date(student.enrolledDate).toLocaleDateString() : 'No disponible'}</td>
                <td>{student.status === 'Aceptado' || student.status === 'En progreso' || student.status === 'Completado' ? `${student.progress || 0}%` : 'N/A'}</td>
                <td>
                <span className={`badge d-inline-flex align-items-center ${student.status === 'Aceptado' || student.status === 'Completado' ? 'bg-success' : student.status === 'Rechazado' ? 'bg-danger' : 'bg-warning'}`}>
                              <span className="fs-6 fw-normal">{student.status}</span>
                              {student.status === 'Aceptado' || student.status === 'Completado' ? (
                                <span className="fs-6">
                                  <i className="bi bi-check-circle ms-2"></i>
                                </span>
                              ) : student.status === 'Rechazado' ? (
                                <span className="fs-6">
                                  <i className="bi bi-x-circle ms-2"></i>
                                </span>
                              ) : (
                                <span className="fs-6">
                                  <i className="bi bi-hourglass-split ms-2"></i>
                                </span>
                              )}
                            </span>
                </td>
                <td>
                  {certificateStatus[student.id] === 'Entregado' ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <span className="text-success fw-semibold">Entregado</span>
                      <button
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                        onClick={() => {
                          const base64 = student.certificateFile;
                          const byteCharacters = atob(base64);
                          const byteNumbers = new Array(byteCharacters.length);
                          for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                          }
                          const byteArray = new Uint8Array(byteNumbers);
                          const blob = new Blob([byteArray], { type: 'application/pdf' });
                          const tempUrl = URL.createObjectURL(blob);
                          window.open(tempUrl, '_blank');
                        }}
                      >
                        <FileText size={16} className="me-1" />
                      </button>
                    </div>
                  ) : (
                    certificateStatus[student.id]
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-5 text-muted">
                <strong>No hay estudiantes inscritos</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyStudents;

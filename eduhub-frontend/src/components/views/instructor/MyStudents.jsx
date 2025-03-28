import { useEffect, useState } from 'react';
import { getStudentsByCourse, deliverCertificates } from '../../../services/courseService';
import { CheckCircle, AlertCircle, FileText } from 'react-feather';
import jsPDF from 'jspdf';

const MyStudents = ({ courseId, courseLenght, deliverCertificatesTrigger, course, instructor, setCanDeliverCertificates }) => {
  const [students, setStudents] = useState([]);
  const [certificateStatus, setCertificateStatus] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudentsByCourse(courseId);
        setStudents(data);

        const newStatus = {};

        data.forEach((s) => {
          if (s.certificateDelivered === true) {
            newStatus[s.id] = 'Entregado';
          } else if (s.progress >= 80 && course.hasCertificate) {
            newStatus[s.id] = 'Con derecho';
          } else {
            newStatus[s.id] = 'Sin derecho';
          }
        });

        setCertificateStatus(newStatus);

        const eligibleCount = data.filter((s) => s.progress >= 80 && course.hasCertificate && !s.certificateDelivered).length;

        setCanDeliverCertificates(eligibleCount > 0);

        if (typeof setCanDeliverCertificates === 'function') {
          setCanDeliverCertificates(eligibleCount > 0);
        }
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
      }
    };

    fetchStudents();
  }, [courseId, course.hasCertificate, setCanDeliverCertificates]);

  useEffect(() => {
    if (deliverCertificatesTrigger) {
      handleDeliverCertificates();
    }
  }, [deliverCertificatesTrigger]);

  const handleDeliverCertificates = async () => {
    const eligibleStudents = students.filter((s) => certificateStatus[s.id] === 'Con derecho');

    if (eligibleStudents.length === 0) {
      alert('No hay estudiantes con derecho al certificado o ya entregado.');
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

      alert('¡Certificados generados y marcados como entregados en el backend!');

      const updated = await getStudentsByCourse(courseId);
      setStudents(updated);
    } else {
      alert('Error al marcar certificados como entregados: ' + response.message);
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
                Estudiantes Inscritos - {students.length}/{courseLenght}
              </h4>
            </th>
          </tr>
          <tr>
            <th>Nombre</th>
            <th>Fecha de Inscripción</th>
            <th>Asistencias</th>
            <th>Estado</th>
            <th>Certificado</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.name} {student.surname}{' '}
                </td>
                <td>{student.enrolledDate || 'Fecha no disponible'}</td>
                <td>{student.status === 'Aceptado' || student.status === 'En progreso' || student.status === 'Completado' ? `${student.progress || 0}%` : 'N/A'}</td>
                <td>
                  {student.status === 'Aceptado' || student.status === 'Completado' ? (
                    <span className="fw-semibold text-success">
                      {student.status} <CheckCircle color="green" />
                    </span>
                  ) : (
                    <span className="text-warning">
                      {student.status} <AlertCircle color="orange" />
                    </span>
                  )}
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

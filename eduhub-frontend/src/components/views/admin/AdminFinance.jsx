import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '../../utilities/ToastProvider';
import { getAllFinances, payInstructorForCourse } from '../../../services/financeService';
import { getCourses } from '../../../services/courseService';
import { useConfirmDialog } from '../../utilities/ConfirmDialogsProvider';
import FinanceListTransactions from './FinanceListTransactions';
import FinancePieChart from './FinancePieChart';
import logo from '../../../assets/img/eduhub-icon.png';
import Loading from '../../utilities/Loading';

const AdminFinance = () => {
  const { showSuccess, showError } = useToast();
  const { confirmAction } = useConfirmDialog();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navbarRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [unpaidCourses, setUnpaidCourses] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinances();
    fetchUnpaidCourses();
  }, []);

  const fetchFinances = async () => {
    try {
      const finances = await getAllFinances();

      let totalIncomes = 0;
      let totalExpenses = 0;

      finances.forEach((finance) => {
        if (finance.transactionType === 'INCOME') {
          totalIncomes += Number(finance.amount);
        } else if (finance.transactionType === 'EXPENSE') {
          totalExpenses += Number(finance.amount);
        }
      });

      setChartData([
        { name: 'Ingresos', monto: totalIncomes },
        { name: 'Gastos', monto: totalExpenses },
      ]);
    } catch (error) {
      console.error('Error al obtener finanzas:', error);
    }
  };

  const fetchUnpaidCourses = async () => {
    setLoading(true);
    try {
      const allCourses = await getCourses();
      const incomes = await getAllFinances();

      const result = allCourses.filter((course) => {
        const hasIncome = incomes.some((fin) => fin.courseId === course.id && fin.transactionType === 'INCOME');
        return course.paidToInstructor === false && ['Finalizado', 'Empezado'].includes(course.status) && hasIncome;
      });

      setUnpaidCourses(result);
    } catch (error) {
      console.error('Error al obtener cursos pendientes de pago:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const downloadPDF = async () => {
    const input = document.getElementById('pdf-content');
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const title = 'Reporte de métricas de EduHub';

    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = () => {
      pdf.addImage(logoImg, 'PNG', margin, 10, 20, 20);
      pdf.setFontSize(16);
      pdf.text(title, margin + 25, 20);

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', margin, 30, imgWidth, imgHeight);
      pdf.save('reporte_finanzas.pdf');
    };
  };

  const handlePay = (courseId) => {
    confirmAction({
      message: '¿Deseas pagarle al instructor por este curso?',
      header: 'Confirmación de pago',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, pagar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-confirm-dialog-accept',
      rejectClassName: 'p-confirm-dialog-reject',
      onAccept: async () => {
        const res = await payInstructorForCourse(courseId);
        if (res.status !== 200) {
          showError('Error', 'Error al realizar el pago al instructor');
          fetchUnpaidCourses();
          fetchFinances();
        } else {
          showSuccess('Pagado', 'Se ha entregado el pago total al instructor');
          fetchUnpaidCourses();
          fetchFinances();
        }
      },
    });
  };

  return (
    <div className="bg-main">
      {/* SIDEBAR */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} navbarRef={navbarRef} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow-1">
        <div ref={navbarRef}>
          <Navbar toggleSidebar={toggleSidebar} />
        </div>

        <div className="overflow-auto vh-100">
          <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
            {/* BARRA DE NAVEGACIÓN SECUNDARIA */}
            <div className="bg-white shadow-sm mb-4">
              <div className="container-fluid px-4 py-2">
                <div className="row gx-3 align-items-center">
                  <div className="col-12 d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Finanzas</h3>
                    <button className="btn btn-purple-400" onClick={downloadPDF}>
                      <i className="bi bi-download"></i>
                      <span className="d-none d-sm-inline ms-2">Descargar reporte</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido exportable */}
            <div id="pdf-content">
              {/* MÉTRICAS Y CURSOS PENDIENTES */}
              <div className="row gx-md-4 gy-3">
                <div className="col-12 col-md-6">
                  <div className="bg-white shadow-sm p-4 rounded h-100" style={{ maxHeight: '389.50px', overflowY: 'auto' }}>
                    <h4>Cursos pendientes de pago</h4>

                    {isLoading ? (
                      <Loading />
                    ) : unpaidCourses.length === 0 ? (
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <p className="text-muted">No hay cursos pendientes por pagar.</p>
                      </div>
                    ) : (
                      unpaidCourses.map((course) => (
                        <div
                          key={course.id}
                          className="card rounded-4 p-3 notification-card mb-3"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div className="d-flex align-items-top w-100">
                            <h4>
                              <i className="bi bi-cash-stack text-success"></i>
                            </h4>
                            <div className="text-start ms-2 me-2 overflow-x-auto text-nowrap">
                              <div className="d-flex flex-column flex-sm-row gap-2 mb-1">
                                <h6 className="mb-0 fw-bold">{course.title}</h6>
                                <small className="text-muted">- {course.status}</small>
                              </div>
                              <span className="mb-0">Precio: ${course.price}</span> <span>Estudiantes: {course.enrollments.length}</span> <span>Total: ${course.price * course.enrollments.length}</span>
                            </div>
                            <button
                              className="btn ms-auto btn-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePay(course.id);
                              }}
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              Pagar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="bg-white shadow-sm p-4 rounded h-100">
                    <h3>Métricas</h3>
                    <FinancePieChart chartData={chartData} />
                  </div>
                </div>
              </div>

              <div className="row gx-md-4 mt-3">
                <div className="col-12">
                  <div className="bg-white shadow-sm p-4 rounded">
                    <FinanceListTransactions />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminFinance;

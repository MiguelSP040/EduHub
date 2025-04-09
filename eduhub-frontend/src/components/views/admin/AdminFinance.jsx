import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import FinancePieChart from './FinancePieChart';
import { useToast } from '../../utilities/ToastProvider';
import { getAllFinances, payInstructorForCourse } from '../../../services/financeService';
import FinanceListTransactions from './FinanceListTransactions';
import { getCourses } from '../../../services/courseService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../../assets/img/eduhub-icon.png';
import { useConfirmDialog } from '../../utilities/ConfirmDialogsProvider';

const AdminFinance = () => {
  const { showSuccess, showError, showWarn } = useToast();
  const { confirmAction } = useConfirmDialog();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navbarRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [unpaidCourses, setUnpaidCourses] = useState([]);

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
    try {
      const allCourses = await getCourses();
      const incomes = await getAllFinances();
        console.log('allCourses', allCourses);
        console.log('incomes', incomes);


      const result = allCourses.filter((course) => {
        const hasIncome = incomes.some((fin) => fin.courseId === course.id && fin.transactionType === 'INCOME')
        return course.payment === true && course.paidToInstructor === false && ['Finalizado', 'Empezado'].includes(course.status) && hasIncome;
      });

      setUnpaidCourses(result);
    } catch (error) {
      console.error('Error al obtener cursos pendientes de pago:', error);
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
    const pageHeight = pdf.internal.pageSize.getHeight();

    const logoImg = new Image();
    logoImg.src = logo;

    const logoSize = 20;
    const margin = 10;
    const title = 'Reporte de métricas de EduHub';

    logoImg.onload = () => {
      pdf.addImage(logoImg, 'PNG', margin, 10, logoSize, logoSize);
      pdf.setFontSize(16);
      pdf.text(title, margin + logoSize + 5, 20);

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', margin, 30, imgWidth, imgHeight);
      pdf.save('reporte_finanzas.pdf');
    };
  };

  const handlePay = async (courseId) => {
    confirmAction({
      message: '¿Deseas pagarle al instructor por este curso?',
      header: 'Confirmación de pago',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, pagar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-confirm-dialog-accept',
      rejectClassName: 'p-confirm-dialog-reject',
      onAccept: async () => {
        try {
          const res = await payInstructorForCourse(courseId);

          if (res.status !== 200) {
            showError('Error', res.message);
            await fetchUnpaidCourses();
            await fetchFinances();
            return;
          }

          showSuccess('Pagado', res.message);
          await fetchUnpaidCourses();
          await fetchFinances();
        } catch (error) {
          console.error('Error al procesar el pago:', error);
          showError('Error', 'No se pudo completar el pago. Intenta nuevamente.');
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
                      <i className="bi bi-download me-2"></i>
                      Descargar reporte
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido exportable */}
            <div id="pdf-content">
              {/* MÉTRICAS Y CURSOS PENDIENTES */}
              <div className="row gx-md-4 mt-3">
                <div className="col-12 col-md-6">
                  <div className="bg-white shadow-sm p-4 rounded h-100">
                    <h3>Métricas</h3>
                    <FinancePieChart chartData={chartData} />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="bg-white shadow-sm p-4 rounded h-100  ">
                    <h4>Cursos pendientes de pago</h4>
                    {unpaidCourses.length === 0 ? (
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <p className="text-muted">No hay cursos pendientes por pagar.</p>
                      </div>
                    ) : (
                      unpaidCourses.map((course) => (
                        <div key={course.id} className="card mb-3">
                          <div className="card-body">
                            <h5 className="card-title">{course.title}</h5>
                            <p className="card-text">Precio: ${course.price}</p>
                            <p className="card-text">Estado: {course.status}</p>
                            <button className="btn btn-success" onClick={() => handlePay(course.id)}>
                              Pagar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* LISTADO DE TRANSACCIONES */}
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

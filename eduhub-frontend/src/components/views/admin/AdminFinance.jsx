import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import FinancePieChart from "./FinancePieChart";
import { getAllFinances } from "../../../services/financeService";
import FinanceListTransactions from "./FinanceListTransactions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../assets/img/eduhub-icon.png";

const AdminFinance = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const navbarRef = useRef(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchFinances();
    }, []);

    const fetchFinances = async () => {
        try {
            const finances = await getAllFinances();

            let totalIncomes = 0;
            let totalExpenses = 0;

            finances.forEach((finance) => {
                if (finance.transactionType === "INCOME") {
                    totalIncomes += Number(finance.amount);
                } else if (finance.transactionType === "EXPENSE") {
                    totalExpenses += Number(finance.amount);
                }
            });

            setChartData([
                { name: "Ingresos", monto: totalIncomes },
                { name: "Gastos", monto: totalExpenses },
            ]);
        } catch (error) {
            console.error("Error al obtener finanzas:", error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const downloadPDF = async () => {
        const input = document.getElementById("pdf-content");
        if (!input) return;

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const logoImg = new Image();
        logoImg.src = logo;

        const logoSize = 20;
        const margin = 10;
        const title = "Reporte de métricas de EduHub";

        logoImg.onload = () => {
            pdf.addImage(logoImg, "PNG", margin, 10, logoSize, logoSize);
            pdf.setFontSize(16);
            pdf.text(title, margin + logoSize + 5, 20);

            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = pageWidth - 2 * margin;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", margin, 30, imgWidth, imgHeight);
            pdf.save("reporte_finanzas.pdf");
        };
    };

    return (
        <div className='bg-main'>
            {/* SIDEBAR */}
            <Sidebar
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
                navbarRef={navbarRef}
            />

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex-grow-1">
                <div ref={navbarRef}>
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>

                <div className="overflow-auto vh-100">
                    <main className="px-3 px-md-5 pt-5 mt-5 ms-md-5">
                        <div className="row">
                            <div className="col d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">Finanzas</h3>
                                <button className="btn btn-purple-400" onClick={downloadPDF}>Descargar reporte</button>
                            </div>
                        </div>
                        <div id="pdf-content">
                            <div className="row">
                                <div className="col-12 col-md-5 bg-white shadow-sm p-4 rounded mt-3">
                                    <h3>Métricas</h3>
                                    <FinancePieChart chartData={chartData} />
                                </div>
                            </div>

                            <div className="bg-white shadow-sm p-4 rounded mt-2">
                                <FinanceListTransactions />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminFinance;

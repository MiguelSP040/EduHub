import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import FinancePieChart from "./FinancePieChart";
import { getAllFinances } from "../../../services/financeService";
import FinanceListTransactions from "./FinanceListTransactions";

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

    return (
        <div>
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
                                <button className="btn btn-purple-400">Descargar reporte</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-5 bg-white shadow-sm p-4 rounded mt-3">
                                <h3>Métricas</h3>
                                <FinancePieChart chartData={chartData} />
                            </div>
                        </div>

                        <div className="bg-white shadow-sm p-4 rounded mt-2">
                            <FinanceListTransactions />
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminFinance;

import { useEffect, useState, useMemo } from "react";
import {
    PieChart,
    Pie,
    Sector,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { getAllFinances } from "../../../services/financeService";

const COLORS = ["#8884d8", "#dc3545"];

const CustomActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector {...{ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }} />
            <Sector {...{ cx, cy, innerRadius: outerRadius + 6, outerRadius: outerRadius + 10, startAngle, endAngle, fill }} />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
                {`$${value.toFixed(2)}`}
            </text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {(percent * 100).toFixed(0)}%
            </text>
        </g>
    );
};

const FinancePieChart = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [finances, setFinances] = useState([]);

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const data = await getAllFinances();
                setFinances(data);
            } catch (error) {
                console.error("Error al obtener finanzas:", error);
            }
        };
        fetchFinanceData();
    }, []);

    const chartData = useMemo(() => {
        if (!finances.length) return [];

        let ingresos = 0;
        let egresos = 0;

        finances.forEach((item) => {
            const amount = Number(item.amount || 0);
            if (item.transactionType === "INCOME") ingresos += amount;
            else if (item.transactionType === "EXPENSE") egresos += amount;
        });

        return [
            { name: "Ingresos", value: ingresos },
            { name: "Egresos", value: egresos }
        ];
    }, [finances]);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <div>
            {chartData.every(data => data.value === 0) ? (
                <div className="text-center">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[{ name: "Sin transacciones", value: 1 }]}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#ccc"
                            >
                                <Cell fill="#ccc" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <p className="text-muted">No hay transacciones actualmente.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={CustomActiveShape}
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default FinancePieChart;
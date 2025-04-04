import { useEffect, useState } from "react";
import { getAllFinances } from "../../../services/financeService";
import { getCourseById } from "../../../services/courseService";
import { findUserById } from "../../../services/userService";
import Loading from "../../utilities/Loading";

const FinanceListTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [courseMap, setCourseMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await fetchFinances();
    })();
  }, []);

  const fetchFinances = async () => {
    setIsLoading(true);
    try {
      const data = await getAllFinances();
      setTransactions(data);

      const courseIds = [...new Set(data.map((tx) => tx.courseId))];
      const userIds = [...new Set(data.map((tx) => tx.userId))];

      const coursePromises = courseIds.map((id) => getCourseById(id));
      const userPromises = userIds.map((id) => findUserById(id));

      const courseResults = await Promise.all(coursePromises);
      const userResults = await Promise.all(userPromises);

      const courseMapTemp = {};
      courseResults.forEach((course) => {
        if (course?.id) courseMapTemp[course.id] = course.title;
      });
      setCourseMap(courseMapTemp);

      const userMapTemp = {};
      userResults.forEach((user) => {
        if (user?.id)
          userMapTemp[user.id] = `${user.name} ${user.surname} ${user.lastname || ""}`.trim();
      });
      setUserMap(userMapTemp);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-4">
      <h4 className="mb-3">Listado de transacciones</h4>
      <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Curso</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <Loading />
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.transactionDate)}</td>
                  <td>{userMap[item.userId] || item.userId || "—"}</td>
                  <td>{courseMap[item.courseId] || item.courseId || "—"}</td>
                  <td>{item.description || "—"}</td>
                  <td>
                    <span className={`badge ${item.transactionType === "INCOME" ? "badge-purple-color" : "badge-pink-color"}`}>
                      {item.transactionType === "INCOME" ? "Ingreso" : "Egreso"}
                    </span>
                  </td>
                  <td>${Number(item.amount).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay transacciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceListTransactions;

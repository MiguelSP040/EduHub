import { useEffect, useState, useMemo } from 'react';
import { getAllFinances } from '../../../services/financeService';
import { getCourseById } from '../../../services/courseService';
import { findUserById } from '../../../services/userService';
import Loading from '../../utilities/Loading';

const FinanceListTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [courseMap, setCourseMap] = useState(new Map());
  const [userMap, setUserMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState(null); // "fecha" | "usuario" | "tipo" etc.
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    setIsLoading(true);
    try {
      const data = await getAllFinances();
      setTransactions(data);

      const courseIds = [...new Set(data.map((tx) => tx.courseId))].filter(Boolean);
      const userIds = [...new Set(data.map((tx) => tx.userId))].filter(Boolean);

      const [courseResults, userResults] = await Promise.all([Promise.all(courseIds.map((id) => getCourseById(id))), Promise.all(userIds.map((id) => findUserById(id)))]);

      const newCourseMap = new Map();
      courseResults.forEach((course) => {
        if (course?.id) {
          newCourseMap.set(course.id, course.title);
        }
      });
      setCourseMap(newCourseMap);

      const newUserMap = new Map();
      userResults.forEach((user) => {
        if (user?.id) {
          newUserMap.set(user.id, `${user.name} ${user.surname} ${user.lastname || ''}`.trim());
        }
      });
      setUserMap(newUserMap);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setIsLoading(false);
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

  const getCaretIcon = (column) => {
    if (sortColumn !== column) {
      return <i className="bi bi-caret-down-fill text-muted ms-1"></i>;
    }
    if (sortDirection === 'asc') {
      return <i className="bi bi-caret-up-fill ms-1"></i>;
    }
    return <i className="bi bi-caret-down-fill ms-1"></i>;
  };

  const sortedTransactions = useMemo(() => {
    if (!sortColumn) return transactions;

    const sorted = [...transactions];
    sorted.sort((a, b) => {
      let valA, valB;

      switch (sortColumn) {
        case 'fecha': {
          valA = new Date(a.transactionDate).getTime();
          valB = new Date(b.transactionDate).getTime();
          break;
        }
        case 'usuario': {
          const userA = userMap.get(a.userId) || '';
          const userB = userMap.get(b.userId) || '';
          valA = userA.toLowerCase();
          valB = userB.toLowerCase();
          break;
        }
        case 'tipo': {
          valA = a.transactionType || '';
          valB = b.transactionType || '';
          break;
        }
        default: {
          valA = '';
          valB = '';
          break;
        }
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [transactions, sortColumn, sortDirection, userMap]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-4">
      <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th colSpan="6" className="text-center">
                <h4 className="mb-0">Listado de transacciones</h4>
              </th>
            </tr>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fecha')}>
                Fecha
                {getCaretIcon('fecha')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('usuario')}>
                Usuario
                {getCaretIcon('usuario')}
              </th>
              <th>Curso</th>
              <th>Descripción</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('tipo')}>
                Tipo
                {getCaretIcon('tipo')}
              </th>
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
            ) : sortedTransactions.length > 0 ? (
              sortedTransactions.map((item) => {
                const userName = userMap.get(item.userId) || item.userId || '—';
                const courseTitle = courseMap.get(item.courseId) || item.courseId || '—';

                return (
                  <tr key={item.id}>
                    <td>{formatDate(item.transactionDate)}</td>
                    <td>{userName}</td>
                    <td>{courseTitle}</td>
                    <td>{item.description || '—'}</td>
                    <td>
                      <span className={`badge ${item.transactionType === 'INCOME' ? 'badge-purple-color' : 'badge-pink-color'}`}>{item.transactionType === 'INCOME' ? 'Ingreso' : 'Egreso'}</span>
                    </td>
                    <td>${Number(item.amount).toFixed(2)}</td>
                  </tr>
                );
              })
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

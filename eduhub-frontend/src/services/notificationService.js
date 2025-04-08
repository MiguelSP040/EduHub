const API_URL = 'http://localhost:8080/eduhub/api/notifications';

export const getNotifications = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error al obtener notificaciones');
    return await response.json();
  } catch (error) {
    console.error('Error en getNotifications:', error);
    return [];
  }
};

export const markAsRead = async (notificationId, read = true) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/mark-as-read/${notificationId}?read=${read}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error al marcar como leída/no leída');
  } catch (error) {
    console.error('Error en markAsRead:', error);
  }
};

export const deleteReadNotifications = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/delete-read`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error al eliminar notificaciones leídas');
  } catch (error) {
    console.error('Error en deleteReadNotifications:', error);
  }
};
const API_URL = "http://localhost:8080/eduhub/api/session";

export const createSession = async (sessionData) => {
  const token = localStorage.getItem("token");

  if (typeof sessionData.multimedia === "string") {
    sessionData.multimedia = [sessionData.multimedia];
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sessionData),
    });

    const text = await response.text();
    console.log("Respuesta del servidor:", text);

    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: "Sesión registrada exitosamente" };
  } catch (error) {
    console.error("Error al crear la sesión:", error);
    return { status: 500, message: "Error de conexión con el servidor" };
  }
};

export const getSessionsByCourse = async (courseId) => {
  const token = localStorage.getItem("token");
  //console.log("Obteniendo sesiones para el curso:", courseId);
  
  try {
    const response = await fetch(`${API_URL}/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Error al obtener sesiones:", response.statusText);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error en getSessionsByCourse:", error);
    return [];
  }
};

export const updateSession = async (sessionData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      return { status: response.status, message: await response.text() };
    }
    return { status: 200, message: "Sesión actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar sesión:", error);
    return { status: 500, message: "Error de conexión con el servidor" };
  }
};

export const deleteSession = async (sessionId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { status: response.status, message: await response.text() };
    }
    return { status: 200, message: "Sesión eliminada correctamente" };
  } catch (error) {
    console.error("Error al eliminar sesión:", error);
    return { status: 500, message: "Error de conexión con el servidor" };
  }
};

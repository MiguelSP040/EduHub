const API_URL = "http://localhost:8080/eduhub/api/session";

export const createSession = async (sessionData) => {
  const token = localStorage.getItem("token");

  try {
    const isFormData = sessionData instanceof FormData;
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(!isFormData && { "Content-Type": "application/json" })
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: isFormData ? sessionData : JSON.stringify(sessionData)
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
    const isFormData = sessionData instanceof FormData;

    const headers = {
      Authorization: `Bearer ${token}`,
      ...(!isFormData && { "Content-Type": "application/json" }),
    };

    const response = await fetch(API_URL, {
      method: "PUT",
      headers,
      body: isFormData ? sessionData : JSON.stringify(sessionData),
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }

    return { status: 200, message: text || "Sesión actualizada correctamente" };
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

export const downloadFile = async (sessionId, fileId, fileName) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${sessionId}/multimedia/${fileId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al descargar el archivo: ${response.statusText}`);
    }

    const blob = await response.blob();
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Error en la descarga:", error);
    alert("Ocurrió un error al descargar el archivo.");
  }
};

export const handleViewFile = async (sessionId, file, setLoadingId) => {
  try {
    if (setLoadingId) setLoadingId(file.id);
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${sessionId}/multimedia/${file.id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`Error al descargar el archivo: ${response.statusText}`);
    const blob = await response.blob();
    const tempUrl = URL.createObjectURL(blob);
    window.open(tempUrl, '_blank');
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al visualizar el archivo.");
  } finally {
    if (setLoadingId) setLoadingId(null);
  }
};


export const removeFileFromSession = async (sessionId, fileId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/${sessionId}/multimedia/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Error al eliminar archivo");
    }

    return { status: 200, message: "Archivo eliminado correctamente" };
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    return { status: 500, message: error.message };
  }
};
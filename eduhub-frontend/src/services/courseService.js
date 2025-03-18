const API_URL = 'http://localhost:8080/eduhub/api/courses';

export const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });
    
    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: "Curso registrado exitosamente" };
  } catch (error) {
    console.error("Error al crear el curso:", error);
    return { status: 500, message: "Error de conexión con el servidor" };
  }
};

export const getCourses = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener cursos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getCourses:", error);
    throw error;
  }
};

export const getCourseById = async (courseId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getStudentsByCourse = async (courseId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/${courseId}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getStudentsByCourse:", error);
    return [];
  }
};

export const requestEnrollment = async (courseId, studentId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/${courseId}/enroll/${studentId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const message = await response.text();
    return { status: response.status, message };
  } catch (error) {
    console.error("Error en requestEnrollment:", error);
    return { status: 500, message: "Error de conexión con el servidor" };
  }
};

export const manageEnrollment = async (courseId, studentId, accept) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/${courseId}/enrollment/${studentId}?accept=${accept}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    const message = await response.text();
    return { status: response.status, message };
  } catch (error) {
    console.error("Error en manageEnrollment:", error);
    return { status: 500, message: "Error de conexión con el servidor" };
  }
};


export const getCoursesByInstructor = async (instructorId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/instructor/${instructorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener cursos del instructor");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getCoursesByInstructor:", error);
    throw error;
  }
};

export const updateCourse = async (courseData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: "Curso actualizado exitosamente" };
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    return { status: 500, message: "Error de conexión con el servidor" };
  }
};

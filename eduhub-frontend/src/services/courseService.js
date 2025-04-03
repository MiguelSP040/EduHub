const API_URL = 'http://localhost:8080/eduhub/api/courses';

export const getCourses = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener cursos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getCourses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getStudentsByCourse = async (courseId) => {
  const token = localStorage.getItem('token');
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
    console.error('Error en getStudentsByCourse:', error);
    return [];
  }
};

export const getCoursesByInstructor = async (instructorId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/instructor/${instructorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener cursos del instructor');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getCoursesByInstructor:', error);
    throw error;
  }
};

export const createCourse = async (courseData, file) => {
  const token = localStorage.getItem('token');
  try {
    // Armamos FormData
    const body = new FormData();
    // El JSON del curso sin coverImage
    body.append('course', new Blob([JSON.stringify(courseData)], { type: 'application/json' }));

    // Si hay archivo, lo agregamos
    if (file) {
      body.append('coverImage', file);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: 'Curso registrado exitosamente' };
  } catch (error) {
    console.error('Error al crear el curso:', error);
    return { status: 500, message: 'Error de conexión con el servidor' };
  }
};

export const publishCourse = async (courseId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${courseId}/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      return { status: response.status, message };
    }

    const updatedCourse = await response.json();
    return { status: 200, message: 'Curso enviado para aprobación.', course: updatedCourse };
  } catch (error) {
    console.error('Error al publicar curso:', error);
    return { status: 500, message: 'Error de conexión con el servidor' };
  }
};

export const approveCourse = async (courseId, approve) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${courseId}/approve?approve=${approve}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: `Curso ${approve ? 'aprobado' : 'rechazado'} correctamente.` };
  } catch (error) {
    console.error('Error al aprobar curso:', error);
    return { status: 500, message: 'Error de conexión con el servidor' };
  }
};

export const requestModification = async (courseId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${courseId}/modify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: 'Curso ahora requiere nueva aprobación.' };
  } catch (error) {
    console.error('Error al solicitar modificación:', error);
    return { status: 500, message: 'Error de conexión con el servidor' };
  }
};

export const archiveCourse = async (courseId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${courseId}/archive`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const text = await response.text();
    return { status: response.status, message: text };
  } catch (error) {
    return { status: 500, message: 'Error de conexión al archivar el curso.' };
  }
};

export const duplicateCourse = async (courseId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${courseId}/duplicate`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const text = await response.text();
    return { status: response.status, message: text };
  } catch (error) {
    return { status: 500, message: 'Error de conexión al duplicar el curso.' };
  }
};

export const requestEnrollment = async (courseId, studentId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${courseId}/enroll/${studentId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    const message = await response.text();
    return { status: response.status, message };
  } catch (error) {
    console.error('Error en requestEnrollment:', error);
    return { status: 500, message: 'Error de conexión con el servidor' };
  }
};

export const manageEnrollment = async (courseId, studentId, accept) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Error: No se encontró un token en localStorage.');
    return { status: 401, message: 'No autorizado: Token no encontrado.' };
  }

  try {
    const response = await fetch(`${API_URL}/${courseId}/manage-enrollment/${studentId}/${accept}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const message = await response.text();

    if (!response.ok) {
      console.error('Error en manageEnrollment:', message);
      return { status: response.status, message };
    }

    return { status: 200, message };
  } catch (error) {
    console.error('Error en manageEnrollment:', error);
    return { status: 500, message: 'Error de conexión con el servidor.' };
  }
};

export const deliverCertificates = async (courseId, certificates) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/${courseId}/deliver-certificates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(certificates),
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: "Certificados entregados exitosamente." };
  } catch (error) {
    console.error("Error en deliverCertificates:", error);
    return { status: 500, message: "Error de conexión con el servidor." };
  }
};

export const viewVoucherFile = async (gridFsId, setLoadingId) => {
  try {
    if (setLoadingId) setLoadingId(gridFsId);
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/eduhub/api/courses/view-file/${gridFsId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Error al obtener el archivo: ${response.statusText}`);

    const blob = await response.blob();
    const tempUrl = URL.createObjectURL(blob);
    window.open(tempUrl, "_blank");
  } catch (error) {
    console.error(error);
    alert("No se pudo mostrar el archivo.");
  } finally {
    if (setLoadingId) setLoadingId(null);
  }
};

export const updateCourse = async (courseData) => {
  const token = localStorage.getItem('token');

  try {
    let body;
    let headers = {
      Authorization: `Bearer ${token}`,
    };

    if (courseData instanceof FormData) {
      body = courseData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(courseData);
    }

    const response = await fetch(`${API_URL}`, {
      method: 'PUT',
      headers,
      body,
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: 'Curso actualizado exitosamente' };
  } catch (error) {
    console.error('Error al actualizar el curso:', error);
    return { status: 500, message: 'Error de conexión con el servidor' };
  }
};

export const startCourse = async (courseId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${courseId}/start`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: text };
  } catch (error) {
    return { status: 500, message: 'Error de conexión con el servidor.' };
  }
};

export const finishCourse = async (courseId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${courseId}/finish`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: text };
  } catch (error) {
    return { status: 500, message: 'Error de conexión con el servidor.' };
  }
};

export const resetCourseToApproved = async (courseId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${courseId}/reset`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    if (!response.ok) {
      return { status: response.status, message: text };
    }
    return { status: 200, message: 'Curso reiniciado a estado Aprobado.' };
  } catch (error) {
    console.error('Error al reiniciar curso:', error);
    return { status: 500, message: 'Error de conexión con el servidor.' };
  }
};

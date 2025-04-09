const API_URL = "http://44.208.29.225:8080/eduhub/api/user";

export const findAllUsers = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response.json();
};

export const findUserById = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
  });
  if (!response.ok) {
      throw new Error("Error al obtener el usuario");
  }
  return response.json();
};

export const activateInstructor = async (instructorId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/activate/${instructorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      return { status: response.status, message };
    }

    return { status: 200, message: "Instructor activado correctamente." };
  } catch (error) {
    console.error("Error en activateInstructor:", error);
    return { status: 500, message: "Error de conexión con el servidor." };
  }
};


export const updateProfile = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });

    return response;
  } catch (error) {
    return { status: 500, ok: false, message: "Error de conexión con el servidor." }
  }
};


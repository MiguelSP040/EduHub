const API_URL = 'http://localhost:8080/eduhub/api/finances';

// Obtener todas las finanzas
export const getAllFinances = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`


                ,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener finanzas");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getAllFinances:", error);
        throw error;
    }
};

// Obtener una finanza por ID
export const getFinanceById = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener la finanza");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getFinanceById:", error);
        throw error;
    }
};

// Crear una nueva finanza
export const createFinance = async (finance) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(finance)
        });

        const text = await response.text();
        if (!response.ok) {
            return { status: response.status, message: text };
        }

        return { status: 200, message: "Finanza registrada correctamente" };
    } catch (error) {
        console.error("Error en createFinance:", error);
        return { status: 500, message: "Error de conexión con el servidor" };
    }
};

// Actualizar una finanza
export const updateFinance = async (id, finance) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(finance)
        });

        const text = await response.text();
        if (!response.ok) {
            return { status: response.status, message: text };
        }

        return { status: 200, message: "Finanza actualizada correctamente" };
    } catch (error) {
        console.error("Error en updateFinance:", error);
        return { status: 500, message: "Error de conexión con el servidor" };
    }
};

// Eliminar una finanza
export const deleteFinance = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const text = await response.text();
        if (!response.ok) {
            return { status: response.status, message: text };
        }

        return { status: 200, message: "Finanza eliminada correctamente" };
    } catch (error) {
        console.error("Error en deleteFinance:", error);
        return { status: 500, message: "Error de conexión con el servidor" };
    }
};

//Pagar a Instructor
export const payInstructorForCourse = async (courseId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/pay-instructor/${courseId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const text = await response.text();
        return {
            status: response.status,
            message: text,
        };
    } catch (error) {
        console.error("Error al pagar al instructor:", error);
        return {
            status: 500,
            message: "Error de conexión con el servidor",
        };
    }
};

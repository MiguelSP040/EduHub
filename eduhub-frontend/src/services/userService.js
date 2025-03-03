const API_URL = "http://localhost:8080/eduhub/api";

export const findAllUsers = async (token) => {
    const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response;
};

export const findUserById = async (id, token) => {
    const response = await fetch(`${API_URL}/user/${id}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response;
}

export const updateProfile = async (userData, token) => {
    const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData),
    });

    return response;
};


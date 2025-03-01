const API_URL = "http://localhost:8080/eduhub/api";

export const findAllUsers = async () => {
    const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        authorization: `Bearer ${localStorage.getItem("token")}`
    });
    return response;
};

export const findUserById = async (id) => {
    const response = await fetch(`${API_URL}/user/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        authorization: `Bearer ${localStorage.getItem("token")}`
    });
    return response;
}

export const updateProfile = async (userData) => {
    const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        authorization: `Bearer ${localStorage.getItem("token")}`,
        body: JSON.stringify(userData),
    });
    return response;
};
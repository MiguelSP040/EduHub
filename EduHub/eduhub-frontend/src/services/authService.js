const API_URL = "http://localhost:8080/eduhub";

export const login = async (user, password) => {
    const response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
    });
    return response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return response;
};

export const checkEmail = async (email) => {
    const response = await fetch(`${API_URL}/auth/check-email?email=${email}`);
    return response.json();
};

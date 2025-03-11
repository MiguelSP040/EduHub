import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL = "http://192.168.100.200:8080/eduhub";  // Para dispositivo Android físico


export const login = async (user, password) => {
    try {
      const response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
  
      console.log("Estado HTTP:", response.status); // Verifica el estado de la respuesta
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en el login:", errorData);
        throw new Error(JSON.stringify(errorData));
      }
  
      const data = await response.json();
      console.log("Respuesta de la API:", data); // Verifica la respuesta
  
      // Verifica si el token y los datos del usuario están presentes
      if (data.body.token && data.body.user) {
        // Guardar token y datos del usuario en AsyncStorage
        await AsyncStorage.setItem('authToken', data.body.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.body.user));
        console.log("Token y datos del usuario guardados:", data.body.token, data.body.user);
        return { token: data.body.token, user: data.body.user }; // Devuelve ambos
      } else {
        throw new Error("Token o datos del usuario no encontrados en la respuesta");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      throw error;
    }
  };

export const logout = async () => {
    try {
        await AsyncStorage.removeItem("authToken");
        console.log("Token eliminado");
    } catch (error) {
        console.error("Error al eliminar el token:", error);
    }
};

export const register = async (user) => {
    try {
        const response = await fetch(`${API_URL}/api/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        console.log("Estado HTTP:", response.status); // Verifica el estado de la respuesta

        // Solo devolver el estado HTTP
        return { status: response.status };
    } catch (error) {
        // Si hay un error en la conexión o cualquier otro error, lo capturamos
        console.error("Error de conexión:", error);
        throw new Error("No se pudo conectar con el servidor");
    }
};



export const checkEmail = async (email) => {
    const response = await fetch(`${API_URL}/auth/check-email?email=${email}`);
    return response.json();
};


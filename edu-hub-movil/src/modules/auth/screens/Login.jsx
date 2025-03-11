import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Input, Icon, Image, Button } from "@rneui/themed";
import { login } from "../../../config/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation, setIsLoggedIn }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ user: "", password: "" });
  const [showPassword, setShowPassword] = useState(true);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    console.log("Valor de user:", user); // Verifica el valor de user
    console.log("Valor de password:", password); // Verifica el valor de password

    // Validar que los campos no estén vacíos
    if (!user || !password) {
      setMessage("El nombre de usuario y la contraseña son obligatorios.");
      return;
    }

    try {
      // Intentar iniciar sesión
      const { token, user: userData } = await login(user, password);

      // Verificar si se obtuvieron el token y los datos del usuario
      if (token && userData) {
        console.log("Inicio de sesión exitoso. Token:", token);

        // Guardar el token en AsyncStorage
        await AsyncStorage.setItem("authToken", token);

        // Actualizar el estado de autenticación usando setIsLoggedIn
        setIsLoggedIn(true);

        // Navegar a la pantalla de perfil (si es necesario)
        //navigation.navigate("Profile", { user: userData });
      } else {
        setMessage("No se pudo iniciar sesión. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error en handleLogin:", error);

      // Manejar el mensaje de error
      let errorMessage = "Error al intentar iniciar sesión.";

      // Si el error tiene un mensaje específico, usarlo
      if (error.message) {
        try {
          const parsedError = JSON.parse(error.message);
          errorMessage = parsedError.user || errorMessage;
        } catch (e) {
          errorMessage = error.message;
        }
      }

      setMessage(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/eduhub-icon.png")}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.subtitle}>¡Hola de nuevo!</Text>

      <Input
        placeholder="Usuario"
        label="Correo electronico o usuario"
        keyboardType="email-address"
        inputContainerStyle={{ width: "100%" }}
        onChange={({ nativeEvent: { text } }) => setUser(text)}
        errorMessage={error.email}
        style={styles.input}
      />
      <Input
        placeholder="Contraseña"
        label="Constraseña"
        secureTextEntry={showPassword}
        inputContainerStyle={{ width: "100%" }}
        onChange={({ nativeEvent: { text } }) => setPassword(text)}
        errorMessage={error.password}
        rightIcon={
          <Icon
            onPress={() => setShowPassword(!showPassword)}
            type="material-community"
            name={showPassword ? "eye-outline" : "eye-off-outline"}
          />
        }
      />
      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonCreateAccount}
        onPress={() => navigation.navigate("CreateAccount")}
      >
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonLogin: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "#AA39AD",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  buttonCreateAccount: {
    width: "100%",
    backgroundColor: "#604274",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 10,
  },
  forgotPassword: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
    alignSelf: "flex-end",
  },
});

export default Login;

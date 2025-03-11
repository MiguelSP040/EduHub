import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Input } from "@rneui/themed";
import { Icon } from "@rneui/base";
import { register } from "../../../config/authService";
import Messages from "../../../kernel/components/Messages";
import { CommonActions } from "@react-navigation/native"; // Importar CommonActions

const ContinueCreate = ({ route = {}, navigation }) => {
  // Asignar valores por defecto a route.params
  const { name = "", surname = "", email = "" } = route.params || {};

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(true);

  // Estados para controlar el mensaje
  const [showMessage, setShowMessage] = useState(false);
  const [messageData, setMessageData] = useState({
    title: "",
    message: "",
    image: null,
  });

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError({ ...error, confirmPassword: "Las contraseñas no coinciden" });
      return;
    }

    const userData = {
      name,
      surname,
      email,
      username,
      password,
      role: "ROLE_STUDENT",
      description: "Hola soy un usuario",
      isValidated: false,
      lastname: "xd",
    };

    console.log("Datos enviados:", JSON.stringify(userData, null, 2)); // Verifica el JSON

    try {
      const response = await register(userData);

      // Verificar el estado HTTP
      if (response.status === 200) {
        // Mostrar mensaje de éxito
        setMessageData({
          title: "Éxito",
          message: "Usuario registrado correctamente",
          image: require('../../../../assets/Aprobado.png'), // Asegúrate de tener esta imagen
        });
        setShowMessage(true);

        // Limpiar los campos y reiniciar el stack después de 3 segundos
        setTimeout(() => {
          setShowMessage(false);
          setUsername("");
          setPassword("");
          setConfirmPassword("");

          // Reiniciar el stack y navegar al LoginStack
          navigation.dispatch(
            CommonActions.reset({
              index: 0, // Reiniciar el stack
              routes: [
                { name: "Login" }, // Navegar al stack que contiene Login
              ],
            })
          );
        }, 3000); // 3 segundos
      } else {
        // Mostrar mensaje de error
        setMessageData({
          title: "Error",
          message: `Error en el registro. Estado HTTP: ${response.status}`,
          image: require('../../../../assets/Error.png'), // Asegúrate de tener esta imagen
        });
        setShowMessage(true);

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error de conexión:", error);

      // Mostrar mensaje de error de conexión
      setMessageData({
        title: "Error",
        message: "No se pudo conectar con el servidor",
        image: require('../../../../assets/Error.png'), // Asegúrate de tener esta imagen
      });
      setShowMessage(true);

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo te gustaría que te llamemos?</Text>

      <Input
        style={styles.input}
        placeholder="Ingresa tu apodo"
        label="Apodo"
        inputContainerStyle={{ width: "100%" }}
        onChangeText={(text) => setUsername(text)} // Usar onChangeText
        value={username} // Controlar el valor del input
        errorMessage={error.username}
      />
      <Text style={styles.note}>Piensa en una contraseña segura</Text>

      <Input
        placeholder="Ingresa una contraseña"
        label="Constraseña"
        secureTextEntry={showPassword}
        inputContainerStyle={{ width: "100%" }}
        onChangeText={(text) => setPassword(text)} // Usar onChangeText
        value={password} // Controlar el valor del input
        errorMessage={error.password}
        rightIcon={
          <Icon
            onPress={() => setShowPassword(!showPassword)}
            type="material-community"
            name={showPassword ? "eye-outline" : "eye-off-outline"}
          />
        }
      />

      <Input
        placeholder="Confirmar contraseña"
        label="Confirme su nueva contraseña"
        secureTextEntry={showPassword}
        inputContainerStyle={{ width: "100%" }}
        onChangeText={(text) => setConfirmPassword(text)} // Usar onChangeText
        value={confirmPassword} // Controlar el valor del input
        errorMessage={error.confirmPassword}
        rightIcon={
          <Icon
            onPress={() => setShowPassword(!showPassword)}
            type="material-community"
            name={showPassword ? "eye-outline" : "eye-off-outline"}
          />
        }
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>¡Empieza a aprender!</Text>
      </TouchableOpacity>

      {/* Mostrar el componente Messages condicionalmente */}
      {showMessage && (
        <View style={styles.messageContainer}>
          <Messages
            title={messageData.title}
            message={messageData.message}
            image={messageData.image}
          />
        </View>
      )}
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
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  note: {
    fontSize: 14,
    color: "gray",
  },
  button: {
    width: "100%",
    backgroundColor: "#AA39AD",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  messageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
});

export default ContinueCreate;
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { logout } from "../../../config/authService";
import AvatarComponent from "../components/AvatarComponent";
import ProfileOptions from "../components/ProfileOptions";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Profile({ route, setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const navigation = useNavigation(); // Obtén el objeto navigation

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUserData();
  }, []);
  

  const handleLogout = async () => {
    try {
      await logout(); // Llama a la función de logout
      await AsyncStorage.removeItem("authToken"); // Elimina el token de AsyncStorage
      await AsyncStorage.removeItem("userData"); // Elimina los datos del usuario de AsyncStorage
      setIsLoggedIn(false); // Actualiza el estado de autenticación
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!user) {
    return <Text>Cargando...</Text>; // Mostrar un mensaje de carga mientras se obtienen los datos
  }

  return (
    <View style={styles.container}>
      <AvatarComponent userName={user.username} description={user.description} />
      <View style={styles.editarPerfil}>
        <TouchableOpacity style={styles.square}>
          <Icon name="edit" size={32} color="#6200ee" />
        </TouchableOpacity>
      </View>
      <View style={styles.container2}>
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Apellidos</Text>
          <Text style={styles.value}>{user.surname}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Correo electrónico</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      </View>
      <ProfileOptions />
      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 64,
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
  datosUsuario: {
    marginBottom: 10,
  },
  editarPerfil: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
    marginTop: 5,
    marginRight: 15,
  },
  input: {
    borderRadius: 10,
    borderBlockColor: "#6200ee",
    marginBottom: 10,
  },
  container2: {
    padding: 16,
    backgroundColor: "white",
  },
  field: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
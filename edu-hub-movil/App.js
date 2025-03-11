import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navigation from './src/navigation/Navigation';
import NavigationLogger from './src/navigation/NavigationLogger';
import Loading from './src/kernel/components/Loading';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Token obtenido en App.js:", token);
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error al obtener el token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (isLoading) {
    return <Loading isVisible={true} size={64} color='#AA39AD' title='Espere un momento' />;
  } else {
    if (isLoggedIn) {
      return <NavigationLogger setIsLoggedIn={setIsLoggedIn} />;
    } else {
      return <Navigation setIsLoggedIn={setIsLoggedIn} />; // Pasa setIsLoggedIn como prop
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

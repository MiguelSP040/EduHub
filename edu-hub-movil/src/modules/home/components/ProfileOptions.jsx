import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asegúrate de instalar esta librería

const { width } = Dimensions.get('window');

const ProfileOptions = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recursos</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.square}>
          <Icon name="password" size={32} color="#6200ee" />
          <Text style={styles.optionText}>EDITAR CONTRASEÑA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.square}>

          <Icon name="person" size={32} color="#6200ee" />
          <Text style={styles.optionText}>ASISTENCIA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.square}>
          <Icon name="assignment" size={32} color="#6200ee" />
          <Text style={styles.optionText}>CERTIFICADOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  square: {
    width: (width - 48) / 3, // Ajusta el ancho para que quepan 3 cuadrados en una fila con padding
    aspectRatio: 1, // Mantiene la proporción cuadrada
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ProfileOptions;
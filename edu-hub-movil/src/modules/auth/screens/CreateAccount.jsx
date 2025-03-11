import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';

const CreateAccount = ({ navigation }) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState({ name: "", surname: "", email: "" });

    // Función para limpiar los inputs
    const clearInputs = () => {
        setName("");
        setSurname("");
        setEmail("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¡Crea tu cuenta y aprende sin límites!</Text>

            <Input
                style={styles.input}
                placeholder="Ingresa tu nombre"
                label="Nombre"
                inputContainerStyle={{ width: '100%' }}
                onChangeText={(text) => setName(text)} // Usar onChangeText
                value={name} // Controlar el valor del input
                errorMessage={error.name}
            />

            <Input
                style={styles.input}
                placeholder="Ingresa tu apellido"
                label="Apellido"
                inputContainerStyle={{ width: '100%' }}
                onChangeText={(text) => setSurname(text)} // Usar onChangeText
                value={surname} // Controlar el valor del input
                errorMessage={error.surname}
            />

            <Input
                style={styles.input}
                placeholder="Ingresa tu correo"
                label="Correo"
                inputContainerStyle={{ width: '100%' }}
                onChangeText={(text) => setEmail(text)} // Usar onChangeText
                value={email} // Controlar el valor del input
                errorMessage={error.email}
            />

            {/* Botón "Continuar" */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate("ContinueCreate", { name, surname, email });
                    clearInputs(); // Limpiar los inputs
                }}
            >
                <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>

            {/* Botón "¿Ya tienes cuenta?" */}
            <TouchableOpacity
                style={styles.buttonBack}
                onPress={() => {
                    navigation.navigate("Login");
                    clearInputs(); // Limpiar los inputs
                }}
            >
                <Text style={styles.buttonText}>¿Ya tienes cuenta?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        marginBottom: 10,
        paddingHorizontal: 10,
        marginTop: 10,
        borderRadius: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#AA39AD',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 10,
    },
    buttonBack: {
        width: '100%',
        backgroundColor: '#604274',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    loginText: {
        fontSize: 14,
    },
    loginLink: {
        color: 'blue',
        fontWeight: 'bold',
    },
});

export default CreateAccount;
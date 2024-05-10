import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function Login() {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Username</Text>
            <TextInput 
                style={styles.input}
                placeholder='Enter your username'
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput 
                style={styles.input}
                placeholder='Enter your password'
                secureTextEntry={true} // Hides the password
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}> Log In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        marginTop: 30
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 15,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff', // Optional, for better visibility on some screens
    },
    button: {
        backgroundColor: '#0066cc',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

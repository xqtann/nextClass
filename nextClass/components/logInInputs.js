import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const userNameHandler = (text) => {
        setUsername(text);
        console.log(text);
    }
    const passWordHandler = (text) => {
        setPassword(text);
        console.log(text);
    }
    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                placeholder='Enter your username'
                autoCapitalize="none"
                onChangeText={userNameHandler}  // Update to use setUsername
                value={username}            // Add value prop to bind state
            />
            
            <TextInput 
                style={styles.input}
                placeholder='Enter your password'
                secureTextEntry={true}      // Hides the password
                autoCapitalize="none"
                onChangeText={passWordHandler}  // Update to use setPassword
                value={password}            // Add value prop to bind state
            />

            <TouchableOpacity style={styles.button} onPress={() => {
                setPassword('');
                setUsername('');
            }}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        marginTop: 50
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 10,
        width: 200,
        marginBottom: 15,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff', // Optional, for better visibility on some screens
    },
    button: {
        backgroundColor: '#0066cc',
        paddingVertical: 10, // Adjusted for better spacing vertically
        paddingHorizontal: 20, // Added for better spacing horizontally
        alignItems: 'center',
        justifyContent: 'center', // Ensure text is centered vertically
        borderRadius: 5,
        height: 35, // Ensure there's enough height for the text and padding
    },
    buttonText: {
        color: '#ffffff', // Changed for better visibility
        fontSize: 13,
        fontWeight: 'bold',
    }
});

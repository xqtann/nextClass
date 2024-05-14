import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import TextInput from "react-native-text-input-interactive";

export default function LogInInputs(props) {
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

            <ThemedButton name="rick" type='primary' style={styles.button} onPress={() => {
                setPassword('');
                setUsername('');
            }}>
                {props.funct}
            </ThemedButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 20,
        marginTop: 50,
        alignItems: "center"
    },
    input: {
        marginTop: 10,
    },
    button: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center', // Ensure text is centered vertically
    },
    buttonText: {
        color: '#ffffff', // Changed for better visibility
        fontSize: 13,
        fontWeight: 'bold',
    }
});

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

export default function Home({ navigation }) {
    const [user, setUser] = useState(null);
    const apiUrl = `https://api.nusmods.com/v2`;
    const acadYear = '2022-2023';
    const moduleCode = 'BT2102';
    
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  })

  const getData = () => {
    fetch(`${apiUrl}/${acadYear}/modules/${moduleCode}.json`)
        .then(res => {
            console.log('success');
            return res.json();
        })
        .then(result => {
            // Logging the full result in a formatted manner
            console.log('Fetched data:', JSON.stringify(result, null, 2));
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};

    return (
      <View style={styles.container}>
        <Text style={styles.text}> HomePage for {user ? user.email : "Guest"} </Text>
        <Button title='fetch api' onPress={ getData } />
        {!user ? <ThemedButton name="rick" type="primary" style={styles.button} onPress={() => navigation.navigate("Login")}>Login</ThemedButton> : ""}
        {user ? <ThemedButton name="rick" type="primary" style={styles.button} onPress={() => FIREBASE_AUTH.signOut()}>LogOut</ThemedButton> : ""}
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },
    text: {
        fontSize: 20,
        textAlign: "center"
    },
    button: {
        margin: 10,
        alignSelf: "center"
    }
})

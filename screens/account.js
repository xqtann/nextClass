import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

export default function Account({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  })
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Account Page for {user ? user.email : "Guest"} </Text>
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

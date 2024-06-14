import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsButton from '../components/SettingsButton';

export default function Account({ navigation }) {

  const auth = getAuth();
  const user = auth.currentUser;
  const [storedUser, setStoredUser] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        console.log('Stored data:', storedUsername);
        if (storedUsername) {
          setStoredUser(storedUsername);
        } else {
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.text}> Account Page for {user ? user.displayName : storedUser} </Text>
        <SettingsButton title="Change Username" onPress={()=>console.log("presschangeusername")}/>
        <SettingsButton title="Change Password" onPress={()=>console.log("presschange pw")}/>
        <SettingsButton title="Delete Profile" onPress={()=>console.log("delete")}/>
        <SettingsButton title="Feedback and Suggestions" onPress={()=>console.log("fb")}/>
        {/* {!user ? <ThemedButton name="rick" type="primary" style={styles.button} onPress={() => navigation.navigate("Login")}>Login</ThemedButton> : ""} */}
        {user || storedUser != '' ? <ThemedButton name="rick" type="primary" style={styles.button} onPress={() => {
          FIREBASE_AUTH.signOut(); 
          navigation.navigate("Login"); 
          AsyncStorage.removeItem("username")
          }}>
            LogOut</ThemedButton> : ""}
      </View>
    )
}

// AsyncStorage.removeItem("username");

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

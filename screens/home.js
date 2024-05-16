import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { AppOfTheDayCard } from 'react-native-apple-card-views';

export default function Home({ navigation }) {
    const [user, setUser] = useState(null);
    
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  })

    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.heading}> Welcome back, {user ? user.email : "Guest"}! </Text>
        <View>
          <AppOfTheDayCard
          style={styles.card}
          largeTitle={"CS2030S"}
          title={"2.00PM - 4.00PM"}
          subtitle={"COM1-01-02"}
          buttonText={"GO"}
          backgroundSource={require("../assets/nextclass_logo.png")}
          onPress={() => {}}
        />
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    heading: {
      fontSize: 30,
        textAlign: "left"
    },
    text: {
        fontSize: 20,
        textAlign: "center"
    },
    button: {
        margin: 10,
        alignSelf: "center"
    },
    card: {
      borderRadius:25,
      height: 140,
    }
})

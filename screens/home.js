import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button, ScrollView } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import AppleCard from '../components/AppleCard/AppleCard.js';
import AppOfTheDayCard from '../components/AppOfTheDayCard/AppOfTheDayCard.js';

export default function Home({ navigation }) {
    const [user, setUser] = useState(null);
    
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  })

    return (
      <ScrollView>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.heading}> Welcome back, {user ? user.email : "Guest"}! </Text>
        <View style={styles.mainCardContainer}>
          <AppOfTheDayCard
          style={styles.card}
          largeTitle={"CS2030S"}
          title={"2.00PM - 4.00PM"}
          subtitle={"COM1-01-02"}
          buttonText={"ROUTE"}
          backgroundSource={require("../assets/nextclass_logo.png")}
          onPress={() => {navigation.navigate("Reminder", { moduleCode: "CS2030S" })}}
        />
        </View>
        <View style={styles.mainCardContainer}>
        <AppOfTheDayCard
          style={styles.card}
          largeTitle={"CS2040S"}
          title={"4.00PM - 6.00PM"}
          subtitle={"COM2-02-02"}
          buttonText={"ROUTE"}
          backgroundSource={require("../assets/nextclass_logo.png")}
          onPress={() => {navigation.navigate("Reminder", { moduleCode: "CS2040S" })}}
        />
        </View>
        <View style={styles.reminderContainer}>
          <AppleCard
            style={styles.card}
            source={require("../assets/nextclass_logo.png")}
            largeTitle='Reminders'
          />
        </View>
      </View>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    heading: {
      fontSize: 30,
      paddingLeft: 5,
      fontWeight: "bold",
      textAlign: "left",
      fontFamily: "System",
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
      alignSelf: "center",
      position: "absolute"
    },
    mainCardContainer: {
      marginVertical: 10,
      height: 140,
    }, 
    reminderContainer: {
      marginVertical: 20,
      height: 500,
    }
})

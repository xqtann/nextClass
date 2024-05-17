import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { AppOfTheDayCard } from 'react-native-apple-card-views';

export default function Reminder({ navigation, route }) {
  const { moduleCode } = route.params;

    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => {navigation.navigate("NewReminder")}} title="Add" />
      ),
    });
    
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>Reminder Page for {moduleCode}</Text>
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
      paddingLeft: 5,
      fontWeight: "bold",
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
})

import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';

export default function Home({ navigation, route }) {
    const { userId } = route.params;
    return (
      <View style={styles.container}>
        <Text style={styles.text}> HomePage for User {userId} </Text>
        <ThemedButton name="rick" type="primary" style={styles.button} onPress={() => navigation.navigate("Login")}>Login</ThemedButton>
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

import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

export default function Home({ navigation, route }) {
    const { userId } = route.params;
    return (
      <View>
        <Text style={styles.text}> HomePage for User {userId} </Text>
        <Button title='login' onPress={() => navigation.navigate("Login")} />
      </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
    }
})

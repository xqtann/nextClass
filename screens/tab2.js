import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

export default function Tab2({ navigation }) {
    return (
      <View>
        <Text style={styles.text}> Tab2 Page </Text>
      </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
    }
})

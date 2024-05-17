import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';

export default function NewReminder({ navigation }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [remind, setRemind] = useState(new Date());

  const submitHandler = () => {
    console.log(title);
    console.log(dueDate);
    console.log(remind);
    setTitle("");
    setDueDate(new Date());
    setRemind(new Date());
  }

  navigation.setOptions({
    headerRight: () => (
      <Button onPress={() => {navigation.pop()}} title="Dismiss" /> 
    ),
  });

  return (
    <View style={styles.container}>
      <Text>Create New Reminder</Text>
      <TextInput 
        style={styles.input}
        placeholder="Reminder Title"
        placeholderTextColor="#9E9E9E"
        onChangeText={(val) => setTitle(val)}
        value={title}
      />
      <TextInput 
        style={styles.input}
        placeholder="Due Date"
        placeholderTextColor="#9E9E9E"
        onChangeText={(val) => setDueDate(val)}
        value={dueDate}
      />
      <TextInput 
        style={styles.input}
        placeholder="Remind Me"
        placeholderTextColor="#9E9E9E"
        onChangeText={(val) => setRemind(val)}
        value={remind}
      />
      <ThemedButton name='rick' type='secondary' onPress={() => {submitHandler()}}>Create</ThemedButton>
      <StatusBar style="light" />
    </View>
  );
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
    input: {
      width: '80%',
      height: 40,
      borderWidth: 2,
      borderRadius: 10,
      paddingHorizontal: 10,
      backgroundColor: '#F0F0F0',
      top: '40%',
    },
})

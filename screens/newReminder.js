import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewReminder({ navigation }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [remind, setRemind] = useState(new Date());

  const submitHandler = async () => {
    const doc = addDoc(collection(FIRESTORE_DB, 'reminders'), 
    { title: title, dueDate: dueDate, remind: remind, done: false});
    setTitle("");
    setDueDate(new Date());
    setRemind(new Date());
    navigation.pop();
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDueDate(currentDate);
    console.log(currentDate);
  };


  navigation.setOptions({
    headerRight: () => (
      <Button onPress={() => {navigation.pop()}} title="Dismiss" /> 
    ),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create New Reminder</Text>
      <TextInput 
        style={styles.input}
        placeholder="Reminder Title"
        placeholderTextColor="#9E9E9E"
        onChangeText={(val) => setTitle(val)}
        value={title}
      />
      <View style={styles.datetimeContainer}>
        <Text style={styles.text}> Due Date: </Text>
        <DateTimePicker
          style = {styles.datetime}
          testID="dateTimePicker"
          value={dueDate}
          mode={'datetime'}
          is24Hour={true}
          onChange={onChange}
        />
      </View>
      <View style={styles.datetimeContainer}>
        <Text style={styles.text}> Remind Me: </Text>
        <DateTimePicker
          style = {styles.datetime}
          testID="dateTimePicker"
          value={dueDate}
          mode={'datetime'}
          is24Hour={true}
          onChange={onChange}
        />
      </View>
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
        fontFamily: 'System',
        textAlign: "center",
        alignSelf: "center"
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
      margin: 10
    },
    datetimeContainer: {
      justifyContent: 'flex-start',
      flexDirection: "row",
    },
    datetime: {
      marginVertical: 10,
      marginHorizontal: 10,
      alignSelf: "center",
    }
})

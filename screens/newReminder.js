import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button, TextInput, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { onAuthStateChanged } from 'firebase/auth';

export default function NewReminder({ navigation, route }) {
  const { moduleCode } = route.params;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [remind, setRemind] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);

  const submitHandler = async () => {
    if (!title || !description || !dueDate || !remind) {
      Alert.alert("Error", "Please fill all fields before submitting.");
      return;
    }
    if (user) {
      await addDoc(collection(FIRESTORE_DB, `users/${user.uid}/reminders`), {
        title: title,
        description: description,
        dueDate: Timestamp.fromDate(dueDate),
        remind: Timestamp.fromDate(remind),
        done: false,
        moduleCode: moduleCode,
      });
      setTitle("");
      setDescription("");
      setDueDate(new Date());
      setRemind(new Date());
      navigation.pop();
    } else {
      Alert.alert("Error", "User not logged in.");
    }
  };

  const onDueDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setDueDate(currentDate);
  };

  const onRemindChange = (event, selectedDate) => {
    const currentDate = selectedDate || remind;
    setRemind(currentDate);
  };

  navigation.setOptions({
    headerRight: () => (
      <Button onPress={() => { navigation.pop() }} title="Dismiss" />
    ),
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Reminder Title"
          placeholderTextColor="#9E9E9E"
          onChangeText={(val) => setTitle(val)}
          value={title}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          placeholderTextColor="#9E9E9E"
          onChangeText={(val) => setDescription(val)}
          value={description}
          multiline={true}
          numberOfLines={4}
        />
        <View style={styles.datetimeContainer}>
          <Text style={styles.label}> Due Date: </Text>
          <DateTimePicker
            style={styles.datetime}
            testID="dateTimePickerDue"
            value={dueDate}
            mode={'datetime'}
            is24Hour={true}
            onChange={onDueDateChange}
          />
        </View>
        <View style={styles.datetimeContainer}>
          <Text style={styles.label}> Remind Me: </Text>
          <DateTimePicker
            style={styles.datetime}
            testID="dateTimePickerRemind"
            value={remind}
            mode={'datetime'}
            is24Hour={true}
            onChange={onRemindChange}
          />
        </View>
        <View style={{ padding: 5, paddingRight: 30, paddingLeft: 30 }}>
          <ThemedButton name='rick' type='secondary' style={styles.button} onPress={submitHandler}>
            <Text style={styles.buttonText}>Create</Text>
          </ThemedButton>
          <StatusBar style="light" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    marginBottom: 20,
    fontSize: 18,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  datetimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#333',
  },
  datetime: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingBottom: 50,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
  }
});

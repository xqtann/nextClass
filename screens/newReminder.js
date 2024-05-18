import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewReminder({ navigation, route }) {
  const { moduleCode } = route.params;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [remind, setRemind] = useState(new Date());

  const submitHandler = async () => {
    await addDoc(collection(FIRESTORE_DB, 'reminders'), {
      title: title, 
      description: description,
      dueDate: dueDate, 
      remind: remind, 
      done: false,
      moduleCode: moduleCode,
    });
    setTitle("");
    setDescription("");
    setDueDate(new Date());
    setRemind(new Date());
    navigation.pop();
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
        <Text style={styles.text}> Due Date: </Text>
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
        <Text style={styles.text}> Remind Me: </Text>
        <DateTimePicker
          style={styles.datetime}
          testID="dateTimePickerRemind"
          value={remind}
          mode={'datetime'}
          is24Hour={true}
          onChange={onRemindChange}
        />
      </View>
      <ThemedButton name='rick' type='secondary' onPress={submitHandler}>Create</ThemedButton>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  // The main container of the component, with padding and a light background color
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  // The heading text at the top, with larger font size, bold weight, centered alignment, and bottom margin for spacing
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  // The text input for the reminder title, with a specific height, border, padding, background color, border color, bottom margin, and font size
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
  // The text input for the description, with additional styles for multiline input
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top', // Align text to the top for multiline input
  },
  // A container for the date/time picker and its label, with row direction, center alignment, and bottom margin for spacing
  datetimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  // The label text for date/time pickers, with specific font size and color for better readability
  label: {
    fontSize: 18,
    color: '#333',
  },
  // The date/time picker style, taking full available width and margin on the left for spacing from the label
  datetime: {
    flex: 1,
    marginLeft: 10,
  },
  // The themed button style, centered horizontally and with top margin for spacing
  button: {
    alignSelf: 'center',
    marginTop: 20,
  }
});

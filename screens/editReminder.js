import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditReminder({ navigation, route }) {
  const { reminder } = route.params;
  const [title, setTitle] = useState(reminder.title);
  const [description, setDescription] = useState(reminder.description);
  const [dueDate, setDueDate] = useState(new Date(reminder.dueDate.seconds * 1000));
  const [remind, setRemind] = useState(new Date(reminder.remind.seconds * 1000));

  const submitHandler = async () => {
    const reminderRef = doc(FIRESTORE_DB, 'reminders', reminder.id);
    await updateDoc(reminderRef, {
      title: title,
      description: description,
      dueDate: dueDate,
      remind: remind,
    });

    navigation.navigate('ReminderPage', {
      reminder: {
        ...reminder,
        title,
        description,
        dueDate: { seconds: Math.floor(dueDate.getTime() / 1000) },
        remind: { seconds: Math.floor(remind.getTime() / 1000) },
      },
    });
  };

  const deleteHandler = async () => {
    const reminderRef = doc(FIRESTORE_DB, 'reminders', reminder.id);
    await deleteDoc(reminderRef);
    navigation.pop();
    navigation.pop(); 
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteHandler }
      ]
    );
  };

  const onDueDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setDueDate(currentDate);
  };

  const onRemindChange = (event, selectedDate) => {
    const currentDate = selectedDate || remind;
    setRemind(currentDate);
  };
  
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
      <ThemedButton name='rick' type='secondary' onPress={submitHandler}>Update</ThemedButton>
      <ThemedButton name='rick' type='danger' onPress={confirmDelete} style={styles.deleteButton}>Delete</ThemedButton>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
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
  deleteButton: {
    marginTop: 10,
  },
  button: {
    alignSelf: 'center',
    marginTop: 20,
  }
});

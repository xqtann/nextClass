import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { onAuthStateChanged } from 'firebase/auth';
import { DarkModeContext } from '../DarkModeContext';

export default function EditReminder({ navigation, route }) {
  const { reminder, reminderID } = route.params;
  const [title, setTitle] = useState(reminder.title);
  const [description, setDescription] = useState(reminder.description);
  const [dueDate, setDueDate] = useState(new Date(reminder.dueDate.seconds * 1000));
  const [remind, setRemind] = useState(new Date(reminder.remind.seconds * 1000));
  const [user, setUser] = useState(null);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
            setUser(user);
            console.log('User UID:', user.uid); // Debugging log
        }
    });

    return () => unsubscribe();
  }, []); 

  const submitHandler = async () => {
    if (user) {
      const uid = user.uid;
      console.log('Updating reminder for UID:', uid); // Debugging log
      const reminderRef = doc(FIRESTORE_DB, `users/${uid}/reminders`, reminderID);
      await updateDoc(reminderRef, {
        title: title,
        description: description,
        dueDate: Timestamp.fromDate(dueDate),
        remind: Timestamp.fromDate(remind),
      });

      navigation.navigate('ReminderPage', {
        reminder: {
          ...reminder,
          title,
          description,
          dueDate: { seconds: Math.floor(dueDate.getTime() / 1000) },
          remind: { seconds: Math.floor(remind.getTime() / 1000) },
        },
        reminderID: reminderID
      });
    } else {
      console.error('User is not defined');
    }
  };

  const deleteHandler = async () => {
    if (user) {
      const uid = user.uid;
      console.log('Deleting reminder for UID:', uid); // Debugging log
      const reminderRef = doc(FIRESTORE_DB, `users/${uid}/reminders`, reminderID);
      await deleteDoc(reminderRef);
      navigation.pop();
      navigation.pop(); 
    } else {
      console.error('User is not defined');
    }
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
    <View style={darkMode ? stylesDark.container : styles.container}>
      <TextInput
        style={darkMode ? stylesDark.input : styles.input}
        placeholder="Reminder Title"
        placeholderTextColor="#9E9E9E"
        onChangeText={(val) => setTitle(val)}
        value={title}
      />
      <TextInput
        style={darkMode ? [stylesDark.input, stylesDark.descriptionInput] : [styles.input, styles.descriptionInput]}
        placeholder="Description"
        placeholderTextColor="#9E9E9E"
        onChangeText={(val) => setDescription(val)}
        value={description}
        multiline={true}
        numberOfLines={4}
      />
      <View style={darkMode ? stylesDark.datetimeContainer : styles.datetimeContainer}>
        <Text style={darkMode ? stylesDark.label : styles.label}> Due Date: </Text>
        <DateTimePicker
          style={darkMode ? stylesDark.datetime : styles.datetime}
          testID="dateTimePickerDue"
          value={dueDate}
          mode={'datetime'}
          is24Hour={true}
          onChange={onDueDateChange}
          minimumDate={new Date()}
        />
      </View>
      <View style={darkMode ? stylesDark.datetimeContainer : styles.datetimeContainer}>
        <Text style={darkMode ? stylesDark.label : styles.label}> Remind Me: </Text>
        <DateTimePicker
          style={darkMode ? stylesDark.datetime : styles.datetime}
          testID="dateTimePickerRemind"
          value={remind}
          mode={'datetime'}
          is24Hour={true}
          onChange={onRemindChange}
          minimumDate={new Date()}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <ThemedButton name={darkMode ? 'bruce' : 'rick'} type='primary' width={150} raiseLevel={2} onPress={submitHandler}>Update</ThemedButton>
        <ThemedButton name={darkMode ? 'bruce' : 'rick'} type='danger' width={150} raiseLevel={2} onPress={confirmDelete} >Delete</ThemedButton>
      </View>
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
  button: {
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#192734',
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
    backgroundColor: '#282828',
    borderColor: '#181818',
    marginBottom: 20,
    fontSize: 18,
    color: '#b3b3b3'
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
    color: '#b3b3b3',
  },
  datetime: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});


import React, { useState, useEffect, useRef, useContext } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, Alert, TouchableOpacity } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { onAuthStateChanged } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { DarkModeContext } from '../DarkModeContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NewReminder({ navigation, route }) {
  const { moduleCode } = route.params;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [remind, setRemind] = useState(new Date());
  const [user, setUser] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); 


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification(remindDate, title, moduleCode, description, reminderId) {

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const remindTimeInSeconds = remindDate.seconds;
    const secondsDifference = remindTimeInSeconds - currentTimeInSeconds;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder for ' + moduleCode + ': ' + title,
        body: description,
        data: { reminderId : reminderId },
      },
      trigger: { seconds: secondsDifference },
    });
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

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
      const docRef = await addDoc(collection(FIRESTORE_DB, `users/${user.uid}/reminders`), {
        title: title,
        description: description,
        dueDate: Timestamp.fromDate(dueDate),
        remind: Timestamp.fromDate(remind),
        done: false,
        moduleCode: moduleCode,
      });

      const reminderId = docRef.id;

      await schedulePushNotification(Timestamp.fromDate(remind), title, moduleCode, description, reminderId);

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
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.pop()}
        style={styles.headerRightButton}
      >
        <Text style={styles.headerRightButtonText}>Dismiss</Text>
      </TouchableOpacity>
    ),
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={darkMode ? stylesDark.container : styles.container}>
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
            minimumDate={new Date()}
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
            minimumDate={new Date()}
          />
        </View>
        <View style={{ padding: 5, paddingRight: 30, paddingLeft: 30 }}>
          <ThemedButton name='rick' type='secondary' raiseLevel={1} style={styles.button} onPress={submitHandler}>
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
    marginTop: 10,
    paddingVertical: 10,
    paddingBottom: 50,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  headerRightButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFB052',
    borderRadius: 20,
  },
  headerRightButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    color: '#192734',
    backgroundColor: '#192734',
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
    marginTop: 10,
    paddingVertical: 10,
    paddingBottom: 50,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  headerRightButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFB052',
    borderRadius: 20,
  },
  headerRightButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


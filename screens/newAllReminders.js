import React, { useState, useEffect, useRef, useContext } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { addDoc, collection, Timestamp, getDoc, doc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { onAuthStateChanged } from 'firebase/auth';
import SelectDropdown from 'react-native-select-dropdown';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { DarkModeContext } from '../DarkModeContext';

export default function NewAllReminder({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [remind, setRemind] = useState(new Date());
  const [moduleCode, setModuleCode] = useState("");
  const [moduleCodes, setModuleCodes] = useState([]);
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
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      if (user) {
        fetchModuleCodes(user.uid);
      }
    });
    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const fetchModuleCodes = async (uid) => {
    try {
      const docRef = doc(FIRESTORE_DB, "timetables", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const timetableData = docSnap.data().timetableData;
        const codes = new Set(timetableData.map(item => item.title));
        setModuleCodes(Array.from(codes));
      }
    } catch (error) {
      console.error('Error fetching module codes:', error);
    }
  };

  const submitHandler = async () => {
    if (!title || !description || !dueDate || !remind || !moduleCode) {
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
      setModuleCode("");
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            style={styles.datetime}
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
            style={styles.datetime}
            testID="dateTimePickerRemind"
            value={remind}
            mode={'datetime'}
            is24Hour={true}
            onChange={onRemindChange}
            minimumDate={new Date()}
          />
        </View>
        <View style={darkMode ? stylesDark.dropdownContainer : styles.dropdownContainer}>
          <Text style={darkMode ? stylesDark.moduleLabel : styles.moduleLabel}> Module Code: </Text>
          <SelectDropdown
              data={moduleCodes}
              onSelect={(selectedItem, index) => {
                setModuleCode(selectedItem);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={darkMode ? stylesDark.dropdownButtonStyle : styles.dropdownButtonStyle}>
                    <Text style={darkMode ? stylesDark.dropdownButtonTxtStyle : styles.dropdownButtonTxtStyle}>
                      {selectedItem || 'Select A Module'}
                    </Text> 
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                    <Text style={darkMode ? stylesDark.dropdownItemTxtStyle : styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={darkMode ? stylesDark.dropdownMenuStyle : styles.dropdownMenuStyle}
            />
        </View>
        <View style={{ padding: 5, paddingRight: 30, paddingLeft: 30 }}>
          <ThemedButton name={darkMode ? 'bruce' : 'rick'} type='primary' raiseLevel={1} style={styles.button} onPress={submitHandler}>
            <Text style={darkMode ? stylesDark.buttonText : styles.buttonText}>Create Reminder</Text>
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
  moduleLabel: {
    width: 150,
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  datetime: {
    flex: 1,
    marginLeft: 10,
  },
  dropdownContainer: {
      height: 50,
      width: 100,
      flexDirection: "row"
  },
  dropdown: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  dropdownText: {
    textAlign: 'left',
    color: '#333',
    fontSize: 16,
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
  },
  dropdownButtonStyle: {
    left: 15,
    width: 190,
    height: 35,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 17,
    color: 'black',
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    borderColor: "black",
    borderWidth: 1
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
});

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#192734',
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
  moduleLabel: {
    width: 150,
    fontSize: 18,
    color: '#b3b3b3',
    marginTop: 10,
  },
  datetime: {
    flex: 1,
    marginLeft: 10,
  },
  dropdownContainer: {
      height: 50,
      width: 100,
      flexDirection: "row"
  },
  dropdown: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#282828',
  },
  dropdownText: {
    textAlign: 'left',
    color: '#333',
    fontSize: 16,
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
    color: '#b3b3b3'
  },
  dropdownButtonStyle: {
    left: 15,
    width: 190,
    height: 35,
    backgroundColor: '#282828',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 17,
    color: '#b3b3b3',
  },
  dropdownMenuStyle: {
    backgroundColor: '#282828',
    borderRadius: 8,
    borderColor: "black",
    borderWidth: 1
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#b3b3b3',
  },
});


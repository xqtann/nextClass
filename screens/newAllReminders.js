import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button, TextInput, Keyboard, TouchableWithoutFeedback, Alert, TouchableOpacity } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { addDoc, collection, Timestamp, getDoc, doc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { onAuthStateChanged } from 'firebase/auth';
import SelectDropdown from 'react-native-select-dropdown';

export default function NewAllReminder({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [remind, setRemind] = useState(new Date());
  const [moduleCode, setModuleCode] = useState("");
  const [moduleCodes, setModuleCodes] = useState([]);
  const [user, setUser] = useState(null);

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

  navigation.setOptions({
    headerRight: () => (
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
        <View style={styles.dropdownContainer}>
          <Text style={styles.moduleLabel}> Module Code: </Text>
          <SelectDropdown
              data={moduleCodes}
              onSelect={(selectedItem, index) => {
                setModuleCode(selectedItem);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem || 'Select A Module'}
                    </Text> 
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
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
  moduleLabel: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  datetime: {
    flex: 1,
    marginLeft: 10,
  },
  dropdownContainer: {
      flex: 1,
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
    marginLeft: 60,
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

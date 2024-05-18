import React, { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, query, where } from '@firebase/firestore';
import { FIRESTORE_DB } from '../FirebaseConfig';



export default function Reminder({ navigation, route }) {
  const { moduleCode } = route.params;
  const [allReminders, setReminders] = useState([]);

  useEffect(() => {
    const reminderRef = collection(FIRESTORE_DB, 'reminders');

    const q = query(reminderRef, where("moduleCode", "==", moduleCode));

    const subscriber = onSnapshot(q, 
      {next: (snapshot) => {
        const reminderList = [];
        snapshot.docs.forEach(doc => {
          reminderList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setReminders(reminderList);
      }});

      return () => subscriber();
    }, []);

    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => {navigation.navigate("NewReminder", { moduleCode:moduleCode })}} title="Add" />
      ),
    });
    
    return (allReminders.length > 0) ? (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <FlatList
          data={allReminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reminderItem}>
              <View style={styles.reminderHeader}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <TouchableOpacity style={styles.optionsButton} onPress={() => {/* Add your options handler here */}}>
                  <Text style={styles.optionsButtonText}>Options</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <Text>On: {new Date(item.dueDate.seconds * 1000).toLocaleString()}</Text>
              <Text>Remind Me: {new Date(item.remind.seconds * 1000).toLocaleString()}</Text>
            </View>
          )}
        />
      </View>
    ) : (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.noreminders}>No new reminders! 😊</Text>
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
  reminderItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  noreminders: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  optionsButton: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
  },
  optionsButtonText: {
    fontSize: 14,
    color: '#333',
  },
});


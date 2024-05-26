import React, { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, where } from '@firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function AllReminders({ navigation }) {
  const [allReminders, setReminders] = useState([]);
  const [user, setUser] = useState(null);
  const [reminderID, setReminderID] = useState("");


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUser(user);
        fetchAllReminders(user.uid);
      }
    });

    return () => unsubscribeAuth();
  }, [reminderID]);

  const fetchAllReminders = (uid) => {
    const reminderRef = collection(FIRESTORE_DB, 'users', uid, 'reminders');
    const q = query(reminderRef, orderBy("dueDate", "asc"), where("done", "==", true));

    const subscriber = onSnapshot(q, { next: (snapshot) => {
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
  };

  return (allReminders.length > 0) ? (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={allReminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {navigation.navigate("ReminderPage", { reminder: item, reminderID: item.id })}}>
            <View style={styles.reminderItem}>
              <View style={styles.reminderHeader}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
              </View>
              <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
              <Text>On: {new Date(item.dueDate.seconds * 1000).toLocaleString()}</Text>
              <Text>Remind Me: {new Date(item.remind.seconds * 1000).toLocaleString()}</Text>
              <Text style={styles.reminderModule}>Module: {item.moduleCode}</Text>
              <TouchableOpacity style={styles.completeButton} onPress={() => completeReminder(item.id)}>
              <Image source={require('../assets/check-circle-outline.png')} style={{height: 40, width: 40, tintColor:'#185A37'}}></Image>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.noreminders}>No completed reminders!</Text>
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
  reminderModule: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
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
  completeButton: {
    position: 'absolute',
    right: 20,
    top: '40%',
    height: 40,
    width: 40,
  }
});

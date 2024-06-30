import React, { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import { collection, onSnapshot, query, where, doc, updateDoc, deleteDoc } from '@firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function Reminder({ navigation, route }) {
  const { moduleCode } = route.params;
  const [allReminders, setReminders] = useState([]);
  const [user, setUser] = useState(null);
  const [reminderID, setReminderID] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUser(user);
        fetchReminders(user.uid);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchReminders = (uid) => {
    const reminderRef = collection(FIRESTORE_DB, `users/${uid}/reminders`);
    const q = query(reminderRef, where("moduleCode", "==", moduleCode), where("done", "==", false));

    const subscriber = onSnapshot(q, { next: (snapshot) => {
      const reminderList = [];
      snapshot.docs.forEach(doc => {
        reminderList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      const sortedReminderList = reminderList.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return a.dueDate.seconds - b.dueDate.seconds;
        } else {
          return 0;
        }
      });
      setReminders(sortedReminderList);
    }});

    return () => subscriber();
  };

  navigation.setOptions({
    headerRight: () => (
      <Button onPress={() => {navigation.navigate("NewReminder", { moduleCode: moduleCode })}} title="Add" />
    ),
  });

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('NewReminder', { moduleCode: moduleCode })}
        style={styles.headerRightButton}
      >
        <Text style={styles.headerRightButtonText}>Add</Text>
      </TouchableOpacity>
    ),
  });

  const completeReminder = async (itemId) => {
    await setReminderID(itemId);
    const reminderRef = doc(FIRESTORE_DB, 'users', user.uid, 'reminders', itemId);
    await updateDoc(reminderRef, {
      done: true,
    });
  };

  const deleteReminder = async (itemId) => {
    await setReminderID(itemId);
    const reminderRef = doc(FIRESTORE_DB, 'users', user.uid, 'reminders', itemId);
    await deleteDoc(reminderRef);
  }

  return (allReminders.length > 0) ? (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={allReminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {navigation.navigate("ReminderPage", { reminder: item, reminderID: item.id })}}>
            <View style={item.dueDate.seconds > Math.trunc(new Date().valueOf()/1000) ? styles.reminderItem : styles.dueItem}>
              <View style={styles.reminderHeader}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
              </View>
              <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
              <Text>Due On: {new Date(item.dueDate.seconds * 1000).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
              <Text>Remind Me: {new Date(item.remind.seconds * 1000).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
              <TouchableOpacity style={styles.completeButton} onPress={() => completeReminder(item.id)}>
              <Image source={require('../assets/sticker-check-outline.png')} style={{height: 35, width: 35, tintColor:'#185A37'}}></Image>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReminder(item.id)}>
              <Image source={require('../assets/trash-can.png')} style={{height: 35, width: 35, tintColor:'#8b0000'}}></Image>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  dueItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: "#ffcccb"
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
  completeButton: {
    position: 'absolute',
    right: 20,
    top: '10%',
    height: 35,
    width: 35,
  },
  deleteButton : {
    position: 'absolute',
    right: 20,
    top: '70%',
    height: 35,
    width: 35,
  }
});

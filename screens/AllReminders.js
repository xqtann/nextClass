import React, { useEffect, useState, useContext } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, where, deleteDoc } from '@firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { DarkModeContext } from '../DarkModeContext';

export default function AllReminders({ navigation }) {
  const [allReminders, setReminders] = useState([]);
  const [user, setUser] = useState(null);
  const [reminderID, setReminderID] = useState("");
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); 

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('CompletedReminders')}
        style={darkMode ? stylesDark.headerRightButton : styles.headerRightButton}
      >
        <Text style={styles.headerRightButtonText}>Completed</Text>
      </TouchableOpacity>
    ),
  });

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
    const q = query(reminderRef, orderBy("dueDate", "asc"), where("done", "==", false));

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

  const confirmDelete = (itemId) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteReminder(itemId) }
      ]
    );
  };

  return (allReminders.length > 0) ? (
    <View style={darkMode ? stylesDark.container : styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={allReminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {navigation.navigate("ReminderPage", { reminder: item, reminderID: item.id })}}>
            <View style={item.dueDate.seconds > Math.trunc(new Date().valueOf()/1000) ? (darkMode ? stylesDark.reminderItem : styles.reminderItem) : 
                  (darkMode ? stylesDark.dueItem : styles.dueItem)}>
              <View style={styles.reminderHeader}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
              </View>
              <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
              <Text>Due On: {new Date(item.dueDate.seconds * 1000).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
              <Text>Remind Me: {new Date(item.remind.seconds * 1000).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
              <Text style={styles.reminderModule}>Module: {item.moduleCode}</Text>
              <TouchableOpacity style={styles.completeButton} onPress={() => completeReminder(item.id)}>
              <Image source={require('../assets/sticker-check-outline.png')} style={{height: 35, width: 35, tintColor:'#185A37'}}></Image>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
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
    padding: 15,
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
    borderRadius: 20,
    backgroundColor: "white",
    marginBottom: 5
  },
  dueItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: "#ffcccb",
    marginBottom: 5
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
  headerRightButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFB052',
    borderRadius: 20,
  },
  headerRightButtonText: {
    color: '#fff',
    fontSize: 13,
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
const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#192734'
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
    borderRadius: 20,
    backgroundColor: "#b3b3b3",
    marginBottom: 5
  },
  dueItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: "#E0BFB8",
    marginBottom: 5
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
  headerRightButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#804600',
    borderRadius: 20,
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


import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Modal, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import AppOfTheDayCard from '../components/AppOfTheDayCard/AppOfTheDayCard.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import CustomCard from '../components/CustomCard.js';

export default function Home({ navigation }) {
  const [user, setUser] = useState(null);
  const [nextClasses, setNextClasses] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [userName, setUserName] = useState('Guest');
  const [loadingUser, setLoadingUser] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchReminders = async () => {
    const remindersCollection = collection(FIRESTORE_DB, 'reminders');
    const remindersQuery = query(remindersCollection, orderBy('dueDate', 'asc'));
    const querySnapshot = await getDocs(remindersQuery);

    const reminders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return reminders;
  };

  useEffect(() => {
    const loadUserData = async (user) => {
      try {
        console.log('Fetching user data...');
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.username || 'Guest');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error loading user data from Firestore:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        console.log('Authenticated user:', user);
        setUser(user);
        loadUserData(user);
      } else {
        setUser(null);
        setUserName('Guest');
        setLoadingUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('timetableData');
        if (storedData) {
          const timetable = JSON.parse(storedData).map(event => ({
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
          }));
          const upcomingClasses = getNextTwoClasses(timetable);
          setNextClasses(upcomingClasses);
        }
      } catch (error) {
        console.error('Error loading timetable data from AsyncStorage:', error);
      }
    };

    const fetchAllData = async () => {
      const remindersData = await fetchReminders();
      setReminders(remindersData);
    };

    fetchTimetableData();
    fetchAllData();
  }, []);

  const getNextTwoClasses = (timetable) => {
    const now = new Date();
    const nowDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const nowTime = now.getHours() * 60 + now.getMinutes(); // Time in minutes from midnight

    const upcomingClasses = timetable.filter(event => {
      const eventDate = new Date(event.startTime);
      const eventDay = eventDate.getDay(); // 0 (Sunday) to 6 (Saturday)
      const eventTime = eventDate.getHours() * 60 + eventDate.getMinutes(); // Time in minutes from midnight
      
      if (eventDay !== nowDay) {
        return false;
      }
      if (eventDay === nowDay && eventTime > nowTime) {
        return true;
      } else if (eventDay > nowDay) {
        return true;
      } else if (eventDay === nowDay && eventTime === nowTime) {
        return true;
      }

      return false;
    }).sort((a, b) => {
      const aDay = new Date(a.startTime).getDay();
      const bDay = new Date(b.startTime).getDay();
      if (aDay === bDay) {
        return new Date(a.startTime) - new Date(b.startTime);
      }
      return aDay - bDay;
    });

    return upcomingClasses.slice(0, 2);
  };

  const renderReminderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderTitle}>{item.title}</Text>
      <Text style={styles.reminderDate}>
        {new Date(item.dueDate.seconds * 1000).toLocaleString()}
      </Text>
    </View>
  );
  
  if (loadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.heading}> Welcome back, {userName}! </Text>
        
        {nextClasses.length > 0 ? (
          nextClasses.map((event, index) => (
            <View key={index} style={styles.mainCardContainer}>
              <AppOfTheDayCard
                style={styles.card}
                largeTitle={event.title}
                title={`${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                subtitle={event.location}
                buttonText={"ROUTE"}
                backgroundSource={require("../assets/nextclass_logo.png")}
                onPress={() => {navigation.navigate("Reminder", { moduleCode: event.title })}}
              />
            </View>
          ))
        ) : (
          <View style={styles.noClassesContainer}>
            <Text style={styles.noClassesText}>No classes left! Enjoy your day!</Text>
          </View>
        )}

        <CustomCard
          title="Reminders"
          style={styles.reminderContainer}
          onPress={() => console.log("Card Pressed")}
          backgroundSource={require("../assets/nextclass_logo.png")}
        >
          <FlatList
            data={reminders}
            renderItem={renderReminderItem}
            keyExtractor={item => item.id}
            style={styles.flatList}
          />
        </CustomCard>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "System",
    marginVertical: 20,
  },
  mainCardContainer: {
    marginVertical: 10,
    height: 140,
  },
  card: {
    borderRadius: 25,
    height: '100%',
    alignSelf: "center",
  },
  noClassesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  noClassesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
  },
  reminderContainer: {
    flex: 1,
    marginVertical: 20,
  },
  flatList: {
    flexGrow: 1,
  },
  reminderItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderDate: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

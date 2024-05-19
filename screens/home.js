import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import AppleCard from '../components/AppleCard/AppleCard.js';
import AppOfTheDayCard from '../components/AppOfTheDayCard/AppOfTheDayCard.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {
  const [user, setUser] = useState(null);
  const [nextClasses, setNextClasses] = useState([]);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
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

    fetchTimetableData();
  }, []);

  const getNextTwoClasses = (timetable) => {
    const now = new Date();
    const nowDay = now.getDay() + 1; // 0 (Sunday) to 6 (Saturday)
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


  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.heading}> Welcome back, {user ? user.email : "Guest"}! </Text>
        
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

        <View style={styles.reminderContainer}>
          <AppleCard
            style={styles.card}
            source={require("../assets/nextclass_logo.png")}
            largeTitle='Reminders'
          />
        </View>
      </View>
    </ScrollView>
  )
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
    textAlign: "left",
    fontFamily: "System",
  },
  text: {
    fontSize: 20,
    textAlign: "center"
  },
  button: {
    margin: 10,
    alignSelf: "center"
  },
  card: {
    borderRadius: 25,
    height: 140,
    alignSelf: "center",
    position: "absolute"
  },
  mainCardContainer: {
    marginVertical: 10,
    height: 140,
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
    marginVertical: 20,
    height: 500,
  }
});
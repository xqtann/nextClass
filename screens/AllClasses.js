import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import AppOfTheDayCard from '../components/AppOfTheDayCard/AppOfTheDayCard.js';

export default function AllClassesScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUser(user);
        fetchTimetableData(user.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTimetableData = async (uid) => {
    try {
      const docRef = doc(FIRESTORE_DB, "timetables", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const timetableData = docSnap.data().timetableData.map(item => ({
          ...item,
          id: item.id || `${item.title}-${item.startTime}`, // Ensure each item has a unique id
          startTime: new Date(item.startTime),
          endTime: new Date(item.endTime),
        }));
        setAllClasses(timetableData);
      }
    } catch (error) {
      console.error('Error loading timetable data from Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDay = (classes) => {
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const grouped = classes.reduce((acc, cls) => {
      const day = cls.startTime.toLocaleDateString('en-US', { weekday: 'long' });
      if (daysOrder.includes(day)) {
        if (!acc[day]) acc[day] = [];
        acc[day].push(cls);
      }
      return acc;
    }, {});
    return daysOrder.map(day => ({ day, data: grouped[day] || [] }));
  };

  const renderClassItem = ({ item }) => (
    <View key={item.id} style={styles.mainCardContainer}>
      <AppOfTheDayCard
        style={styles.card}
        largeTitle={item.title}
        title={`${item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        subtitle={item.location}
        buttonText={"ROUTE"}
        backgroundColor={"#003D7C"}
        backgroundSource={require("../assets/background-pattern.png")}
        onPress={() => navigation.navigate("Reminder", { moduleCode: item.title })}
        onButtonPress={() => {navigation.navigate("Profile", {screen: "Map", params: {destVenue: item.location} } )}}
      />
    </View>
  );

  const renderDayHeader = ({ section: { day } }) => (
    <View style={styles.dayHeaderContainer}>
      <Text style={styles.dayHeaderText}>{day}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const classesByDay = groupByDay(allClasses);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SectionList
        sections={classesByDay}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderClassItem}
        renderSectionHeader={renderDayHeader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCardContainer: {
    marginVertical: 10,
    height: 130,
  },
  card: {
    borderRadius: 25,
    height: '100%',
    alignSelf: "center",
  },
  dayHeaderContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

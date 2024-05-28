import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from "expo-status-bar";

export default function ReminderPage({ navigation, route }) {
  const { reminder, reminderID } = route.params;

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('EditReminder', { reminder: reminder, reminderID: reminderID })}
        style={styles.headerRightButton}
      >
        <Text style={styles.headerRightButtonText}>Edit</Text>
      </TouchableOpacity>
    ),
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.reminderCard}>
        <Text style={styles.title}>{reminder.title}</Text>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.description}>{reminder.description}</Text>
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.dateText}>{new Date(reminder.dueDate.seconds * 1000).toLocaleString()}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.label}>Remind Me</Text>
            <Text style={styles.dateText}>{new Date(reminder.remind.seconds * 1000).toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  reminderCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    marginTop: 10,
  },
  description: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
    lineHeight: 24,
  },
  dateContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    flex: 1,
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
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

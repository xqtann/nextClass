import { NavigationContainer } from "@react-navigation/native";
import "react-native-reanimated";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./screens/login";
import Register from "./screens/register";
import Home from "./screens/home";
import Map from "./screens/map";
import Account from "./screens/account";
import Timetable from "./screens/timetable";
import Reminder from "./screens/reminder";
import NewReminder from "./screens/newReminder";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { StyleSheet } from "react-native";
import ReminderPage from "./screens/reminderPage";
import EditReminder from "./screens/editReminder";
import AllReminders from "./screens/AllReminders";
import AllClassesScreen from "./screens/AllClasses";
import NewAllReminder from "./screens/newAllReminders";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Profile() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: '#ff7f50' }, 
      headerTintColor: '#fff', // Set the header text color here
      headerTitleStyle: { fontWeight: 'bold', fontSize: 16}, // Customize the header title style here
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        paddingTop: 7,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderLeftWidth: 0.2,
        borderRightWidth: 0.2,
      }
      })}>
      <Tab.Screen name="Home" component={Reminders} options={{ tabBarIcon: ({color}) => <Feather name="home" size={24} color={color} />, headerShown: false }} />
      <Tab.Screen name="Timetable" component={RemindersTT} options={{ tabBarIcon: ({color}) => <MaterialCommunityIcons name="timetable" size={24} color={color} />, headerShown: false}} />
      <Tab.Screen name="Map" component={Map} initialParams={{ destVenue: "" }} options={{ tabBarIcon: ({color}) => <MaterialCommunityIcons name="map-marker" size={24} color={color} />}} />
      <Tab.Screen name="Account" component={Account} options={{ tabBarIcon: ({color}) => <MaterialCommunityIcons name="account" size={24} color={color} />}} />
    </Tab.Navigator>
  );
}

function Reminders() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: '#ff7f50' }, 
          headerTintColor: '#fff', // Set the header text color here
          headerTitleStyle: { fontWeight: 'bold', fontSize: 16}, // Customize the header title style here
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Reminder" component={Reminder} 
          options={({ route }) => ({ title: route.params.moduleCode })}  />
        <Stack.Screen name="NewReminder" component={NewReminder} options={{ presentation: 'modal', headerTitle: 'New Reminder' }} />
        <Stack.Screen name="ReminderPage" component={ReminderPage} 
          options={({ route }) => ({ title: route.params.reminder.title })}
        />
        <Stack.Screen name="EditReminder" component={EditReminder} />
        <Stack.Screen name="AllReminders" options={{title: 'Reminders'}} component={AllReminders} />
        <Stack.Screen name="AllClasses"component={AllClassesScreen} />
        <Stack.Screen name="Map" initialParams={{ destVenue: "" }} component={Map} />
        <Stack.Screen name="NewAllReminder" component={NewAllReminder} options={{title: 'New Reminder'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function RemindersTT() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: '#ff7f50' }, 
          headerTintColor: '#fff', // Set the header text color here
          headerTitleStyle: { fontWeight: 'bold', fontSize: 16}, // Customize the header title style here
        }}>
        <Stack.Screen name="Timetable" component={Timetable} />
        <Stack.Screen name="Reminder" component={Reminder} 
          options={({ route }) => ({ title: route.params.screenTitle })}  />
        <Stack.Screen name="Map" initialParams={{ destVenue: "" }} component={Map} />
        <Stack.Screen name="NewReminder" component={NewReminder} options={{ presentation: 'modal', headerTitle: 'New Reminder' }} />
        <Stack.Screen name="ReminderPage" component={ReminderPage} 
          options={({ route }) => ({ title: route.params.reminder.title })}
        />
        <Stack.Screen name="EditReminder" component={EditReminder} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  })

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={({route}) => ({gestureEnabled: route.name !== 'Profile'})}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff7f50'
  }
});
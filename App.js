import { NavigationContainer } from "@react-navigation/native";
import "react-native-reanimated";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./screens/login";
import Register from "./screens/register";
import Home from "./screens/home";
import Tab2 from "./screens/tab2";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Timetable from "./screens/timetable";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Profile() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: () => <Feather name="home" size={24} />}} />
      <Tab.Screen name="Timetable" component={Timetable} options={{ tabBarIcon: () => <MaterialCommunityIcons name="timetable" size={24} />}} />
      <Tab.Screen name="Account" component={Tab2} options={{ tabBarIcon: () => <MaterialCommunityIcons name="account" size={24} />}} />
    </Tab.Navigator>
  );
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
      <Stack.Navigator>
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

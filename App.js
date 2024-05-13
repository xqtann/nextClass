import { NavigationContainer } from "@react-navigation/native";
import "react-native-reanimated";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./screens/login";
import Register from "./screens/register";
import Home from "./screens/home";
import Tab2 from "./screens/tab2";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Profile() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} initialParams={{ userId: 1 }} />
      <Tab.Screen name="Tab2" component={Tab2} />
    </Tab.Navigator>
  );
}

export default function App() {
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

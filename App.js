import { NavigationContainer } from '@react-navigation/native';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./screens/login";
import Register from "./screens/register";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


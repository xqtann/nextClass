import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Button, Keyboard, TouchableWithoutFeedback } from 'react-native';
import LogInHeader from '../components/logInHeader';
import LoginInputs from '../components/logInInputs';
import { ThemedButton } from 'react-native-really-awesome-button';

export default function Login({ navigation }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container}>
        <LogInHeader />
        <LoginInputs funct="Login" />
        <ThemedButton name="rick" type='secondary' raiseLevel={2} style={styles.button} onPress={() => navigation.navigate("Home", { userId: 1})}>
          Log in as Guest
        </ThemedButton>
        <ThemedButton name="rick" type='secondary' raiseLevel={2} onPress={() => navigation.push("Register")}>
          Register An Account
        </ThemedButton>
        <StatusBar style="auto" />
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
  },
  button: {
    marginBottom: 10,
  }
});

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, Button, Keyboard, TouchableWithoutFeedback } from 'react-native';
import LogInHeader from '../components/logInHeader';
import LoginInputs from '../components/logInInputs';
import Guest from '../components/loginGuest';


export default function Login({ navigation }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container}>
        <LogInHeader />
        <LoginInputs funct="Login" />
        <Guest />
        <Button title='register' onPress={() => navigation.push("Register")} />
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
});

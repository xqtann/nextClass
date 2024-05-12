import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import LogInHeader from '../components/logInHeader';
import LoginInputs from '../components/logInInputs';
import Guest from '../components/loginGuest';


export default function Login({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LogInHeader />
      <LoginInputs />
      <Guest />
      <Button title='register' onPress={() => navigation.push("Register")} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
  },
});

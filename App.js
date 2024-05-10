import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import LogInHeader from './components/logInHeader';
import Login from './components/logInInputs';
import Guest from './components/loginGuest';


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LogInHeader />
      <Login />
      <Guest />
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

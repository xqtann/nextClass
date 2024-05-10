import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import LogInHeader from './components/logInHeader';
import Login from './components/logInInputs';


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LogInHeader />
      <Login />
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

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import LogInInputs from '../components/logInInputs';



export default function Register() {
  return (
    <SafeAreaView style={styles.container}>
      <LogInInputs funct="Register" />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
  },
});

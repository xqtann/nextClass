import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';



export default function Register({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Register Page</Text>
      <Button title='back' onPress={() => navigation.navigate("Login")} />
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

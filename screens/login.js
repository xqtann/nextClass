import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Button, Keyboard, TouchableWithoutFeedback } from 'react-native';
import LogInHeader from '../components/logInHeader';
import LoginInputs from '../components/logInInputs';

export default function Login({ navigation }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container}>
        <LogInHeader />
        <LoginInputs funct="Login" />
        <View>
            <TouchableOpacity onPress={() => navigation.navigate("Home", { userId: 1})}> 
                <Text style={styles.guest}> Log in as Guest </Text>
            </TouchableOpacity>
        </View>
        <Button style={styles.button} title='Register An Account' onPress={() => navigation.push("Register")} />
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
  guest: {
    textDecorationLine: 'underline',
    marginTop: 50,
}
});

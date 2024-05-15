import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, View, Text } from "react-native";
import LogInHeader from "../components/logInHeader";
import { ThemedButton } from "react-native-really-awesome-button";
import TextInput from "react-native-text-input-interactive";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const emailHandler = (text) => {
    setEmail(text);
  };
  const passWordHandler = (text) => {
    setPassword(text);
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert("Logged in as " + email);
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.outContainer}>
        <LogInHeader />
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            autoCapitalize="none"
            onChangeText={emailHandler} // Update to use setUsername
            value={email} // Add value prop to bind state
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true} // Hides the password
            autoCapitalize="none"
            onChangeText={passWordHandler} // Update to use setPassword
            value={password} // Add value prop to bind state
          />

          <ThemedButton
            name="rick"
            type="primary"
            style={styles.button}
            onPress={() => {
              signIn();
              setPassword("");
              setEmail("");
              Keyboard.dismiss();
            }}
          >
            Login
          </ThemedButton>
        </View>
        <ThemedButton
          name="rick"
          type="secondary"
          raiseLevel={2}
          style={styles.otherButton}
          onPress={() => navigation.navigate("Profile")}
        >
          Log in as Guest
        </ThemedButton>
        <ThemedButton
          name="rick"
          type="secondary"
          raiseLevel={2}
          style={styles.otherButton}
          onPress={() => navigation.push("Register")}
        >
          Register An Account
        </ThemedButton>
        <StatusBar style="auto" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
  },
  otherButton: {
    marginBottom: 10,
  },
  container: {
    justifyContent: "center",
    padding: 20,
    marginTop: 50,
    alignItems: "center",
  },
  input: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center", // Ensure text is centered vertically
  },
  buttonText: {
    color: "#ffffff", // Changed for better visibility
    fontSize: 13,
    fontWeight: "bold",
  },
});

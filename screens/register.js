import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, SafeAreaView, Keyboard } from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";
import TextInput from "react-native-text-input-interactive";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Register() {
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

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      alert("Check emails");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.outContainer}>
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
            signUp();
            setPassword("");
            setEmail("");
            Keyboard.dismiss();
          }}
        >
          SignUp
        </ThemedButton>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
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

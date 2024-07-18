import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";
import TextInput from "react-native-text-input-interactive";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { setDoc, doc, addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { DarkModeContext } from "../DarkModeContext";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); 


  const emailHandler = (text) => {
    setEmail(text);
  };

  const passWordHandler = (text) => {
    setPassword(text);
  };

  const usernameHandler = (text) => {
    setUsername(text);
  };

  const signUp = () => {
    setLoading(true);
  
    createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then((response) => {
        // Save the username to Firestore with the document ID as the user's UID
        const userDocRef = doc(FIRESTORE_DB, "users", response.user.uid);
        return setDoc(userDocRef, {
          uid: response.user.uid,
          username: username,
          email: email,
        });
      })
      .then(() => {
        // Update the profile with the display name
        return updateProfile(FIREBASE_AUTH.currentUser, { 
          displayName: username 
        });
      })
      .then(() => {
        FIREBASE_AUTH.signOut();
      })
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((err) => {
        if (err.code == "auth/email-already-in-use") {
          alert("Email already in use");
        }
        else if (err.code == "auth/weak-password") {
          alert("Password is too weak");
        }
        else if (err.code == "auth/invalid-email") {
          alert("Invalid Email");
        }
        else {
          alert('An error occurred.\n Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.outContainer}>
        <View style={styles.container}>
        <Image 
            style={{width: 115, height: 70, marginBottom: 20}}
            source={require("../assets/nextclass-logo-transparent.png")}
            />
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            autoCapitalize="none"
            onChangeText={usernameHandler}
            value={username}
            testID="usernameInput"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            autoCapitalize="none"
            onChangeText={emailHandler}
            value={email}
            testID="emailInput"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={passWordHandler}
            value={password}
            testID="passwordInput"
          />
          <ThemedButton
            name="rick"
            type="primary"
            style={[styles.button, { alignSelf: "center" }]}
            testID="RegisterButton"
            onPress={() => {
              signUp();
              setUsername("");
              setPassword("");
              setEmail("");
              Keyboard.dismiss();
            }}
          >
            Sign Up
          </ThemedButton>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#f0f0f0",
  },
  container: {
    justifyContent: "center",
    padding: 20,
    marginTop: 0,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginTop: 10,
    width: "100%",
  },
  button: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  loginContainer: {
    marginTop: 20,
  },
  loginText: {
    color: "#000",
    fontSize: 14,
  },
  loginLink: {
    color: "#3498db",
    fontWeight: "bold",
  },
});

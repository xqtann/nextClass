import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";
import TextInput from "react-native-text-input-interactive";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { DarkModeContext } from "../DarkModeContext";

export default function Login({ navigation }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = FIREBASE_AUTH;
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); 

  const emailHandler = (text) => {
    setEmail(text);
  };

  const passWordHandler = (text) => {
    setPassword(text);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // console.log("USER IS STILL LOGGED IN: " , user);
      if (user) {
        setUser(user);
        navigation.navigate("Profile");
      } else {
        // navigation.navigate("Login");
      }
    });
  }, [user]);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User logged in successfully:',  userCredential);
        setUser(userCredential);
      })
      .catch((err) => {
        if (err.code == "auth/invalid-email") {
          alert("Invalid Email");
        }
        else {
          alert("Invalid Password");
        }
      });
  };

  // AsyncStorage.clear();

  return (
    <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.outContainer}>
        <View style={styles.container}>
          <Image 
            style={{width: 115, height: 70, marginBottom: 20}}
            source={require("../assets/nextclass-logo-transparent.png")}
            />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            autoCapitalize="none"
            onChangeText={emailHandler}
            value={email}
            accessible={true}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={passWordHandler}
            value={password}
            accessible={true}
          />
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.push("Register")}
          >

            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupLink}>Sign up now</Text>
            </Text>
          </TouchableOpacity>

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
        <StatusBar style="auto" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
    </>
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
  input: {
    marginTop: 10,
    width: '100%',
  },
  signupContainer: {
    marginTop: 20,
  },
  signupText: {
    color: "#000",
    fontSize: 14,
  },
  signupLink: {
    color: "#3498db",
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  userModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  userModalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
const stylesDark = StyleSheet.create({
  outContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
    backgroundColor: "#192734",
  },
  container: {
    justifyContent: "center",
    padding: 20,
    marginTop: 0,
    alignItems: "center",
    backgroundColor: "#192734",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    marginTop: 10,
    width: '100%',
  },
  signupContainer: {
    marginTop: 20,
  },
  signupText: {
    color: "#000",
    fontSize: 14,
  },
  signupLink: {
    color: "#3498db",
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  userModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  userModalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});


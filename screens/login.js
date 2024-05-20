import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button
} from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";
import TextInput from "react-native-text-input-interactive";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from '@rneui/themed';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [keepLogin, setKeepLogin] = useState(false);
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
      const saveData = async () => {
        try {
          await AsyncStorage.setItem('username', FIREBASE_AUTH.currentUser.displayName);
          navigation.navigate("Profile");
        } catch (error) {
          console.error('Error saving data to AsyncStorage:', error);
        }
      };
      saveData();
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('username');
        if (storedData) {
          navigation.navigate("Profile");
        } else {
          setModalVisible(true);
          // navigation.navigate("Login");
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

  // AsyncStorage.clear();

  return (
    <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.outContainer}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            autoCapitalize="none"
            onChangeText={emailHandler}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={passWordHandler}
            value={password}
          />

          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.push("Register")}
          >
            <CheckBox
              center
              title="Keep Me Logged In"
              checked={keepLogin}
              onPress={() => setKeepLogin(!keepLogin)}
            />
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
    marginTop: 50,
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
  userTextInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
